#!/bin/bash

# Script de restauration de la base de données
# Usage: ./scripts/restore-database.sh [fichier_backup]

set -e

# Configuration
BACKUP_DIR="./backups"

# Vérifier les arguments
if [ $# -eq 0 ]; then
    echo "❌ Usage: $0 <fichier_backup>"
    echo "📋 Sauvegardes disponibles:"
    ls -la "$BACKUP_DIR"/balades_backup_*.db 2>/dev/null || echo "   Aucune sauvegarde trouvée"
    exit 1
fi

BACKUP_FILE="$1"

# Vérifier que le fichier de sauvegarde existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Fichier de sauvegarde non trouvé: $BACKUP_FILE"
    echo "📋 Sauvegardes disponibles:"
    ls -la "$BACKUP_DIR"/balades_backup_*.db 2>/dev/null || echo "   Aucune sauvegarde trouvée"
    exit 1
fi

echo "🔄 Début de la restauration de la base de données..."
echo "📁 Fichier de sauvegarde: $BACKUP_FILE"

# Vérifier si le conteneur est en cours d'exécution
if ! docker ps | grep -q "monsites"; then
    echo "❌ Le conteneur monsites n'est pas en cours d'exécution"
    echo "💡 Démarrez d'abord le conteneur avec: docker-compose up -d"
    exit 1
fi

# Demander confirmation
echo "⚠️  ATTENTION: Cette opération va remplacer la base de données actuelle!"
echo "📊 Taille du fichier de sauvegarde: $(du -h "$BACKUP_FILE" | cut -f1)"
read -p "Êtes-vous sûr de vouloir continuer? (oui/non): " confirm

if [ "$confirm" != "oui" ]; then
    echo "❌ Restauration annulée"
    exit 0
fi

# Arrêter temporairement le conteneur pour éviter les conflits
echo "⏸️  Arrêt temporaire du conteneur..."
docker-compose stop app

# Copier la base de données vers le conteneur
echo "📋 Restauration de la base de données..."
docker cp "$BACKUP_FILE" monsites:/app/data/balades.db

if [ $? -eq 0 ]; then
    echo "✅ Restauration réussie!"
    
    # Redémarrer le conteneur
    echo "🔄 Redémarrage du conteneur..."
    docker-compose up -d app
    
    echo "🎉 Restauration terminée avec succès!"
    echo "🌐 Votre site est maintenant accessible avec les données restaurées"
else
    echo "❌ Erreur lors de la restauration"
    echo "🔄 Redémarrage du conteneur..."
    docker-compose up -d app
    exit 1
fi
