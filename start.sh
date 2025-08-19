#!/bin/sh

# Générer le fichier .env au runtime avec les variables VITE_ pour SvelteKit
echo "EMAIL_USER=$EMAIL_USER" > .env
echo "EMAIL_APP_PASSWORD=$EMAIL_APP_PASSWORD" >> .env
echo "ADMIN_EMAIL=$ADMIN_EMAIL" >> .env

# Démarrer l'application
npm run preview -- --host 0.0.0.0 --port 3000 