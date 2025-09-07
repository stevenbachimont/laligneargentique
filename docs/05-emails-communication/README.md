# 📧 Emails & Communication

## 📋 Vue d'ensemble

Cette section contient toute la documentation relative au système d'emails et de communication, incluant les templates et la configuration.

## 📚 Documentation Disponible

### 📝 Templates d'Emails
- **[EMAIL_TEMPLATES_README.md](./EMAIL_TEMPLATES_README.md)** - Guide complet des templates d'emails
  - Structure des templates
  - Variables disponibles
  - Modification du contenu
  - Types d'emails disponibles

### ⚙️ Configuration Email
- **[README-EMAIL-SETUP.md](./README-EMAIL-SETUP.md)** - Configuration du système d'emails
  - Variables d'environnement
  - Configuration Gmail
  - Configuration SMTP personnalisé
  - Dépannage

## 🎯 Fonctionnalités Principales

### ✅ Système de Templates
- **Maintenance simplifiée** : Modifiez le contenu sans toucher au code
- **Réutilisabilité** : Templates centralisés et réutilisables
- **Cohérence** : Style et structure uniformes
- **Flexibilité** : Variables dynamiques et personnalisation

### ✅ Types d'Emails Disponibles
- **Réservations Argentique** : Confirmation client et notification admin
- **Réservations Stripe** : Confirmation de paiement et réservation
- **Contact** : Confirmation de message reçu
- **Questions sur réservation** : Confirmation de question

## 🔧 Structure des Fichiers

```
src/lib/server/
├── emailTemplates.json      # Contient tous les templates d'emails
├── emailTemplateService.ts  # Service pour gérer les templates
└── emailService.ts          # Service d'envoi d'emails (simplifié)
```

## 📝 Variables Disponibles

Les variables sont remplacées automatiquement dans les templates :

- `{prenom}`, `{nom}` - Informations du client
- `{email}`, `{telephone}` - Coordonnées
- `{dateSouhaitee}`, `{nombrePersonnes}` - Détails de réservation
- `{theme}`, `{date}`, `{heure}`, `{lieu}` - Informations de balade
- `{montant}`, `{paymentIntentId}` - Détails de paiement

## 🎨 Styles CSS

Les styles sont centralisés dans la section `styles` du fichier JSON :

```json
{
  "styles": {
    "header": "background: linear-gradient(135deg, #000000, #1a1a1a); color: #ffd700;",
    "highlight": "background: #ffd700; color: #000;",
    "success": "background: #d4edda; color: #155724;"
  }
}
```

## ⚙️ Configuration

### Variables d'Environnement
```bash
# Configuration Gmail (recommandé)
EMAIL_USER=votre-email@gmail.com
EMAIL_APP_PASSWORD=votre-mot-de-passe-d-application
ADMIN_EMAIL=votre-email-admin@gmail.com

# Ou configuration SMTP personnalisé
SMTP_HOST=smtp.votre-fournisseur.com
SMTP_PORT=587
SMTP_USER=votre-email@votre-fournisseur.com
SMTP_PASS=votre-mot-de-passe
```

## 🚀 Utilisation

### Modification des Templates
1. Ouvrez `src/lib/server/emailTemplates.json`
2. Modifiez le contenu souhaité
3. Sauvegardez le fichier
4. Le changement est automatiquement appliqué

### Ajout de Nouveaux Templates
1. Ajoutez le template dans `emailTemplates.json`
2. Utilisez-le dans `emailService.ts` :
```typescript
const template = this.templateService.getTemplate('nouveauType', 'client', variables);
const html = this.templateService.generateEmailHTML(template, styles);
```

## 🧪 Tests

### Test de Connexion Email
```bash
# Tester la connexion email
curl -X POST "http://localhost:3000/api/test-email-connection"
```

### Test d'Envoi d'Email
```bash
# Tester l'envoi d'un email
curl -X POST "http://localhost:3000/api/test-email" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","message":"Message de test"}'
```

## 🚨 Dépannage

### Erreurs Communes
1. **"Invalid login"**
   - Vérifier les identifiants Gmail
   - Utiliser un mot de passe d'application

2. **"Connection timeout"**
   - Vérifier la configuration SMTP
   - Vérifier les ports et serveurs

3. **"Template not found"**
   - Vérifier la structure du fichier JSON
   - Vérifier les noms des templates

## 🛡️ Bonnes Pratiques

### Sécurité
- 🔧 Utilisez des mots de passe d'application pour Gmail
- 📝 Gardez les variables entre accolades `{variable}`
- 🎨 Respectez la structure HTML existante
- 📱 Vérifiez la compatibilité mobile des styles

### Maintenance
- Testez vos modifications en envoyant un email de test
- Sauvegardez les templates avant modification
- Documentez les nouveaux templates
- Surveillez les logs d'envoi

---

**💡 Conseil** : Commencez par le `EMAIL_TEMPLATES_README.md` pour comprendre le système de templates.
