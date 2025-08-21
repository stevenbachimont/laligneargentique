#!/bin/sh

echo "🚀 Démarrage de l'application..."

# Vérifier que les variables d'environnement sont présentes
if [ -z "$EMAIL_USER" ]; then
    echo "❌ ERREUR: EMAIL_USER n'est pas défini"
    exit 1
fi

if [ -z "$EMAIL_APP_PASSWORD" ]; then
    echo "❌ ERREUR: EMAIL_APP_PASSWORD n'est pas défini"
    exit 1
fi

echo "✅ Variables d'environnement détectées:"
echo "   EMAIL_USER: $EMAIL_USER"
echo "   EMAIL_APP_PASSWORD: [MASQUÉ]"
echo "   ADMIN_EMAIL: $ADMIN_EMAIL"

# Générer le fichier .env au runtime avec les variables pour SvelteKit
echo "📝 Génération du fichier .env..."
echo "EMAIL_USER=$EMAIL_USER" > .env
echo "EMAIL_APP_PASSWORD=$EMAIL_APP_PASSWORD" >> .env
echo "ADMIN_EMAIL=$ADMIN_EMAIL" >> .env
echo "NODE_ENV=production" >> .env
echo "DATABASE_URL=file:./data/balades.db" >> .env

echo "✅ Fichier .env généré avec succès"

# Créer la base de données si elle n'existe pas
echo "🗄️ Vérification de la base de données..."
if [ ! -f "./data/balades.db" ]; then
    echo "📝 Création de la base de données..."
    node -e "
    const Database = require('better-sqlite3');
    const db = new Database('./data/balades.db');
    
    // Créer les tables
    db.exec(\`
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
    \`);
    
    // Insérer les données initiales si la table est vide
    const count = db.prepare('SELECT COUNT(*) as count FROM balades').get();
    if (count.count === 0) {
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
    }
    
    db.close();
    console.log('✅ Base de données créée et initialisée');
    \"
else
    echo "✅ Base de données existante"
fi
echo "✅ Base de données prête"

# Démarrer l'application
echo "🌐 Démarrage du serveur..."
npm run preview -- --host 0.0.0.0 --port 3000 