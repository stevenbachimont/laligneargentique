#!/bin/bash

# Script pour arrêter le serveur de documentation Docsify

echo "🛑 Arrêt du serveur de documentation..."

# Trouver et arrêter les processus docsify
PIDS=$(pgrep -f "docsify serve")

if [ -z "$PIDS" ]; then
    echo "ℹ️  Aucun serveur de documentation en cours d'exécution."
else
    echo "🔄 Arrêt des processus docsify..."
    pkill -f "docsify serve"
    sleep 2
    
    # Vérifier que les processus sont arrêtés
    REMAINING=$(pgrep -f "docsify serve")
    if [ -z "$REMAINING" ]; then
        echo "✅ Serveur de documentation arrêté avec succès."
    else
        echo "⚠️  Certains processus pourraient encore être en cours d'exécution."
        echo "💡 Utilisez 'pkill -9 -f \"docsify serve\"' pour forcer l'arrêt."
    fi
fi

echo ""
echo "🌐 Pour redémarrer le serveur, utilisez :"
echo "   ./scripts/start-docs.sh"
