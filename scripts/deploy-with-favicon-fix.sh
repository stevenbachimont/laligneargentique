#!/bin/bash

echo "🚀 Déploiement avec correction du favicon..."

# Construire l'application
echo "📦 Construction de l'application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la construction"
    exit 1
fi

# Copier les fichiers vers le VPS
echo "📤 Upload vers le VPS..."
rsync -avz --delete build/ user@votre-vps:/var/www/html/

# Forcer la mise à jour du favicon
echo "🔧 Mise à jour du favicon..."
ssh user@votre-vps "
    # Copier le favicon
    cp /var/www/html/static/favicon.png /var/www/html/favicon.png
    
    # Mettre à jour les permissions
    chmod 644 /var/www/html/favicon.png
    chown www-data:www-data /var/www/html/favicon.png
    
    # Redémarrer nginx pour forcer le rechargement
    systemctl reload nginx
    
    echo '✅ Favicon mis à jour sur le VPS'
"

# Vérifier que le favicon est accessible
echo "🔍 Vérification du favicon..."
curl -I https://votre-domaine.com/favicon.png

echo ""
echo "🎉 Déploiement terminé !"
echo "💡 Si le favicon ne s'affiche toujours pas :"
echo "   - Videz le cache de votre navigateur (Ctrl+F5)"
echo "   - Ouvrez en navigation privée"
echo "   - Attendez quelques minutes"
