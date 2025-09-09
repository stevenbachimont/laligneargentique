# Flotte d'Appareils Photos - Images

Ce dossier contient toutes les images des appareils photos argentiques de la flotte, organisées par catégories.

## Structure des Dossiers

```
static/flotte/
├── default-camera.png      # Image par défaut avec motif d'appareils vintage
├── TLR/                    # Twin Lens Reflex
│   ├── rolleiflex-2.8f.jpg
│   ├── rolleicord-v.jpg    ✅ (image réelle disponible)
│   ├── lubitel-2.jpg       ✅ (image réelle disponible)
│   └── yashica-mat-124g.jpg
├── SLR/                    # Single Lens Reflex
│   ├── canon-ae1.jpg
│   └── pentax-k1000.jpg
├── Folding/                # Appareils pliables
│   └── zeiss-super-ikonta.jpg
├── Rangefinder/            # Télémètres
│   └── voigtlander-bessa-r2a.jpg
└── Point-Shoot/            # Compacts
    └── olympus-xa.jpg
```

## Images Disponibles

### ✅ Images Réelles
- **Rolleicord V** (`TLR/rolleicord-v.jpg`) - Image haute qualité disponible
- **Lubitel 2** (`TLR/lubitel-2.jpg`) - Image haute qualité disponible (WebP)

### 🔄 Images Manquantes
Les autres appareils n'ont pas encore d'images. Vous pouvez ajouter les vraies photos des appareils au fur et à mesure.

## Ajout de Nouvelles Images

### 1. Préparer l'image
- **Format recommandé** : JPG ou PNG
- **Résolution** : Minimum 400x400px (format carré recommandé), idéalement 800x800px
- **Qualité** : Haute résolution pour un affichage optimal
- **Nommage** : Utiliser des noms en minuscules avec des tirets (ex: `canon-ae1.jpg`)
- **Format d'affichage** : Toutes les images sont automatiquement recadrées au format carré (350x350px sur desktop)

### 2. Placer l'image
```bash
# Exemple pour ajouter une image du Canon AE-1
cp /chemin/vers/canon-ae1.jpg static/flotte/SLR/canon-ae1.jpg
```

### 3. Vérifier l'affichage
L'image sera automatiquement visible sur la page `/photographie/argentique/flotte` dans le carrousel correspondant.

## Gestion des Images Manquantes

Pour les appareils sans image, la page affichera automatiquement l'image par défaut (`default-camera.png`) qui contient un beau motif d'appareils photos vintage. Vous pouvez ajouter les vraies photos au fur et à mesure en les plaçant dans les dossiers correspondants.

## Appareils de la Flotte

### TLR (Twin Lens Reflex)
- **Rolleiflex 2.8F** (1960) - 45€/balade
- **Rolleicord V** (1955) - 40€/balade ✅
- **Lubitel 2** (1955) - 25€/balade ✅
- **Yashica Mat 124G** (1970) - 35€/balade

### SLR (Single Lens Reflex)
- **Canon AE-1** (1976) - 40€/balade
- **Pentax K1000** (1976) - 35€/balade

### Folding
- **Zeiss Ikon Super Ikonta** (1938) - 50€/balade

### Rangefinder
- **Voigtländer Bessa R2A** (2004) - 45€/balade

### Point & Shoot
- **Olympus XA** (1979) - 30€/balade

## Notes Techniques

- Les images sont servies statiquement via SvelteKit
- Les chemins d'images sont définis dans `src/lib/data/appareilsData.ts`
- Le format d'URL est `/flotte/CATEGORIE/nom-appareil.jpg`
- Les images sont optimisées pour le web (compression JPG recommandée)

### Règles CSS pour l'affichage

Toutes les images d'appareils sont automatiquement formatées en carré pour une apparence uniforme :

- **Desktop** : 350x350px
- **Tablet** : 250x250px  
- **Mobile** : 200x200px

La propriété `object-fit: cover` recadre automatiquement les images pour remplir le carré, en gardant les proportions et en centrant l'image.

## Maintenance

- Vérifier régulièrement que toutes les images se chargent correctement
- Mettre à jour les données dans `appareilsData.ts` si de nouveaux appareils sont ajoutés
- Tester la page de la flotte après chaque ajout d'image
