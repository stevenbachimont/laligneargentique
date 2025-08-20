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
echo "DATABASE_URL=file:./prisma/dev.db" >> .env

echo "✅ Fichier .env généré avec succès"

# Créer la base de données si elle n'existe pas
echo "🗄️ Vérification de la base de données..."
npx prisma db push --accept-data-loss
echo "✅ Base de données prête"

# Démarrer l'application
echo "🌐 Démarrage du serveur..."
npm run preview -- --host 0.0.0.0 --port 3000 