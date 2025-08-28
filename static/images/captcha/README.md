# Images pour le Captcha de Netteté

Ce dossier contient les images utilisées pour le captcha d'ajustement de netteté.

## Images requises

Pour que le captcha fonctionne correctement, vous devez ajouter les images suivantes :

### Images de base (nettes)
- `IMG_8176.png` - Photo de test (actuellement utilisée)

## Spécifications techniques

- **Format** : PNG, JPG, JPEG
- **Taille recommandée** : 400x300 pixels minimum
- **Poids** : Moins de 200KB par image
- **Qualité** : Images nettes de bonne qualité

## Fonctionnement

Le captcha applique un effet de flou CSS à ces images. L'utilisateur doit ajuster un curseur pour retrouver la netteté optimale.

## Ajout d'images

1. Placez vos images dans ce dossier
2. Assurez-vous qu'elles correspondent aux noms attendus par le service
3. Vérifiez que les images sont accessibles via `/images/captcha/`

## Exemple d'utilisation

```javascript
// Le service charge automatiquement une image aléatoire
const challenge = captchaService.generateCaptcha();
// challenge.imageUrl sera "/images/captcha/IMG_8176.png" par exemple
```

## Images temporaires

En attendant vos vraies images, vous pouvez utiliser des images de placeholder ou des photos libres de droits depuis Unsplash, Pexels, ou Pixabay.

## Ajout de nouvelles images

Pour ajouter plus d'images au captcha, modifiez le fichier `src/lib/server/captchaService.ts` et ajoutez vos images dans le tableau `photoImages` :

```typescript
private photoImages = [
  {
    imageUrl: "/images/captcha/IMG_8176.png",
    targetSharpness: 75,
    description: "Photo de test"
  },
  {
    imageUrl: "/images/captcha/votre-nouvelle-image.jpg",
    targetSharpness: 80,
    description: "Description de votre image"
  }
];
```
