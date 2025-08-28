# 📸 Captcha Photo Game - Exposition + Netteté

## 🎯 Concept du Captcha

Un captcha photo-réaliste en **deux étapes** qui simule l'utilisation d'un appareil photo professionnel :

### **Étape 1 : Ajustement de l'Exposition** 📷
- **Vitesse d'obturation** : Curseur de 1s à 1/1000
- **Diaphragme** : Curseur de f2.4 à f22
- **Effet en temps réel** : L'image change d'apparence selon l'exposition
- **Validation** : L'exposition doit être correcte pour continuer

### **Étape 2 : Ajustement de la Netteté** 🎯
- **Viseur photo** : Curseur stylisé qui suit la souris/doigt
- **Netteté en temps réel** : L'image se floute selon la position
- **Validation automatique** : À 95% de netteté

## ✨ Fonctionnalités Principales

### 🎮 **Interface Interactive**
- **Deux étapes distinctes** : Exposition puis netteté
- **Feedback visuel** : L'image change en temps réel
- **Validation progressive** : Chaque étape doit être réussie
- **Design photo-réaliste** : Interface d'appareil photo

### 📊 **Système d'Exposition**
- **Vitesses** : 1s, 1/2, 1/4, 1/8, 1/15, 1/30, 1/60, 1/125, 1/250, 1/500, 1/1000
- **Diaphragmes** : f2.4, f2.8, f4, f5.6, f8, f11, f16, f22
- **Calcul EV** : Valeur d'exposition basée sur la formule photo
- **Tolérance** : ±0.5 stops pour la validation

### 🎯 **Système de Netteté**
- **Format carré** : Image recadrée en 1:1 avec `aspect-ratio`
- **Distance maximale** : 50% (optimisé pour le carré)
- **Tolérance** : 20% (plus précise pour le format carré)
- **Centrage** : L'image reste centrée horizontalement
- **Recadrage** : Suppression automatique du haut et du bas

### ⚡ **Validation Automatique**
- **Seuil de validation** : 95% de netteté
- **Validation instantanée** : Pas de bouton à cliquer
- **Feedback immédiat** : Message de succès automatique
- **Curseur bloqué** : Le viseur se fige après validation pour permettre l'utilisation du formulaire

### 📱 **Support Multi-Plateforme**
- **Desktop** : Suivi de la souris en temps réel
- **Mobile** : Suivi du doigt tactile
- **Responsive** : Adaptation automatique à tous les écrans
- **Sécurité** : Curseur bloqué après validation pour éviter les manipulations

## 🔧 Fonctionnement Technique

### **Calcul de l'Exposition**
```typescript
// Formule simplifiée : EV = log2(aperture² / shutter)
function calculateExposureValue(shutter: number, aperture: number): number {
  return Math.log2((aperture * aperture) / shutter);
}
```

### 📸 Exposition Réaliste
- **Vitesse d'obturation** : Plus rapide (1/1000) = plus sombre, plus lente (1s) = plus claire
- **Diaphragme** : Plus fermé (f22) = plus sombre, plus ouvert (f2.4) = plus clair
- **Combinaison** : 1/500 f16 = trop sombre, 1/60 f4 = trop clair
- **Feedback intelligent** : Conseils d'ajustement selon l'exposition actuelle
- **Effets visuels** : Luminosité, contraste et saturation ajustés en temps réel

### 🎯 Logique d'Exposition Photo
- **Surexposition** : Image trop claire → Augmenter la vitesse ou fermer le diaphragme
- **Sous-exposition** : Image trop sombre → Diminuer la vitesse ou ouvrir le diaphragme
- **Exposition correcte** : Équilibre parfait entre vitesse et diaphragme
- **Stops d'exposition** : Chaque changement de vitesse/diaphragme = 1 stop de lumière

### **Effets Visuels en Temps Réel**
- **Très mal exposé** (>2 stops) : Luminosité 150% ou 50%, contraste 120%, saturation 80%
- **Mal exposé** (1-2 stops) : Luminosité 130% ou 70%, contraste 110%, saturation 90%
- **Légèrement mal exposé** (0.5-1 stop) : Luminosité 115% ou 85%, contraste 105%, saturation 95%
- **Bien exposé** (≤0.5 stop) : Luminosité 100%, contraste 100%, saturation 100%

### **Événements Interactifs**
- **mousemove** : Suivi de la souris sur desktop
- **touchmove** : Suivi du doigt sur mobile
- **mouseenter/mouseleave** : Activation/désactivation du suivi
- **click/touchstart** : Validation finale

### **Comportement après Validation**
- **Curseur bloqué** : Plus de mouvement du viseur
- **Événements désactivés** : Pas de modification de la netteté
- **Curseur visuel** : Changement d'apparence (transparence, gris)
- **Formulaire accessible** : Permet de cliquer sur les boutons de validation

## 🎨 Interface Utilisateur

### **Étape 1 : Exposition**
- **Aperçu en temps réel** : L'image change selon les réglages
- **Feedback visuel** : Indicateurs de qualité d'exposition
- **Contrôles intuitifs** : Menus déroulants pour vitesse et diaphragme
- **Validation conditionnelle** : Bouton activé uniquement si l'exposition est correcte

### **Étape 2 : Netteté**
- **Viseur photo stylisé** : Curseur noir avec croix et cercle
- **Bordure colorée** : Rouge → Orange → Jaune → Vert selon la netteté
- **Validation automatique** : À 95% de netteté
- **Curseur bloqué** : Plus de mouvement après validation

## 🔒 Sécurité et Validation

### **Double Validation**
1. **Exposition** : Doit être dans ±0.5 stops de la cible
2. **Netteté** : Doit atteindre 95% de netteté

### **Protection Anti-Bot**
- **Deux étapes** : Rend le captcha plus complexe
- **Calculs photo** : Nécessite une compréhension des concepts photo
- **Validation progressive** : Chaque étape doit être réussie
- **Tolérance stricte** : Pas de validation approximative

### **Expiration**
- **Délai** : 10 minutes maximum
- **Nettoyage automatique** : Suppression des défis expirés
- **Sécurité** : Pas de réutilisation des défis

## 🚀 Utilisation

### **Pour l'Utilisateur**
1. **Ajuster l'exposition** : Modifier vitesse et diaphragme jusqu'à ce que l'image soit bien exposée
2. **Valider l'exposition** : Cliquer sur "Valider l'Exposition" une fois satisfait
3. **Ajuster la netteté** : Déplacer le viseur sur l'image pour la rendre nette
4. **Validation automatique** : Le captcha se valide à 95% de netteté

### **Pour le Développeur**
```svelte
<Captcha 
  onValidated={(valid) => captchaValidated = valid}
  disabled={isCreatingPayment}
/>
```

## 🎯 Avantages de ce Système

### **Photo-Réaliste**
- **Concepts photo** : Exposition, netteté, viseur
- **Interface familière** : Menus déroulants de réglages
- **Feedback visuel** : L'image change en temps réel

### **Sécurisé**
- **Deux étapes** : Double validation requise
- **Calculs complexes** : Formules photo réelles
- **Tolérance stricte** : Pas de validation approximative

### **Engageant**
- **Interactif** : Feedback en temps réel
- **Éducatif** : Apprend les concepts photo
- **Satisfaisant** : Validation progressive et feedback visuel

**Le captcha photo est maintenant un véritable simulateur d'appareil photo en deux étapes !** 📸✨
