#!/bin/bash

# Script de sauvegarde de la base de données
# Usage: ./scripts/backup-database.sh

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="balades_backup_${DATE}.db"

# Créer le dossier de sauvegarde s'il n'existe pas
mkdir -p "$BACKUP_DIR"

echo "🔄 Début de la sauvegarde de la base de données..."

# Vérifier si le conteneur est en cours d'exécution
if ! docker ps | grep -q "monsites"; then
    echo "❌ Le conteneur monsites n'est pas en cours d'exécution"
    echo "💡 Démarrez d'abord le conteneur avec: docker-compose up -d"
    exit 1
fi

# Copier la base de données depuis le conteneur
echo "📋 Copie de la base de données depuis le conteneur..."
docker cp monsites:/app/data/balades.db "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Sauvegarde réussie: $BACKUP_DIR/$BACKUP_FILE"
    
    # Afficher la taille du fichier
    FILE_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "📊 Taille du fichier: $FILE_SIZE"
    
    # Garder seulement les 10 dernières sauvegardes
    echo "🧹 Nettoyage des anciennes sauvegardes..."
    cd "$BACKUP_DIR"
    ls -t balades_backup_*.db | tail -n +11 | xargs -r rm
    cd ..
    
    echo "🎉 Sauvegarde terminée avec succès!"
else
    echo "❌ Erreur lors de la sauvegarde"
    exit 1
fi
