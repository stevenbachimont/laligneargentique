# 🐳 Architecture Docker

## 📋 Vue d'ensemble

Cette section détaille l'architecture Docker du projet, incluant la configuration Dockerfile, Docker Compose, la gestion des volumes et les services de sauvegarde.

## 🐳 Dockerfile

### Configuration Optimisée
```dockerfile
# Dockerfile
FROM node:18-alpine

# Installation des dépendances système
RUN apk add --no-cache \
    sqlite \
    bash \
    curl

# Configuration du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production && npm cache clean --force

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Création d'un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Changement de propriétaire des fichiers
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exposition du port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Commande de démarrage
CMD ["npm", "start"]
```

### Optimisations
- **Image Alpine** : Image légère et sécurisée
- **Utilisateur non-root** : Sécurité renforcée
- **Cache des dépendances** : Build plus rapide
- **Nettoyage du cache** : Réduction de la taille

## 🐙 Docker Compose

### Configuration Complète
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    container_name: monsite-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./data/balades.db
    volumes:
      # Volume persistant pour la base de données
      - ./data:/app/data
      # Volume pour les logs
      - ./logs:/app/logs
      # Volume pour les uploads (si applicable)
      - ./uploads:/app/uploads
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - monsite-network

  # Service de sauvegarde (optionnel)
  backup:
    image: alpine:latest
    container_name: monsite-backup
    volumes:
      - ./data:/backup/data:ro
      - ./backups:/backup/output
    command: >
      sh -c "
        apk add --no-cache sqlite &&
        while true; do
          timestamp=$$(date +%Y%m%d_%H%M%S)
          sqlite3 /backup/data/balades.db '.backup /backup/output/balades_$$timestamp.db'
          find /backup/output -name 'balades_*.db' -mtime +7 -delete
          sleep 86400
        done
      "
    restart: unless-stopped
    networks:
      - monsite-network

networks:
  monsite-network:
    driver: bridge

volumes:
  data:
    driver: local
  logs:
    driver: local
  backups:
    driver: local
```

### Services
- **app** : Application principale
- **backup** : Service de sauvegarde automatique
- **networks** : Réseau isolé pour la communication
- **volumes** : Volumes persistants pour les données

## 📦 Gestion des Volumes

### Structure des Volumes
```
/root/monsite/
├── data/                    # Volume persistant pour la base de données
│   ├── balades.db          # Base de données principale
│   └── balades.db.backup   # Sauvegarde automatique
├── logs/                   # Volume pour les logs
│   ├── app.log            # Logs de l'application
│   ├── error.log          # Logs d'erreurs
│   └── access.log         # Logs d'accès
├── backups/               # Volume pour les sauvegardes
│   ├── daily/             # Sauvegardes quotidiennes
│   ├── weekly/            # Sauvegardes hebdomadaires
│   └── monthly/           # Sauvegardes mensuelles
└── uploads/               # Volume pour les fichiers uploadés
    ├── images/            # Images uploadées
    └── documents/         # Documents uploadés
```

### Types de Volumes
- **Volumes bind** : Liens directs vers le système de fichiers
- **Volumes nommés** : Volumes gérés par Docker
- **Volumes temporaires** : Données non persistantes

## 🔧 Scripts de Gestion

### Sauvegarde de Base de Données
```bash
# scripts/backup-database.sh
#!/bin/bash
set -e

BACKUP_DIR="./backups/daily"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_FILE="./data/balades.db"
BACKUP_FILE="$BACKUP_DIR/balades_$TIMESTAMP.db"

# Création du répertoire de sauvegarde
mkdir -p "$BACKUP_DIR"

# Sauvegarde de la base de données
sqlite3 "$DB_FILE" ".backup '$BACKUP_FILE'"

# Compression de la sauvegarde
gzip "$BACKUP_FILE"

# Nettoyage des anciennes sauvegardes (plus de 30 jours)
find "$BACKUP_DIR" -name "balades_*.db.gz" -mtime +30 -delete

echo "✅ Sauvegarde créée: $BACKUP_FILE.gz"
```

### Restauration de Base de Données
```bash
# scripts/restore-database.sh
#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

BACKUP_FILE="$1"
DB_FILE="./data/balades.db"

# Vérification de l'existence du fichier de sauvegarde
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Fichier de sauvegarde non trouvé: $BACKUP_FILE"
    exit 1
fi

# Arrêt de l'application
docker-compose down

# Sauvegarde de la base actuelle
cp "$DB_FILE" "$DB_FILE.backup.$(date +%Y%m%d_%H%M%S)"

# Restauration
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | sqlite3 "$DB_FILE"
else
    sqlite3 "$DB_FILE" < "$BACKUP_FILE"
fi

# Redémarrage de l'application
docker-compose up -d

echo "✅ Base de données restaurée depuis: $BACKUP_FILE"
```

## 🏥 Health Checks

### Configuration
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Endpoint de Santé
```typescript
// src/routes/api/health/+server.ts
export async function GET() {
  try {
    // Vérification de la base de données
    const db = getDatabase();
    db.prepare('SELECT 1').get();
    
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'unhealthy',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

## 🔄 Gestion des Mises à Jour

### Déploiement Sécurisé
```bash
# scripts/deploy-secure.sh
#!/bin/bash
set -e

echo "🚀 Déploiement sécurisé de l'application..."

# Vérification des prérequis
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml non trouvé"
    exit 1
fi

# Sauvegarde avant déploiement
echo "📦 Création de la sauvegarde..."
./scripts/backup-database.sh

# Test de la configuration
echo "🧪 Test de la configuration..."
docker-compose config

# Arrêt propre
echo "🛑 Arrêt des services..."
docker-compose down

# Nettoyage
echo "🧹 Nettoyage des ressources..."
docker system prune -f

# Reconstruction
echo "🔨 Reconstruction des images..."
docker-compose build --no-cache

# Démarrage
echo "▶️ Démarrage des services..."
docker-compose up -d

# Attente du démarrage
echo "⏳ Attente du démarrage..."
sleep 15

# Vérification de santé
echo "🏥 Vérification de la santé..."
if curl -f http://localhost:3000/api/health; then
    echo "✅ Application déployée avec succès"
else
    echo "❌ Échec du déploiement"
    exit 1
fi

# Affichage du statut
echo "📊 Statut des conteneurs:"
docker-compose ps
```

## 📊 Monitoring

### Script de Monitoring
```bash
# scripts/monitor.sh
#!/bin/bash

echo "📊 Monitoring de l'application..."

# Statut des conteneurs
echo "🐳 Conteneurs Docker:"
docker-compose ps

# Utilisation des ressources
echo "💾 Utilisation des ressources:"
docker stats --no-stream

# Logs récents
echo "📝 Logs récents:"
docker-compose logs --tail=20

# Espace disque
echo "💿 Espace disque:"
df -h

# Taille des volumes
echo "📦 Taille des volumes:"
du -sh data/ logs/ backups/ 2>/dev/null || echo "Volumes non trouvés"
```

## 🚀 Commandes Utiles

### Gestion des Conteneurs
```bash
# Démarrage
docker-compose up -d

# Arrêt
docker-compose down

# Redémarrage
docker-compose restart

# Logs en temps réel
docker-compose logs -f

# Accès au conteneur
docker-compose exec app sh
```

### Gestion des Images
```bash
# Reconstruction
docker-compose build --no-cache

# Nettoyage des images
docker image prune -f

# Nettoyage complet
docker system prune -f --volumes
```

### Gestion des Volumes
```bash
# Liste des volumes
docker volume ls

# Inspection d'un volume
docker volume inspect monsite_data

# Suppression d'un volume
docker volume rm monsite_data
```

---

**💡 Conseil** : Cette architecture Docker est conçue pour la production avec une gestion robuste des données, des sauvegardes automatiques et un monitoring complet.
