# 🧪 Tests Stripe - Préparation au Déploiement

## 📋 Vue d'ensemble

Ce document décrit tous les tests unitaires et d'intégration créés pour valider le système de réservation Stripe avant le déploiement.

## 🗂️ Structure des tests

```
tests/
├── services/
│   ├── baladesService.test.ts      # Tests du service principal
│   └── stripeService.test.ts       # Tests du service Stripe
├── api/
│   ├── balades.test.ts             # Tests API balades (existant)
│   ├── payment.test.ts             # Tests API paiement
│   └── admin.test.ts               # Tests API administration
└── integration/
    └── stripe-integration.test.ts  # Tests d'intégration complets
```

## 🚀 Tests unitaires

### 1. Service BaladesService (`tests/services/baladesService.test.ts`)

**Fonctionnalités testées :**
- ✅ Création de balades avec statut
- ✅ Modification de balades avec parcours et coordonnées
- ✅ Filtrage des balades par statut
- ✅ Création de réservations avec statut `en_attente`
- ✅ Modification du statut des réservations
- ✅ Décrémentation des places disponibles (simple et multiple)
- ✅ Correction automatique des places
- ✅ Gestion des balades archivées et futures
- ✅ Validation des données

**Exemple de test :**
```typescript
it('devrait créer une réservation avec statut en_attente', () => {
  const reservationData = {
    baladeId: 1,
    prenom: 'Test',
    nom: 'User',
    email: 'test@example.com',
    nombrePersonnes: 2,
    montant: 2000
  };

  const result = baladesService.creerReservation(reservationData);
  expect(result).toBe(1);
});
```

### 2. Service StripeService (`tests/services/stripeService.test.ts`)

**Fonctionnalités testées :**
- ✅ Création de Payment Intent
- ✅ Récupération de Payment Intent
- ✅ Vérification des signatures webhook
- ✅ Conversion de prix (euros ↔ centimes)
- ✅ Formatage des montants
- ✅ Validation des métadonnées
- ✅ Gestion des erreurs Stripe

**Exemple de test :**
```typescript
it('devrait créer un Payment Intent avec succès', async () => {
  const result = await stripeService.createPaymentIntent({
    amount: 2000,
    currency: 'eur',
    metadata: { baladeId: '1', nombrePersonnes: '2' }
  });

  expect(result.amount).toBe(2000);
  expect(result.currency).toBe('eur');
});
```

### 3. API Payment (`tests/api/payment.test.ts`)

**Fonctionnalités testées :**
- ✅ Création de Payment Intent via API
- ✅ Validation des données de réservation
- ✅ Gestion des erreurs de validation
- ✅ Traitement des webhooks Stripe
- ✅ Confirmation automatique des réservations
- ✅ Décrémentation des places
- ✅ Envoi d'emails de confirmation

**Exemple de test :**
```typescript
it('devrait créer un Payment Intent avec succès', async () => {
  const requestData = {
    baladeId: 1,
    participantName: 'Test User',
    participantEmail: 'test@example.com',
    nombrePersonnes: 2
  };

  const response = await POST({ request } as any);
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.success).toBe(true);
  expect(data.clientSecret).toBeTruthy();
});
```

### 4. API Admin (`tests/api/admin.test.ts`)

**Fonctionnalités testées :**
- ✅ Confirmation manuelle des réservations
- ✅ Liste des réservations en attente
- ✅ Correction automatique des places
- ✅ Validation des données d'administration
- ✅ Gestion des erreurs

## 🔗 Tests d'intégration

### 5. Intégration Stripe (`tests/integration/stripe-integration.test.ts`)

**Fonctionnalités testées :**
- ✅ Flux complet de réservation
- ✅ Gestion des erreurs de paiement
- ✅ Validation des places disponibles
- ✅ Traitement des webhooks
- ✅ Envoi d'emails
- ✅ Correction des données

**Exemple de test :**
```typescript
it('devrait gérer un flux de réservation complet avec succès', async () => {
  // 1. Création d'une balade
  const baladeId = baladesService.creerBalade(baladeData);
  
  // 2. Création d'une réservation
  const reservationId = baladesService.creerReservation(reservationData);
  
  // 3. Simulation du paiement Stripe
  const paymentIntent = await stripeService.createPaymentIntent(paymentIntentData);
  
  // 4. Traitement du webhook
  // 5. Vérification finale
  expect(reservationFinale.statut).toBe('confirmee');
  expect(baladeFinale.placesDisponibles).toBe(3);
});
```

## 🧪 Script de test complet

### 6. Test complet système (`test-stripe-complet.js`)

**Tests automatisés :**
- ✅ Vérification du serveur
- ✅ Test des balades disponibles
- ✅ Création de Payment Intent
- ✅ Vérification des réservations
- ✅ Test des API d'administration
- ✅ Confirmation manuelle
- ✅ Vérification de la configuration Stripe
- ✅ Test de la page de confirmation

**Exécution :**
```bash
npm run test:stripe
```

## 📊 Commandes de test

### Tests unitaires
```bash
# Tous les tests unitaires
npm run test:unit

# Tests unitaires en mode watch
npm run test:unit -- --watch

# Tests unitaires avec couverture
npm run test:unit -- --coverage
```

### Tests d'intégration
```bash
# Test complet du système Stripe
npm run test:stripe

# Tous les tests (unitaires + intégration)
npm run test:all
```

### Tests E2E
```bash
# Tests Playwright
npm run test:e2e
```

## 🎯 Critères de réussite

### Tests unitaires
- ✅ **100% des tests passent**
- ✅ **Couverture de code > 80%**
- ✅ **Aucune erreur de linting**

### Tests d'intégration
- ✅ **Flux complet fonctionnel**
- ✅ **Gestion d'erreurs robuste**
- ✅ **Performance acceptable**

### Tests système
- ✅ **Tous les composants opérationnels**
- ✅ **Configuration Stripe complète**
- ✅ **Webhook configuré et fonctionnel**

## 🔧 Configuration requise

### Variables d'environnement
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@example.com
```

### Dépendances
```bash
# Installation des dépendances de test
npm install --save-dev vitest @testing-library/svelte jsdom

# Dépendances Stripe
npm install stripe @stripe/stripe-js
```

## 🚨 Gestion des erreurs

### Erreurs courantes
1. **Configuration Stripe manquante**
   - Vérifier les variables d'environnement
   - Tester les clés Stripe

2. **Webhook non configuré**
   - Configurer l'URL webhook dans Stripe
   - Vérifier le secret webhook

3. **Base de données**
   - Vérifier la structure des tables
   - Tester les migrations

### Debugging
```bash
# Logs détaillés
DEBUG=* npm run test:stripe

# Test spécifique
npm run test:unit -- --run tests/services/baladesService.test.ts
```

## 📈 Métriques de qualité

### Couverture de code
- **Services** : > 90%
- **API** : > 85%
- **Intégration** : > 80%

### Performance
- **Temps de réponse API** : < 500ms
- **Temps de traitement webhook** : < 2s
- **Temps de création Payment Intent** : < 1s

### Fiabilité
- **Taux de succès** : > 99%
- **Gestion d'erreurs** : 100%
- **Validation des données** : 100%

## 🚀 Checklist de déploiement

### Avant le déploiement
- [ ] Tous les tests unitaires passent
- [ ] Tests d'intégration réussis
- [ ] Configuration Stripe complète
- [ ] Webhook configuré en production
- [ ] Variables d'environnement définies
- [ ] Base de données migrée
- [ ] Emails configurés

### Après le déploiement
- [ ] Test manuel du flux de paiement
- [ ] Vérification des webhooks
- [ ] Test des emails de confirmation
- [ ] Validation des places disponibles
- [ ] Test de l'interface d'administration

## 📞 Support

En cas de problème avec les tests :
1. Vérifier la configuration
2. Consulter les logs d'erreur
3. Tester manuellement les composants
4. Contacter l'équipe de développement

---

**🎉 Le système est prêt pour le déploiement quand tous les tests passent !**
