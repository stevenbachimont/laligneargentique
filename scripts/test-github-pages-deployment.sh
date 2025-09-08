#!/bin/bash

echo "🔍 Test du déploiement GitHub Pages pour la documentation"
echo "=================================================="

# Vérifier la structure des fichiers
echo "📁 Structure des fichiers docs/:"
find docs/ -type f -name "*.md" -o -name "*.html" | sort

echo ""
echo "📄 Contenu du README.md principal:"
if [ -f "docs/README.md" ]; then
    echo "✅ docs/README.md existe"
    head -5 docs/README.md
else
    echo "❌ docs/README.md n'existe pas"
fi

echo ""
echo "📄 Contenu du _404.md:"
if [ -f "docs/_404.md" ]; then
    echo "✅ docs/_404.md existe"
    head -3 docs/_404.md
else
    echo "❌ docs/_404.md n'existe pas"
fi

echo ""
echo "🌐 Test des URLs GitHub Pages:"
echo "URL principale: https://stevenbachimont.github.io/monsite/"
echo "URL documentation: https://stevenbachimont.github.io/monsite/docs/"
echo "URL avec hash: https://stevenbachimont.github.io/monsite/docs/#/"

echo ""
echo "🔧 Configuration Docsify dans index.html:"
grep -A 5 -B 5 "basePath" docs/index.html

echo ""
echo "📋 Vérification des liens dans la sidebar:"
grep -o 'href="#/[^"]*"' docs/index.html | head -10

echo ""
echo "✅ Test terminé"
