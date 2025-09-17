# 🏗️ Architecture Technique

## 📋 Vue d'ensemble

Cette section contient la documentation relative à l'architecture technique du projet, incluant les diagrammes, les schémas et les spécifications techniques.

## 📚 Documentation Disponible

### 🏗️ Architecture Générale
- **[ARCHITECTURE_GENERALE.md](11-architecture-technique/ARCHITECTURE_GENERALE.md)** - Structure du projet et technologies
  - Organisation des dossiers et fichiers
  - Stack technique complet
  - Patterns architecturaux
  - Gestion des dépendances

### 🗄️ Base de Données
- **[ARCHITECTURE_DATABASE.md](11-architecture-technique/ARCHITECTURE_DATABASE.md)** - Schéma et relations
  - Structure des tables
  - Relations entre entités
  - Optimisations et index
  - Gestion des données JSON

### 🔌 APIs et Services
- **[ARCHITECTURE_APIS.md](11-architecture-technique/ARCHITECTURE_APIS.md)** - Endpoints et services
  - APIs publiques et admin
  - Architecture des services
  - Composants réutilisables
  - Gestion des erreurs

### 🔒 Sécurité
- **[ARCHITECTURE_SECURITE.md](11-architecture-technique/ARCHITECTURE_SECURITE.md)** - Architecture de sécurité
  - Authentification et autorisation
  - Protection des routes
  - Gestion des secrets
  - Monitoring de sécurité

### 🐳 Docker et Conteneurisation
- **[ARCHITECTURE_DOCKER.md](11-architecture-technique/ARCHITECTURE_DOCKER.md)** - Docker et Docker Compose
  - Configuration Dockerfile
  - Docker Compose complet
  - Gestion des volumes
  - Services de sauvegarde

### 🔄 CI/CD et Déploiement
- **[ARCHITECTURE_CICD.md](11-architecture-technique/ARCHITECTURE_CICD.md)** - Déploiement continu
  - GitHub Actions VPS
  - Pipeline de déploiement
  - Scripts de maintenance
  - Monitoring et logs

### 🧪 Tests et Qualité
- **[ARCHITECTURE_TESTS.md](11-architecture-technique/ARCHITECTURE_TESTS.md)** - Architecture de tests
  - Tests unitaires et intégration
  - Tests end-to-end
  - Qualité du code
  - Couverture de tests

### 📊 Performance et Monitoring
- **[ARCHITECTURE_PERFORMANCE.md](11-architecture-technique/ARCHITECTURE_PERFORMANCE.md)** - Performance et monitoring
  - Optimisations
  - Métriques de performance
  - Logs et monitoring
  - Surveillance système

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

---

**💡 Conseil** : Cette architecture est conçue pour être scalable, maintenable et sécurisée. Consultez les sections spécifiques pour plus de détails.
