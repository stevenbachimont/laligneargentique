import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log('🚀 Début de la migration des données...');
    
    // Lire le fichier JSON existant
    const jsonPath = path.join(process.cwd(), 'src/lib/balades-argentique.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log(`📊 ${jsonData.baladesProgrammees.length} balades trouvées`);
    
    // Migrer chaque balade
    for (const baladeData of jsonData.baladesProgrammees) {
      console.log(`📝 Migration de la balade: ${baladeData.theme}`);
      
      // Créer la balade
      const balade = await prisma.balade.create({
        data: {
          date: baladeData.date,
          heure: baladeData.heure,
          lieu: baladeData.lieu,
          theme: baladeData.theme,
          placesDisponibles: baladeData.placesDisponibles,
          placesInitiales: baladeData.placesInitiales,
          prix: baladeData.prix,
          description: baladeData.description,
          
          // Créer les consignes
          consignes: {
            create: baladeData.consignes.map(consigne => ({
              texte: consigne
            }))
          },
          
          // Créer le matériel
          materiel: {
            create: baladeData.materiel.map(materiel => ({
              nom: materiel
            }))
          },
          
          // Créer les coordonnées
          coordonnees: {
            create: baladeData.coordonnees.map(coord => ({
              lat: coord.lat,
              lng: coord.lng,
              name: coord.name
            }))
          },
          
          // Créer le parcours
          parcours: {
            create: baladeData.parcours.map(etape => ({
              titre: etape.titre,
              description: etape.description,
              duree: etape.duree,
              distance: etape.distance
            }))
          }
        }
      });
      
      console.log(`✅ Balade créée avec l'ID: ${balade.id}`);
    }
    
    console.log('🎉 Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
