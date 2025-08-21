import Database from 'better-sqlite3';

console.log('🗄️ Initialisation de la base de données...');

try {
  const db = new Database('./data/balades.db');
  
  // Créer les tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS balades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      heure TEXT NOT NULL,
      lieu TEXT NOT NULL,
      theme TEXT NOT NULL,
      places_disponibles INTEGER NOT NULL,
      prix TEXT NOT NULL,
      description TEXT NOT NULL,
      consignes TEXT NOT NULL,
      materiel TEXT NOT NULL,
      coordonnees TEXT NOT NULL,
      parcours TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      balade_id INTEGER NOT NULL,
      prenom TEXT NOT NULL,
      nom TEXT NOT NULL,
      email TEXT NOT NULL,
      nombre_personnes INTEGER NOT NULL,
      message TEXT,
      date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (balade_id) REFERENCES balades (id)
    );
  `);
  
  // Insérer les données initiales si la table est vide
  const count = db.prepare('SELECT COUNT(*) as count FROM balades').get();
  if (count.count === 0) {
    console.log('📝 Insertion des données initiales...');
    
    const balades = [
      {
        date: '2024-03-15',
        heure: '14:00',
        lieu: 'Quartier du Bouffay',
        theme: 'Architecture médiévale',
        places_disponibles: 3,
        prix: '45€',
        description: 'Découvrez les secrets architecturaux du quartier historique de Nantes',
        consignes: JSON.stringify(['Appareil photo argentique requis', 'Pellicule 400 ISO recommandée']),
        materiel: JSON.stringify(['Appareil photo argentique', 'Pellicules', 'Trépied (optionnel)']),
        coordonnees: JSON.stringify([{ lat: 47.2138, lng: -1.5561, name: 'Place du Bouffay' }]),
        parcours: JSON.stringify([{ titre: 'Départ - Place du Bouffay', description: 'Point de rendez-vous', duree: '15 min', distance: '0 km' }])
      },
      {
        date: '2024-03-22',
        heure: '16:00',
        lieu: 'Jardin des Plantes',
        theme: 'Nature en ville',
        places_disponibles: 2,
        prix: '45€',
        description: 'Photographie botanique et paysages urbains verdoyants',
        consignes: JSON.stringify(['Appareil photo argentique requis', 'Pellicule 100 ISO recommandée']),
        materiel: JSON.stringify(['Appareil photo argentique', 'Pellicules', 'Objectif macro (optionnel)']),
        coordonnees: JSON.stringify([{ lat: 47.2138, lng: -1.5561, name: 'Jardin des Plantes' }]),
        parcours: JSON.stringify([{ titre: 'Départ - Entrée principale', description: 'Point de rendez-vous', duree: '15 min', distance: '0 km' }])
      }
    ];
    
    const insert = db.prepare('INSERT INTO balades (date, heure, lieu, theme, places_disponibles, prix, description, consignes, materiel, coordonnees, parcours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    
    for (const balade of balades) {
      insert.run(balade.date, balade.heure, balade.lieu, balade.theme, balade.places_disponibles, balade.prix, balade.description, balade.consignes, balade.materiel, balade.coordonnees, balade.parcours);
    }
    
    console.log('✅ Données initiales insérées');
  } else {
    console.log('✅ Base de données déjà initialisée');
  }
  
  db.close();
  console.log('✅ Base de données prête');
  
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de la base de données:', error.message);
  process.exit(1);
}
