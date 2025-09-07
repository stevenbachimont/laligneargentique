#!/bin/bash

# Script pour tester le déploiement GitHub Pages
# Usage: ./scripts/test-github-pages.sh

set -e

echo "🧪 Test du déploiement GitHub Pages..."

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "docs/index.html" ]; then
    echo "❌ Erreur: docs/index.html non trouvé"
    exit 1
fi

# Vérifier que .nojekyll existe
if [ ! -f "docs/.nojekyll" ]; then
    echo "❌ Erreur: docs/.nojekyll non trouvé"
    exit 1
fi

# Vérifier que _404.md existe
if [ ! -f "docs/_404.md" ]; then
    echo "❌ Erreur: docs/_404.md non trouvé"
    exit 1
fi

# Vérifier que README.md existe
if [ ! -f "docs/README.md" ]; then
    echo "❌ Erreur: docs/README.md non trouvé"
    exit 1
fi

echo "✅ Tous les fichiers requis sont présents"

# Vérifier la configuration Docsify
echo "🔧 Vérification de la configuration Docsify..."

# Vérifier que le repo est configuré
if ! grep -q "repo: 'https://github.com/stevenbachimont/monsite'" docs/index.html; then
    echo "❌ Erreur: Configuration du repo manquante"
    exit 1
fi

# Vérifier que basePath est configuré conditionnellement
if ! grep -q "basePath = '/docs'" docs/index.html; then
    echo "❌ Erreur: Configuration basePath manquante"
    exit 1
fi

echo "✅ Configuration Docsify correcte"

# Vérifier la structure des dossiers
echo "📁 Vérification de la structure des dossiers..."

expected_dirs=(
    "01-administration"
    "02-paiements-stripe"
    "03-securite-api"
    "04-systeme-balades"
    "05-emails-communication"
    "06-captcha-securite"
    "07-deploiement-configuration"
    "08-tests-qualite"
    "09-corrections-ameliorations"
    "10-guides-utilisateur"
    "11-architecture-technique"
)

for dir in "${expected_dirs[@]}"; do
    if [ ! -d "docs/$dir" ]; then
        echo "❌ Erreur: Dossier docs/$dir manquant"
        exit 1
    fi
    
    if [ ! -f "docs/$dir/README.md" ]; then
        echo "❌ Erreur: docs/$dir/README.md manquant"
        exit 1
    fi
done

echo "✅ Structure des dossiers correcte"

# Vérifier les liens dans les README
echo "🔗 Vérification des liens dans les README..."

# Vérifier qu'il n'y a pas de liens relatifs problématiques
if grep -r "\.\/.*\.md" docs/*/README.md | grep -v "11-architecture-technique" | head -5; then
    echo "⚠️  Avertissement: Liens relatifs détectés (peuvent causer des 404 sur GitHub Pages)"
fi

echo "✅ Vérification des liens terminée"

# Résumé
echo ""
echo "🎉 Test de déploiement GitHub Pages terminé !"
echo ""
echo "📋 Résumé :"
echo "   ✅ Fichiers requis présents"
echo "   ✅ Configuration Docsify correcte"
echo "   ✅ Structure des dossiers valide"
echo "   ✅ Liens vérifiés"
echo ""
echo "🚀 Prochaines étapes :"
echo "   1. Commiter les changements : git add . && git commit -m 'Fix GitHub Pages deployment'"
echo "   2. Pousser vers GitHub : git push origin steven2"
echo "   3. Vérifier le déploiement sur GitHub Actions"
echo "   4. Accéder à la documentation sur : https://stevenbachimont.github.io/monsite/docs/"
echo ""
echo "💡 Si vous obtenez toujours un 404 :"
echo "   - Vérifiez que GitHub Pages est activé dans les paramètres du repo"
echo "   - Vérifiez que la source est configurée sur 'GitHub Actions'"
echo "   - Attendez quelques minutes pour que le déploiement se termine"
