#!/bin/bash

echo "🔧 Correction du cache du favicon..."

# Vérifier si nginx est installé
if command -v nginx &> /dev/null; then
    echo "📋 Configuration nginx détectée"
    
    # Créer une configuration pour le favicon
    cat > /etc/nginx/sites-available/favicon-cache << 'EOF'
# Configuration pour forcer la mise à jour du favicon
location ~* \.(ico|png|gif|jpeg|jpg)$ {
    expires 1d;
    add_header Cache-Control "public, no-transform";
    add_header Vary "Accept-Encoding";
}

# Configuration spécifique pour favicon.png
location = /favicon.png {
    expires 1h;
    add_header Cache-Control "public, max-age=3600, must-revalidate";
    add_header Vary "Accept-Encoding";
}
EOF

    # Activer la configuration
    ln -sf /etc/nginx/sites-available/favicon-cache /etc/nginx/sites-enabled/
    
    # Tester la configuration nginx
    nginx -t
    
    if [ $? -eq 0 ]; then
        echo "✅ Configuration nginx valide"
        systemctl reload nginx
        echo "🔄 Nginx rechargé"
    else
        echo "❌ Erreur dans la configuration nginx"
        exit 1
    fi
else
    echo "⚠️  Nginx non détecté, configuration manuelle nécessaire"
fi

# Vérifier si le fichier favicon existe
if [ -f "/var/www/html/static/favicon.png" ]; then
    echo "✅ Favicon trouvé dans /var/www/html/static/favicon.png"
    
    # Vérifier les permissions
    chmod 644 /var/www/html/static/favicon.png
    chown www-data:www-data /var/www/html/static/favicon.png
    
    echo "🔧 Permissions mises à jour"
else
    echo "❌ Favicon non trouvé dans /var/www/html/static/"
    echo "📁 Contenu du dossier static :"
    ls -la /var/www/html/static/ | grep -E "(favicon|\.png|\.ico)"
fi

echo ""
echo "🚀 Solutions pour forcer la mise à jour du favicon :"
echo "1. Vider le cache du navigateur (Ctrl+F5 ou Cmd+Shift+R)"
echo "2. Ouvrir en navigation privée"
echo "3. Utiliser un autre navigateur"
echo "4. Attendre 1 heure (nouveau cache max-age=3600)"
echo ""
echo "🔍 Pour vérifier :"
echo "curl -I https://votre-domaine.com/favicon.png"
