#!/usr/bin/env node

import Database from 'better-sqlite3';
import readline from 'readline';

const db = new Database('./data/balades.db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function showMenu() {
  console.log('\n=== Gestion des Balades Argentique ===');
  console.log('1. Lister toutes les balades');
  console.log('2. Ajouter une nouvelle balade');
  console.log('3. Modifier une balade');
  console.log('4. Supprimer une balade');
  console.log('5. Voir les réservations');
  console.log('6. Quitter');
  console.log('=====================================');
  
  const choice = await question('Choisissez une option (1-6): ');
  return choice;
}

async function listBalades() {
  console.log('\n📋 Liste des balades :');
  console.log('=====================');
  
  const stmt = db.prepare('SELECT * FROM balades ORDER BY date, heure');
  const balades = stmt.all();
  
  if (balades.length === 0) {
    console.log('Aucune balade trouvée.');
    return;
  }
  
  balades.forEach((balade, index) => {
    console.log(`\n${index + 1}. ${balade.theme}`);
    console.log(`   📅 Date: ${balade.date} à ${balade.heure}`);
    console.log(`   📍 Lieu: ${balade.lieu}`);
    console.log(`   💰 Prix: ${balade.prix}`);
    console.log(`   👥 Places: ${balade.places_disponibles} disponibles`);
    console.log(`   📝 Description: ${balade.description.substring(0, 50)}...`);
  });
}

async function addBalade() {
  console.log('\n➕ Ajouter une nouvelle balade');
  console.log('============================');
  
  const theme = await question('Thème de la balade: ');
  const date = await question('Date (YYYY-MM-DD): ');
  const heure = await question('Heure (HH:MM): ');
  const lieu = await question('Lieu: ');
  const prix = await question('Prix: ');
  const places = await question('Nombre de places disponibles: ');
  const description = await question('Description: ');
  
  const consignes = JSON.stringify([
    'Appareil photo argentique requis',
    'Pellicule 400 ISO recommandée',
    'Arrivée 10 minutes avant le départ'
  ]);
  
  const materiel = JSON.stringify([
    'Appareil photo argentique',
    'Pellicules',
    'Guide technique fourni'
  ]);
  
  const coordonnees = JSON.stringify([
    { lat: 47.2138, lng: -1.5561, name: lieu }
  ]);
  
  const parcours = JSON.stringify([
    {
      titre: `Départ - ${lieu}`,
      description: 'Point de rendez-vous et présentation du matériel',
      duree: '30 min',
      distance: '0 km'
    }
  ]);
  
  try {
    const stmt = db.prepare(`
      INSERT INTO balades (
        date, heure, lieu, theme, places_disponibles, prix, description,
        consignes, materiel, coordonnees, parcours
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(date, heure, lieu, theme, places, prix, description, consignes, materiel, coordonnees, parcours);
    console.log('✅ Balade ajoutée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout:', error.message);
  }
}

async function modifyBalade() {
  console.log('\n✏️ Modifier une balade');
  console.log('=====================');
  
  const stmt = db.prepare('SELECT id, theme, date, heure FROM balades ORDER BY date, heure');
  const balades = stmt.all();
  
  if (balades.length === 0) {
    console.log('Aucune balade à modifier.');
    return;
  }
  
  balades.forEach((balade, index) => {
    console.log(`${index + 1}. ${balade.theme} (${balade.date} à ${balade.heure})`);
  });
  
  const choice = await question('\nChoisissez le numéro de la balade à modifier: ');
  const baladeIndex = parseInt(choice) - 1;
  
  if (baladeIndex < 0 || baladeIndex >= balades.length) {
    console.log('❌ Choix invalide.');
    return;
  }
  
  const balade = balades[baladeIndex];
  console.log(`\nModification de: ${balade.theme}`);
  
  const newTheme = await question(`Nouveau thème (${balade.theme}): `) || balade.theme;
  const newDate = await question(`Nouvelle date (${balade.date}): `) || balade.date;
  const newHeure = await question(`Nouvelle heure (${balade.heure}): `) || balade.heure;
  const newLieu = await question(`Nouveau lieu: `);
  const newPrix = await question(`Nouveau prix: `);
  const newPlaces = await question(`Nouvelles places disponibles: `);
  const newDescription = await question(`Nouvelle description: `);
  
  try {
    const updateStmt = db.prepare(`
      UPDATE balades 
      SET theme = ?, date = ?, heure = ?, lieu = ?, prix = ?, places_disponibles = ?, description = ?
      WHERE id = ?
    `);
    
    updateStmt.run(newTheme, newDate, newHeure, newLieu, newPrix, newPlaces, newDescription, balade.id);
    console.log('✅ Balade modifiée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error.message);
  }
}

async function deleteBalade() {
  console.log('\n🗑️ Supprimer une balade');
  console.log('======================');
  
  const stmt = db.prepare('SELECT id, theme, date, heure FROM balades ORDER BY date, heure');
  const balades = stmt.all();
  
  if (balades.length === 0) {
    console.log('Aucune balade à supprimer.');
    return;
  }
  
  balades.forEach((balade, index) => {
    console.log(`${index + 1}. ${balade.theme} (${balade.date} à ${balade.heure})`);
  });
  
  const choice = await question('\nChoisissez le numéro de la balade à supprimer: ');
  const baladeIndex = parseInt(choice) - 1;
  
  if (baladeIndex < 0 || baladeIndex >= balades.length) {
    console.log('❌ Choix invalide.');
    return;
  }
  
  const balade = balades[baladeIndex];
  const confirm = await question(`\nÊtes-vous sûr de vouloir supprimer "${balade.theme}" ? (oui/non): `);
  
  if (confirm.toLowerCase() === 'oui') {
    try {
      // Supprimer d'abord les réservations associées
      const deleteReservations = db.prepare('DELETE FROM reservations WHERE balade_id = ?');
      deleteReservations.run(balade.id);
      
      // Puis supprimer la balade
      const deleteBalade = db.prepare('DELETE FROM balades WHERE id = ?');
      deleteBalade.run(balade.id);
      
      console.log('✅ Balade supprimée avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error.message);
    }
  } else {
    console.log('❌ Suppression annulée.');
  }
}

async function showReservations() {
  console.log('\n📋 Réservations');
  console.log('===============');
  
  const stmt = db.prepare(`
    SELECT r.*, b.theme, b.date, b.heure 
    FROM reservations r 
    JOIN balades b ON r.balade_id = b.id 
    ORDER BY r.created_at DESC
  `);
  const reservations = stmt.all();
  
  if (reservations.length === 0) {
    console.log('Aucune réservation trouvée.');
    return;
  }
  
  reservations.forEach((reservation, index) => {
    console.log(`\n${index + 1}. ${reservation.prenom} ${reservation.nom}`);
    console.log(`   📧 Email: ${reservation.email}`);
    console.log(`   🎯 Balade: ${reservation.theme}`);
    console.log(`   📅 Date: ${reservation.date} à ${reservation.heure}`);
    console.log(`   👥 Personnes: ${reservation.nombre_personnes}`);
    console.log(`   📝 Message: ${reservation.message || 'Aucun message'}`);
    console.log(`   🕐 Créée le: ${reservation.created_at}`);
  });
}

async function main() {
  console.log('🎞️ Gestionnaire des Balades Argentique');
  console.log('=====================================');
  
  while (true) {
    const choice = await showMenu();
    
    switch (choice) {
      case '1':
        await listBalades();
        break;
      case '2':
        await addBalade();
        break;
      case '3':
        await modifyBalade();
        break;
      case '4':
        await deleteBalade();
        break;
      case '5':
        await showReservations();
        break;
      case '6':
        console.log('👋 Au revoir !');
        rl.close();
        db.close();
        process.exit(0);
        break;
      default:
        console.log('❌ Option invalide. Veuillez choisir 1-6.');
    }
    
    await question('\nAppuyez sur Entrée pour continuer...');
  }
}

main().catch(console.error);
