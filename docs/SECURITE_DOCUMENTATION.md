# 🔒 Sécurité de la Documentation

## ⚠️ **IMPORTANT - Données Sensibles**

Cette documentation est **publique** et sera déployée sur GitHub Pages. **NE JAMAIS** inclure de données sensibles.

## 🚫 **À NE JAMAIS INCLURE**

### Clés et Secrets
```bash
# ❌ INTERDIT
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_ACCESS_CODE=mon_code_reel
EMAIL_APP_PASSWORD=mon_mot_de_passe_reel
```

### Emails Personnels
```bash
# ❌ INTERDIT
EMAIL_USER=mon.email@gmail.com
ADMIN_EMAIL=mon.email.personnel@gmail.com
```

### Informations de Connexion
```bash
# ❌ INTERDIT
VPS_HOST=mon.serveur.com
VPS_USER=mon_utilisateur
VPS_SSH_KEY=ma_cle_privee
```

## ✅ **Format Correct**

### Utiliser des Placeholders
```bash
# ✅ CORRECT
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
ADMIN_ACCESS_CODE=votre_code_securise
EMAIL_APP_PASSWORD=votre_mot_de_passe_app
EMAIL_USER=votre-email@gmail.com
ADMIN_EMAIL=votre-email-admin@gmail.com
```

## 🔍 **Vérifications Avant Commit**

### Checklist de Sécurité
- [ ] Aucune clé Stripe réelle (`sk_live_`, `pk_live_`)
- [ ] Aucun mot de passe réel
- [ ] Aucun email personnel
- [ ] Aucun code d'accès réel
- [ ] Aucune adresse IP ou hostname réel
- [ ] Aucune clé SSH ou token

### Commandes de Vérification
```bash
# Rechercher des données sensibles
grep -r "sk_live\|pk_live\|whsec_" docs/
grep -r "@gmail.com\|@yahoo.com" docs/
grep -r "password\|secret\|key" docs/
```

## 🛡️ **Bonnes Pratiques**

### 1. Utiliser des Variables d'Environnement
```bash
# Dans la documentation
EMAIL_USER=${EMAIL_USER}
ADMIN_ACCESS_CODE=${ADMIN_ACCESS_CODE}
```

### 2. Exemples Génériques
```bash
# Exemple de configuration
STRIPE_SECRET_KEY=sk_live_remplacez_par_votre_cle
EMAIL_USER=remplacez@par-votre-email.com
```

### 3. Documentation des Secrets
```markdown
## Configuration des Secrets

**⚠️ Important** : Remplacez les valeurs suivantes par vos vraies données :

- `STRIPE_SECRET_KEY` : Votre clé secrète Stripe
- `EMAIL_USER` : Votre adresse email
- `ADMIN_ACCESS_CODE` : Votre code d'accès admin
```

## 🚨 **En Cas d'Exposition Accidentelle**

### Actions Immédiates
1. **Changer immédiatement** tous les secrets exposés
2. **Révoquer** les clés API exposées
3. **Nettoyer** la documentation
4. **Vérifier** l'historique Git

### Prévention
- **Review systématique** avant commit
- **Tests automatiques** de détection de secrets
- **Formation** de l'équipe sur la sécurité

---

**💡 Conseil** : En cas de doute, utilisez toujours des placeholders génériques plutôt que des données réelles.
