#!/bin/bash

# Script de diagnostic de la configuration admin
# Usage: ./scripts/check-admin-config.sh

echo "🔍 Diagnostic de la configuration admin"
echo "======================================"

# Vérifier si le conteneur est en cours d'exécution
if ! docker ps | grep -q "laligneargentique"; then
    echo "❌ Le conteneur laligneargentique n'est pas en cours d'exécution"
    echo "💡 Démarrez le conteneur avec: docker-compose up -d"
    exit 1
fi

echo "✅ Conteneur en cours d'exécution"

# Vérifier la variable ADMIN_ACCESS_CODE
echo ""
echo "🔑 Vérification du code d'accès admin..."
ADMIN_CODE=$(docker exec laligneargentique env | grep ADMIN_ACCESS_CODE | cut -d'=' -f2)

if [ -z "$ADMIN_CODE" ]; then
    echo "❌ Variable ADMIN_ACCESS_CODE non définie"
    echo "💡 Ajoutez ADMIN_ACCESS_CODE=argentique2024 dans votre fichier .env"
else
    echo "✅ Code d'accès configuré: $ADMIN_CODE"
fi

# Vérifier que l'API admin répond
echo ""
echo "🌐 Test de l'API admin..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/admin/balades)

if [ "$API_RESPONSE" = "401" ]; then
    echo "✅ API admin protégée (401 Unauthorized) - Normal sans authentification"
elif [ "$API_RESPONSE" = "200" ]; then
    echo "⚠️  API admin accessible sans authentification - Problème de sécurité!"
else
    echo "❌ API admin ne répond pas (Code: $API_RESPONSE)"
fi

# Vérifier la page d'administration
echo ""
echo "📄 Test de la page d'administration..."
ADMIN_PAGE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin)

if [ "$ADMIN_PAGE" = "200" ]; then
    echo "✅ Page d'administration accessible"
else
    echo "❌ Page d'administration non accessible (Code: $ADMIN_PAGE)"
fi

# Vérifier la base de données
echo ""
echo "🗄️ Vérification de la base de données..."
if docker exec laligneargentique ls -la /app/data/balades.db >/dev/null 2>&1; then
    echo "✅ Base de données accessible"
    
    # Compter les balades
    BALADE_COUNT=$(docker exec laligneargentique sqlite3 /app/data/balades.db "SELECT COUNT(*) FROM balades;" 2>/dev/null || echo "0")
    echo "📊 Nombre de balades: $BALADE_COUNT"
    
    # Compter les réservations
    RESERVATION_COUNT=$(docker exec laligneargentique sqlite3 /app/data/balades.db "SELECT COUNT(*) FROM reservations;" 2>/dev/null || echo "0")
    echo "📊 Nombre de réservations: $RESERVATION_COUNT"
else
    echo "❌ Base de données non accessible"
fi

echo ""
echo "📚 Instructions:"
echo "1. Allez sur: http://localhost:3000/admin"
echo "2. Entrez le code: $ADMIN_CODE"
echo "3. Cliquez sur 'Se connecter'"
echo ""
echo "🔧 Si le code ne fonctionne pas:"
echo "1. Vérifiez votre fichier .env"
echo "2. Redémarrez: docker-compose down && docker-compose up -d"
echo "3. Relancez ce script: ./scripts/check-admin-config.sh"
