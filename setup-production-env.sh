#!/bin/bash

echo "🔧 Configuration de l'environnement de production"
echo "================================================"

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp env.production.example .env
    echo "✅ Fichier .env créé à partir de env.production.example"
else
    echo "✅ Fichier .env existe déjà"
fi

echo ""
echo "⚠️  ATTENTION: Variables Stripe obligatoires"
echo "============================================="
echo "Pour que les paiements fonctionnent, vous DEVEZ configurer:"
echo ""
echo "1. STRIPE_SECRET_KEY=sk_live_..."
echo "2. STRIPE_PUBLISHABLE_KEY=pk_live_..."
echo "3. STRIPE_WEBHOOK_SECRET=whsec_..."
echo "4. PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_..."
echo ""
echo "🔗 Obtenez ces clés sur: https://dashboard.stripe.com/apikeys"
echo "🔗 Configurez le webhook sur: https://dashboard.stripe.com/webhooks"
echo ""
echo "📝 Éditez le fichier .env et remplacez les valeurs par défaut"
echo ""

# Vérifier les variables Stripe
echo "🔍 Vérification des variables Stripe..."
if grep -q "sk_live_" .env; then
    echo "✅ STRIPE_SECRET_KEY configurée"
else
    echo "❌ STRIPE_SECRET_KEY non configurée (utilise la valeur par défaut)"
fi

if grep -q "pk_live_" .env; then
    echo "✅ STRIPE_PUBLISHABLE_KEY configurée"
else
    echo "❌ STRIPE_PUBLISHABLE_KEY non configurée (utilise la valeur par défaut)"
fi

if grep -q "whsec_" .env; then
    echo "✅ STRIPE_WEBHOOK_SECRET configurée"
else
    echo "❌ STRIPE_WEBHOOK_SECRET non configurée (utilise la valeur par défaut)"
fi

if grep -q "PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_" .env; then
    echo "✅ PUBLIC_STRIPE_PUBLISHABLE_KEY configurée"
else
    echo "❌ PUBLIC_STRIPE_PUBLISHABLE_KEY non configurée (utilise la valeur par défaut)"
fi

echo ""
echo "🚀 Pour déployer:"
echo "1. Configurez les variables Stripe dans .env"
echo "2. Lancez: docker-compose up -d --build"
echo ""
