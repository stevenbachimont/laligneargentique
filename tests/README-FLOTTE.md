# Tests de la Flotte d'Appareils

Ce document décrit la suite de tests pour la fonctionnalité de présentation de la flotte d'appareils photos argentiques.

## Structure des Tests

### 1. Tests des Données (`tests/services/appareilsData.test.ts`)

**Objectif** : Vérifier la structure et la cohérence des données d'appareils.

**Tests inclus** :
- ✅ Structure des données (propriétés requises)
- ✅ Validation des catégories (TLR, SLR, Folding, Rangefinder, Point & Shoot)
- ✅ Validation des statuts (disponible, maintenance, reserve)
- ✅ Fonction `getAppareilsByCategorie()`
- ✅ Fonction `getAppareilById()`
- ✅ Fonction `getAppareilsDisponibles()`
- ✅ Données spécifiques (Rolleiflex, Canon AE-1, etc.)

### 2. Tests de l'API (`tests/api/appareils.test.ts`)

**Objectif** : Vérifier le fonctionnement de l'API REST pour les appareils.

**Tests inclus** :
- ✅ GET `/api/appareils` (tous les appareils)
- ✅ GET `/api/appareils?categorie=TLR` (filtrage par catégorie)
- ✅ GET `/api/appareils?disponible=true` (filtrage par disponibilité)
- ✅ Gestion des catégories inexistantes
- ✅ Gestion des erreurs
- ✅ Structure de réponse correcte
- ✅ Propriétés des appareils dans la réponse

### 3. Tests de la Page (`tests/routes/web/flotte.test.ts`)

**Objectif** : Vérifier l'interface utilisateur et les interactions.

**Tests inclus** :
- ✅ Rendu initial (titre, sous-titre, catégories)
- ✅ Navigation par catégories
- ✅ Affichage du carrousel d'appareils
- ✅ Informations des appareils (nom, marque, prix, statut)
- ✅ Caractéristiques techniques
- ✅ Contrôles du carrousel (navigation, lecture/pause)
- ✅ Section informations pratiques
- ✅ Gestion des catégories vides
- ✅ Interactions utilisateur
- ✅ Accessibilité (labels ARIA)
- ✅ Design responsive

### 4. Tests d'Intégration (`tests/integration/flotte-integration.test.ts`)

**Objectif** : Vérifier le fonctionnement complet du système.

**Tests inclus** :
- ✅ Flux complet de navigation
- ✅ Navigation dans le carrousel avec plusieurs appareils
- ✅ Intégration API et données
- ✅ Gestion des états (auto-play, compteurs)
- ✅ Gestion des erreurs
- ✅ Performance et UX
- ✅ Accessibilité complète

## Exécution des Tests

### Script de Test Dédié

```bash
# Exécuter tous les tests de la flotte
./scripts/test-flotte.sh

# Mode watch (surveillance continue)
./scripts/test-flotte.sh --watch

# Avec couverture de code
./scripts/test-flotte.sh --coverage
```

### Tests Individuels

```bash
# Tests des données
npx vitest run tests/services/appareilsData.test.ts

# Tests de l'API
npx vitest run tests/api/appareils.test.ts

# Tests de la page
npx vitest run tests/routes/web/flotte.test.ts

# Tests d'intégration
npx vitest run tests/integration/flotte-integration.test.ts
```

### Tous les Tests

```bash
# Exécuter tous les tests du projet
npm test

# Mode watch
npm run test:watch
```

## Couverture de Code

Les tests couvrent :

- **Données** : 100% des fonctions utilitaires
- **API** : 100% des endpoints et cas d'erreur
- **Page** : 90%+ des interactions utilisateur
- **Intégration** : Flux complets et états

## Mocks et Données de Test

### Données Mockées

Les tests utilisent des données mockées pour :
- Appareils photos (Rolleiflex, Canon, Yashica, etc.)
- Catégories d'appareils
- Statuts de disponibilité
- Caractéristiques techniques

### Mocks de Services

- `$lib/data/appareilsData` : Données d'appareils
- `window.location` : Navigation
- `fetch` : Appels API
- `@testing-library/svelte` : Rendu des composants

## Bonnes Pratiques

### 1. Tests Unitaires
- Un test par fonctionnalité
- Assertions claires et spécifiques
- Données de test réalistes

### 2. Tests d'Intégration
- Flux complets utilisateur
- Gestion des états
- Performance

### 3. Tests d'Accessibilité
- Labels ARIA appropriés
- Navigation au clavier
- Descriptions des éléments

### 4. Tests Responsive
- Adaptation mobile/desktop
- Interactions tactiles
- Mise en page flexible

## Dépannage

### Erreurs Communes

1. **Import errors** : Vérifier les chemins d'import
2. **Mock errors** : Vérifier la configuration des mocks
3. **Timeout errors** : Augmenter les délais d'attente
4. **DOM errors** : Vérifier les sélecteurs CSS

### Debug

```bash
# Mode debug avec logs détaillés
npx vitest run --reporter=verbose

# Test spécifique avec debug
npx vitest run tests/services/appareilsData.test.ts --reporter=verbose
```

## Maintenance

### Ajout de Nouveaux Tests

1. Suivre la structure existante
2. Utiliser des noms descriptifs
3. Ajouter des commentaires si nécessaire
4. Mettre à jour ce README

### Mise à Jour des Données

1. Modifier les mocks en conséquence
2. Vérifier la cohérence des tests
3. Exécuter la suite complète

## Métriques

- **Temps d'exécution** : < 5 secondes
- **Couverture** : > 90%
- **Tests passants** : 100%
- **Performance** : Chargement < 1 seconde
