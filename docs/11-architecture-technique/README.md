# 🏗️ Architecture Technique

## 📋 Vue d'ensemble

Cette section contient la documentation relative à l'architecture technique du projet, incluant les diagrammes, les schémas et les spécifications techniques.

## 📚 Documentation Disponible

### 🏗️ Architecture Générale
- **Structure du projet** : Organisation des dossiers et fichiers
- **Technologies utilisées** : Stack technique complet
- **Patterns architecturaux** : Modèles de conception appliqués
- **Dépendances** : Gestion des dépendances et versions

### 🔧 Spécifications Techniques
- **Base de données** : Schéma et relations
- **APIs** : Endpoints et documentation
- **Services** : Architecture des services
- **Composants** : Structure des composants

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
monsite/
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

## 🗄️ Architecture de la Base de Données

### Schéma Principal
```sql
-- Table des balades
CREATE TABLE balades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme TEXT NOT NULL,
  date TEXT NOT NULL,
  heure TEXT NOT NULL,
  lieu TEXT NOT NULL,
  prix TEXT NOT NULL,
  places_disponibles INTEGER NOT NULL,
  description TEXT NOT NULL,
  consignes TEXT NOT NULL,        -- JSON array
  materiel TEXT NOT NULL,         -- JSON array
  coordonnees TEXT NOT NULL,      -- JSON array
  parcours TEXT NOT NULL,         -- JSON array
  statut TEXT DEFAULT 'en_ligne'
);

-- Table des réservations
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  balade_id INTEGER NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  nombre_personnes INTEGER NOT NULL,
  message TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (balade_id) REFERENCES balades(id)
);
```

### Relations
- **balades** ↔ **reservations** : Relation 1:N
- **Champs JSON** : Structure flexible pour les données complexes
- **Index** : Optimisation des requêtes fréquentes

## 🔌 Architecture des APIs

### Endpoints Publics
```
GET  /api/balades                    # Récupérer les balades
POST /api/balades/reservation        # Créer une réservation
POST /api/contact                    # Envoyer un message de contact
POST /api/payment/create             # Créer un paiement Stripe
POST /api/payment/webhook            # Webhook Stripe
```

### Endpoints Admin
```
POST /api/admin/auth                 # Authentification admin
GET  /api/admin/balades              # Récupérer toutes les balades
POST /api/admin/balades              # Créer une balade
PUT  /api/admin/balades/[id]         # Modifier une balade
DELETE /api/admin/balades/[id]       # Supprimer une balade
GET  /api/admin/reservations         # Récupérer les réservations
DELETE /api/admin/reservations/[id]  # Supprimer une réservation
```

### Endpoints de Test
```
GET  /api/test-env                   # Variables d'environnement
POST /api/test-email-connection      # Test connexion email
POST /api/test-argentique            # Test validation
```

## 🏗️ Architecture des Services

### Services Serveur
```typescript
// src/lib/server/
├── baladesService.ts        # Gestion des balades
├── emailService.ts          # Envoi d'emails
├── stripeService.ts         # Paiements Stripe
├── authService.ts           # Authentification
├── validationService.ts     # Validation des données
├── captchaService.ts        # Système de captcha
├── rateLimiter.ts           # Rate limiting
└── database.ts              # Connexion base de données
```

### Services Client
```typescript
// src/lib/client/
├── stripeClient.ts          # Client Stripe
└── adminApiService.ts       # Service API admin
```

### Composants
```typescript
// src/lib/components/
├── AdminAuth.svelte         # Authentification admin
├── Captcha.svelte           # Composant captcha
└── StripePaymentForm.svelte # Formulaire de paiement
```

## 🔒 Architecture de Sécurité

### Authentification
- **Sessions cryptographiques** : Tokens sécurisés
- **Expiration automatique** : 24 heures
- **Validation côté serveur** : Vérification systématique
- **Rate limiting** : Protection contre les attaques

### Protection des Routes
- **Middleware de sécurité** : Authentification obligatoire
- **Headers de sécurité** : Protection XSS, CSRF
- **Validation CORS** : Contrôle des origines
- **Validation des données** : Sanitisation et validation

### Gestion des Secrets
- **Variables d'environnement** : Configuration sécurisée
- **Clés API** : Gestion sécurisée des clés
- **Webhooks** : Validation des signatures
- **Logs de sécurité** : Audit et monitoring

## 🚀 Architecture de Déploiement

### Développement
```bash
# Serveur de développement
npm run dev

# Tests
npm run test:unit
npm run test:e2e
```

### Production
```bash
# Build de production
npm run build

# Démarrage
npm start
```

### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Architecture de Monitoring

### Logs
- **Logs d'application** : Erreurs et événements
- **Logs de sécurité** : Tentatives d'accès
- **Logs de performance** : Métriques de performance
- **Logs d'audit** : Actions administratives

### Métriques
- **Performance** : Temps de réponse, utilisation CPU
- **Sécurité** : Tentatives d'accès, erreurs d'authentification
- **Utilisation** : Nombre de requêtes, utilisateurs actifs
- **Erreurs** : Taux d'erreur, types d'erreurs

## 🧪 Architecture de Tests

### Tests Unitaires
```
tests/
├── services/                # Tests des services
├── api/                     # Tests des APIs
└── utils/                   # Tests des utilitaires
```

### Tests d'Intégration
```
tests/
├── integration/             # Tests d'intégration
└── routes/                  # Tests des routes
```

### Tests End-to-End
```
e2e/
├── demo.test.ts            # Tests de démonstration
└── parcours.test.ts        # Tests de parcours utilisateur
```

## 🔄 Architecture de CI/CD

### Pipeline de Déploiement
1. **Tests** : Exécution des tests unitaires et d'intégration
2. **Build** : Construction de l'application
3. **Déploiement** : Déploiement en production
4. **Validation** : Tests de validation post-déploiement

### Qualité du Code
- **Linting** : ESLint et Prettier
- **Types** : TypeScript strict
- **Tests** : Couverture de code 100%
- **Sécurité** : Audit de sécurité

## 📈 Architecture de Performance

### Optimisations
- **Code splitting** : Chargement à la demande
- **Lazy loading** : Chargement différé des composants
- **Caching** : Mise en cache des données
- **Compression** : Compression des assets

### Monitoring
- **Temps de réponse** : Surveillance des APIs
- **Utilisation mémoire** : Monitoring des ressources
- **Taux d'erreur** : Surveillance des erreurs
- **Performance utilisateur** : Métriques d'expérience

---

**💡 Conseil** : Cette architecture est conçue pour être scalable, maintenable et sécurisée. Consultez les sections spécifiques pour plus de détails.
