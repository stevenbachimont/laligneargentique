# 🛡️ Sécurité & API

## 📋 Vue d'ensemble

Cette section contient toute la documentation relative à la sécurité des APIs et aux mesures de protection implémentées.

## 📚 Documentation Disponible

### 🔐 Sécurité des APIs
- **[SECURITE_API.md](./SECURITE_API.md)** - Documentation complète de la sécurité
  - Authentification admin sécurisée
  - Protection des routes admin
  - Rate limiting
  - Headers de sécurité
  - Configuration et déploiement

## 🎯 Fonctionnalités de Sécurité

### ✅ Authentification Admin
- Sessions cryptographiques
- Expiration automatique (24h)
- Validation côté serveur
- Gestion des IP

### ✅ Protection des Routes
- Middleware de sécurité
- Authentification obligatoire
- Headers de sécurité
- Validation CORS

### ✅ Rate Limiting
- Protection contre les attaques par force brute
- 5 tentatives par IP toutes les 15 minutes
- Blocage temporaire
- Messages informatifs

### ✅ Endpoints de Test Sécurisés
- Authentification admin requise
- Désactivés en production
- Logs de sécurité
- Accès restreint

## 🔧 Configuration

### Variables d'Environnement
```bash
ADMIN_ACCESS_CODE=votre_code_securise
NODE_ENV=production
```

### Headers de Sécurité
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### CORS pour APIs Admin
```http
Access-Control-Allow-Origin: [domaine autorisé]
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Session
Access-Control-Allow-Credentials: true
```

## 🚨 Gestion des Erreurs

### Codes d'Erreur Sécurité
- `401 UNAUTHORIZED` - Session invalide ou expirée
- `429 RATE_LIMITED` - Trop de tentatives
- `403 FORBIDDEN` - Accès refusé
- `404 NOT_FOUND` - Endpoint non disponible en production

### Logs de Sécurité
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

## 🛡️ Bonnes Pratiques

### Variables Sensibles
- **Ne jamais** commiter le fichier `.env` dans Git
- **Ne jamais** exposer les clés secrètes dans le code client
- Utiliser des variables d'environnement pour les secrets

### Clés de Test vs Production
- **Développement** : Utilisez les clés de test (`sk_test_`, `pk_test_`)
- **Production** : Utilisez les clés de production (`sk_live_`, `pk_live_`)

---

**⚠️ Important** : Ces mesures de sécurité sont essentielles. Ne jamais désactiver l'authentification ou exposer les endpoints de test en production.
