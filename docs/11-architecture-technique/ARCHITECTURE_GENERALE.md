# 🏗️ Architecture Générale

## 📋 Vue d'ensemble

Cette section détaille l'architecture générale du projet, incluant la structure des dossiers, les technologies utilisées et les patterns architecturaux.

## 🎯 Technologies Utilisées

### Frontend
- **SvelteKit** : Framework principal
- **TypeScript** : Langage de programmation
- **CSS** : Styles et responsive design
- **JavaScript** : Logique côté client

### Backend
- **Node.js** : Runtime JavaScript
- **SvelteKit** : Framework full-stack
- **SQLite** : Base de données
- **Better-SQLite3** : Driver de base de données

### Services Externes
- **Stripe** : Paiements
- **Gmail SMTP** : Envoi d'emails
- **Docker** : Conteneurisation

## 🏗️ Structure du Projet

```
laligneargentique/
├── src/
│   ├── app.html                 # Template HTML principal
│   ├── app.css                  # Styles globaux
│   ├── hooks.server.ts          # Hooks serveur
│   ├── lib/
│   │   ├── components/          # Composants réutilisables
│   │   ├── server/              # Services et logique serveur
│   │   └── client/              # Services côté client
│   └── routes/
│       ├── api/                 # Endpoints API
│       ├── admin/               # Interface d'administration
│       └── photographie/        # Pages photographie
├── static/                      # Fichiers statiques
├── tests/                       # Tests unitaires et d'intégration
├── e2e/                         # Tests end-to-end
├── docs/                        # Documentation
└── scripts/                     # Scripts de maintenance
```

## 🔧 Patterns Architecturaux

### Architecture en Couches
- **Présentation** : Composants Svelte
- **Logique métier** : Services et API
- **Données** : Base de données SQLite
- **Infrastructure** : Docker et déploiement

### Séparation des Responsabilités
- **Composants** : Interface utilisateur
- **Services** : Logique métier
- **Routes** : Gestion des requêtes
- **Utils** : Fonctions utilitaires

## 📦 Gestion des Dépendances

### Package.json
```json
{
  "dependencies": {
    "@sveltejs/adapter-node": "^1.0.0",
    "@sveltejs/kit": "^1.0.0",
    "better-sqlite3": "^8.0.0",
    "stripe": "^12.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.0.0",
    "@sveltejs/vite-plugin-svelte": "^2.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
}
```

### Gestion des Versions
- **Dépendances fixes** : Versions exactes pour la production
- **Dépendances de développement** : Versions flexibles
- **Mise à jour régulière** : Audit de sécurité

---

**💡 Conseil** : Cette architecture est conçue pour être maintenable, scalable et sécurisée.
