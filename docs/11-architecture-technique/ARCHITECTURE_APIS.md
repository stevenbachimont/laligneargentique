# 🔌 Architecture APIs et Services

## 📋 Vue d'ensemble

Cette section détaille l'architecture des APIs et services, incluant les endpoints, les services et les composants.

## 🔌 Endpoints Publics

### APIs Principales
```
GET  /api/balades                    # Récupérer les balades
POST /api/balades/reservation        # Créer une réservation
POST /api/contact                    # Envoyer un message de contact
POST /api/payment/create             # Créer un paiement Stripe
POST /api/payment/webhook            # Webhook Stripe
```

### APIs de Test
```
GET  /api/test-env                   # Variables d'environnement
POST /api/test-email-connection      # Test connexion email
POST /api/test-argentique            # Test validation
```

## 🔐 Endpoints Admin

### Authentification
```
POST /api/admin/auth                 # Authentification admin
```

### Gestion des Balades
```
GET  /api/admin/balades              # Récupérer toutes les balades
POST /api/admin/balades              # Créer une balade
PUT  /api/admin/balades/[id]         # Modifier une balade
DELETE /api/admin/balades/[id]       # Supprimer une balade
```

### Gestion des Réservations
```
GET  /api/admin/reservations         # Récupérer les réservations
DELETE /api/admin/reservations/[id]  # Supprimer une réservation
```

## 🏗️ Architecture des Services

### Services Serveur
```typescript
// src/lib/server/
├── baladesService.ts        # Gestion des balades
├── emailService.ts          # Envoi d'emails
├── stripeService.ts         # Paiements Stripe
├── authService.ts           # Authentification
├── validationService.ts     # Validation des données
├── captchaService.ts        # Système de captcha
├── rateLimiter.ts           # Rate limiting
└── database.ts              # Connexion base de données
```

### Services Client
```typescript
// src/lib/client/
├── stripeClient.ts          # Client Stripe
└── adminApiService.ts       # Service API admin
```

## 🧩 Composants

### Composants Réutilisables
```typescript
// src/lib/components/
├── AdminAuth.svelte         # Authentification admin
├── Captcha.svelte           # Composant captcha
└── StripePaymentForm.svelte # Formulaire de paiement
```

### Structure des Composants
- **Props** : Propriétés d'entrée
- **Events** : Événements émis
- **Slots** : Contenu personnalisable
- **Stores** : État global

## 🔧 Gestion des Erreurs

### Types d'Erreurs
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}
```

### Gestion Centralisée
```typescript
// src/lib/server/errorHandler.ts
export function handleApiError(error: Error): Response {
  return new Response(JSON.stringify({
    code: 'INTERNAL_ERROR',
    message: error.message
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## 🔒 Sécurité des APIs

### Validation des Données
```typescript
// src/lib/server/validationService.ts
export function validateReservation(data: any): boolean {
  return data.prenom && data.nom && data.email && data.nombre_personnes;
}
```

### Rate Limiting
```typescript
// src/lib/server/rateLimiter.ts
export function checkRateLimit(ip: string): boolean {
  // Implémentation du rate limiting
  return true;
}
```

## 📊 Monitoring des APIs

### Logs
```typescript
// Logging des requêtes
console.log(`API ${method} ${path} - ${status} - ${duration}ms`);
```

### Métriques
- **Temps de réponse** : Durée des requêtes
- **Taux d'erreur** : Pourcentage d'erreurs
- **Volume** : Nombre de requêtes
- **Utilisateurs** : Utilisateurs actifs

---

**💡 Conseil** : Cette architecture d'APIs est conçue pour être sécurisée, performante et maintenable.
