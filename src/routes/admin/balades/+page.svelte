<script lang="ts">
  import { onMount } from 'svelte';
  import type { Balade } from '$lib/server/baladesService';

  let balades: Balade[] = [];
  let isLoading = true;
  let errorMessage = '';
  let successMessage = '';
  let isVisible = false;
  let selectedBalade: Balade | null = null;
  let isEditing = false;
  let isAdding = false;

  // Formulaire pour ajouter/modifier une balade
  let baladeForm = {
    theme: '',
    date: '',
    heure: '',
    lieu: '',
    prix: '',
    placesDisponibles: 5,
    description: ''
  };

  onMount(async () => {
    await loadBalades();
    setTimeout(() => { isVisible = true; }, 100);
  });

  async function loadBalades() {
    try {
      isLoading = true;
      const response = await fetch('/api/balades');
      const data = await response.json();
      
      if (data.success) {
        balades = data.balades;
      } else {
        errorMessage = 'Erreur lors du chargement des balades';
      }
    } catch (error) {
      errorMessage = 'Erreur lors du chargement des balades';
    } finally {
      isLoading = false;
    }
  }

  function addBalade() {
    isAdding = true;
    isEditing = false;
    selectedBalade = null;
    resetForm();
  }

  function editBalade(balade: Balade) {
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
      description: balade.description
    };
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
      description: ''
    };
  }

  async function saveBalade() {
    if (!baladeForm.theme || !baladeForm.date || !baladeForm.heure || !baladeForm.lieu || !baladeForm.prix || !baladeForm.description) {
      errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    try {
      const url = isEditing ? `/api/admin/balades/${selectedBalade?.id}` : '/api/admin/balades';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
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

  function retourAdmin() {
    window.location.href = '/admin';
  }
</script>

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
          <div class="balades-grid">
            {#each balades as balade}
              <div class="balade-card">
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
                  </div>
                  <div class="balade-status">
                                    <span class="places {balade.placesDisponibles === 0 ? 'complete' : balade.placesDisponibles === 1 ? 'limite' : balade.placesDisponibles <= 3 ? 'orange' : 'disponible'}">
                  {balade.placesDisponibles} place{balade.placesDisponibles > 1 ? 's' : ''}
                </span>
                  </div>
                </div>
                
                <p class="balade-description">{balade.description}</p>
                
                <div class="balade-actions">
                  <button class="btn-edit" on:click={() => editBalade(balade)}>
                    ✏️ Modifier
                  </button>
                  <button class="btn-delete" on:click={() => deleteBalade(balade.id)}>
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

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

  .balades-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .balade-card {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.3s ease;
  }

  .balade-card:hover {
    transform: translateY(-2px);
  }

  .balade-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .balade-date {
    background: #ffd700;
    color: #000;
    padding: 0.5rem;
    border-radius: 8px;
    text-align: center;
    min-width: 60px;
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
  }

  .balade-info h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #ffd700;
  }

  .balade-lieu, .balade-heure, .balade-prix {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
    margin-bottom: 0.2rem;
  }

  .balade-status {
    text-align: right;
  }

  .places {
    display: block;
    font-size: 0.8rem;
    color: #00ff00;
    margin-bottom: 0.5rem;
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

  .balade-description {
    color: rgba(255,255,255,0.8);
    line-height: 1.5;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .balade-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-edit {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .btn-edit:hover {
    transform: translateY(-1px);
  }

  .btn-delete {
    background: rgba(255,0,0,0.2);
    color: #ff6b6b;
    border: 1px solid rgba(255,0,0,0.3);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .btn-delete:hover {
    background: rgba(255,0,0,0.3);
    transform: translateY(-1px);
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

    .balade-actions {
      justify-content: center;
    }
  }
</style>
