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
        description: 'Découverte des façades historiques et des ruelles pittoresques',
        consignes: JSON.stringify([
          'Apportez des chaussures confortables',
          'Prévoir une veste selon la météo',
          'Arrivée 10 minutes avant le départ'
        ]),
        materiel: JSON.stringify([
          'Appareil photo argentique fourni',
          'Pellicules incluses',
          'Guide technique fourni'
        ]),
        coordonnees: JSON.stringify([
          { lat: 47.2138, lng: -1.5561, name: 'Place du Bouffay' },
          { lat: 47.2140, lng: -1.5565, name: 'Église Sainte-Croix' },
          { lat: 47.2145, lng: -1.5572, name: 'Rue Kervégan' },
          { lat: 47.2148, lng: -1.5578, name: 'Place du Pilori' },
          { lat: 47.2152, lng: -1.5583, name: 'Rue de la Juiverie' },
          { lat: 47.2155, lng: -1.5588, name: 'Cathédrale Saint-Pierre-et-Saint-Paul' },
          { lat: 47.2158, lng: -1.5593, name: 'Place Royale' },
          { lat: 47.2161, lng: -1.5598, name: 'Rue Crébillon' },
          { lat: 47.2164, lng: -1.5603, name: 'Place Graslin' },
          { lat: 47.2167, lng: -1.5608, name: 'Rue de la Fosse' },
          { lat: 47.2170, lng: -1.5613, name: 'Quai de la Fosse' },
          { lat: 47.2173, lng: -1.5618, name: 'Rue des Carmes' },
          { lat: 47.2176, lng: -1.5623, name: 'Place du Commerce' },
          { lat: 47.2179, lng: -1.5628, name: 'Rue du Château' },
          { lat: 47.2138, lng: -1.5561, name: 'Retour Place du Bouffay' }
        ]),
        parcours: JSON.stringify([
          {
            titre: 'Départ - Place du Bouffay',
            description: 'Rendez-vous et présentation du matériel argentique. Explication des techniques de composition pour l\'architecture médiévale.',
            duree: '30 min',
            distance: '0 km'
          },
          {
            titre: 'Église Sainte-Croix',
            description: 'Photographie de la façade gothique flamboyant. Focus sur les détails architecturaux et les jeux de lumière.',
            duree: '25 min',
            distance: '0.1 km'
          },
          {
            titre: 'Rue Kervégan',
            description: 'Exploration des maisons à pans de bois du XVIe siècle. Techniques de cadrage pour les façades étroites.',
            duree: '35 min',
            distance: '0.2 km'
          },
          {
            titre: 'Place du Pilori',
            description: 'Capture de l\'ambiance médiévale. Photographie de rue avec les arcades historiques.',
            duree: '20 min',
            distance: '0.3 km'
          },
          {
            titre: 'Rue de la Juiverie',
            description: 'Découverte des hôtels particuliers Renaissance. Techniques de photographie d\'architecture classique.',
            duree: '30 min',
            distance: '0.4 km'
          },
          {
            titre: 'Cathédrale Saint-Pierre-et-Saint-Paul',
            description: 'Vue extérieure de la cathédrale gothique. Photographie des tours et de la façade principale.',
            duree: '25 min',
            distance: '0.5 km'
          },
          {
            titre: 'Place Royale',
            description: 'Photographie de la place royale et de la fontaine. Techniques de composition urbaine.',
            duree: '20 min',
            distance: '0.6 km'
          },
          {
            titre: 'Rue Crébillon',
            description: 'Exploration des passages couverts et des galeries. Photographie d\'intérieurs historiques.',
            duree: '30 min',
            distance: '0.7 km'
          },
          {
            titre: 'Place Graslin',
            description: 'Capture du théâtre Graslin et de la place. Techniques de photographie d\'architecture néoclassique.',
            duree: '25 min',
            distance: '0.8 km'
          },
          {
            titre: 'Rue de la Fosse',
            description: 'Découverte des maisons bourgeoises du XVIIIe siècle. Photographie des portes sculptées.',
            duree: '20 min',
            distance: '0.9 km'
          },
          {
            titre: 'Quai de la Fosse',
            description: 'Vue sur la Loire et les anciens entrepôts. Photographie de paysage urbain fluvial.',
            duree: '30 min',
            distance: '1.0 km'
          },
          {
            titre: 'Rue des Carmes',
            description: 'Exploration des ruelles médiévales. Techniques de photographie en lumière naturelle.',
            duree: '25 min',
            distance: '1.1 km'
          },
          {
            titre: 'Place du Commerce',
            description: 'Photographie de la place principale et de ses arcades. Composition urbaine et perspective.',
            duree: '20 min',
            distance: '1.2 km'
          },
          {
            titre: 'Rue du Château',
            description: 'Vue sur le château des ducs de Bretagne. Photographie d\'architecture militaire médiévale.',
            duree: '30 min',
            distance: '1.3 km'
          },
          {
            titre: 'Fin - Retour Place du Bouffay',
            description: 'Retour au point de départ. Révision des photos prises et conseils pour le développement.',
            duree: '15 min',
            distance: '1.4 km'
          }
        ])
      },
      {
        date: '2024-03-22',
        heure: '10:00',
        lieu: 'Île de Nantes',
        theme: 'Street Art & Contemporain',
        places_disponibles: 2,
        prix: '45€',
        description: 'Capture des œuvres d\'art urbain et de l\'architecture moderne',
        consignes: JSON.stringify([
          'Apportez des chaussures confortables',
          'Prévoir une veste selon la météo',
          'Arrivée 10 minutes avant le départ'
        ]),
        materiel: JSON.stringify([
          'Appareil photo argentique fourni',
          'Pellicules incluses',
          'Guide technique fourni'
        ]),
        coordonnees: JSON.stringify([
          { lat: 47.2078, lng: -1.5647, name: 'Les Machines de l\'île' },
          { lat: 47.2080, lng: -1.5650, name: 'Éléphant des Machines' },
          { lat: 47.2082, lng: -1.5653, name: 'Carrousel des Mondes Marins' },
          { lat: 47.2085, lng: -1.5658, name: 'Quai des Antilles' },
          { lat: 47.2088, lng: -1.5663, name: 'Hangar à Bananes' },
          { lat: 47.2091, lng: -1.5668, name: 'Quai des Chantiers' },
          { lat: 47.2094, lng: -1.5673, name: 'Passerelle Victor-Schœlcher' },
          { lat: 47.2097, lng: -1.5678, name: 'Rue des Olivettes' },
          { lat: 47.2100, lng: -1.5683, name: 'Place de la Petite Hollande' },
          { lat: 47.2103, lng: -1.5688, name: 'Quai de la Fosse' },
          { lat: 47.2106, lng: -1.5693, name: 'Rue Kervégan' },
          { lat: 47.2109, lng: -1.5698, name: 'Place du Bouffay' },
          { lat: 47.2112, lng: -1.5703, name: 'Rue de la Juiverie' },
          { lat: 47.2115, lng: -1.5708, name: 'Retour Quai des Antilles' },
          { lat: 47.2078, lng: -1.5647, name: 'Retour Les Machines de l\'île' }
        ]),
        parcours: JSON.stringify([
          {
            titre: 'Départ - Les Machines de l\'île',
            description: 'Rendez-vous et présentation du matériel argentique. Explication des techniques pour photographier l\'art urbain.',
            duree: '30 min',
            distance: '0 km'
          },
          {
            titre: 'Éléphant des Machines',
            description: 'Photographie de l\'éléphant mécanique. Techniques de capture de mouvement et d\'architecture industrielle.',
            duree: '25 min',
            distance: '0.1 km'
          },
          {
            titre: 'Carrousel des Mondes Marins',
            description: 'Capture des créatures marines mécaniques. Photographie d\'art contemporain et de sculpture mobile.',
            duree: '30 min',
            distance: '0.2 km'
          },
          {
            titre: 'Quai des Antilles',
            description: 'Découverte des fresques murales et du street art. Techniques de composition urbaine.',
            duree: '35 min',
            distance: '0.3 km'
          },
          {
            titre: 'Hangar à Bananes',
            description: 'Photographie de l\'architecture industrielle réhabilitée. Focus sur les lignes et les volumes.',
            duree: '25 min',
            distance: '0.4 km'
          },
          {
            titre: 'Quai des Chantiers',
            description: 'Capture des œuvres d\'art urbain et des installations temporaires. Techniques de photographie d\'art contemporain.',
            duree: '30 min',
            distance: '0.5 km'
          },
          {
            titre: 'Passerelle Victor-Schœlcher',
            description: 'Photographie de l\'architecture contemporaine. Vues sur la Loire et l\'île.',
            duree: '20 min',
            distance: '0.6 km'
          },
          {
            titre: 'Rue des Olivettes',
            description: 'Exploration des graffitis et tags urbains. Techniques de photographie de rue.',
            duree: '25 min',
            distance: '0.7 km'
          },
          {
            titre: 'Place de la Petite Hollande',
            description: 'Photographie de l\'espace public contemporain. Composition urbaine moderne.',
            duree: '20 min',
            distance: '0.8 km'
          },
          {
            titre: 'Quai de la Fosse',
            description: 'Vue sur les anciens entrepôts réhabilités. Photographie d\'architecture industrielle.',
            duree: '30 min',
            distance: '0.9 km'
          },
          {
            titre: 'Rue Kervégan',
            description: 'Découverte des œuvres d\'art intégrées à l\'architecture. Techniques de photographie d\'art public.',
            duree: '25 min',
            distance: '1.0 km'
          },
          {
            titre: 'Place du Bouffay',
            description: 'Capture de l\'ambiance urbaine contemporaine. Photographie de rue et de vie quotidienne.',
            duree: '20 min',
            distance: '1.1 km'
          },
          {
            titre: 'Rue de la Juiverie',
            description: 'Exploration des galeries d\'art contemporain. Photographie d\'expositions urbaines.',
            duree: '30 min',
            distance: '1.2 km'
          },
          {
            titre: 'Quai des Antilles',
            description: 'Retour pour photographier les œuvres sous un autre angle. Techniques de variation de point de vue.',
            duree: '25 min',
            distance: '1.3 km'
          },
          {
            titre: 'Fin - Les Machines de l\'île',
            description: 'Retour au point de départ. Révision des photos et conseils pour le développement argentique.',
            duree: '15 min',
            distance: '1.4 km'
          }
        ])
      },
      {
        date: '2024-04-05',
        heure: '16:00',
        lieu: 'Jardin des Plantes',
        theme: 'Nature en ville',
        places_disponibles: 2,
        prix: '45€',
        description: 'Photographie botanique et paysages urbains verdoyants',
        consignes: JSON.stringify([
          'Apportez des chaussures confortables',
          'Prévoir une veste selon la météo',
          'Arrivée 10 minutes avant le départ'
        ]),
        materiel: JSON.stringify([
          'Appareil photo argentique fourni',
          'Pellicules incluses',
          'Guide technique fourni'
        ]),
        coordonnees: JSON.stringify([
          { lat: 47.2189, lng: -1.5432, name: 'Entrée Jardin des Plantes' },
          { lat: 47.2192, lng: -1.5435, name: 'Allée des Palmiers' },
          { lat: 47.2196, lng: -1.5443, name: 'Serres tropicales' },
          { lat: 47.2200, lng: -1.5448, name: 'Jardin japonais' },
          { lat: 47.2203, lng: -1.5454, name: 'Rocaille alpine' },
          { lat: 47.2206, lng: -1.5459, name: 'Bassin des Nymphéas' },
          { lat: 47.2209, lng: -1.5464, name: 'Allée des Magnolias' },
          { lat: 47.2212, lng: -1.5469, name: 'Jardin de l\'École' },
          { lat: 47.2215, lng: -1.5474, name: 'Point de vue sur la ville' },
          { lat: 47.2218, lng: -1.5479, name: 'Allée des Chênes' },
          { lat: 47.2221, lng: -1.5484, name: 'Jardin des Bambous' },
          { lat: 47.2224, lng: -1.5489, name: 'Rosière historique' },
          { lat: 47.2227, lng: -1.5494, name: 'Allée des Platanes' },
          { lat: 47.2230, lng: -1.5499, name: 'Jardin des Cactus' },
          { lat: 47.2189, lng: -1.5432, name: 'Retour Entrée Jardin des Plantes' }
        ]),
        parcours: JSON.stringify([
          {
            titre: 'Départ - Entrée Jardin des Plantes',
            description: 'Rendez-vous et présentation du matériel argentique. Explication des techniques de photographie botanique.',
            duree: '30 min',
            distance: '0 km'
          },
          {
            titre: 'Allée des Palmiers',
            description: 'Photographie des palmiers centenaires. Techniques de cadrage vertical et de composition naturelle.',
            duree: '25 min',
            distance: '0.1 km'
          },
          {
            titre: 'Serres tropicales',
            description: 'Exploration des plantes exotiques. Photographie en intérieur avec gestion de la lumière.',
            duree: '35 min',
            distance: '0.2 km'
          },
          {
            titre: 'Jardin japonais',
            description: 'Capture de l\'ambiance zen et des éléments d\'eau. Techniques de photographie de paysage minimaliste.',
            duree: '30 min',
            distance: '0.3 km'
          },
          {
            titre: 'Rocaille alpine',
            description: 'Photographie des plantes de montagne. Techniques de macro-photographie botanique.',
            duree: '25 min',
            distance: '0.4 km'
          },
          {
            titre: 'Bassin des Nymphéas',
            description: 'Capture des fleurs d\'eau et des reflets. Photographie de nature et de paysage aquatique.',
            duree: '30 min',
            distance: '0.5 km'
          },
          {
            titre: 'Allée des Magnolias',
            description: 'Photographie des magnolias en fleur. Techniques de photographie de fleurs et de couleurs.',
            duree: '20 min',
            distance: '0.6 km'
          },
          {
            titre: 'Jardin de l\'École',
            description: 'Découverte des plantes médicinales. Photographie de détails botaniques.',
            duree: '25 min',
            distance: '0.7 km'
          },
          {
            titre: 'Point de vue sur la ville',
            description: 'Vue panoramique sur Nantes. Photographie de paysage urbain depuis la nature.',
            duree: '30 min',
            distance: '0.8 km'
          },
          {
            titre: 'Allée des Chênes',
            description: 'Photographie des arbres majestueux. Techniques de photographie d\'arbres et de forêt.',
            duree: '25 min',
            distance: '0.9 km'
          },
          {
            titre: 'Jardin des Bambous',
            description: 'Exploration de la bambouseraie. Photographie de textures et de formes naturelles.',
            duree: '30 min',
            distance: '1.0 km'
          },
          {
            titre: 'Rosière historique',
            description: 'Capture des roses anciennes. Techniques de photographie de fleurs en macro.',
            duree: '20 min',
            distance: '1.1 km'
          },
          {
            titre: 'Allée des Platanes',
            description: 'Photographie des platanes centenaires. Composition avec les allées ombragées.',
            duree: '25 min',
            distance: '1.2 km'
          },
          {
            titre: 'Jardin des Cactus',
            description: 'Découverte des plantes succulentes. Photographie de formes géométriques naturelles.',
            duree: '30 min',
            distance: '1.3 km'
          },
          {
            titre: 'Fin - Retour Entrée',
            description: 'Retour au point de départ. Révision des photos et conseils pour le développement argentique.',
            duree: '15 min',
            distance: '1.4 km'
          }
        ])
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
