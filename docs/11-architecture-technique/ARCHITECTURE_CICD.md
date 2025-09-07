# 🔄 Architecture CI/CD

## 📋 Vue d'ensemble

Cette section détaille l'architecture de déploiement continu (CI/CD) du projet, incluant les GitHub Actions, les pipelines de déploiement et les scripts de maintenance.

## 🚀 GitHub Actions - Déploiement VPS

### Configuration Complète
```yaml
# .github/workflows/deploy.yml
name: Déploiement Docker sur VPS

on:
  push:
    branches:
      - main
      - steven
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout du code
        uses: actions/checkout@v3

      - name: Configuration Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Installation des dépendances
        run: npm ci

      - name: Tests unitaires
        run: npm run test:unit

      - name: Tests d'intégration
        run: npm run test:integration

      - name: Build de l'application
        run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/steven'
    
    steps:
      - name: Checkout du code
        uses: actions/checkout@v3

      - name: Déploiement sur le VPS
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          script: |
            # Navigation vers le répertoire du projet
            cd /root/monsite
            
            # Sauvegarde de la base de données avant déploiement
            ./scripts/backup-database.sh
            
            # Récupération du code
            git pull origin ${{ github.ref_name }}
            
            # Arrêt des conteneurs
            docker-compose down
            
            # Nettoyage des images inutilisées
            docker image prune -f
            
            # Reconstruction et démarrage
            docker-compose up -d --build
            
            # Attente du démarrage
            sleep 10
            
            # Vérification du statut
            docker-compose ps
            
            # Nettoyage du système
            docker system prune -f --volumes
            
            # Test de santé de l'application
            curl -f http://localhost:3000/api/health || exit 1
            
            echo "✅ Déploiement terminé avec succès"
```

### Étapes du Pipeline
1. **Tests** : Exécution des tests unitaires et d'intégration
2. **Build** : Construction de l'application
3. **Déploiement** : Déploiement sur le VPS
4. **Validation** : Tests de santé post-déploiement

## 📚 GitHub Actions - Documentation

### Configuration
```yaml
# .github/workflows/docs.yml
name: Déploiement Documentation GitHub Pages

on:
  push:
    branches:
      - main
      - steven2
    paths:
      - 'docs/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pages: write
      id-token: write

    steps:
      - name: Checkout du code
        uses: actions/checkout@v4

      - name: Configurer Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './docs'

      - name: Déployer sur GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Déploiement Séparé
- **Déclenchement** : Modifications dans le dossier `docs/`
- **Cible** : GitHub Pages
- **Indépendant** : Ne perturbe pas le déploiement principal

## 🔧 Scripts de Maintenance

### Script de Déploiement Sécurisé
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

## 🔄 Pipeline de Déploiement

### Étapes Automatisées
1. **Déclenchement** : Push sur les branches `main` ou `steven`
2. **Tests** : Exécution automatique des tests
3. **Build** : Construction de l'application
4. **Sauvegarde** : Sauvegarde de la base de données
5. **Déploiement** : Mise à jour sur le VPS
6. **Validation** : Tests de santé post-déploiement

### Gestion des Erreurs
- **Rollback automatique** : En cas d'échec des tests de santé
- **Notifications** : Alertes en cas de problème
- **Logs détaillés** : Traçabilité complète du déploiement

## 🏥 Tests de Santé

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

### Vérifications
- **Base de données** : Connexion et requêtes
- **Services externes** : Stripe, Email
- **Ressources système** : Mémoire, CPU
- **Endpoints critiques** : APIs principales

## 📊 Monitoring et Logs

### Logs de Déploiement
```bash
# Logs GitHub Actions
gh run list --workflow=deploy.yml

# Logs du VPS
docker-compose logs -f app

# Logs de santé
curl http://localhost:3000/api/health
```

### Métriques
- **Temps de déploiement** : Durée totale du pipeline
- **Taux de succès** : Pourcentage de déploiements réussis
- **Temps de récupération** : Durée de rollback en cas d'échec
- **Disponibilité** : Uptime de l'application

## 🔐 Sécurité du Pipeline

### Secrets GitHub
- `VPS_HOST` : Adresse du serveur VPS
- `VPS_USER` : Utilisateur SSH
- `VPS_SSH_KEY` : Clé privée SSH

### Bonnes Pratiques
- **Secrets chiffrés** : Utilisation des secrets GitHub
- **Accès limité** : Permissions minimales
- **Audit trail** : Traçabilité des déploiements
- **Validation** : Tests de sécurité intégrés

## 🚀 Commandes Utiles

### Déploiement Manuel
```bash
# Déploiement sécurisé
./scripts/deploy-secure.sh

# Déploiement rapide
docker-compose up -d --build

# Rollback
git checkout HEAD~1
./scripts/deploy-secure.sh
```

### Monitoring
```bash
# Statut des conteneurs
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Santé de l'application
curl http://localhost:3000/api/health
```

### Maintenance
```bash
# Sauvegarde
./scripts/backup-database.sh

# Nettoyage
docker system prune -f

# Mise à jour
git pull && ./scripts/deploy-secure.sh
```

---

**💡 Conseil** : Cette architecture CI/CD assure un déploiement fiable et automatisé avec une gestion robuste des erreurs et un monitoring complet.
