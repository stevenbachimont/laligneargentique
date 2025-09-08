# 🚀 Guide de Déploiement avec Stripe

## 📋 Prérequis

1. **Compte Stripe** : Créez un compte sur [stripe.com](https://stripe.com)
2. **Clés API** : Obtenez vos clés de production sur le [dashboard Stripe](https://dashboard.stripe.com/apikeys)
3. **Webhook** : Configurez un webhook sur le [dashboard Stripe](https://dashboard.stripe.com/webhooks)

## 🔧 Configuration des Variables d'Environnement

### 1. Créer le fichier `.env`

```bash
# Copier le fichier d'exemple
cp env.production.example .env
```

### 2. Configurer les variables Stripe

Éditez le fichier `.env` et remplacez les valeurs par défaut :

```env
# Configuration Stripe (OBLIGATOIRE pour les paiements)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 3. Obtenir les clés Stripe

#### Clés API
1. Allez sur [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copiez la **Publishable key** (commence par `pk_live_`)
3. Copiez la **Secret key** (commence par `sk_live_`)

#### Webhook Secret
1. Allez sur [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez sur **"Add endpoint"**
3. URL : `https://votre-domaine.com/api/payment/webhook`
4. Événements à sélectionner :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiez le **Signing secret** (commence par `whsec_`)

## 🐳 Déploiement avec Docker

### Option 1 : Variables dans le fichier .env

```bash
# 1. Configurer le fichier .env avec vos vraies clés Stripe
nano .env

# 2. Déployer
docker-compose up -d --build
```

### Option 2 : Variables d'environnement système

```bash
# 1. Exporter les variables
export STRIPE_SECRET_KEY="sk_live_..."
export STRIPE_PUBLISHABLE_KEY="pk_live_..."
export STRIPE_WEBHOOK_SECRET="whsec_..."

# 2. Déployer
docker-compose up -d --build
```

## ✅ Vérification du Déploiement

### 1. Vérifier les logs

```bash
docker-compose logs -f app
```

Vous devriez voir :
```
✅ Variables d'environnement détectées:
   STRIPE_SECRET_KEY: [CONFIGURÉ]
   STRIPE_PUBLISHABLE_KEY: [CONFIGURÉ]
   STRIPE_WEBHOOK_SECRET: [CONFIGURÉ]
```

### 2. Tester les paiements

1. Allez sur votre site : `https://votre-domaine.com`
2. Naviguez vers une balade avec des places disponibles
3. Testez un paiement avec une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : Date future quelconque
   - CVC : 3 chiffres quelconques

### 3. Vérifier les webhooks

Dans les logs Stripe, vous devriez voir les événements webhook reçus.

## 🚨 Dépannage

### Erreur : "PUBLIC_STRIPE_PUBLISHABLE_KEY is not exported"

**Cause** : La variable `PUBLIC_STRIPE_PUBLISHABLE_KEY` n'est pas définie.

**Solution** :
```bash
# Vérifier que la variable est dans .env
grep PUBLIC_STRIPE_PUBLISHABLE_KEY .env

# Si elle n'existe pas, l'ajouter
echo "PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_..." >> .env
```

### Erreur : "Cannot find module 'stripe'"

**Cause** : Le package Stripe n'est pas installé.

**Solution** :
```bash
# Reconstruire l'image Docker
docker-compose down
docker-compose up -d --build
```

### Erreur : "Webhook signature verification failed"

**Cause** : Le `STRIPE_WEBHOOK_SECRET` est incorrect.

**Solution** :
1. Vérifier le secret sur le dashboard Stripe
2. Mettre à jour le fichier `.env`
3. Redémarrer le conteneur

## 🔒 Sécurité

### Variables sensibles
- **Ne jamais** commiter le fichier `.env` dans Git
- **Ne jamais** exposer les clés secrètes dans le code client
- Utiliser des variables d'environnement pour les secrets

### Clés de test vs production
- **Développement** : Utilisez les clés de test (`sk_test_`, `pk_test_`)
- **Production** : Utilisez les clés de production (`sk_live_`, `pk_live_`)

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `docker-compose logs app`
2. Testez les variables : `docker-compose exec app env | grep STRIPE`
3. Vérifiez la configuration Stripe sur le dashboard

---

**⚠️ Important** : Sans configuration Stripe, les paiements ne fonctionneront pas et l'application affichera des erreurs lors de la compilation.
