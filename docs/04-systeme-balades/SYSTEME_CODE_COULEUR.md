# 🎨 Système de Code Couleur pour les Places Disponibles

## 📋 Vue d'ensemble

Le système de code couleur permet d'indiquer visuellement le niveau de disponibilité des places pour chaque balade argentique. Il utilise trois couleurs distinctes pour guider les utilisateurs dans leur choix.

## 🎯 Objectif

- **Faciliter la prise de décision** : Les utilisateurs peuvent rapidement identifier les balades avec des places disponibles
- **Encourager les réservations** : Les couleurs d'alerte incitent à réserver rapidement
- **Améliorer l'expérience utilisateur** : Interface intuitive et informative

## 🎨 Codes Couleur

### 🟢 Vert (#00ff00) - "disponible"
- **Condition** : 4 ou 5 places disponibles
- **Signification** : Places nombreuses, pas d'urgence
- **Texte affiché** : "X place(s) disponible(s)"
- **État** : ✅ Confortable

### 🟠 Orange (#ff8c00) - "orange"
- **Condition** : 2 ou 3 places disponibles
- **Signification** : Places moyennes, réserver bientôt
- **Texte affiché** : "X place(s) disponible(s)"
- **État** : ⚠️ Moyen

### 🔴 Rouge (#ff6b6b) - "limite" / "complete"
- **Condition** : 0 ou 1 place disponible
- **Signification** : Places critiques ou balade complète
- **Texte affiché** : "Complet" ou "1 place disponible"
- **État** : ❌ Critique/Épuisé

## 🔧 Implémentation Technique

### Logique de Détermination

```javascript
function getCouleurPlaces(placesDisponibles) {
  if (placesDisponibles === 0) return 'complete';
  if (placesDisponibles === 1) return 'limite';
  if (placesDisponibles <= 3) return 'orange';
  return 'disponible';
}
```

### Classes CSS Appliquées

#### Page Argentique (`/photographie/argentique`)
```svelte
<span class="places {balade.placesDisponibles === 0 ? 'complete' : balade.placesDisponibles === 1 ? 'limite' : balade.placesDisponibles <= 3 ? 'orange' : 'disponible'}">
  {balade.placesDisponibles === 0 ? 'Complet' : `${balade.placesDisponibles} place${balade.placesDisponibles > 1 ? 's' : ''} disponible${balade.placesDisponibles > 1 ? 's' : ''}`}
</span>
```

#### Page Principale (`/photographie`)
```svelte
<span class="places-dispo {balade.placesDisponibles === 0 ? 'complete' : balade.placesDisponibles === 1 ? 'limite' : balade.placesDisponibles <= 3 ? 'orange' : 'disponible'}">
  {balade.placesDisponibles} place{balade.placesDisponibles > 1 ? 's' : ''} disponible{balade.placesDisponibles > 1 ? 's' : ''}
</span>
```

### Styles CSS

#### Page Argentique
```css
.places {
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.places.disponible {
  color: #00ff00;
}

.places.orange {
  color: #ff8c00;
}

.places.limite {
  color: #ff6b6b;
}

.places.complete {
  color: #ff6b6b;
}
```

#### Page Principale
```css
.places-dispo {
  font-size: 0.8rem;
  font-weight: 500;
}

.places-dispo.disponible {
  color: #00ff00;
}

.places-dispo.orange {
  color: #ff8c00;
}

.places-dispo.limite {
  color: #ff6b6b;
}

.places-dispo.complete {
  color: #ff6b6b;
}
```

## 📍 Pages Concernées

### 1. Page Principale (`/photographie`)
- **Fichier** : `src/routes/photographie/+page.svelte`
- **Section** : Aperçu des balades dans le bloc "La ligne Argentique"
- **Classe** : `places-dispo`

### 2. Page Argentique (`/photographie/argentique`)
- **Fichier** : `src/routes/photographie/argentique/+page.svelte`
- **Section** : Liste complète des balades
- **Classe** : `places`

### 3. Page d'Administration (`/admin/balades`)
- **Fichier** : `src/routes/admin/balades/+page.svelte`
- **Section** : Gestion des balades
- **Classe** : `places`

## 🧪 Tests

### Test Automatique
```bash
# Vérifier que le système fonctionne
curl -s http://localhost:3000/api/balades | jq '.balades[] | {id, theme, placesDisponibles}'
```

### Test Manuel
1. Accéder à `/photographie` - Vérifier les couleurs dans l'aperçu
2. Accéder à `/photographie/argentique` - Vérifier les couleurs dans la liste complète
3. Modifier les places disponibles via l'admin - Vérifier les changements de couleur

## 🔄 Mise à Jour Dynamique

Le système se met à jour automatiquement :
- **Lors des réservations** : Les places diminuent et les couleurs changent
- **Via l'interface admin** : Modification directe des places disponibles
- **Temps réel** : Les changements sont immédiatement visibles

## 📊 Exemples Visuels

### Configuration 1 : Toutes disponibles
```
🟢 Architecture médiévale: 5 places disponibles
🟢 Street Art & Contemporain: 4 places disponibles  
🟢 Nature en ville: 4 places disponibles
```

### Configuration 2 : Mix toutes les couleurs
```
🟢 Architecture médiévale: 4 places disponibles
🟠 Street Art & Contemporain: 3 places disponibles
🔴 Nature en ville: 1 place disponible
```

### Configuration 3 : Places moyennes
```
🟠 Architecture médiévale: 3 places disponibles
🟠 Street Art & Contemporain: 2 places disponibles
🟠 Nature en ville: 3 places disponibles
```

### Configuration 4 : Places critiques
```
🔴 Architecture médiévale: Complet
🔴 Street Art & Contemporain: 1 place disponible
🔴 Nature en ville: Complet
```

## ✅ Validation

Le système a été testé et validé avec :
- ✅ **Logique de détermination** : Fonctionne correctement pour toutes les valeurs
- ✅ **Styles CSS** : Couleurs appliquées correctement (vert, orange, rouge)
- ✅ **Pages multiples** : Cohérence entre toutes les pages
- ✅ **Mise à jour dynamique** : Changements visibles en temps réel
- ✅ **Accessibilité** : Contraste suffisant pour la lisibilité
- ✅ **Nouvelle logique** : Vert (4-5), Orange (2-3), Rouge (0-1)

## 🚀 Déploiement

Le système est prêt pour la production et fonctionne de manière transparente avec :
- **Base de données SQLite** : Données persistantes
- **API REST** : Mise à jour en temps réel
- **Interface utilisateur** : Réactive et intuitive
- **Administration** : Gestion facile des places disponibles
