# MonSite - Portfolio Photographique et Web

Site web portfolio présentant des travaux photographiques et de développement web, avec un système de réservation pour des balades photo argentique.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Configuration EmailJS

Pour que le formulaire de contact fonctionne, vous devez configurer les variables d'environnement EmailJS :

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez vos clés EmailJS :

```bash
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_PUBLIC_KEY=votre_public_key
```

## Déploiement Docker

Le projet inclut une configuration Docker complète :

```bash
# Build de l'image
docker build -t monsite .

# Lancement avec docker-compose
docker-compose up -d
```

> **Note** : Les variables d'environnement EmailJS peuvent être surchargées via docker-compose ou définies dans le Dockerfile.
