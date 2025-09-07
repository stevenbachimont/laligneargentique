# 🔧 Configuration des Variables d'Environnement

## 📋 Vue d'ensemble

Le code d'accès administrateur est maintenant configuré via les variables d'environnement pour une meilleure sécurité et flexibilité.

## 🔑 Variables d'Environnement

### Variables Requises

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `ADMIN_ACCESS_CODE` | Code d'accès à l'interface d'administration | `argentique2024` |
| `EMAIL_USER` | Adresse email pour l'envoi des messages | - |
| `EMAIL_APP_PASSWORD` | Mot de passe d'application Gmail | - |
| `ADMIN_EMAIL` | Email de l'administrateur | - |
| `DATABASE_URL` | URL de la base de données SQLite | `file:./data/balades.db` |

### Variables Optionnelles

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `NODE_ENV` | Environnement (development/production) | `development` |
| `PORT` | Port du serveur | `3000` |
| `HOST` | Host du serveur | `0.0.0.0` |
| `SMTP_HOST` | Serveur SMTP alternatif | `smtp.gmail.com` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_USER` | Utilisateur SMTP | - |
| `SMTP_PASS` | Mot de passe SMTP | - |

## 🚀 Configuration Rapide

### Développement Local

1. **Script automatique** (recommandé) :
```bash
./setup-env.sh
```

2. **Configuration manuelle** :
```bash
cp env.example .env
# Éditez le fichier .env avec vos valeurs
```

### Production (Docker)

Les variables sont automatiquement configurées via le script `start.sh` :

```bash
# Variables requises dans docker-compose.yml
environment:
  - ADMIN_ACCESS_CODE=your-secure-code
  - EMAIL_USER=your-email@gmail.com
  - EMAIL_APP_PASSWORD=your-app-password
  - ADMIN_EMAIL=admin@yourdomain.com
```

## 📁 Fichiers de Configuration

### `env.example`
Template pour le développement local avec toutes les variables nécessaires.

### `env.production.example`
Template pour la production avec les variables essentielles.

### `.env` (local)
Fichier de configuration local (ignoré par Git).

## 🔐 Sécurité

### Code d'Accès Administrateur

- **Changement** : Modifiez `ADMIN_ACCESS_CODE` dans `.env`
- **Complexité** : Utilisez un code complexe en production
- **Partage** : Ne partagez le code qu'avec les administrateurs
- **Rotation** : Changez régulièrement le code

### Variables Sensibles

- **Email** : Utilisez des mots de passe d'application Gmail
- **Base de données** : Le fichier SQLite est sécurisé localement
- **Environnement** : Utilisez `NODE_ENV=production` en production

## 🛠️ Configuration Vite

Le fichier `vite.config.ts` expose la variable `ADMIN_ACCESS_CODE` côté client :

```typescript
define: {
  'import.meta.env.VITE_ADMIN_ACCESS_CODE': JSON.stringify(env.ADMIN_ACCESS_CODE)
}
```

## 📱 Utilisation dans le Code

### Côté Client (Svelte)
```typescript
const adminCode = import.meta.env.VITE_ADMIN_ACCESS_CODE || 'default-code';
```

### Côté Serveur (API)
```typescript
const adminCode = process.env.ADMIN_ACCESS_CODE || 'default-code';
```

## 🔄 Déploiement

### Docker
```bash
# Variables d'environnement dans docker-compose.yml
docker-compose up -d
```

### VPS Manuel
```bash
# Copier les fichiers de configuration
cp env.production.example .env

# Éditer avec vos valeurs
nano .env

# Lancer l'application
npm run build
npm run preview
```

## ✅ Vérification

### Test de Configuration
```bash
# Vérifier que les variables sont chargées
node -e "console.log('Admin code:', process.env.ADMIN_ACCESS_CODE)"
```

### Test de l'Interface
1. Accédez à `/admin`
2. Utilisez le code configuré dans `.env`
3. Vérifiez l'accès à l'interface d'administration

## 🚨 Dépannage

### Variables non chargées
- Vérifiez que le fichier `.env` existe
- Vérifiez la syntaxe du fichier `.env`
- Redémarrez le serveur après modification

### Code d'accès incorrect
- Vérifiez la variable `ADMIN_ACCESS_CODE` dans `.env`
- Vérifiez qu'il n'y a pas d'espaces en trop
- Utilisez le code par défaut si nécessaire

### Erreurs de build
- Vérifiez que toutes les variables requises sont définies
- Vérifiez la syntaxe dans `vite.config.ts`
- Consultez les logs d'erreur

---

## 📋 Checklist de Configuration

- [ ] Fichier `.env` créé avec les bonnes valeurs
- [ ] Code d'accès administrateur configuré
- [ ] Variables email configurées
- [ ] Serveur redémarré après configuration
- [ ] Interface d'administration accessible
- [ ] Tests de fonctionnalité effectués
