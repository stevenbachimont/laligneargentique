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

# Vérifier les variables Stripe
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "⚠️  AVERTISSEMENT: STRIPE_SECRET_KEY n'est pas défini - les paiements ne fonctionneront pas"
fi

if [ -z "$STRIPE_PUBLISHABLE_KEY" ]; then
    echo "⚠️  AVERTISSEMENT: STRIPE_PUBLISHABLE_KEY n'est pas défini - les paiements ne fonctionneront pas"
fi

if [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
    echo "⚠️  AVERTISSEMENT: STRIPE_WEBHOOK_SECRET n'est pas défini - les webhooks ne fonctionneront pas"
fi

echo "✅ Variables d'environnement détectées:"
echo "   EMAIL_USER: $EMAIL_USER"
echo "   EMAIL_APP_PASSWORD: [MASQUÉ]"
echo "   ADMIN_EMAIL: $ADMIN_EMAIL"
echo "   STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY:+[CONFIGURÉ]}"
echo "   STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUBLISHABLE_KEY:+[CONFIGURÉ]}"
echo "   STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET:+[CONFIGURÉ]}"

# Générer le fichier .env au runtime avec les variables pour SvelteKit
echo "📝 Génération du fichier .env..."
echo "EMAIL_USER=$EMAIL_USER" > .env
echo "EMAIL_APP_PASSWORD=$EMAIL_APP_PASSWORD" >> .env
echo "ADMIN_EMAIL=$ADMIN_EMAIL" >> .env
echo "NODE_ENV=production" >> .env
echo "PORT=3000" >> .env
echo "HOST=0.0.0.0" >> .env
echo "DATABASE_URL=file:./data/balades.db" >> .env
echo "ADMIN_ACCESS_CODE=$ADMIN_ACCESS_CODE" >> .env

# Ajouter les variables Stripe si elles sont définies
if [ ! -z "$STRIPE_SECRET_KEY" ]; then
    echo "STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY" >> .env
fi

if [ ! -z "$STRIPE_PUBLISHABLE_KEY" ]; then
    echo "STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY" >> .env
fi

if [ ! -z "$STRIPE_WEBHOOK_SECRET" ]; then
    echo "STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET" >> .env
fi

# Variable publique pour SvelteKit (doit être définie)
if [ ! -z "$STRIPE_PUBLISHABLE_KEY" ]; then
    echo "PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY" >> .env
else
    echo "PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder" >> .env
    echo "⚠️  Utilisation d'une clé Stripe de placeholder - les paiements ne fonctionneront pas"
fi

echo "✅ Fichier .env généré avec succès"

# Créer la base de données si elle n'existe pas
echo "🗄️ Vérification de la base de données..."
if [ ! -f "./data/balades.db" ]; then
    echo "📝 Création de la base de données..."
    node init-db.js
else
    echo "✅ Base de données existante"
fi
echo "✅ Base de données prête"

# Démarrer l'application
echo "🌐 Démarrage du serveur..."
npm run preview -- --host 0.0.0.0 --port 3000 