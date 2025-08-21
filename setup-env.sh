#!/bin/bash

echo "🔧 Configuration de l'environnement de développement..."

# Vérifier si le fichier .env existe déjà
if [ -f ".env" ]; then
    echo "⚠️  Le fichier .env existe déjà."
    read -p "Voulez-vous le remplacer ? (oui/non): " replace
    if [ "$replace" != "oui" ]; then
        echo "❌ Configuration annulée."
        exit 0
    fi
fi

# Créer le fichier .env
echo "📝 Création du fichier .env..."

cat > .env << EOF
# Configuration email (remplacez par vos vraies valeurs)
EMAIL_USER=votre-email@gmail.com
EMAIL_APP_PASSWORD=votre-mot-de-passe-d-application
ADMIN_EMAIL=votre-email@gmail.com

# Configuration serveur
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Configuration base de données
DATABASE_URL=file:./data/balades.db

# Configuration SMTP alternative (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe

# Configuration administrateur
ADMIN_ACCESS_CODE=argentique2024
EOF

echo "✅ Fichier .env créé avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Modifiez le fichier .env avec vos vraies valeurs d'email"
echo "2. Changez le code d'accès administrateur si nécessaire"
echo "3. Lancez le serveur avec : npm run dev"
echo ""
echo "🔐 Code d'accès administrateur par défaut : argentique2024"
echo "🌐 Interface d'administration : http://localhost:3000/admin"
