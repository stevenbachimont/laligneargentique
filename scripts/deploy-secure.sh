#!/bin/bash

# Script de déploiement sécurisé avec sauvegarde automatique
# Usage: ./scripts/deploy-secure.sh

set -e

echo "🚀 Déploiement sécurisé de laligneargentique"
echo "=================================="

# Vérifier si Docker est en cours d'exécution
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution"
    exit 1
fi

# Étape 1: Sauvegarde automatique
echo ""
echo "📋 Étape 1: Sauvegarde automatique de la base de données"
echo "--------------------------------------------------------"
if docker ps | grep -q "laligneargentique"; then
    echo "🔄 Sauvegarde en cours..."
    ./scripts/backup-database.sh
    if [ $? -eq 0 ]; then
        echo "✅ Sauvegarde réussie"
    else
        echo "⚠️  Sauvegarde échouée, mais continuation du déploiement"
    fi
else
    echo "ℹ️  Aucun conteneur en cours d'exécution, pas de sauvegarde nécessaire"
fi

# Étape 2: Construction de l'image
echo ""
echo "🔨 Étape 2: Construction de la nouvelle image"
echo "---------------------------------------------"
echo "🔄 Construction en cours..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo "✅ Construction réussie"
else
    echo "❌ Erreur lors de la construction"
    exit 1
fi

# Étape 3: Redémarrage avec les volumes persistants
echo ""
echo "🔄 Étape 3: Redémarrage avec persistance des données"
echo "----------------------------------------------------"
echo "🔄 Arrêt des conteneurs existants..."
docker-compose down

echo "🔄 Démarrage des nouveaux conteneurs avec volumes persistants..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi

# Étape 4: Vérification
echo ""
echo "🔍 Étape 4: Vérification du déploiement"
echo "---------------------------------------"
echo "⏳ Attente du démarrage du conteneur..."
sleep 10

if docker ps | grep -q "laligneargentique"; then
    echo "✅ Conteneur en cours d'exécution"
    
    # Vérifier que la base de données est accessible
    echo "🔍 Vérification de la base de données..."
    if docker exec laligneargentique ls -la /app/data/balades.db >/dev/null 2>&1; then
        echo "✅ Base de données accessible"
    else
        echo "⚠️  Base de données non trouvée (normal si première installation)"
    fi
    
    echo ""
    echo "🎉 Déploiement terminé avec succès!"
    echo "🌐 Votre site est accessible sur: http://localhost:3000"
    echo "📊 Données persistantes dans le volume Docker: laligneargentique_data"
    
else
    echo "❌ Le conteneur n'est pas en cours d'exécution"
    echo "📋 Logs du conteneur:"
    docker-compose logs app
    exit 1
fi

echo ""
echo "📚 Commandes utiles:"
echo "  - Voir les logs: docker-compose logs -f app"
echo " - Sauvegarder: ./scripts/backup-database.sh"
echo " - Restaurer: ./scripts/restore-database.sh <fichier>"
echo " - Arrêter: docker-compose down"
echo " - Redémarrer: docker-compose up -d"
