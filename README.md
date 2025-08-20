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

## Configuration Email

Pour que les formulaires de contact et de réservation fonctionnent, vous devez configurer les variables d'environnement email :

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez vos paramètres email :

```bash
# Configuration Gmail (recommandé)
EMAIL_USER=votre-email@gmail.com
EMAIL_APP_PASSWORD=votre-mot-de-passe-d-application
ADMIN_EMAIL=votre-email-admin@gmail.com

# Ou configuration SMTP personnalisé
# SMTP_HOST=smtp.votre-fournisseur.com
# SMTP_PORT=587
# SMTP_USER=votre-email@votre-fournisseur.com
# SMTP_PASS=votre-mot-de-passe
```

## Déploiement Docker

Le projet inclut une configuration Docker complète :

```bash
# Build de l'image
docker build -t monsite .

# Lancement avec docker-compose
docker-compose up -d
```

> **Note** : Les variables d'environnement peuvent être surchargées via docker-compose ou définies dans le Dockerfile.
