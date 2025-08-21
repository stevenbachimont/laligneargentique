# 🔐 Interface d'Administration

## 📋 Vue d'ensemble

L'interface d'administration permet de gérer les balades et les réservations directement depuis le site web, avec une authentification sécurisée par code.

## 🔑 Accès

- **URL :** `https://votre-domaine.com/admin`
- **Code d'accès :** Configuré dans le fichier `.env` (variable `ADMIN_ACCESS_CODE`)


## 🎯 Fonctionnalités

### 🔐 Authentification
- **Sécurisé** : Code d'accès requis
- **Session** : Maintien de la session pendant la navigation
- **Déconnexion** : Bouton de déconnexion disponible

### 📋 Gestion des Balades (`/admin/balades`)

#### Ajouter une balade
- ✅ **Thème** : Nom de la balade
- ✅ **Date** : Date de la balade (YYYY-MM-DD)
- ✅ **Heure** : Heure de départ (HH:MM)
- ✅ **Lieu** : Lieu de rendez-vous
- ✅ **Prix** : Tarif de la balade
- ✅ **Places** : Nombre de places disponibles
- ✅ **Description** : Description détaillée

#### Modifier une balade
- ✏️ **Édition** : Modification de tous les champs
- ✏️ **Validation** : Vérification des données
- ✏️ **Sauvegarde** : Mise à jour en temps réel

#### Supprimer une balade
- 🗑️ **Confirmation** : Demande de confirmation
- 🗑️ **Cascade** : Suppression des réservations associées
- 🗑️ **Sécurisé** : Action irréversible

### 📅 Gestion des Réservations (`/admin/reservations`)

#### Visualisation
- 👥 **Liste** : Toutes les réservations
- 📊 **Statistiques** : Nombre total et affichées
- 🔍 **Recherche** : Par nom, email ou thème

#### Détails des réservations
- 👤 **Participant** : Nom, prénom, email
- 📅 **Date** : Date et heure de création
- 🎯 **Balade** : Thème, date, heure
- 👥 **Personnes** : Nombre de participants
- 💬 **Message** : Message optionnel du client

#### Actions
- 🗑️ **Suppression** : Supprimer une réservation
- 🔍 **Filtrage** : Recherche en temps réel

## 🎨 Interface Utilisateur

### Design
- 🎨 **Thème sombre** : Interface moderne et élégante
- 📱 **Responsive** : Compatible mobile et desktop
- ⚡ **Animations** : Transitions fluides
- 🎯 **Intuitif** : Navigation claire et simple

### Navigation
- 🏠 **Accueil admin** : Page principale avec actions rapides
- 📋 **Gestion balades** : Interface complète de gestion
- 📅 **Gestion réservations** : Liste et actions sur les réservations
- 👁️ **Voir le site** : Accès au site public

## 🔧 API Endpoints

### Balades
- `GET /api/balades` : Récupérer toutes les balades
- `POST /api/admin/balades` : Créer une nouvelle balade
- `PUT /api/admin/balades/[id]` : Modifier une balade
- `DELETE /api/admin/balades/[id]` : Supprimer une balade

### Réservations
- `GET /api/admin/reservations` : Récupérer toutes les réservations
- `DELETE /api/admin/reservations/[id]` : Supprimer une réservation

## 🛡️ Sécurité

### Authentification
- 🔐 **Code unique** : Code d'accès administrateur
- 🚪 **Session** : Maintien de l'authentification
- 🚪 **Déconnexion** : Fermeture de session

### Validation
- ✅ **Données** : Validation côté client et serveur
- ✅ **Confirmation** : Actions destructives confirmées
- ✅ **Erreurs** : Messages d'erreur explicites

## 📱 Responsive Design

### Mobile
- 📱 **Adaptatif** : Interface optimisée mobile
- 👆 **Touch-friendly** : Boutons et interactions adaptés
- 📏 **Layout** : Grilles et formulaires responsives

### Desktop
- 🖥️ **Largeur** : Utilisation optimale de l'espace
- 🖱️ **Hover** : Effets au survol
- ⌨️ **Clavier** : Navigation au clavier

## 🚀 Utilisation

### Première connexion
1. Accédez à `/admin`
2. Saisissez le code : `argentique2024`
3. Cliquez sur "Accéder à l'administration"

### Gestion des balades
1. Cliquez sur "Gestion des balades"
2. Utilisez "Ajouter une balade" pour créer
3. Cliquez "Modifier" sur une balade existante
4. Cliquez "Supprimer" pour supprimer

### Gestion des réservations
1. Cliquez sur "Gestion des réservations"
2. Utilisez la barre de recherche pour filtrer
3. Consultez les détails de chaque réservation
4. Supprimez si nécessaire

## 🔄 Maintenance

### Code d'accès
- **Changement** : Modifiez `ADMIN_ACCESS_CODE` dans le fichier `.env`
- **Sécurité** : Changez régulièrement le code
- **Partage** : Partagez uniquement avec les administrateurs
- **Déploiement** : Le code est configuré via les variables d'environnement

### Sauvegarde
- 💾 **Base de données** : Sauvegardez `data/balades.db`
- 📁 **Fichiers** : Sauvegardez les fichiers de configuration
- 🔄 **Régulier** : Effectuez des sauvegardes régulières

---

## ✅ Avantages

- 🎯 **Simple** : Interface intuitive et facile à utiliser
- 🔐 **Sécurisé** : Authentification par code
- 📱 **Mobile** : Accessible depuis n'importe quel appareil
- ⚡ **Rapide** : Actions en temps réel
- 🎨 **Moderne** : Design élégant et professionnel
- 🔄 **Maintenable** : Code propre et documenté
