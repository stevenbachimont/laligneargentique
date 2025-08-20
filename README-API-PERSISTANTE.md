# 🚀 API Persistante pour les Balades

## 📋 **Vue d'ensemble**

Cette implémentation remplace l'ancien système basé sur des fichiers JSON par une **API persistante** utilisant **Prisma ORM** et **SQLite**. Les places disponibles sont maintenant **persistées en base de données** et fonctionnent en **production**.

## 🏗️ **Architecture**

### **Base de données**
- **SQLite** avec Prisma ORM
- **Schéma relationnel** : Balades, Consignes, Matériel, Coordonnées, Parcours, Réservations
- **Persistance automatique** des modifications

### **Services**
- `baladesPrismaService` : Gestion des balades avec Prisma
- `BaladesClientService` : Synchronisation client-serveur
- **Store Svelte** pour la réactivité

### **APIs**
- `GET /api/balades` : Récupérer toutes les balades
- `POST /api/balades/update-places` : Mettre à jour les places
- `POST /api/reservations` : Créer une réservation

## 🚀 **Installation et configuration**

### **1. Dépendances**
```bash
npm install prisma @prisma/client sqlite3
```

### **2. Configuration Prisma**
```bash
npx prisma init --datasource-provider sqlite
```

### **3. Création de la base**
```bash
npx prisma db push
```

### **4. Migration des données**
```bash
npm run migrate
```

## 🧪 **Tests**

### **Test de l'API**
```bash
npm run test:api
```

### **Tests unitaires**
```bash
npm test
```

## 📊 **Structure de la base de données**

### **Table `Balade`**
- `id`, `date`, `heure`, `lieu`, `theme`
- `placesDisponibles`, `placesInitiales`, `prix`, `description`
- Relations avec : Consignes, Matériel, Coordonnées, Parcours, Réservations

### **Table `Reservation`**
- `id`, `baladeId`, `prenom`, `nom`, `email`
- `telephone`, `dateSouhaitee`, `nombrePersonnes`, `message`
- `statut` (en_attente, confirmee, annulee)

## 🔄 **Workflow de réservation**

1. **Utilisateur clique sur "Réserver"**
2. **Formulaire de réservation** pré-rempli
3. **Validation côté client** et serveur
4. **Création de la réservation** en base
5. **Mise à jour automatique** des places disponibles
6. **Synchronisation du store** Svelte
7. **Interface mise à jour** en temps réel

## 🌐 **Déploiement en production**

### **Avantages**
✅ **Persistance des données** : Les modifications sont sauvegardées  
✅ **Fonctionne en production** : Plus de problème de fichiers en lecture seule  
✅ **Scalabilité** : Facile de migrer vers PostgreSQL/MySQL  
✅ **Sécurité** : Validation et sanitisation des données  
✅ **Performance** : Requêtes optimisées avec Prisma  

### **Configuration production**
```env
# .env.production
DATABASE_URL="file:./prod.db"
```

### **Migration vers PostgreSQL (optionnel)**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🔧 **Maintenance**

### **Réinitialiser les places**
```typescript
// Via l'API
POST /api/balades/update-places
{
  "baladeId": 1,
  "nombrePlaces": 0,
  "action": "reinitialiser"
}
```

### **Sauvegarder la base**
```bash
# SQLite
cp dev.db backup-$(date +%Y%m%d).db

# PostgreSQL
pg_dump $DATABASE_URL > backup.sql
```

## 📝 **Exemples d'utilisation**

### **Récupérer les balades**
```typescript
import { baladesPrismaService } from '$lib/services/baladesPrismaService';

const balades = await baladesPrismaService.getBalades();
```

### **Réserver des places**
```typescript
const success = await baladesPrismaService.reserverPlaces(1, 2);
```

### **Créer une réservation**
```typescript
const reservation = await baladesPrismaService.creerReservation({
  baladeId: 1,
  prenom: "Jean",
  nom: "Dupont",
  email: "jean@example.com",
  nombrePersonnes: 2,
  message: "Réservation pour 2 personnes"
});
```

## 🎯 **Prochaines étapes**

1. **Tests en production** pour valider la persistance
2. **Monitoring** des performances de la base
3. **Backup automatique** des données
4. **Migration vers PostgreSQL** si nécessaire
5. **Interface d'administration** pour gérer les balades

## 🆘 **Dépannage**

### **Problème : Base de données non trouvée**
```bash
npx prisma db push
```

### **Problème : Données corrompues**
```bash
npm run migrate
```

### **Problème : Performance lente**
- Vérifier les index de la base
- Optimiser les requêtes Prisma
- Considérer une migration vers PostgreSQL

---

**🎉 Votre API est maintenant persistante et prête pour la production !**
