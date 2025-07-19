#!/bin/sh

# Générer le fichier .env au runtime avec les variables VITE_ pour SvelteKit
echo "VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID" > .env
echo "VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID" >> .env
echo "VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY" >> .env

# Démarrer l'application
npm run preview -- --host 0.0.0.0 --port 3000 