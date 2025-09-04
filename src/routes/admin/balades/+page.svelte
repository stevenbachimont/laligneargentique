<script lang="ts">
  import { onMount } from 'svelte';
  import type { Balade } from '$lib/server/baladesService';
  import AdminAuth from '$lib/components/AdminAuth.svelte';

  // Types pour les étapes du parcours
  interface EtapeParcours {
    id: number;
    titre: string;
    description: string;
    latitude: number;
    longitude: number;
    ordre: number;
  }

  interface CoordonneeGPS {
    latitude: number;
    longitude: number;
  }

  let balades: Balade[] = [];
  let isLoading = true;
  let errorMessage = '';
  let successMessage = '';
  let isVisible = false;
  let selectedBalade: Balade | null = null;
  let isEditing = false;
  let isAdding = false;
  let isEditingParcours = false;

  // Variables pour le tri et la séparation
  let baladesFutures: Balade[] = [];
  let baladesPassees: Balade[] = [];
  let baladesParAnnee: { [annee: string]: Balade[] } = {};

  // Formulaire pour ajouter/modifier une balade
  let baladeForm = {
    theme: '',
    date: '',
    heure: '',
    lieu: '',
    prix: '',
    placesDisponibles: 5,
    description: '',
    statut: 'brouillon', // 'brouillon' ou 'en_ligne'
    type: 'payante' // 'payante' ou 'invitation'
  };

  // Gestion du parcours
  let parcoursEtapes: EtapeParcours[] = [];
  let currentEtape: EtapeParcours | null = null;
  let isAddingEtape = false;
  let isEditingEtape = false;

  // Variables réactives pour le formulaire d'étape
  let etapeTitre = '';
  let etapeDescription = '';
  let etapeLatitude = 0;
  let etapeLongitude = 0;
  let etapeOrdre = 1;

  onMount(async () => {
    await loadBalades();
    setTimeout(() => { isVisible = true; }, 100);
  });

  async function loadBalades() {
    try {
      isLoading = true;
      
      // Récupérer le token de session
      const sessionToken = sessionStorage.getItem('admin_session_token');
      if (!sessionToken) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        window.location.href = '/admin';
        return;
      }

      const response = await fetch('/api/balades?admin=true', {
        headers: {
          'X-Admin-Session': sessionToken
        }
      });
      const data = await response.json();
      
      if (data.success) {
        balades = data.balades;
        trierEtSeparerBalades();
      } else {
        errorMessage = 'Erreur lors du chargement des balades';
      }
    } catch (error) {
      errorMessage = 'Erreur lors du chargement des balades';
    } finally {
      isLoading = false;
    }
  }

  function trierEtSeparerBalades() {
    const aujourdhui = new Date();
    const aujourdhuiStr = aujourdhui.toISOString().split('T')[0];

    // Séparer les balades futures et passées
    baladesFutures = balades.filter(balade => balade.date >= aujourdhuiStr)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    baladesPassees = balades.filter(balade => balade.date < aujourdhuiStr)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Classer par années
    baladesParAnnee = {};
    
    // Balades futures par année
    baladesFutures.forEach(balade => {
      const annee = new Date(balade.date).getFullYear().toString();
      if (!baladesParAnnee[annee]) {
        baladesParAnnee[annee] = [];
      }
      baladesParAnnee[annee].push(balade);
    });

    // Balades passées par année
    baladesPassees.forEach(balade => {
      const annee = new Date(balade.date).getFullYear().toString();
      if (!baladesParAnnee[annee]) {
        baladesParAnnee[annee] = [];
      }
      baladesParAnnee[annee].push(balade);
    });
  }

  // Fonctions pour la gestion des balades
  function addBalade() {
    isAdding = true;
    isEditing = false;
    selectedBalade = null;
    resetForm();
  }

  function editBalade(balade: Balade) {
    // Empêcher la modification des balades passées
    const aujourdhui = new Date();
    const baladeDate = new Date(balade.date);
    
    if (baladeDate < aujourdhui) {
      errorMessage = 'Impossible de modifier une balade passée. Utilisez la fonction "Copier" pour créer une nouvelle balade basée sur celle-ci.';
      setTimeout(() => { errorMessage = ''; }, 5000);
      return;
    }

    isEditing = true;
    isAdding = false;
    selectedBalade = balade;
    
    baladeForm = {
      theme: balade.theme,
      date: balade.date,
      heure: balade.heure,
      lieu: balade.lieu,
      prix: balade.prix,
      placesDisponibles: balade.placesDisponibles,
      description: balade.description,
      statut: balade.statut,
      type: balade.type || 'payante'
    };
  }

  function copyBalade(balade: Balade) {
    isAdding = true;
    isEditing = false;
    selectedBalade = null;
    
    // Copier les données de la balade existante
    baladeForm = {
      theme: balade.theme,
      date: '', // Laisser vide pour que l'utilisateur choisisse une nouvelle date
      heure: balade.heure,
      lieu: balade.lieu,
      prix: balade.prix,
      placesDisponibles: balade.placesDisponibles,
      description: balade.description,
      statut: 'brouillon', // Toujours en brouillon par défaut
      type: balade.type || 'payante'
    };

    // Copier aussi le parcours et les coordonnées pour les réutiliser
    if (balade.parcours && Array.isArray(balade.parcours)) {
      parcoursEtapes = balade.parcours.map((etape: any, index: number) => {
        let latitude = 0;
        let longitude = 0;
        
        if (balade.coordonnees && Array.isArray(balade.coordonnees) && balade.coordonnees[index]) {
          const coord = balade.coordonnees[index] as any;
          if (coord.lat !== undefined && coord.lng !== undefined) {
            latitude = coord.lat;
            longitude = coord.lng;
          } else if (coord.latitude !== undefined && coord.longitude !== undefined) {
            latitude = coord.latitude;
            longitude = coord.longitude;
          }
        }
        
        return {
          id: index + 1,
          titre: etape.titre || '',
          description: etape.description || '',
          latitude: latitude,
          longitude: longitude,
          ordre: index + 1
        };
      });
    }

    successMessage = `Balade "${balade.theme}" copiée avec succès ! Vous pouvez maintenant modifier les détails et choisir une nouvelle date.`;
    setTimeout(() => { successMessage = ''; }, 5000);
  }

  function viewBaladeDetails(balade: Balade) {
    // Afficher les détails de la balade passée en lecture seule
    selectedBalade = balade;
    isEditingParcours = true; // Réutiliser l'interface de parcours en mode lecture seule
    
    // Charger le parcours existant
    if (balade.parcours && Array.isArray(balade.parcours)) {
      parcoursEtapes = balade.parcours.map((etape: any, index: number) => {
        let latitude = 0;
        let longitude = 0;
        
        if (balade.coordonnees && Array.isArray(balade.coordonnees) && balade.coordonnees[index]) {
          const coord = balade.coordonnees[index] as any;
          if (coord.lat !== undefined && coord.lng !== undefined) {
            latitude = coord.lat;
            longitude = coord.lng;
          } else if (coord.latitude !== undefined && coord.longitude !== undefined) {
            latitude = coord.latitude;
            longitude = coord.longitude;
          }
        }
        
        return {
          id: index + 1,
          titre: etape.titre || '',
          description: etape.description || '',
          latitude: latitude,
          longitude: longitude,
          ordre: index + 1
        };
      });
    } else {
      parcoursEtapes = [];
    }
  }

  function cancelEdit() {
    isEditing = false;
    isAdding = false;
    selectedBalade = null;
    resetForm();
  }

  function resetForm() {
    baladeForm = {
      theme: '',
      date: '',
      heure: '',
      lieu: '',
      prix: '',
      placesDisponibles: 5,
      description: '',
      statut: 'brouillon',
      type: 'payante'
    };
  }

  // Fonctions pour la gestion du parcours
  function editParcours(balade: Balade) {
    // Empêcher la modification du parcours des balades passées
    const aujourdhui = new Date();
    const baladeDate = new Date(balade.date);
    
    if (baladeDate < aujourdhui) {
      errorMessage = 'Impossible de modifier le parcours d\'une balade passée. Utilisez la fonction "Copier" pour créer une nouvelle balade basée sur celle-ci.';
      setTimeout(() => { errorMessage = ''; }, 5000);
      return;
    }

    isEditingParcours = true;
    selectedBalade = balade;
    
    // Charger le parcours existant
    if (balade.parcours && Array.isArray(balade.parcours)) {
      parcoursEtapes = balade.parcours.map((etape: any, index: number) => {
        // Récupérer les coordonnées correspondantes
        let latitude = 0;
        let longitude = 0;
        
        if (balade.coordonnees && Array.isArray(balade.coordonnees) && balade.coordonnees[index]) {
          const coord = balade.coordonnees[index] as any;
          // Structure actuelle : {lat: number, lng: number, name: string}
          if (coord.lat !== undefined && coord.lng !== undefined) {
            latitude = coord.lat;
            longitude = coord.lng;
          }
          // Structure alternative : {latitude: number, longitude: number}
          else if (coord.latitude !== undefined && coord.longitude !== undefined) {
            latitude = coord.latitude;
            longitude = coord.longitude;
          }
        }
        
        return {
          id: index + 1,
          titre: etape.titre || '',
          description: etape.description || '',
          latitude: latitude,
          longitude: longitude,
          ordre: index + 1
        };
      });
    } else {
      parcoursEtapes = [];
    }
  }

  function cancelParcoursEdit() {
    isEditingParcours = false;
    selectedBalade = null;
    parcoursEtapes = [];
    currentEtape = null;
    isAddingEtape = false;
    isEditingEtape = false;
  }

  function addEtape() {
    isAddingEtape = true;
    isEditingEtape = false;
    etapeTitre = '';
    etapeDescription = '';
    etapeLatitude = 0;
    etapeLongitude = 0;
    etapeOrdre = parcoursEtapes.length + 1;
    currentEtape = {
      id: parcoursEtapes.length + 1,
      titre: '',
      description: '',
      latitude: 0,
      longitude: 0,
      ordre: parcoursEtapes.length + 1
    };
  }

  function editEtape(etape: EtapeParcours) {
    isEditingEtape = true;
    isAddingEtape = false;
    etapeTitre = etape.titre;
    etapeDescription = etape.description;
    etapeLatitude = etape.latitude;
    etapeLongitude = etape.longitude;
    etapeOrdre = etape.ordre;
    currentEtape = { ...etape };
  }

  function cancelEtapeEdit() {
    isAddingEtape = false;
    isEditingEtape = false;
    currentEtape = null;
    etapeTitre = '';
    etapeDescription = '';
    etapeLatitude = 0;
    etapeLongitude = 0;
    etapeOrdre = 1;
  }

  function saveEtape() {
    if (!etapeTitre || !etapeDescription) {
      errorMessage = 'Veuillez remplir le titre et la description de l\'étape';
      return;
    }

    const etapeData = {
      id: currentEtape?.id || parcoursEtapes.length + 1,
      titre: etapeTitre,
      description: etapeDescription,
      latitude: etapeLatitude,
      longitude: etapeLongitude,
      ordre: etapeOrdre
    };

    if (isAddingEtape) {
      // Ajouter une nouvelle étape
      parcoursEtapes.push(etapeData);
    } else if (isEditingEtape && currentEtape) {
      // Modifier une étape existante
      const index = parcoursEtapes.findIndex(e => e.id === currentEtape?.id);
      if (index !== -1) {
        parcoursEtapes[index] = etapeData;
      }
    }

    // Réorganiser les ordres
    parcoursEtapes.forEach((etape, index) => {
      etape.ordre = index + 1;
    });

    cancelEtapeEdit();
    successMessage = isAddingEtape ? 'Étape ajoutée avec succès !' : 'Étape modifiée avec succès !';
    setTimeout(() => { successMessage = ''; }, 3000);
  }

  function deleteEtape(etapeId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette étape ?')) {
      return;
    }

    parcoursEtapes = parcoursEtapes.filter(e => e.id !== etapeId);
    
    // Réorganiser les ordres
    parcoursEtapes.forEach((etape, index) => {
      etape.ordre = index + 1;
    });

    successMessage = 'Étape supprimée avec succès !';
    setTimeout(() => { successMessage = ''; }, 3000);
  }

  function moveEtapeUp(etapeId: number) {
    const index = parcoursEtapes.findIndex(e => e.id === etapeId);
    if (index > 0) {
      [parcoursEtapes[index], parcoursEtapes[index - 1]] = [parcoursEtapes[index - 1], parcoursEtapes[index]];
      // Mettre à jour les ordres
      parcoursEtapes.forEach((etape, i) => {
        etape.ordre = i + 1;
      });
    }
  }

  function moveEtapeDown(etapeId: number) {
    const index = parcoursEtapes.findIndex(e => e.id === etapeId);
    if (index < parcoursEtapes.length - 1) {
      [parcoursEtapes[index], parcoursEtapes[index + 1]] = [parcoursEtapes[index + 1], parcoursEtapes[index]];
      // Mettre à jour les ordres
      parcoursEtapes.forEach((etape, i) => {
        etape.ordre = i + 1;
      });
    }
  }

  async function saveParcours() {
    if (parcoursEtapes.length === 0) {
      errorMessage = 'Le parcours doit contenir au moins une étape';
      return;
    }

    try {
      // Préparer les données du parcours
      const parcoursData = parcoursEtapes.map(etape => ({
        titre: etape.titre,
        description: etape.description,
        latitude: etape.latitude,
        longitude: etape.longitude
      }));

      // Préparer les coordonnées GPS
      const coordonneesData = parcoursEtapes.map(etape => ({
        latitude: etape.latitude,
        longitude: etape.longitude
      }));

      // Mettre à jour la balade avec le nouveau parcours
      const updatedBalade = {
        ...selectedBalade,
        parcours: parcoursData,
        coordonnees: coordonneesData
      };

      const response = await fetch(`/api/admin/balades/${selectedBalade?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBalade)
      });

      const data = await response.json();

      if (response.ok) {
        successMessage = 'Parcours sauvegardé avec succès !';
        await loadBalades();
        cancelParcoursEdit();
        
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        errorMessage = data.error || 'Erreur lors de la sauvegarde du parcours';
      }
    } catch (error) {
      errorMessage = 'Erreur lors de la sauvegarde du parcours';
    }
  }

  async function saveBalade() {
    if (!baladeForm.theme || !baladeForm.date || !baladeForm.heure || !baladeForm.lieu || !baladeForm.prix || !baladeForm.description) {
      errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    try {
      // Récupérer le token de session
      const sessionToken = sessionStorage.getItem('admin_session_token');
      if (!sessionToken) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        window.location.href = '/admin';
        return;
      }

      const url = isEditing ? `/api/admin/balades/${selectedBalade?.id}` : '/api/admin/balades';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': sessionToken
        },
        body: JSON.stringify(baladeForm)
      });

      const data = await response.json();

      if (response.ok) {
        successMessage = isEditing ? 'Balade modifiée avec succès !' : 'Balade ajoutée avec succès !';
        await loadBalades();
        cancelEdit();
        
        // Effacer le message de succès après 3 secondes
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        errorMessage = data.error || 'Erreur lors de la sauvegarde';
      }
    } catch (error) {
      errorMessage = 'Erreur lors de la sauvegarde';
    }
  }

  async function toggleStatut(balade: Balade) {
    const newStatut = balade.statut === 'en_ligne' ? 'brouillon' : 'en_ligne';
    const action = newStatut === 'en_ligne' ? 'mise en ligne' : 'mise en brouillon';
    
    if (!confirm(`Êtes-vous sûr de vouloir ${action} cette balade ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/balades/${balade.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...balade,
          statut: newStatut
        })
      });

      const data = await response.json();

      if (response.ok) {
        successMessage = `Balade ${action} avec succès !`;
        await loadBalades();
        
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        errorMessage = data.error || `Erreur lors de la ${action}`;
      }
    } catch (error) {
      errorMessage = `Erreur lors de la ${action}`;
    }
  }

  async function deleteBalade(baladeId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette balade ? Cette action est irréversible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/balades/${baladeId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        successMessage = 'Balade supprimée avec succès !';
        await loadBalades();
        
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        errorMessage = data.error || 'Erreur lors de la suppression';
      }
    } catch (error) {
      errorMessage = 'Erreur lors de la suppression';
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getAnneeLabel(annee: string): string {
    return annee;
  }

  function retourAdmin() {
    window.location.href = '/admin';
  }
</script>

<AdminAuth>
  <div class="admin-balades-page">
      <div class="admin-header">
    <button class="btn-retour" on:click={retourAdmin}>
      ← Retour à l'administration
    </button>
    <h1>📋 Gestion des Balades</h1>
  </div>

  <div class="admin-content {isVisible ? 'fade-in' : ''}">
    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Chargement des balades...</p>
      </div>
    {:else}
      <!-- Messages d'erreur/succès -->
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}

      {#if successMessage}
        <div class="success-message">
          {successMessage}
        </div>
      {/if}

      <!-- Formulaire d'ajout/modification -->
      {#if isAdding || isEditing}
        <div class="form-section">
          <h2>{isEditing ? 'Modifier la balade' : 'Ajouter une nouvelle balade'}</h2>
          
          <form on:submit|preventDefault={saveBalade} class="balade-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="theme">Thème de la balade *</label>
                <input 
                  type="text" 
                  id="theme"
                  bind:value={baladeForm.theme}
                  placeholder="Ex: Architecture médiévale"
                  required
                />
              </div>

              <div class="form-group">
                <label for="date">Date *</label>
                <input 
                  type="date" 
                  id="date"
                  bind:value={baladeForm.date}
                  required
                />
              </div>

              <div class="form-group">
                <label for="heure">Heure *</label>
                <input 
                  type="time" 
                  id="heure"
                  bind:value={baladeForm.heure}
                  required
                />
              </div>

              <div class="form-group">
                <label for="lieu">Lieu *</label>
                <input 
                  type="text" 
                  id="lieu"
                  bind:value={baladeForm.lieu}
                  placeholder="Ex: Quartier du Bouffay"
                  required
                />
              </div>

              <div class="form-group">
                <label for="prix">Prix *</label>
                <input 
                  type="text" 
                  id="prix"
                  bind:value={baladeForm.prix}
                  placeholder="Ex: 45€"
                  required
                />
              </div>

              <div class="form-group">
                <label for="places">Places disponibles *</label>
                <input 
                  type="number" 
                  id="places"
                  bind:value={baladeForm.placesDisponibles}
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>

            <div class="form-group full-width">
              <label for="description">Description *</label>
              <textarea 
                id="description"
                bind:value={baladeForm.description}
                rows="4"
                placeholder="Description détaillée de la balade..."
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="type">Type de balade</label>
              <select 
                id="type"
                bind:value={baladeForm.type}
                required
              >
                <option value="payante">💰 Balade payante (réservation avec paiement)</option>
                <option value="invitation">🎁 Balade sur invitation (gratuite avec code)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="statut">Statut de la balade</label>
              <select 
                id="statut"
                bind:value={baladeForm.statut}
                required
              >
                <option value="brouillon">📝 Brouillon (non visible au public)</option>
                <option value="en_ligne">🌐 En ligne (visible au public)</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save">
                {isEditing ? 'Modifier la balade' : 'Ajouter la balade'}
              </button>
              <button type="button" class="btn-cancel" on:click={cancelEdit}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      {/if}

      <!-- Liste des balades -->
      <div class="balades-section">
        <div class="section-header">
          <h2>Balades existantes ({balades.length})</h2>
          {#if !isAdding && !isEditing}
            <button class="btn-add" on:click={addBalade}>
              ➕ Ajouter une balade
            </button>
          {/if}
        </div>

        {#if balades.length === 0}
          <div class="empty-state">
            <p>Aucune balade trouvée.</p>
            <button class="btn-add" on:click={addBalade}>
              Ajouter la première balade
            </button>
          </div>
        {:else}
          <!-- Balades futures -->
          {#if baladesFutures.length > 0}
            <div class="balades-category">
              <h3 class="category-title future">🚀 Balades à venir ({baladesFutures.length})</h3>
              <div class="balades-grid">
                {#each Object.entries(baladesParAnnee).filter(([annee]) => parseInt(annee) >= new Date().getFullYear()).sort(([a], [b]) => parseInt(a) - parseInt(b)) as [annee, baladesAnnee]}
                  <div class="annee-section">
                    <h4 class="annee-title">{getAnneeLabel(annee)}</h4>
                    {#each baladesAnnee.filter(b => b.date >= new Date().toISOString().split('T')[0]) as balade}
                      <div class="balade-card future">
                        <div class="balade-header">
                          <div class="balade-date">
                            <span class="date-day">{new Date(balade.date).getDate()}</span>
                            <span class="date-month">{new Date(balade.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                          </div>
                          <div class="balade-info">
                            <h3>{balade.theme}</h3>
                            <p class="balade-lieu">📍 {balade.lieu}</p>
                            <p class="balade-heure">🕐 {balade.heure}</p>
                            <p class="balade-prix">💰 {balade.prix}</p>
                            <p class="balade-type {balade.type === 'invitation' ? 'type-invitation' : 'type-payante'}">
                              {balade.type === 'invitation' ? '🎁 Sur invitation' : '💰 Payante'}
                            </p>
                          </div>
                          <div class="balade-status">
                            <span class="places {balade.placesDisponibles === 0 ? 'complete' : balade.placesDisponibles === 1 ? 'limite' : balade.placesDisponibles <= 3 ? 'orange' : 'disponible'}">
                              {balade.placesDisponibles} place{balade.placesDisponibles > 1 ? 's' : ''}
                            </span>
                            <span class="balade-statut {balade.statut === 'en_ligne' ? 'statut-en-ligne' : 'statut-brouillon'}">
                              {balade.statut === 'en_ligne' ? '🌐 En ligne' : '📝 Brouillon'}
                            </span>
                          </div>
                        </div>
                        
                        <p class="balade-description">{balade.description}</p>
                        
                        <div class="balade-actions">
                          <button class="btn-edit" on:click={() => editBalade(balade)}>
                            ✏️ Modifier
                          </button>
                          <button class="btn-parcours" on:click={() => editParcours(balade)}>
                            🗺️ Parcours
                          </button>
                          <button 
                            class="btn-toggle-statut {balade.statut === 'en_ligne' ? 'btn-mettre-brouillon' : 'btn-mettre-en-ligne'}"
                            on:click={() => toggleStatut(balade)}
                            title={balade.statut === 'en_ligne' ? 'Mettre en brouillon' : 'Mettre en ligne'}
                          >
                            {balade.statut === 'en_ligne' ? '📝 Brouillon' : '🌐 En ligne'}
                          </button>
                          <button class="btn-delete" on:click={() => deleteBalade(balade.id)}>
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Balades passées -->
          {#if baladesPassees.length > 0}
            <div class="balades-category">
              <h3 class="category-title past">📚 Balades passées ({baladesPassees.length})</h3>
              <div class="balades-grid">
                {#each Object.entries(baladesParAnnee).filter(([annee]) => parseInt(annee) < new Date().getFullYear()).sort(([a], [b]) => parseInt(b) - parseInt(a)) as [annee, baladesAnnee]}
                  <div class="annee-section">
                    <h4 class="annee-title">{getAnneeLabel(annee)}</h4>
                    {#each baladesAnnee.filter(b => b.date < new Date().toISOString().split('T')[0]) as balade}
                      <div class="balade-card past">
                        <div class="balade-header">
                          <div class="balade-date past">
                            <span class="date-day">{new Date(balade.date).getDate()}</span>
                            <span class="date-month">{new Date(balade.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                          </div>
                          <div class="balade-info">
                            <h3>{balade.theme}</h3>
                            <p class="balade-lieu">📍 {balade.lieu}</p>
                            <p class="balade-heure">🕐 {balade.heure}</p>
                            <p class="balade-prix">💰 {balade.prix}</p>
                            <p class="balade-type {balade.type === 'invitation' ? 'type-invitation' : 'type-payante'}">
                              {balade.type === 'invitation' ? '🎁 Sur invitation' : '💰 Payante'}
                            </p>
                          </div>
                          <div class="balade-status">
                            <span class="places complete">
                              Terminée
                            </span>
                            <span class="balade-statut statut-passee">
                              📚 Passée
                            </span>
                          </div>
                        </div>
                        
                        <p class="balade-description">{balade.description}</p>
                        
                        <div class="balade-actions">
                          <button class="btn-copy" on:click={() => copyBalade(balade)} title="Copier cette balade pour créer une nouvelle version">
                            📋 Copier
                          </button>
                          <button class="btn-view" on:click={() => viewBaladeDetails(balade)} title="Voir les détails de cette balade passée">
                            👁️ Voir
                          </button>
                          <button class="btn-delete" on:click={() => deleteBalade(balade.id)}>
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        {/if}
      </div>
    {/if}

    <!-- Interface d'édition du parcours -->
    {#if isEditingParcours && selectedBalade}
      <div class="parcours-section">
        <div class="parcours-header">
          <h2>🗺️ {selectedBalade && selectedBalade.date < new Date().toISOString().split('T')[0] ? 'Consultation' : 'Édition'} du parcours - {selectedBalade.theme}</h2>
          <div class="parcours-actions">
                          {#if selectedBalade && selectedBalade.date >= new Date().toISOString().split('T')[0]}
                <!-- Boutons d'édition pour les balades futures -->
                <button class="btn-add-etape" on:click={addEtape}>
                  ➕ Ajouter une étape
                </button>
                <button class="btn-save-parcours" on:click={saveParcours}>
                  💾 Sauvegarder le parcours
                </button>
              {:else if selectedBalade}
                <!-- Boutons de consultation pour les balades passées -->
                <button class="btn-copy" on:click={() => selectedBalade && copyBalade(selectedBalade)}>
                  📋 Copier cette balade
                </button>
              {/if}
            <button class="btn-cancel-parcours" on:click={cancelParcoursEdit}>
              ❌ Fermer
            </button>
          </div>
        </div>

        <!-- Formulaire d'ajout/modification d'étape -->
        {#if (isAddingEtape || isEditingEtape) && selectedBalade && selectedBalade.date >= new Date().toISOString().split('T')[0]}
          <div class="etape-form-section">
            <h3>{isAddingEtape ? 'Ajouter une étape' : 'Modifier l\'étape'}</h3>
            
            <form on:submit|preventDefault={saveEtape} class="etape-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="etape-titre">Titre de l'étape *</label>
                  <input 
                    type="text" 
                    id="etape-titre"
                    bind:value={etapeTitre}
                    placeholder="Ex: Départ - Place du Bouffay"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="etape-ordre">Ordre</label>
                  <input 
                    type="number" 
                    id="etape-ordre"
                    bind:value={etapeOrdre}
                    min="1"
                    max="20"
                    readonly
                  />
                </div>

                <div class="form-group">
                  <label for="etape-latitude">Latitude *</label>
                  <input 
                    type="number" 
                    id="etape-latitude"
                    bind:value={etapeLatitude}
                    step="0.000001"
                    placeholder="Ex: 47.2138"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="etape-longitude">Longitude *</label>
                  <input 
                    type="number" 
                    id="etape-longitude"
                    bind:value={etapeLongitude}
                    step="0.000001"
                    placeholder="Ex: -1.5564"
                    required
                  />
                </div>
              </div>

              <div class="form-group full-width">
                <label for="etape-description">Description de l'étape *</label>
                <textarea 
                  id="etape-description"
                  bind:value={etapeDescription}
                  rows="3"
                  placeholder="Description détaillée de cette étape du parcours..."
                  required
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-save">
                  {isAddingEtape ? 'Ajouter l\'étape' : 'Modifier l\'étape'}
                </button>
                <button type="button" class="btn-cancel" on:click={cancelEtapeEdit}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        {/if}

        <!-- Liste des étapes du parcours -->
        <div class="etapes-section">
          <h3>Étapes du parcours ({parcoursEtapes.length})</h3>
          
          {#if parcoursEtapes.length === 0}
            <div class="empty-etapes">
              <p>Aucune étape définie. Cliquez sur "Ajouter une étape" pour commencer.</p>
            </div>
          {:else}
            <div class="etapes-list">
              {#each parcoursEtapes as etape (etape.id)}
                <div class="etape-card">
                  <div class="etape-header">
                    <div class="etape-ordre">
                      <span class="ordre-number">{etape.ordre}</span>
                    </div>
                    <div class="etape-info">
                      <h4>{etape.titre}</h4>
                      <p class="etape-coords">📍 {etape.latitude.toFixed(6)}, {etape.longitude.toFixed(6)}</p>
                    </div>
                    <div class="etape-actions">
                      <button class="btn-move-up" on:click={() => moveEtapeUp(etape.id)} disabled={etape.ordre === 1}>
                        ⬆️
                      </button>
                      <button class="btn-move-down" on:click={() => moveEtapeDown(etape.id)} disabled={etape.ordre === parcoursEtapes.length}>
                        ⬇️
                      </button>
                      <button class="btn-edit-etape" on:click={() => editEtape(etape)}>
                        ✏️
                      </button>
                      <button class="btn-delete-etape" on:click={() => deleteEtape(etape.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div class="etape-description">
                    <p>{etape.description}</p>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
  </div>
</AdminAuth>

<style>
  .admin-balades-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
    padding: 2rem;
  }

  .admin-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .btn-retour {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    white-space: nowrap;
  }

  .btn-retour:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }



  .admin-header h1 {
    font-size: 2rem;
    color: #ffd700;
    margin: 0;
  }

  .admin-content {
    opacity: 0;
    transform: translateY(30px);
  }

  .loading {
    text-align: center;
    padding: 3rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255,255,255,0.1);
    border-left: 4px solid #ffd700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    background: rgba(255,0,0,0.1);
    border: 1px solid rgba(255,0,0,0.3);
    color: #ff6b6b;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .success-message {
    background: rgba(0,255,0,0.1);
    border: 1px solid rgba(0,255,0,0.3);
    color: #00ff00;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .form-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .form-section h2 {
    color: #ffd700;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .balade-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-group label {
    color: rgba(255,255,255,0.9);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .form-group input,
  .form-group textarea {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 0.75rem;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255,255,255,0.15);
  }

  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: rgba(255,255,255,0.5);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .btn-save {
    background: linear-gradient(45deg, #00ff00, #00cc00);
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    white-space: nowrap;
  }

  .btn-save:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
  }

  .btn-cancel {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .btn-cancel:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }

  .balades-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .section-header h2 {
    color: #ffd700;
    margin: 0;
    font-size: 1.5rem;
  }

  .btn-add {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    white-space: nowrap;
  }

  .btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: rgba(255,255,255,0.7);
  }

  /* Styles pour les catégories de balades */
  .balades-category {
    margin-bottom: 3rem;
  }

  .balades-category:last-child {
    margin-bottom: 0;
  }

  .category-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
    font-weight: 600;
  }

  .category-title.future {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1));
    color: #4CAF50;
    border: 2px solid rgba(76, 175, 80, 0.3);
  }

  .category-title.past {
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(156, 39, 176, 0.1));
    color: #9C27B0;
    border: 2px solid rgba(156, 39, 176, 0.3);
  }

  .annee-section {
    margin-bottom: 2rem;
  }

  .annee-section:last-child {
    margin-bottom: 0;
  }

  .annee-title {
    font-size: 1.3rem;
    color: #ffd700;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 215, 0, 0.1);
    border-radius: 8px;
    border-left: 4px solid #ffd700;
    font-weight: 600;
  }

  .balades-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  .balade-card {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.3s ease;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-word;
  }

  .balade-card:hover {
    transform: translateY(-2px);
  }

  .balade-card.future {
    border-left: 4px solid #4CAF50;
  }

  .balade-card.past {
    border-left: 4px solid #9C27B0;
    opacity: 0.8;
  }

  .balade-card.past:hover {
    opacity: 1;
  }

  .balade-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .balade-date {
    background: #ffd700;
    color: #000;
    padding: 0.5rem;
    border-radius: 8px;
    text-align: center;
    min-width: 60px;
    flex-shrink: 0;
  }

  .balade-date.past {
    background: #9C27B0;
    color: #fff;
  }

  .date-day {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .date-month {
    display: block;
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  .balade-info {
    flex: 1;
    min-width: 0;
    max-width: calc(100% - 140px);
  }

  .balade-info h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #ffd700;
    word-wrap: break-word;
    word-break: break-word;
    line-height: 1.3;
    max-width: 100%;
    overflow-wrap: break-word;
  }

  .balade-lieu, .balade-heure, .balade-prix, .balade-type {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.7);
    margin-bottom: 0.2rem;
    word-wrap: break-word;
    word-break: break-word;
    line-height: 1.2;
    max-width: 100%;
    overflow-wrap: break-word;
  }

  .balade-type {
    font-weight: 600;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    display: inline-block;
    margin-top: 0.3rem;
  }

  .type-payante {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid rgba(255, 193, 7, 0.3);
  }

  .type-invitation {
    background: rgba(156, 39, 176, 0.2);
    color: #9C27B0;
    border: 1px solid rgba(156, 39, 176, 0.3);
  }

  .balade-status {
    text-align: right;
    flex-shrink: 0;
    min-width: 80px;
    max-width: 80px;
  }

  .places {
    display: block;
    font-size: 0.75rem;
    color: #00ff00;
    margin-bottom: 0.5rem;
    white-space: nowrap;
  }

  .places.orange {
    color: #ff8c00;
  }

  .places.limite {
    color: #ff6b6b;
  }

  .places.complete {
    color: #ff6b6b;
  }

  .balade-statut {
    display: block;
    font-size: 0.65rem;
    margin-top: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    text-align: center;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .statut-en-ligne {
    background: rgba(0, 255, 0, 0.2);
    color: #00ff00;
    border: 1px solid rgba(0, 255, 0, 0.3);
  }

  .statut-brouillon {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid rgba(255, 193, 7, 0.3);
  }

  .statut-passee {
    background: rgba(156, 39, 176, 0.2);
    color: #9C27B0;
    border: 1px solid rgba(156, 39, 176, 0.3);
  }

  .balade-description {
    color: rgba(255,255,255,0.8);
    line-height: 1.4;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    word-wrap: break-word;
    word-break: break-word;
    max-width: 100%;
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .balade-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .btn-edit, .btn-delete, .btn-parcours, .btn-toggle-statut {
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    min-width: 0;
    flex: 1;
    max-width: 110px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-edit {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
  }

  .btn-edit:hover {
    transform: translateY(-1px);
  }

  .btn-delete {
    background: rgba(255,0,0,0.2);
    color: #ff6b6b;
    border: 1px solid rgba(255,0,0,0.3);
  }

  .btn-delete:hover {
    background: rgba(255,0,0,0.3);
    transform: translateY(-1px);
  }

  .btn-parcours {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: #fff;
  }

  .btn-parcours:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  }

  .btn-toggle-statut {
    border: 1px solid rgba(255,255,255,0.2);
  }

  .btn-mettre-en-ligne {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: #fff;
  }

  .btn-mettre-en-ligne:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  }

  .btn-mettre-brouillon {
    background: linear-gradient(45deg, #ffc107, #ff9800);
    color: #000;
  }

  .btn-mettre-brouillon:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
  }

  .btn-copy {
    background: linear-gradient(45deg, #2196F3, #1976D2);
    color: #fff;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    min-width: 0;
    flex: 1;
    max-width: 110px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-copy:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
  }

  .btn-view {
    background: linear-gradient(45deg, #9C27B0, #7B1FA2);
    color: #fff;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    min-width: 0;
    flex: 1;
    max-width: 110px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-view:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
  }

  /* Styles pour l'édition du parcours */
  .parcours-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    margin-top: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .parcours-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .parcours-header h2 {
    color: #4CAF50;
    margin: 0;
    font-size: 1.5rem;
    word-wrap: break-word;
    word-break: break-word;
  }

  .parcours-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-add-etape, .btn-save-parcours, .btn-cancel-parcours {
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    white-space: nowrap;
    font-size: 0.9rem;
  }

  .btn-add-etape {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: #fff;
  }

  .btn-add-etape:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  }

  .btn-save-parcours {
    background: linear-gradient(45deg, #2196F3, #1976D2);
    color: #fff;
  }

  .btn-save-parcours:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
  }

  .btn-cancel-parcours {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .btn-cancel-parcours:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }

  .etape-form-section {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .etape-form-section h3 {
    color: #4CAF50;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .etape-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .etapes-section {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .etapes-section h3 {
    color: #4CAF50;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .empty-etapes {
    text-align: center;
    padding: 2rem;
    color: rgba(255,255,255,0.7);
  }

  .etapes-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .etape-card {
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.3s ease;
    word-wrap: break-word;
    word-break: break-word;
  }

  .etape-card:hover {
    transform: translateY(-1px);
  }

  .etape-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  .etape-ordre {
    background: #4CAF50;
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .etape-info {
    flex: 1;
    min-width: 0;
    max-width: calc(100% - 120px);
  }

  .etape-info h4 {
    color: #4CAF50;
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    word-wrap: break-word;
    word-break: break-word;
    line-height: 1.2;
    max-width: 100%;
    overflow-wrap: break-word;
  }

  .etape-coords {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
    word-wrap: break-word;
    word-break: break-word;
    line-height: 1.1;
    max-width: 100%;
    overflow-wrap: break-word;
  }

  .etape-actions {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .btn-move-up, .btn-move-down, .btn-edit-etape, .btn-delete-etape {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.8rem;
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-move-up:hover, .btn-move-down:hover {
    background: rgba(76, 175, 80, 0.2);
    transform: translateY(-1px);
  }

  .btn-edit-etape:hover {
    background: rgba(255, 193, 7, 0.2);
    transform: translateY(-1px);
  }

  .btn-delete-etape:hover {
    background: rgba(255, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  .btn-move-up:disabled, .btn-move-down:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .etape-description {
    color: rgba(255,255,255,0.8);
    font-size: 0.85rem;
    line-height: 1.3;
    word-wrap: break-word;
    word-break: break-word;
    max-width: 100%;
    overflow-wrap: break-word;
  }

  .etape-description p {
    margin: 0;
    word-wrap: break-word;
    word-break: break-word;
  }

  /* Animations */
  .fade-in {
    opacity: 1;
    transform: translateY(0);
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .admin-balades-page {
      padding: 1rem;
    }

    .admin-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .admin-header h1 {
      font-size: 1.5rem;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }

    .section-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .balades-grid {
      grid-template-columns: 1fr;
    }

    .balade-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .balade-info {
      max-width: 100%;
      text-align: center;
    }

    .balade-status {
      max-width: 100%;
      text-align: center;
    }

    .balade-actions {
      justify-content: center;
      gap: 0.25rem;
    }

    .btn-edit, .btn-delete, .btn-parcours, .btn-toggle-statut {
      flex: 1;
      max-width: none;
      min-width: 80px;
      font-size: 0.7rem;
      padding: 0.4rem 0.6rem;
    }

    .category-title {
      font-size: 1.5rem;
      padding: 0.75rem;
    }

    .annee-title {
      font-size: 1.1rem;
      padding: 0.4rem 0.8rem;
    }

    .parcours-header {
      flex-direction: column;
      text-align: center;
    }

    .parcours-actions {
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-add-etape, .btn-save-parcours, .btn-cancel-parcours {
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
    }

    .etape-header {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }

    .etape-info {
      max-width: 100%;
      text-align: center;
    }

    .etape-actions {
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-move-up, .btn-move-down, .btn-edit-etape, .btn-delete-etape {
      min-width: 40px;
      height: 40px;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .balade-actions {
      flex-direction: column;
      gap: 0.5rem;
    }

    .btn-edit, .btn-delete, .btn-parcours, .btn-toggle-statut {
      max-width: none;
      width: 100%;
      font-size: 0.75rem;
    }

    .parcours-actions {
      flex-direction: column;
      width: 100%;
    }

    .btn-add-etape, .btn-save-parcours, .btn-cancel-parcours {
      width: 100%;
    }

    .balade-info h3 {
      font-size: 1rem;
    }

    .balade-lieu, .balade-heure, .balade-prix {
      font-size: 0.8rem;
    }

    .balade-description {
      font-size: 0.8rem;
      -webkit-line-clamp: 2;
    }

    .category-title {
      font-size: 1.3rem;
      padding: 0.5rem;
    }

    .annee-title {
      font-size: 1rem;
      padding: 0.3rem 0.6rem;
    }
  }
</style>
