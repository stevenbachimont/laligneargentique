# 🗺️ Système de Balades

## 📋 Vue d'ensemble

Cette section contient toute la documentation relative au système de gestion des balades, incluant les statuts, les codes couleur et les balades archivées.

## 📚 Documentation Disponible

### 🎯 Système de Statut
- **[SYSTEME_STATUT_BALADES.md](04-systeme-balades/SYSTEME_STATUT_BALADES.md)** - Documentation complète du système de statut
  - Statuts disponibles (brouillon/en ligne)
  - Workflow de création et publication
  - Interface d'administration
  - Tests et validation

### 🎨 Système de Code Couleur
- **[SYSTEME_CODE_COULEUR.md](04-systeme-balades/SYSTEME_CODE_COULEUR.md)** - Guide du système de code couleur
  - Indicateurs visuels de disponibilité
  - Logique des couleurs
  - Interface utilisateur
  - Responsive design

### 📚 Balades Archivées
- **[SYSTEME_BALADES_ARCHIVEES.md](04-systeme-balades/SYSTEME_BALADES_ARCHIVEES.md)** - Documentation technique des balades archivées
  - Architecture technique
  - Gestion des rétrospectives
  - Interface utilisateur
  - Base de données

- **[README_BALADES_ARCHIVEES.md](04-systeme-balades/README_BALADES_ARCHIVEES.md)** - Guide utilisateur des balades archivées
  - Utilisation du système
  - Interface utilisateur
  - Fonctionnalités
  - Workflow

## 🎯 Fonctionnalités Principales

### ✅ Gestion des Statuts
- **Brouillon** : Visible uniquement par l'admin
- **En ligne** : Visible par le public et réservables
- **Archivées** : Balades passées avec rétrospectives

### ✅ Système de Code Couleur
- 🟢 **Vert** : 4-5 places disponibles
- 🟠 **Orange** : 2-3 places disponibles
- 🔴 **Rouge** : 0-1 place ou complet

### ✅ Balades Archivées
- Rétrospectives des balades passées
- Photos des participants
- Commentaires et notes
- Détail du parcours suivi

## 🔧 Architecture Technique

### Base de Données
```sql
CREATE TABLE balades (
  id INTEGER PRIMARY KEY,
  theme TEXT NOT NULL,
  date TEXT NOT NULL,
  heure TEXT NOT NULL,
  lieu TEXT NOT NULL,
  places_disponibles INTEGER NOT NULL,
  prix TEXT NOT NULL,
  description TEXT NOT NULL,
  statut TEXT DEFAULT 'en_ligne',
  consignes TEXT NOT NULL,
  materiel TEXT NOT NULL,
  coordonnees TEXT NOT NULL,
  parcours TEXT NOT NULL
);
```

### Champs JSON
- `consignes` : Array de consignes
- `materiel` : Array de matériel requis
- `coordonnees` : Array de points GPS
- `parcours` : Array d'étapes détaillées

## 🚀 Workflow Utilisateur

### Création d'une Balade
```
Admin → Créer balade → Mode "brouillon" → Finaliser → Mettre "en ligne"
```

### Cycle de Vie d'une Balade
```
Brouillon → En ligne → Réservations → Date passée → Archivée
```

### Gestion des Réservations
```
Réservation → Validation → Email → Mise à jour places → Confirmation
```

## 🎨 Interface Utilisateur

### Design Responsive
- **Mobile** : 1 colonne, boutons pleine largeur
- **Tablet** : Grille adaptative
- **Desktop** : Multi-colonnes avec animations

### Navigation
- **Balades Futures** : Bouton "Réserver"
- **Balades Archivées** : Bouton "Voir la rétrospective"
- **Admin** : Accès protégé par mot de passe

## 🧪 Tests

### Tests Inclus
```bash
# Tests unitaires
npm run test:unit

# Tests spécifiques
npm run test:unit -- --run src/lib/server/baladesService.test.ts
```

### Couverture des Tests
- ✅ Service de balades (CRUD complet)
- ✅ Gestion des statuts
- ✅ Parsing sécurisé des champs JSON
- ✅ Gestion des erreurs
- ✅ Logique métier (places disponibles)

## 🚨 Dépannage

### Erreurs Communes
1. **"Cannot read properties of undefined"**
   - Redémarrer le serveur de développement
   - Vérifier les imports dans les fichiers

2. **"Photos not found"**
   - Les photos sont simulées pour l'instant
   - Créer le dossier `/static/photos/retrospective/` si nécessaire

3. **"Balades non trouvées"**
   - Vérifier la base de données
   - Vérifier les dates (futures vs passées)

---

**💡 Conseil** : Consultez d'abord le `SYSTEME_STATUT_BALADES.md` pour comprendre le workflow complet.
