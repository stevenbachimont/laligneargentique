# 🔐 Sécurité des APIs - Documentation

## 📋 Vue d'ensemble

Ce document décrit les mesures de sécurité implémentées pour protéger les APIs de l'application contre les accès non autorisés et les attaques.

## 🛡️ Mesures de Sécurité Implémentées

### 1. **Authentification Admin Sécurisée**

#### Système de Sessions
- **Sessions cryptographiques** : Utilisation de tokens cryptographiquement sécurisés
- **Expiration automatique** : Sessions valides 24 heures
- **Validation côté serveur** : Vérification systématique de chaque requête admin
- **Gestion des IP** : Suivi des adresses IP pour détecter les accès suspects

#### Endpoints d'Authentification
- `POST /api/admin/auth` - Connexion admin
- `DELETE /api/admin/auth` - Déconnexion admin  
- `GET /api/admin/auth` - Vérification de session

### 2. **Protection des Routes Admin**

#### Middleware de Sécurité
Toutes les routes `/api/admin/*` sont protégées par :
- **Authentification obligatoire** : Token de session requis
- **Headers de sécurité** : Protection XSS, CSRF, etc.
- **Validation CORS** : Contrôle des origines autorisées

#### Routes Protégées
- `/api/admin/balades/*` - Gestion des balades
- `/api/admin/reservations/*` - Gestion des réservations
- `/api/admin/invitations/*` - Gestion des invitations
- `/api/admin/confirmer-reservation` - Confirmation manuelle
- `/api/admin/corriger-places` - Correction des places

### 3. **Rate Limiting**

#### Protection contre les Attaques par Force Brute
- **Limite de tentatives** : 5 tentatives par IP toutes les 15 minutes
- **Blocage temporaire** : IP bloquée en cas de dépassement
- **Messages informatifs** : Temps de blocage communiqué à l'utilisateur

#### Configuration
```typescript
// 5 tentatives maximum par fenêtre de 15 minutes
withRateLimit(5, 15 * 60 * 1000)
```

### 4. **Sécurisation des Endpoints de Test**

#### Endpoints de Test Protégés
- `/api/test-env` - Variables d'environnement (admin + dev uniquement)
- `/api/test-email-connection` - Test de connexion email (admin + dev uniquement)
- `/api/test-argentique` - Test de validation (admin + dev uniquement)

#### Restrictions
- **Authentification admin requise**
- **Désactivés en production** : Retournent 404 en mode production
- **Logs de sécurité** : Toutes les tentatives d'accès sont loggées

### 5. **Headers de Sécurité**

#### Headers Implémentés
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

#### CORS pour APIs Admin
```http
Access-Control-Allow-Origin: [domaine autorisé]
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Session
Access-Control-Allow-Credentials: true
```

## 🔧 Configuration

### Variables d'Environnement

#### Authentification
```bash
# Code d'accès admin (obligatoire)
ADMIN_ACCESS_CODE=votre_code_securise

# Mode de production (désactive les endpoints de test)
NODE_ENV=production
```

### Service d'Authentification

#### Utilisation côté Client
```typescript
import { AdminApiService } from '$lib/services/adminApiService';

// Tous les appels API admin incluent automatiquement l'authentification
const result = await AdminApiService.getReservations();
```

#### Gestion des Sessions
```typescript
// Vérification de session
const isAuthenticated = await AdminApiService.checkSessionStatus();

// Les tokens sont automatiquement gérés
// Expiration après 24h
// Déconnexion automatique en cas d'erreur 401
```

## 🚨 Gestion des Erreurs

### Codes d'Erreur Sécurité
- `401 UNAUTHORIZED` - Session invalide ou expirée
- `429 RATE_LIMITED` - Trop de tentatives
- `403 FORBIDDEN` - Accès refusé
- `404 NOT_FOUND` - Endpoint non disponible en production

### Logs de Sécurité
Tous les événements de sécurité sont loggés :
- Tentatives de connexion (succès/échec)
- Accès aux routes protégées
- Tentatives de rate limiting
- Déconnexions

## 🔍 Monitoring et Alertes

### Métriques de Sécurité
- Nombre de sessions actives
- Tentatives de connexion échouées
- IPs bloquées par rate limiting
- Accès aux endpoints de test

### Recommandations
1. **Surveiller les logs** régulièrement
2. **Changer le code admin** périodiquement
3. **Utiliser HTTPS** en production
4. **Sauvegarder les sessions** en base de données pour la production

## 🚀 Déploiement

### Checklist de Sécurité
- [ ] Variable `ADMIN_ACCESS_CODE` configurée
- [ ] `NODE_ENV=production` en production
- [ ] HTTPS activé
- [ ] Logs de sécurité configurés
- [ ] Monitoring des tentatives d'accès

### Migration depuis l'Ancien Système
1. **Frontend** : Utilise automatiquement le nouveau système
2. **Sessions existantes** : Invalidées au prochain redémarrage
3. **Compatibilité** : Aucun changement requis côté client

## 📞 Support

En cas de problème de sécurité :
1. Vérifier les logs du serveur
2. Contrôler les variables d'environnement
3. Tester l'authentification avec `/api/admin/auth`
4. Vérifier le rate limiting si applicable

---

**⚠️ Important** : Ces mesures de sécurité sont essentielles. Ne jamais désactiver l'authentification ou exposer les endpoints de test en production.
