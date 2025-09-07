# 🔧 Dépannage GitHub Pages - Erreur 404

## 🚨 **Problème : Documentation retourne 404 sur GitHub Pages**

### ✅ **Vérifications Effectuées**
- ✅ Configuration Docsify correcte
- ✅ Fichiers requis présents (index.html, _404.md, README.md)
- ✅ Structure des dossiers valide
- ✅ Fichier .nojekyll présent
- ✅ GitHub Actions configuré

## 🔍 **Causes Possibles et Solutions**

### 1. **GitHub Pages Non Activé**
**Symptôme** : 404 sur toutes les pages
**Solution** :
1. Aller dans **Settings** du repository
2. Scroller vers **Pages** dans le menu de gauche
3. Sous **Source**, sélectionner **GitHub Actions**
4. Sauvegarder

### 2. **Déploiement en Cours**
**Symptôme** : 404 temporaire
**Solution** :
1. Aller dans l'onglet **Actions** du repository
2. Vérifier que le workflow "Déploiement Documentation GitHub Pages" est en cours
3. Attendre la fin du déploiement (2-5 minutes)

### 3. **URL Incorrecte**
**Symptôme** : 404 sur l'URL principale
**URLs Correctes** :
- ✅ `https://stevenbachimont.github.io/monsite/docs/`
- ❌ `https://stevenbachimont.github.io/monsite/`

### 4. **Cache du Navigateur**
**Symptôme** : 404 persistant malgré un déploiement réussi
**Solution** :
1. Vider le cache du navigateur (Ctrl+F5)
2. Tester en navigation privée
3. Tester sur un autre navigateur

### 5. **Problème de Configuration basePath**
**Symptôme** : 404 sur les liens internes
**Solution** : La configuration est déjà corrigée avec :
```javascript
// Configuration conditionnelle pour GitHub Pages
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  window.$docsify.basePath = '/docs';
}
```

## 🧪 **Tests de Diagnostic**

### Test 1 : Vérifier le Déploiement
```bash
# Vérifier que GitHub Actions a réussi
curl -I https://stevenbachimont.github.io/monsite/docs/
```

### Test 2 : Vérifier les Fichiers Statiques
```bash
# Tester l'accès direct aux fichiers
curl -I https://stevenbachimont.github.io/monsite/docs/README.md
curl -I https://stevenbachimont.github.io/monsite/docs/_404.md
```

### Test 3 : Vérifier la Configuration
```bash
# Vérifier que le fichier index.html est accessible
curl -I https://stevenbachimont.github.io/monsite/docs/index.html
```

## 🚀 **Actions Correctives**

### Si GitHub Pages n'est pas activé :
1. **Settings** → **Pages**
2. **Source** → **GitHub Actions**
3. **Save**

### Si le déploiement échoue :
1. **Actions** → Voir les logs d'erreur
2. Corriger les erreurs identifiées
3. Relancer le workflow

### Si l'URL est incorrecte :
- Utiliser : `https://stevenbachimont.github.io/monsite/docs/`
- Pas : `https://stevenbachimont.github.io/monsite/`

## 📊 **Statut du Déploiement**

### Vérifier le Statut
1. Aller sur : https://github.com/stevenbachimont/monsite/actions
2. Chercher le workflow "Déploiement Documentation GitHub Pages"
3. Vérifier que le dernier déploiement est vert ✅

### Logs de Déploiement
Si le déploiement échoue, consulter les logs pour identifier l'erreur :
- **Build** : Vérification de la structure
- **Deploy** : Upload vers GitHub Pages

## 🔄 **Redéploiement Manuel**

### Via GitHub Actions
1. Aller dans **Actions**
2. Sélectionner "Déploiement Documentation GitHub Pages"
3. Cliquer sur **Run workflow**
4. Sélectionner la branche `steven2`
5. Cliquer sur **Run workflow**

### Via Git Push
```bash
# Faire un petit changement pour déclencher le déploiement
git add .
git commit -m "Trigger GitHub Pages deployment"
git push origin steven2
```

## 📞 **Support**

### Si le problème persiste :
1. **Vérifier les logs GitHub Actions** pour des erreurs spécifiques
2. **Tester l'URL** dans différents navigateurs
3. **Attendre 10-15 minutes** après activation de GitHub Pages
4. **Vérifier les permissions** du repository

### URLs de Test
- **Documentation** : https://stevenbachimont.github.io/monsite/docs/
- **Actions** : https://github.com/stevenbachimont/monsite/actions
- **Settings** : https://github.com/stevenbachimont/monsite/settings/pages

---

**💡 Conseil** : La plupart des problèmes 404 sur GitHub Pages sont dus à une configuration incorrecte ou à un déploiement en cours. Vérifiez d'abord ces points avant de chercher des causes plus complexes.
