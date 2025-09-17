# 🗄️ Gestion des Données et Déploiement

## 📋 Vue d'ensemble

Ce document explique comment gérer la persistance des données lors des déploiements et éviter la perte de données.

## 🔧 Configuration des Volumes Persistants

### Docker Compose
Le fichier `docker-compose.yml` a été modifié pour inclure des volumes persistants :

```yaml
volumes:
  # Volume persistant pour la base de données SQLite
  - laligneargentique_data:/app/data
  # Volume pour les logs (optionnel)
  - laligneargentique_logs:/app/logs
```

### Volumes Docker
```yaml
volumes:
  laligneargentique_data:
    driver: local
  laligneargentique_logs:
    driver: local
```

## 🚀 Déploiement Sécurisé

### Script de Déploiement Automatique
Utilisez le script `deploy-secure.sh` pour un déploiement sécurisé :

```bash
./scripts/deploy-secure.sh
```

Ce script :
1. ✅ Sauvegarde automatiquement la base de données
2. 🔨 Construit la nouvelle image
3. 🔄 Redémarre avec les volumes persistants
4. 🔍 Vérifie le bon fonctionnement

### Déploiement Manuel
Si vous préférez un déploiement manuel :

```bash
# 1. Sauvegarder (optionnel mais recommandé)
./scripts/backup-database.sh

# 2. Arrêter les conteneurs
docker-compose down

# 3. Construire la nouvelle image
docker-compose build --no-cache

# 4. Redémarrer avec volumes persistants
docker-compose up -d
```

## 💾 Sauvegarde et Restauration

### Sauvegarde Automatique
```bash
./scripts/backup-database.sh
```

- Crée une sauvegarde dans `./backups/`
- Format : `balades_backup_YYYYMMDD_HHMMSS.db`
- Garde automatiquement les 10 dernières sauvegardes

### Restauration
```bash
./scripts/restore-database.sh backups/balades_backup_20241201_143022.db
```

⚠️ **Attention** : La restauration remplace complètement la base de données actuelle.

### Sauvegarde Manuelle
```bash
# Copier la base depuis le conteneur
docker cp laligneargentiques:/app/data/balades.db ./ma_sauvegarde.db

# Ou depuis un volume Docker
docker run --rm -v laligneargentique_data:/data -v $(pwd):/backup alpine cp /data/balades.db /backup/
```

## 🔍 Vérification des Données

### Vérifier que les volumes sont montés
```bash
docker inspect laligneargentiques | grep -A 10 "Mounts"
```

### Accéder à la base de données
```bash
# Entrer dans le conteneur
docker exec -it laligneargentiques sh

# Vérifier la base de données
ls -la /app/data/
sqlite3 /app/data/balades.db ".tables"
```

### Vérifier les volumes Docker
```bash
# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect laligneargentique_data
```

## 🚨 Gestion des Erreurs

### Problème : Données perdues après déploiement
**Cause** : Volumes non montés ou conteneur recréé sans volumes

**Solution** :
1. Vérifier que les volumes sont dans `docker-compose.yml`
2. Utiliser `docker-compose down` puis `docker-compose up -d`
3. Ne jamais utiliser `docker-compose up --force-recreate`

### Problème : Conteneur ne démarre pas
**Cause** : Problème de permissions ou de volumes

**Solution** :
```bash
# Vérifier les logs
docker-compose logs app

# Nettoyer et redémarrer
docker-compose down -v
docker-compose up -d
```

### Problème : Base de données corrompue
**Solution** :
1. Arrêter le conteneur : `docker-compose stop app`
2. Restaurer depuis une sauvegarde : `./scripts/restore-database.sh <fichier>`
3. Redémarrer : `docker-compose up -d app`

## 📊 Monitoring des Données

### Vérifier l'état de la base
```bash
# Compter les balades
docker exec laligneargentiques sqlite3 /app/data/balades.db "SELECT COUNT(*) FROM balades;"

# Compter les réservations
docker exec laligneargentiques sqlite3 /app/data/balades.db "SELECT COUNT(*) FROM reservations;"

# Voir les dernières réservations
docker exec laligneargentiques sqlite3 /app/data/balades.db "SELECT * FROM reservations ORDER BY created_at DESC LIMIT 5;"
```

### Logs de l'application
```bash
# Voir les logs en temps réel
docker-compose logs -f app

# Voir les logs des dernières 100 lignes
docker-compose logs --tail=100 app
```

## 🔄 Migration et Mise à Jour

### Mise à jour de la structure de la base
Les migrations sont gérées automatiquement dans `database.ts`. Si vous ajoutez de nouvelles colonnes :

1. Modifiez le fichier `database.ts`
2. Ajoutez les migrations avec `ALTER TABLE`
3. Testez en local
4. Déployez avec `./scripts/deploy-secure.sh`

### Exemple de migration
```sql
-- Ajouter une nouvelle colonne
ALTER TABLE balades ADD COLUMN nouvelle_colonne TEXT DEFAULT 'valeur_par_defaut';
```

## 📚 Commandes Utiles

### Gestion des conteneurs
```bash
# Voir l'état des conteneurs
docker-compose ps

# Redémarrer un service
docker-compose restart app

# Voir les logs
docker-compose logs -f app

# Arrêter proprement
docker-compose down

# Arrêter et supprimer les volumes (⚠️ DANGEREUX)
docker-compose down -v
```

### Gestion des volumes
```bash
# Lister les volumes
docker volume ls

# Supprimer un volume (⚠️ DANGEREUX)
docker volume rm laligneargentique_data

# Nettoyer les volumes inutilisés
docker volume prune
```

### Sauvegarde et restauration
```bash
# Sauvegarde automatique
./scripts/backup-database.sh

# Restauration
./scripts/restore-database.sh <fichier>

# Déploiement sécurisé
./scripts/deploy-secure.sh
```

## ⚠️ Bonnes Pratiques

1. **Toujours sauvegarder** avant un déploiement important
2. **Tester en local** avant de déployer en production
3. **Utiliser les volumes persistants** pour toutes les données importantes
4. **Surveiller les logs** après chaque déploiement
5. **Garder plusieurs sauvegardes** récentes
6. **Ne jamais supprimer les volumes** sans sauvegarde

---

**🎯 Résultat** : Vos données sont maintenant persistantes et sécurisées lors des déploiements !
