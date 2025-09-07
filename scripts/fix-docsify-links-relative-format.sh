#!/bin/bash

# Script pour corriger les liens Markdown dans la documentation Docsify (Format Relatif)
# Usage: ./scripts/fix-docsify-links-relative-format.sh

set -e

echo "🔧 Correction des liens Docsify dans la documentation (Format Relatif)..."

# Fonction pour corriger les liens dans un fichier
fix_links_in_file() {
    local file="$1"
    local section_dir="$2"
    
    if [ -f "$file" ]; then
        echo "📝 Correction des liens dans: $file"
        
        # Remplacer les liens Docsify par des liens relatifs
        sed -i '' "s|#/$section_dir/\([^)]*\)|$section_dir/\1.md|g" "$file"
        
        echo "✅ Liens corrigés dans: $file"
    fi
}

# Corriger les liens dans chaque section
echo "📁 Correction des liens par section..."

# Section 01 - Administration
fix_links_in_file "docs/01-administration/README.md" "01-administration"

# Section 02 - Paiements Stripe
fix_links_in_file "docs/02-paiements-stripe/README.md" "02-paiements-stripe"

# Section 03 - Sécurité API
fix_links_in_file "docs/03-securite-api/README.md" "03-securite-api"

# Section 04 - Système Balades
fix_links_in_file "docs/04-systeme-balades/README.md" "04-systeme-balades"

# Section 05 - Emails Communication
fix_links_in_file "docs/05-emails-communication/README.md" "05-emails-communication"

# Section 06 - Captcha Sécurité
fix_links_in_file "docs/06-captcha-securite/README.md" "06-captcha-securite"

# Section 07 - Déploiement Configuration
fix_links_in_file "docs/07-deploiement-configuration/README.md" "07-deploiement-configuration"

# Section 08 - Tests Qualité
fix_links_in_file "docs/08-tests-qualite/README.md" "08-tests-qualite"

# Section 09 - Corrections Améliorations
fix_links_in_file "docs/09-corrections-ameliorations/README.md" "09-corrections-ameliorations"

# Section 10 - Guides Utilisateur
fix_links_in_file "docs/10-guides-utilisateur/README.md" "10-guides-utilisateur"

# Section 11 - Architecture Technique
fix_links_in_file "docs/11-architecture-technique/README.md" "11-architecture-technique"

echo ""
echo "✅ Correction des liens terminée !"
echo ""
echo "📋 Résumé des corrections :"
echo "   - Liens Docsify (#/section/FICHIER) → Liens relatifs (section/FICHIER.md)"
echo "   - Format identique au lien qui fonctionne"
echo "   - Tous les README mis à jour"
echo ""
echo "🚀 Redémarrez le serveur de documentation pour voir les changements :"
echo "   ./scripts/start-docs.sh"
