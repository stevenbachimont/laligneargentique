#!/bin/bash

echo "🧪 Test du build local..."

# Nettoyer les images précédentes
docker rmi monsite-test 2>/dev/null || true

# Build avec logs détaillés
echo "📦 Construction de l'image..."
docker build -t monsite-test . --progress=plain --no-cache

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
    echo "🧪 Test du démarrage..."
    docker run --rm -p 3000:3000 monsite-test &
    sleep 5
    curl -f http://localhost:3000 || echo "❌ L'application ne répond pas"
    docker stop $(docker ps -q --filter ancestor=monsite-test) 2>/dev/null || true
else
    echo "❌ Build échoué"
    exit 1
fi 