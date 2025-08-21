# MonSite - Portfolio Photographique et Web

Site web portfolio présentant des travaux photographiques et de développement web, avec un système de réservation pour des balades photo argentique.

## 🎯 Fonctionnalités

- **Portfolio Photographique** : Séries Street, Portraits, Paysages et Quotidien
- **Portfolio Web** : Projets de développement web
- **Balades Argentique** : Système de réservation automatique avec gestion des places
- **Formulaire de Contact** : Envoi d'emails automatique
- **Interface Responsive** : Optimisé pour tous les appareils

## 🚀 Système de Réservation avec Base de Données

Le site inclut un système de gestion des balades argentique avec base de données SQLite :

### Fonctionnalités
- ✅ **Base de données SQLite** pour la persistance des données
- ✅ **Gestion automatique des places** lors des réservations
- ✅ **Validation des réservations** côté serveur
- ✅ **Interface utilisateur réactive** avec statuts visuels
- ✅ **API REST simple** pour les opérations CRUD

### Statuts des Balades
- 🟢 **Disponible** : Plus de 2 places disponibles
- 🟡 **Limite** : 1-2 places disponibles  
- 🔴 **Complet** : 0 place disponible

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

## 🛠️ API de Gestion des Balades

### Récupérer les Balades
```bash
GET /api/balades
```

### Créer une Réservation
```bash
POST /api/balades/reservation
Content-Type: application/json

{
  "baladeId": 1,
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@email.com",
  "nombrePersonnes": 2,
  "message": "Message optionnel"
}
```

### Base de Données
Les données sont stockées dans `data/balades.db` avec les tables :
- `balades` : Informations des balades et places disponibles
- `reservations` : Historique des réservations

## 🧪 Tests

Le projet inclut une suite de tests complète :

```bash
# Lancer tous les tests
npm test

# Tests spécifiques
npm run test:unit    # Tests unitaires
npm run test:e2e     # Tests end-to-end
```

### Couverture des Tests
- ✅ **Service de gestion des balades**
- ✅ **Validation des données**
- ✅ **Interface utilisateur**
- ✅ **API endpoints**
- ✅ **Intégration des composants**
