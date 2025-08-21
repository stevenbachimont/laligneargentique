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
- 🟢 **Disponible** : 4-5 places disponibles (vert)
- 🟠 **Moyen** : 2-3 places disponibles (orange)
- 🔴 **Critique/Complet** : 0-1 place disponible (rouge)

### Système de Code Couleur
Le site utilise un système de code couleur intuitif pour indiquer la disponibilité :
- **🟢 Vert (#00ff00)** : Places nombreuses (4-5), pas d'urgence
- **🟠 Orange (#ff8c00)** : Places moyennes (2-3), réserver bientôt
- **🔴 Rouge (#ff6b6b)** : Places critiques (0-1) ou balade complète

## 🚀 Installation et Démarrage

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd monsite
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
# Option 1 : Script automatique
./setup-env.sh

# Option 2 : Manuel
cp env.example .env
# Puis éditez le fichier .env avec vos valeurs
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

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
- `balades` : Informations des balades (date, heure, lieu, thème, places disponibles, etc.)
- `reservations` : Historique des réservations

### Gestion des Balades

#### Interface Web d'Administration
Accédez à l'interface d'administration sécurisée : `/admin`

**Code d'accès :** Configuré dans le fichier `.env` (variable `ADMIN_ACCESS_CODE`)
**Code par défaut :** `argentique2024`

**Fonctionnalités :**
- 🔐 Authentification par code
- 📋 Gestion complète des balades (ajouter, modifier, supprimer)
- 📅 Gestion des réservations
- 🔍 Recherche et filtrage
- 📊 Statistiques

#### Script de Maintenance (Alternative)
Pour gérer les balades en ligne de commande :

```bash
# Lancer le gestionnaire interactif
npm run manage-balades

# Ou directement
node scripts/manage-balades.js
```

**Fonctionnalités :**
- 📋 Lister toutes les balades
- ➕ Ajouter une nouvelle balade
- ✏️ Modifier une balade existante
- 🗑️ Supprimer une balade
- 📋 Voir les réservations

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
