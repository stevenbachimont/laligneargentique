#!/bin/bash

# Script de test pour la flotte d'appareils
# Usage: ./scripts/test-flotte.sh [--watch] [--coverage]

echo "🧪 Tests de la flotte d'appareils"
echo "================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si vitest est installé
if ! command -v npx &> /dev/null; then
    print_error "npx n'est pas installé. Veuillez installer Node.js et npm."
    exit 1
fi

# Vérifier si les fichiers de test existent
TEST_FILES=(
    "tests/services/appareilsData.test.ts"
    "tests/api/appareils.test.ts"
    "src/routes/photographie/argentique/flotte/page.svelte.test.ts"
    "tests/integration/flotte-api-integration.test.ts"
)

print_status "Vérification des fichiers de test..."
for file in "${TEST_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Fichier de test manquant: $file"
        exit 1
    fi
done
print_success "Tous les fichiers de test sont présents"

# Construire la commande vitest
VITEST_CMD="npx vitest run"

# Ajouter les options selon les arguments
if [[ "$1" == "--watch" ]]; then
    VITEST_CMD="npx vitest"
    print_status "Mode watch activé"
fi

if [[ "$1" == "--coverage" || "$2" == "--coverage" ]]; then
    VITEST_CMD="$VITEST_CMD --coverage"
    print_status "Couverture de code activée"
fi

# Ajouter les patterns de test spécifiques à la flotte
VITEST_CMD="$VITEST_CMD --reporter=verbose"

# Exécuter les tests
print_status "Exécution des tests de la flotte d'appareils..."
echo ""

# Test des données
print_status "📊 Test des données d'appareils..."
npx vitest run tests/services/appareilsData.test.ts --reporter=verbose

if [ $? -eq 0 ]; then
    print_success "Tests des données: OK"
else
    print_error "Tests des données: ÉCHEC"
    exit 1
fi

echo ""

# Test de l'API
print_status "🔌 Test de l'API des appareils..."
npx vitest run tests/api/appareils.test.ts --reporter=verbose

if [ $? -eq 0 ]; then
    print_success "Tests de l'API: OK"
else
    print_error "Tests de l'API: ÉCHEC"
    exit 1
fi

echo ""

# Test de la page
print_status "🖥️ Test de la page flotte..."
npx vitest run src/routes/photographie/argentique/flotte/page.svelte.test.ts --reporter=verbose

if [ $? -eq 0 ]; then
    print_success "Tests de la page: OK"
else
    print_error "Tests de la page: ÉCHEC"
    exit 1
fi

echo ""


# Test d'intégration API
print_status "🔗 Test d'intégration API..."
npx vitest run tests/integration/flotte-api-integration.test.ts --reporter=verbose

if [ $? -eq 0 ]; then
    print_success "Tests d'intégration API: OK"
else
    print_error "Tests d'intégration API: ÉCHEC"
    exit 1
fi

echo ""
print_success "🎉 Tous les tests de la flotte d'appareils sont passés avec succès!"
print_status "Résumé:"
print_status "  - Tests des données: ✅"
print_status "  - Tests de l'API: ✅"
print_status "  - Tests de la page: ✅"
print_status "  - Tests d'intégration API: ✅"

echo ""
print_status "Pour exécuter tous les tests en mode watch:"
print_status "  ./scripts/test-flotte.sh --watch"
print_status ""
print_status "Pour exécuter avec couverture de code:"
print_status "  ./scripts/test-flotte.sh --coverage"
