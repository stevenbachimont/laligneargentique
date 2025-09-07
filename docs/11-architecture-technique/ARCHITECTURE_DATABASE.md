# 🗄️ Architecture Base de Données

## 📋 Vue d'ensemble

Cette section détaille l'architecture de la base de données, incluant le schéma, les relations et les optimisations.

## 🗄️ Schéma Principal

### Table des Balades
```sql
CREATE TABLE balades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme TEXT NOT NULL,
  date TEXT NOT NULL,
  heure TEXT NOT NULL,
  lieu TEXT NOT NULL,
  prix TEXT NOT NULL,
  places_disponibles INTEGER NOT NULL,
  description TEXT NOT NULL,
  consignes TEXT NOT NULL,        -- JSON array
  materiel TEXT NOT NULL,         -- JSON array
  coordonnees TEXT NOT NULL,      -- JSON array
  parcours TEXT NOT NULL,         -- JSON array
  statut TEXT DEFAULT 'en_ligne'
);
```

### Table des Réservations
```sql
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  balade_id INTEGER NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  nombre_personnes INTEGER NOT NULL,
  message TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (balade_id) REFERENCES balades(id)
);
```

## 🔗 Relations

### Relations Principales
- **balades** ↔ **reservations** : Relation 1:N
- **Champs JSON** : Structure flexible pour les données complexes
- **Index** : Optimisation des requêtes fréquentes

### Contraintes
- **Clés étrangères** : Intégrité référentielle
- **Contraintes NOT NULL** : Données obligatoires
- **Valeurs par défaut** : Statut par défaut

## 📊 Optimisations

### Index
```sql
-- Index sur les requêtes fréquentes
CREATE INDEX idx_balades_statut ON balades(statut);
CREATE INDEX idx_balades_date ON balades(date);
CREATE INDEX idx_reservations_balade_id ON reservations(balade_id);
CREATE INDEX idx_reservations_email ON reservations(email);
```

### Requêtes Optimisées
- **Pagination** : LIMIT et OFFSET
- **Filtrage** : WHERE avec index
- **Jointures** : INNER JOIN optimisées

## 🔧 Gestion des Données JSON

### Structure des Champs JSON
```json
{
  "consignes": ["Consigne 1", "Consigne 2"],
  "materiel": ["Matériel 1", "Matériel 2"],
  "coordonnees": {
    "latitude": 48.8566,
    "longitude": 2.3522
  },
  "parcours": [
    {
      "etape": 1,
      "description": "Départ",
      "duree": "30 min"
    }
  ]
}
```

### Requêtes JSON
```sql
-- Recherche dans les coordonnées
SELECT * FROM balades 
WHERE json_extract(coordonnees, '$.latitude') > 48.0;

-- Filtrage par matériel
SELECT * FROM balades 
WHERE json_extract(materiel, '$[0]') = 'Matériel 1';
```

## 🔄 Migrations

### Script de Migration
```sql
-- Migration pour ajouter un champ
ALTER TABLE balades ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP;

-- Migration pour modifier un champ
UPDATE balades SET statut = 'en_ligne' WHERE statut IS NULL;
```

### Versioning
- **Numérotation** : v1, v2, v3...
- **Rollback** : Scripts de retour en arrière
- **Validation** : Tests de migration

## 📦 Sauvegarde et Restauration

### Sauvegarde
```bash
# Sauvegarde complète
sqlite3 balades.db ".backup backup.db"

# Sauvegarde avec compression
sqlite3 balades.db ".backup backup.db" && gzip backup.db
```

### Restauration
```bash
# Restauration depuis une sauvegarde
sqlite3 balades.db < backup.sql

# Restauration depuis un fichier compressé
gunzip -c backup.db.gz | sqlite3 balades.db
```

## 🔍 Requêtes Types

### Balades Disponibles
```sql
SELECT * FROM balades 
WHERE statut = 'en_ligne' 
AND places_disponibles > 0 
ORDER BY date ASC;
```

### Réservations par Balade
```sql
SELECT b.theme, COUNT(r.id) as nb_reservations
FROM balades b
LEFT JOIN reservations r ON b.id = r.balade_id
GROUP BY b.id, b.theme;
```

### Statistiques
```sql
SELECT 
  COUNT(*) as total_balades,
  COUNT(CASE WHEN statut = 'en_ligne' THEN 1 END) as balades_actives,
  AVG(places_disponibles) as moyenne_places
FROM balades;
```

---

**💡 Conseil** : Cette architecture de base de données est optimisée pour les performances et la flexibilité des données.
