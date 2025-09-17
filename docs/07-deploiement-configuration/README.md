# 🚀 Déploiement & Configuration

## 📋 Vue d'ensemble

Cette section contient toute la documentation relative au déploiement et à la configuration de l'application.

## 📚 Documentation Disponible

### 📊 Déploiement des Données
- **[DEPLOIEMENT_DONNEES.md](07-deploiement-configuration/DEPLOIEMENT_DONNEES.md)** - Guide de déploiement des données
  - Migration de base de données
  - Configuration des données initiales
  - Sauvegarde et restauration

### ⚙️ Configuration d'Environnement
- **[ENV_CONFIGURATION.md](07-deploiement-configuration/ENV_CONFIGURATION.md)** - Configuration des variables d'environnement
  - Variables requises
  - Configuration par environnement
  - Validation des configurations

## 🎯 Fonctionnalités Principales

### ✅ Déploiement des Données
- **Migration automatique** : Scripts de migration de base de données
- **Données initiales** : Configuration des données par défaut
- **Sauvegarde** : Système de sauvegarde automatique
- **Restauration** : Processus de restauration des données

### ✅ Configuration d'Environnement
- **Variables d'environnement** : Configuration centralisée
- **Validation** : Vérification des configurations requises
- **Environnements multiples** : Développement, test, production
- **Sécurité** : Gestion sécurisée des secrets

## 🔧 Configuration Requise

### Variables d'Environnement Essentielles
```bash
# Base de données
DATABASE_URL=sqlite:./data/balades.db

# Email
EMAIL_USER=votre-email@gmail.com
EMAIL_APP_PASSWORD=votre-mot-de-passe-d-application
ADMIN_EMAIL=votre-email-admin@gmail.com

# Admin
ADMIN_ACCESS_CODE=votre_code_securise

# Stripe (pour les paiements)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Environnement
NODE_ENV=production
```

### Configuration par Environnement

#### Développement
```bash
NODE_ENV=development
DATABASE_URL=sqlite:./data/balades.db
EMAIL_USER=dev@example.com
ADMIN_ACCESS_CODE=dev123
```

#### Test
```bash
NODE_ENV=test
DATABASE_URL=sqlite:./data/test.db
EMAIL_USER=test@example.com
ADMIN_ACCESS_CODE=test123
```

#### Production
```bash
NODE_ENV=production
DATABASE_URL=sqlite:./data/balades.db
EMAIL_USER=contact.bachimont@gmail.com
ADMIN_ACCESS_CODE=argentique2024
```

## 🚀 Processus de Déploiement

### 1. Préparation
```bash
# Cloner le projet
git clone <url-du-repo>
cd laligneargentique

# Installer les dépendances
npm install
```

### 2. Configuration
```bash
# Copier le fichier d'exemple
cp env.example .env

# Éditer la configuration
nano .env
```

### 3. Migration de Base de Données
```bash
# Exécuter les migrations
node scripts/migrate.js

# Vérifier la structure
sqlite3 data/balades.db ".schema"
```

### 4. Déploiement
```bash
# Build de production
npm run build

# Démarrage
npm start
```

## 🐳 Déploiement avec Docker

### Configuration Docker
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

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
      - ./.env:/app/.env
```

### Déploiement
```bash
# Build et démarrage
docker-compose up -d --build

# Vérification des logs
docker-compose logs -f app
```

## 🛡️ Sécurité

### Variables Sensibles
- **Ne jamais** commiter le fichier `.env` dans Git
- **Utiliser** des variables d'environnement pour les secrets
- **Chiffrer** les données sensibles en production

### Configuration Sécurisée
```bash
# Permissions des fichiers
chmod 600 .env
chmod 700 data/

# Propriétaire des fichiers
chown app:app .env
chown app:app data/
```

## 🧪 Tests de Déploiement

### Tests de Configuration
```bash
# Vérifier les variables d'environnement
npm run test:env

# Tester la connexion à la base de données
npm run test:db

# Tester la configuration email
npm run test:email
```

### Tests d'Intégration
```bash
# Tests complets
npm run test:integration

# Tests de déploiement
npm run test:deployment
```

## 🚨 Dépannage

### Erreurs Communes

#### 1. "Cannot find module"
```bash
# Solution
npm install
npm run build
```

#### 2. "Database connection failed"
```bash
# Vérifier la configuration
cat .env | grep DATABASE_URL

# Vérifier les permissions
ls -la data/
```

#### 3. "Email configuration invalid"
```bash
# Tester la configuration
npm run test:email

# Vérifier les identifiants
cat .env | grep EMAIL
```

### Logs de Débogage
```bash
# Logs de l'application
tail -f logs/app.log

# Logs Docker
docker-compose logs -f app

# Logs système
journalctl -u your-app-service -f
```

## 📊 Monitoring

### Métriques de Déploiement
- **Uptime** : Temps de fonctionnement
- **Performance** : Temps de réponse
- **Erreurs** : Taux d'erreur
- **Ressources** : Utilisation CPU/Mémoire

### Alertes
- **Disponibilité** : Alertes en cas d'indisponibilité
- **Performance** : Alertes en cas de lenteur
- **Erreurs** : Alertes en cas d'erreurs critiques
- **Ressources** : Alertes en cas de surcharge

---

**💡 Conseil** : Commencez par le `ENV_CONFIGURATION.md` pour configurer correctement votre environnement.
