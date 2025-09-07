#!/bin/bash

# Script pour démarrer le serveur de documentation Docsify
# Usage: ./scripts/start-docs.sh [port]

PORT=${1:-3001}

echo "🚀 Démarrage du serveur de documentation..."
echo "📚 Port: $PORT"
echo "🌐 URL: http://localhost:$PORT"
echo ""

# Vérifier si le port est déjà utilisé
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Le port $PORT est déjà utilisé."
    echo "🔄 Arrêt du processus existant..."
    pkill -f "docsify serve"
    sleep 2
fi

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "docs/index.html" ]; then
    echo "❌ Erreur: Le fichier docs/index.html n'existe pas."
    echo "💡 Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

echo "✅ Configuration vérifiée"
echo "🌐 Ouverture de http://localhost:$PORT dans votre navigateur..."
echo ""
echo "Pour arrêter le serveur, utilisez Ctrl+C"
echo ""

# Ouvrir le navigateur (optionnel)
if command -v open &> /dev/null; then
    open "http://localhost:$PORT" &
fi

cd docs
docsify serve . --port $PORT
