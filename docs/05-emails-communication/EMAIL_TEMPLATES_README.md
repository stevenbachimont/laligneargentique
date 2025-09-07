# Système de Templates d'Emails - La Ligne Argentique

## Vue d'ensemble

Ce système permet de gérer facilement le contenu des emails envoyés par l'application en séparant le contenu (templates) de la logique (service d'envoi).

## Structure des fichiers

- `src/lib/server/emailTemplates.json` - Contient tous les templates d'emails
- `src/lib/server/emailTemplateService.ts` - Service pour gérer les templates
- `src/lib/server/emailService.ts` - Service d'envoi d'emails (simplifié)

## Avantages

✅ **Maintenance simplifiée** : Modifiez le contenu des emails sans toucher au code
✅ **Réutilisabilité** : Templates centralisés et réutilisables
✅ **Cohérence** : Style et structure uniformes pour tous les emails
✅ **Flexibilité** : Variables dynamiques et personnalisation facile

## Comment modifier le contenu des emails

### 1. Éditer les templates

Ouvrez `src/lib/server/emailTemplates.json` et modifiez directement le contenu :

```json
{
  "argentique": {
    "client": {
      "subject": "Nouveau sujet personnalisé",
      "greeting": "Salut {prenom} !",
      "mainMessage": "Votre message personnalisé ici..."
    }
  }
}
```

### 2. Variables disponibles

Les variables sont remplacées automatiquement dans les templates :

- `{prenom}`, `{nom}` - Informations du client
- `{email}`, `{telephone}` - Coordonnées
- `{dateSouhaitee}`, `{nombrePersonnes}` - Détails de réservation
- `{theme}`, `{date}`, `{heure}`, `{lieu}` - Informations de balade
- `{montant}`, `{paymentIntentId}` - Détails de paiement

### 3. Ajouter de nouveaux templates

Pour ajouter un nouveau type d'email :

1. Ajoutez le template dans `emailTemplates.json`
2. Utilisez-le dans `emailService.ts` :

```typescript
const template = this.templateService.getTemplate('nouveauType', 'client', variables);
const html = this.templateService.generateEmailHTML(template, styles);
```

## Types d'emails disponibles

### 📧 Réservations Argentique
- **Client** : Confirmation de demande de réservation
- **Admin** : Notification de nouvelle demande

### 💳 Réservations Stripe
- **Client** : Confirmation de paiement et réservation
- **Admin** : Notification de réservation confirmée

### 📝 Contact
- **Client** : Confirmation de message reçu
- **Admin** : Notification de nouveau message

### ❓ Questions sur réservation
- **Client** : Confirmation de question
- **Admin** : Notification de question

## Styles CSS

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

## Exemple de modification

Pour changer le message de bienvenue des emails de réservation :

1. Ouvrez `emailTemplates.json`
2. Trouvez la section `argentique.client.greeting`
3. Modifiez le texte
4. Sauvegardez

Le changement sera automatiquement appliqué à tous les emails de réservation argentique.

## Bonnes pratiques

- 🔧 Testez vos modifications en envoyant un email de test
- 📝 Gardez les variables entre accolades `{variable}`
- 🎨 Respectez la structure HTML existante
- 📱 Vérifiez la compatibilité mobile des styles

## Support

En cas de problème ou question sur les templates, consultez :
- La structure des variables dans `emailService.ts`
- Les exemples existants dans `emailTemplates.json`
- La logique de génération dans `emailTemplateService.ts`
