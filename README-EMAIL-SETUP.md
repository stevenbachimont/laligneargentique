# Configuration du Service d'Emails - La Ligne Argentique

Ce guide vous explique comment configurer le service d'emails pour les réservations argentique sans utiliser de service tiers.

## 🎯 Objectif

Service d'emails natif utilisant Node.js et nodemailer, permettant l'envoi direct d'emails depuis votre serveur.

## 📋 Prérequis

- Un compte Gmail (recommandé) ou un serveur SMTP
- Node.js installé sur votre serveur
- Accès aux variables d'environnement

## 🔧 Configuration Gmail (Recommandée)

### 1. Activer l'authentification à deux facteurs
- Allez dans les paramètres de votre compte Google
- Activez l'authentification à deux facteurs

### 2. Créer un mot de passe d'application
- Dans les paramètres de sécurité Google
- Allez dans "Mots de passe d'application"
- Créez un nouveau mot de passe pour "Mail"
- Copiez ce mot de passe (16 caractères)

### 3. Configurer les variables d'environnement
Créez un fichier `.env` à la racine de votre projet :

```env
# Configuration Email Gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_APP_PASSWORD=votre-mot-de-passe-d-application-16-caracteres

# Email de l'administrateur (optionnel)
ADMIN_EMAIL=votre-email-admin@gmail.com
```

## 🔧 Configuration SMTP Personnalisé (Alternative)

Si vous préférez utiliser un autre fournisseur email :

```env
# Configuration SMTP personnalisé
SMTP_HOST=smtp.votre-fournisseur.com
SMTP_PORT=587
SMTP_USER=votre-email@votre-fournisseur.com
SMTP_PASS=votre-mot-de-passe
```

## 🚀 Test de la Configuration

### 1. Vérifier la connexion
Le service vérifie automatiquement la configuration au démarrage.

### 2. Tester l'envoi
Envoyez une réservation de test depuis le formulaire.

## 📧 Fonctionnalités

### Emails envoyés automatiquement :
1. **Email de confirmation au client** : Confirme la réception de la demande
2. **Email de notification à l'admin** : Vous informe d'une nouvelle réservation

### Contenu des emails :
- Détails de la réservation
- Coordonnées du client
- Message personnalisé
- Design responsive et professionnel

## 🔒 Sécurité

- Les mots de passe d'application Gmail sont sécurisés
- Validation côté serveur de toutes les données
- Nettoyage automatique des données
- Gestion d'erreurs robuste

## 🛠️ Dépannage

### Erreur "Configuration email manquante"
- Vérifiez que toutes les variables d'environnement sont définies
- Redémarrez le serveur après modification du fichier `.env`

### Erreur d'authentification Gmail
- Vérifiez que l'authentification à deux facteurs est activée
- Régénérez le mot de passe d'application
- Vérifiez que le mot de passe est correctement copié

### Emails non reçus
- Vérifiez les dossiers spam
- Testez la configuration avec un email de test
- Vérifiez les logs du serveur

## 📝 Configuration initiale

1. Configurez les variables d'environnement selon votre fournisseur email
2. Testez la configuration avec la page `/test-email`
3. Testez les formulaires de contact et de réservation

## 🎨 Personnalisation

Les templates d'emails sont dans `src/lib/server/emailService.ts` :
- `generateClientEmailHTML()` : Email client
- `generateAdminEmailHTML()` : Email admin

Vous pouvez modifier le design et le contenu selon vos besoins.

## 📞 Support

En cas de problème, vérifiez :
1. Les logs du serveur
2. La configuration des variables d'environnement
3. Les paramètres de votre compte email
