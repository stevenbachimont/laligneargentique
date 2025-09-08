# 📸 Captcha Photo Game - Exposition + Netteté

## 🎯 Concept du Captcha

Un captcha photo-réaliste qui simule l'utilisation d'un appareil photo professionnel :



### Ajustement de la Netteté 🎯
- **Viseur photo** : Curseur stylisé qui suit la souris/doigt
- **Netteté en temps réel** : L'image se floute selon la position
- **Validation automatique** : À 95% de netteté

## ✨ Fonctionnalités Principales

### 🎮 **Interface Interactive**
- **Deux étapes distinctes** : Exposition puis netteté
- **Feedback visuel** : L'image change en temps réel
- **Validation progressive** : Chaque étape doit être réussie
- **Design photo-réaliste** : Interface d'appareil photo


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


### Netteté
- **Viseur photo stylisé** : Curseur noir avec croix et cercle
- **Bordure colorée** : Rouge → Orange → Jaune → Vert selon la netteté
- **Validation automatique** : À 95% de netteté
- **Curseur bloqué** : Plus de mouvement après validation

## 🔒 Sécurité et Validation

### Validation**
- **Netteté** : Doit atteindre 95% de netteté

### **Protection Anti-Bot**
- **Calculs photo** : Nécessite une compréhension des concepts photo
- **Tolérance stricte** : Pas de validation approximative

### **Expiration**
- **Délai** : 10 minutes maximum
- **Nettoyage automatique** : Suppression des défis expirés
- **Sécurité** : Pas de réutilisation des défis

## 🚀 Utilisation

### **Pour l'Utilisateur**
1. **Ajuster la netteté** : Déplacer le viseur sur l'image pour la rendre nette
2. **Validation automatique** : Le captcha se valide à 95% de netteté

### **Pour le Développeur**
```svelte
<Captcha 
  onValidated={(valid) => captchaValidated = valid}
  disabled={isCreatingPayment}
/>
```

## 🎯 Avantages de ce Système

### **Photo-Réaliste**
- **Concepts photo** : Netteté, viseur
- **Feedback visuel** : L'image change en temps réel

### **Sécurisé**
- **Calculs complexes** : Formules photo réelles
- **Tolérance stricte** : Pas de validation approximative

### **Engageant**
- **Interactif** : Feedback en temps réel
- **Éducatif** : Apprend les concepts photo
- **Satisfaisant** : Validation progressive et feedback visuel

**Le captcha photo est maintenant un véritable simulateur d'appareil photo en deux étapes !** 📸✨
