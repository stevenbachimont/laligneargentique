#!/bin/bash

# Script pour vérifier que toutes les images de la flotte sont présentes
# Usage: ./scripts/check-flotte-images.sh

echo "🖼️ Vérification des images de la flotte d'appareils"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Vérification des images attendues..."

missing_count=0
present_count=0
real_images=0
placeholder_images=0

# Vérifier chaque image individuellement
check_image() {
    local image_path="$1"
    local app_name="$2"
    local full_path="static/flotte/$image_path"
    
    if [ -f "$full_path" ]; then
        # Vérifier si c'est une vraie image
        if file "$full_path" | grep -q "JPEG\|PNG\|JPG\|WebP\|Web/P"; then
            # Vérifier la taille pour détecter les placeholders
            size=$(stat -f%z "$full_path" 2>/dev/null || stat -c%s "$full_path" 2>/dev/null)
            if [ "$size" -gt 50000 ]; then  # Plus de 50KB = probablement une vraie image
                print_success "✅ $app_name ($image_path) - Image réelle"
                real_images=$((real_images + 1))
            else
                print_warning "🔄 $app_name ($image_path) - Image placeholder"
                placeholder_images=$((placeholder_images + 1))
            fi
            present_count=$((present_count + 1))
        else
            print_error "❌ $app_name ($image_path) - Fichier corrompu"
            missing_count=$((missing_count + 1))
        fi
    else
        print_error "❌ $app_name ($image_path) - Manquant"
        missing_count=$((missing_count + 1))
    fi
}

# Vérifier l'image par défaut
check_image "default-camera.png" "Image par défaut"

# Vérifier toutes les images
check_image "TLR/rolleiflex-2.8f.jpg" "Rolleiflex 2.8F"
check_image "TLR/rolleicord-v.jpg" "Rolleicord V"
check_image "TLR/lubitel-2.jpg" "Lubitel 2"
check_image "TLR/yashica-mat-124g.jpg" "Yashica Mat 124G"
check_image "SLR/canon-ae1.jpg" "Canon AE-1"
check_image "SLR/pentax-k1000.jpg" "Pentax K1000"
check_image "Folding/zeiss-super-ikonta.jpg" "Zeiss Super Ikonta"
check_image "Rangefinder/voigtlander-bessa-r2a.jpg" "Voigtländer Bessa R2A"
check_image "Point-Shoot/olympus-xa.jpg" "Olympus XA"

echo ""
print_status "Résumé de la vérification:"
print_status "  - Images présentes: $present_count/10"
print_status "  - Images réelles: $real_images"
print_status "  - Images placeholder: $placeholder_images"
print_status "  - Images manquantes: $missing_count"

echo ""
if [ $missing_count -eq 0 ]; then
    print_success "🎉 Toutes les images sont présentes !"
    if [ $real_images -gt 0 ]; then
        print_status "Vous avez $real_images vraie(s) image(s) et $placeholder_images placeholder(s)."
    fi
else
    print_warning "⚠️  $missing_count image(s) manquante(s)."
    print_status "Les appareils sans image afficheront automatiquement l'image par défaut."
fi

echo ""
print_status "Pour voir la flotte en action:"
print_status "  npm run dev"
print_status "  Puis visitez: http://localhost:3000/photographie/argentique/flotte"
