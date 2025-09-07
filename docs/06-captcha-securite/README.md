# 📸 Captcha & Sécurité

## 📋 Vue d'ensemble

Cette section contient toute la documentation relative au système de captcha photo et aux mesures de sécurité associées.

## 📚 Documentation Disponible

### 🎮 Captcha Photo Game
- **[CAPTCHA_PHOTO_GAME.md](./CAPTCHA_PHOTO_GAME.md)** - Documentation complète du captcha photo
  - Concept du captcha en deux étapes
  - Ajustement de l'exposition
  - Ajustement de la netteté
  - Interface interactive

### 🖼️ Images Captcha
- **[README_CAPTCHA_IMAGES.md](./README_CAPTCHA_IMAGES.md)** - Documentation des images utilisées
  - Gestion des images
  - Optimisation
  - Formats supportés

## 🎯 Fonctionnalités Principales

### ✅ Captcha en Deux Étapes
1. **Ajustement de l'Exposition** 📷
   - Vitesse d'obturation : 1s à 1/1000
   - Diaphragme : f2.4 à f22
   - Effet en temps réel
   - Validation de l'exposition

2. **Ajustement de la Netteté** 🎯
   - Viseur photo stylisé
   - Netteté en temps réel
   - Validation automatique à 95%
   - Curseur bloqué après validation

### ✅ Interface Interactive
- **Deux étapes distinctes** : Exposition puis netteté
- **Feedback visuel** : L'image change en temps réel
- **Validation progressive** : Chaque étape doit être réussie
- **Design photo-réaliste** : Interface d'appareil photo

## 🔧 Fonctionnement Technique

### Calcul de l'Exposition
```typescript
// Formule simplifiée : EV = log2(aperture² / shutter)
function calculateExposureValue(shutter: number, aperture: number): number {
  return Math.log2((aperture * aperture) / shutter);
}
```

### Système d'Exposition
- **Vitesses** : 1s, 1/2, 1/4, 1/8, 1/15, 1/30, 1/60, 1/125, 1/250, 1/500, 1/1000
- **Diaphragmes** : f2.4, f2.8, f4, f5.6, f8, f11, f16, f22
- **Calcul EV** : Valeur d'exposition basée sur la formule photo
- **Tolérance** : ±0.5 stops pour la validation

### Système de Netteté
- **Format carré** : Image recadrée en 1:1 avec `aspect-ratio`
- **Distance maximale** : 50% (optimisé pour le carré)
- **Tolérance** : 20% (plus précise pour le format carré)
- **Centrage** : L'image reste centrée horizontalement
- **Recadrage** : Suppression automatique du haut et du bas

## 🎨 Interface Utilisateur

### Étape 1 : Exposition
- **Aperçu en temps réel** : L'image change selon les réglages
- **Feedback visuel** : Indicateurs de qualité d'exposition
- **Contrôles intuitifs** : Menus déroulants pour vitesse et diaphragme
- **Validation conditionnelle** : Bouton activé uniquement si l'exposition est correcte

### Étape 2 : Netteté
- **Viseur photo stylisé** : Curseur noir avec croix et cercle
- **Bordure colorée** : Rouge → Orange → Jaune → Vert selon la netteté
- **Validation automatique** : À 95% de netteté
- **Curseur bloqué** : Plus de mouvement après validation

## 🔒 Sécurité et Validation

### Double Validation
1. **Exposition** : Doit être dans ±0.5 stops de la cible
2. **Netteté** : Doit atteindre 95% de netteté

### Protection Anti-Bot
- **Deux étapes** : Rend le captcha plus complexe
- **Calculs photo** : Nécessite une compréhension des concepts photo
- **Validation progressive** : Chaque étape doit être réussie
- **Tolérance stricte** : Pas de validation approximative

### Expiration
- **Délai** : 10 minutes maximum
- **Nettoyage automatique** : Suppression des défis expirés
- **Sécurité** : Pas de réutilisation des défis

## 🚀 Utilisation

### Pour l'Utilisateur
1. **Ajuster l'exposition** : Modifier vitesse et diaphragme jusqu'à ce que l'image soit bien exposée
2. **Valider l'exposition** : Cliquer sur "Valider l'Exposition" une fois satisfait
3. **Ajuster la netteté** : Déplacer le viseur sur l'image pour la rendre nette
4. **Validation automatique** : Le captcha se valide à 95% de netteté

### Pour le Développeur
```svelte
<Captcha 
  onValidated={(valid) => captchaValidated = valid}
  disabled={isCreatingPayment}
/>
```

## 📱 Support Multi-Plateforme

### Desktop
- **Suivi de la souris** en temps réel
- **Événements mousemove** pour l'interaction
- **Hover effects** pour le feedback visuel

### Mobile
- **Suivi du doigt** tactile
- **Événements touchmove** pour l'interaction
- **Touch-friendly** : Boutons et interactions adaptés

### Responsive
- **Adaptation automatique** à tous les écrans
- **Layout flexible** : Grilles et formulaires responsives
- **Sécurité** : Curseur bloqué après validation pour éviter les manipulations

## 🎯 Avantages du Système

### Photo-Réaliste
- **Concepts photo** : Exposition, netteté, viseur
- **Interface familière** : Menus déroulants de réglages
- **Feedback visuel** : L'image change en temps réel

### Sécurisé
- **Deux étapes** : Double validation requise
- **Calculs complexes** : Formules photo réelles
- **Tolérance stricte** : Pas de validation approximative

### Engageant
- **Interactif** : Feedback en temps réel
- **Éducatif** : Apprend les concepts photo
- **Satisfaisant** : Validation progressive et feedback visuel

---

**💡 Conseil** : Le captcha photo est un véritable simulateur d'appareil photo en deux étapes ! 📸✨
