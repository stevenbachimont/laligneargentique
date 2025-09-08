# 📸 Guide Utilisateur - Balades Archivées

## 🎯 Qu'est-ce que c'est ?

Le système de balades archivées permet de consulter l'historique des balades terminées avec photos, témoignages et détails du parcours.

## 🚀 Comment ça marche ?

### 1. **Page Principale** (`/photographie/argentique`)
- **Section "Balades programmées"** : Balades futures à réserver
- **Section "Balades passées"** : Balades terminées à consulter

### 2. **Page de Rétrospective** (`/retrospective/[id]`)
- **Statistiques** : Nombre de participants, photos, note moyenne
- **Photos** : Clichés réalisés par les participants
- **Témoignages** : Commentaires et notes des participants
- **Parcours** : Détail des étapes suivies

## 🔧 Pour les Développeurs

### **API Endpoints**

```bash
# Balades en ligne (par défaut)
GET /api/balades

# Balades futures (réservables)
GET /api/balades?type=futures

# Balades passées (archivées)
GET /api/balades?type=archivees

# Toutes les balades (admin)
GET /api/balades?admin=true
```

### **Structure des Données**

```typescript
interface Balade {
  id: number;
  date: string;
  heure: string;
  lieu: string;
  theme: string;
  placesDisponibles: number;
  prix: string;
  description: string;
  consignes: string[];
  materiel: string[];
  coordonnees: Array<{lat: number, lng: number, name: string}>;
  parcours: Array<{
    titre: string;
    description: string;
    duree: string;
    distance: string;
  }>;
  statut: 'brouillon' | 'en_ligne';
}
```

### **Méthodes du Service**

```typescript
// Récupérer les balades futures
getBaladesFutures(): Balade[]

// Récupérer les balades passées
getBaladesArchivees(): Balade[]

// Récupérer les balades en ligne
getBaladesEnLigne(): Balade[]
```

## 🧪 Tests

### **Lancer les Tests**

```bash
# Tests unitaires
npm run test:unit

# Tests spécifiques au service
npm run test:unit -- --run src/lib/server/baladesService.test.ts
```

### **Tests Inclus**

- ✅ `getBaladesFutures()` : Balades futures et en ligne
- ✅ `getBaladesArchivees()` : Balades passées
- ✅ `getBaladesEnLigne()` : Balades publiques
- ✅ Parsing sécurisé des champs JSON
- ✅ Gestion des erreurs

## 🎨 Interface Utilisateur

### **Composants Svelte**

1. **Page Principale** : `src/routes/photographie/argentique/+page.svelte`
2. **Page Rétrospective** : `src/routes/photographie/argentique/retrospective/[id]/+page.svelte`
3. **Route API** : `src/routes/api/balades/+server.ts`

### **Styles CSS**

- **Balades Futures** : Fond doré, bouton "Réserver"
- **Balades Archivées** : Fond gris, bouton "Voir la rétrospective"
- **Responsive** : Adaptation mobile et desktop

## 🚨 Dépannage

### **Erreurs Communes**

1. **"Cannot read properties of undefined"**
   - Vérifier l'import du service : `import { baladesService }`
   - Redémarrer le serveur après modifications

2. **"Photos not found"**
   - Les photos sont simulées pour l'instant
   - Créer le dossier `/static/photos/retrospective/` si nécessaire

3. **"Balades non trouvées"**
   - Vérifier que la base de données contient des balades
   - Vérifier les dates (futures vs passées)

### **Logs de Débogage**

```typescript
// Dans la console du navigateur
console.log('Balades futures:', baladesFutures);
console.log('Balades archivées:', baladesArchivees);

// Dans les logs du serveur
console.log('API appelée avec type:', type);
console.log('Nombre de balades retournées:', balades.length);
```

## 📱 Responsive Design

### **Breakpoints**

- **Mobile** : < 768px (1 colonne, boutons pleine largeur)
- **Tablet** : 768px - 1024px (grille adaptative)
- **Desktop** : > 1024px (grille multi-colonnes)

### **Adaptations**

- **Timeline** : Verticale sur mobile, horizontale sur desktop
- **Grilles** : 1 colonne mobile, 2-3 colonnes desktop
- **Boutons** : Pleine largeur mobile, largeur automatique desktop

## 🔄 Workflow de Développement

### **1. Ajouter une Nouvelle Balade**

```typescript
// Via l'interface admin
POST /api/admin/balades
{
  "theme": "Nouvelle Balade",
  "date": "2025-06-15",
  "statut": "brouillon"
}
```

### **2. Modifier le Statut**

```typescript
// Mettre en ligne
PUT /api/admin/balades/[id]
{
  "statut": "en_ligne"
}
```

### **3. Tester la Rétrospective**

```bash
# Créer une balade avec date passée
# Vérifier qu'elle apparaît dans /api/balades?type=archivees
# Tester la page de rétrospective
```

## 📊 Données Simulées

### **Photos d'Exemple**

```typescript
photos = [
  {
    id: 1,
    url: '/photos/retrospective/1.jpg',
    description: 'Vue sur la cathédrale',
    participant: 'Marie L.',
    date: '2024-06-15'
  }
];
```

### **Commentaires d'Exemple**

```typescript
commentaires = [
  {
    id: 1,
    participant: 'Marie L.',
    commentaire: 'Expérience incroyable !',
    note: 5,
    date: '2024-06-16'
  }
];
```

## 🚀 Déploiement

### **Prérequis**

- ✅ Base de données SQLite avec colonne `statut`
- ✅ Serveur Node.js avec SvelteKit
- ✅ Dossier `/static/photos/retrospective/` (optionnel)

### **Commandes**

```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Tests
npm run test:unit
```

### **Variables d'Environnement**

```bash
# .env
EMAIL_USER=contact.bachimont@gmail.com
EMAIL_APP_PASSWORD=...
ADMIN_EMAIL=contact.bachimont@gmail.com
```

## 📚 Documentation Complète

- **`SYSTEME_BALADES_ARCHIVEES.md`** : Documentation technique détaillée
- **`SYSTEME_STATUT_BALADES.md`** : Système de statut (brouillon/en ligne)
- **`ADMIN_INTERFACE.md`** : Interface d'administration

## 🎯 Prochaines Étapes

1. **Intégration de vraies photos** : Upload et gestion
2. **Système de commentaires** : Interface de saisie
3. **Partage social** : Intégration réseaux sociaux
4. **Analytics** : Suivi des consultations

---

**✅ Statut :** Prêt pour la production  
**🚀 Version :** 1.0.0  
**📅 Dernière mise à jour :** Décembre 2024
