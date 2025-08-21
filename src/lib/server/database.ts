import Database from 'better-sqlite3';
import path from 'path';

// Chemin vers la base de données
const dbPath = path.join(process.cwd(), 'data', 'balades.db');

// Créer le dossier data s'il n'existe pas
import fs from 'fs';
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialiser la base de données
const db = new Database(dbPath);

// Créer les tables
db.exec(`
  CREATE TABLE IF NOT EXISTS balades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    heure TEXT NOT NULL,
    lieu TEXT NOT NULL,
    theme TEXT NOT NULL,
    places_disponibles INTEGER NOT NULL DEFAULT 5,
    prix TEXT NOT NULL,
    description TEXT NOT NULL,
    consignes TEXT NOT NULL,
    materiel TEXT NOT NULL,
    coordonnees TEXT NOT NULL,
    parcours TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    balade_id INTEGER NOT NULL,
    prenom TEXT NOT NULL,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    nombre_personnes INTEGER NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (balade_id) REFERENCES balades (id)
  );
`);

// Insérer les données initiales si la table est vide
const baladeCount = db.prepare('SELECT COUNT(*) as count FROM balades').get() as { count: number };

if (baladeCount.count === 0) {
  const insertBalade = db.prepare(`
    INSERT INTO balades (
      date, heure, lieu, theme, places_disponibles, prix, description, 
      consignes, materiel, coordonnees, parcours
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Balade 1
  insertBalade.run(
    '2024-03-15',
    '14:00',
    'Quartier du Bouffay',
    'Architecture médiévale',
    3,
    '45€',
    'Découverte des façades historiques et des ruelles pittoresques',
    JSON.stringify([
      'Apportez des chaussures confortables',
      'Prévoir une veste selon la météo',
      'Arrivée 10 minutes avant le départ'
    ]),
    JSON.stringify([
      'Appareil photo argentique fourni',
      'Pellicules incluses',
      'Guide technique fourni'
    ]),
    JSON.stringify([
      { lat: 47.2138, lng: -1.5561, name: 'Place du Bouffay' },
      { lat: 47.2145, lng: -1.5572, name: 'Rue Kervégan' },
      { lat: 47.2152, lng: -1.5583, name: 'Place Royale' }
    ]),
    JSON.stringify([
      {
        titre: 'Départ - Place du Bouffay',
        description: 'Rendez-vous et présentation du matériel',
        duree: '30 min',
        distance: '0 km'
      },
      {
        titre: 'Rue Kervégan',
        description: 'Photographie des façades médiévales',
        duree: '45 min',
        distance: '0.2 km'
      },
      {
        titre: 'Place Royale',
        description: 'Vues d\'ensemble et fin de balade',
        duree: '30 min',
        distance: '0.3 km'
      }
    ])
  );

  // Balade 2
  insertBalade.run(
    '2024-03-22',
    '10:00',
    'Île de Nantes',
    'Street Art & Contemporain',
    2,
    '45€',
    'Capture des œuvres d\'art urbain et de l\'architecture moderne',
    JSON.stringify([
      'Apportez des chaussures confortables',
      'Prévoir une veste selon la météo',
      'Arrivée 10 minutes avant le départ'
    ]),
    JSON.stringify([
      'Appareil photo argentique fourni',
      'Pellicules incluses',
      'Guide technique fourni'
    ]),
    JSON.stringify([
      { lat: 47.2078, lng: -1.5647, name: 'Les Machines de l\'île' },
      { lat: 47.2085, lng: -1.5658, name: 'Quai des Antilles' },
      { lat: 47.2092, lng: -1.5669, name: 'Hangar à Bananes' }
    ]),
    JSON.stringify([
      {
        titre: 'Départ - Les Machines de l\'île',
        description: 'Rendez-vous et présentation du matériel',
        duree: '30 min',
        distance: '0 km'
      },
      {
        titre: 'Quai des Antilles',
        description: 'Photographie du street art',
        duree: '45 min',
        distance: '0.3 km'
      },
      {
        titre: 'Hangar à Bananes',
        description: 'Architecture contemporaine et fin de balade',
        duree: '30 min',
        distance: '0.5 km'
      }
    ])
  );

  // Balade 3
  insertBalade.run(
    '2024-04-05',
    '16:00',
    'Jardin des Plantes',
    'Nature en ville',
    2,
    '45€',
    'Photographie botanique et paysages urbains verdoyants',
    JSON.stringify([
      'Apportez des chaussures confortables',
      'Prévoir une veste selon la météo',
      'Arrivée 10 minutes avant le départ'
    ]),
    JSON.stringify([
      'Appareil photo argentique fourni',
      'Pellicules incluses',
      'Guide technique fourni'
    ]),
    JSON.stringify([
      { lat: 47.2189, lng: -1.5432, name: 'Entrée Jardin des Plantes' },
      { lat: 47.2196, lng: -1.5443, name: 'Serres tropicales' },
      { lat: 47.2203, lng: -1.5454, name: 'Point de vue' }
    ]),
    JSON.stringify([
      {
        titre: 'Départ - Entrée Jardin des Plantes',
        description: 'Rendez-vous et présentation du matériel',
        duree: '30 min',
        distance: '0 km'
      },
      {
        titre: 'Serres tropicales',
        description: 'Photographie botanique',
        duree: '45 min',
        distance: '0.2 km'
      },
      {
        titre: 'Point de vue',
        description: 'Paysages urbains et fin de balade',
        duree: '30 min',
        distance: '0.4 km'
      }
    ])
  );
}

export default db;
