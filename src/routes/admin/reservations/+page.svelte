<script lang="ts">
  import { onMount } from 'svelte';
  import type { Reservation } from '$lib/server/baladesService';

  let reservations: Reservation[] = [];
  let isLoading = true;
  let errorMessage = '';
  let successMessage = '';
  let isVisible = false;
  let searchTerm = '';
  let selectedReservation: Reservation | null = null;

  onMount(async () => {
    await loadReservations();
    setTimeout(() => { isVisible = true; }, 100);
  });

  async function loadReservations() {
    try {
      isLoading = true;
      const response = await fetch('/api/admin/reservations');
      const data = await response.json();
      
      if (data.success) {
        reservations = data.reservations;
      } else {
        errorMessage = 'Erreur lors du chargement des réservations';
      }
    } catch (error) {
      errorMessage = 'Erreur lors du chargement des réservations';
    } finally {
      isLoading = false;
    }
  }

  async function deleteReservation(reservationId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        successMessage = 'Réservation supprimée avec succès !';
        await loadReservations();
        
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function retourAdmin() {
    window.location.href = '/admin';
  }

  // Filtrer les réservations selon le terme de recherche
  $: filteredReservations = reservations.filter(reservation => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      reservation.prenom.toLowerCase().includes(search) ||
      reservation.nom.toLowerCase().includes(search) ||
      reservation.email.toLowerCase().includes(search) ||
      reservation.theme?.toLowerCase().includes(search)
    );
  });
</script>

<div class="admin-reservations-page">
  <div class="admin-header">
    <button class="btn-retour" on:click={retourAdmin}>
      ← Retour à l'administration
    </button>
    <h1>📅 Gestion des Réservations</h1>
  </div>

  <div class="admin-content {isVisible ? 'fade-in' : ''}">
    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Chargement des réservations...</p>
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

      <!-- Barre de recherche -->
      <div class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            bind:value={searchTerm}
            placeholder="Rechercher par nom, email ou thème..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        <div class="stats">
          <span class="stat-item">
            📊 Total: {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
          </span>
          <span class="stat-item">
            🔍 Affichées: {filteredReservations.length}
          </span>
        </div>
      </div>

      <!-- Liste des réservations -->
      <div class="reservations-section">
        {#if filteredReservations.length === 0}
          <div class="empty-state">
            {#if searchTerm}
              <p>Aucune réservation trouvée pour "{searchTerm}"</p>
              <button class="btn-clear" on:click={() => searchTerm = ''}>
                Effacer la recherche
              </button>
            {:else}
              <p>Aucune réservation trouvée.</p>
            {/if}
          </div>
        {:else}
          <div class="reservations-grid">
            {#each filteredReservations as reservation}
              <div class="reservation-card">
                <div class="reservation-header">
                  <div class="reservation-info">
                    <h3>{reservation.prenom} {reservation.nom}</h3>
                    <p class="reservation-email">📧 {reservation.email}</p>
                    <p class="reservation-date">📅 {formatDate(reservation.createdAt)}</p>
                  </div>
                  <div class="reservation-status">
                    <span class="status-badge">
                      {reservation.nombrePersonnes} personne{reservation.nombrePersonnes > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div class="reservation-details">
                  <div class="detail-row">
                    <span class="detail-label">Balade :</span>
                    <span class="detail-value">{reservation.theme || 'N/A'}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Date de la balade :</span>
                    <span class="detail-value">{reservation.date || 'N/A'}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Heure :</span>
                    <span class="detail-value">{reservation.heure || 'N/A'}</span>
                  </div>
                  
                  {#if reservation.message}
                    <div class="message-section">
                      <span class="detail-label">Message :</span>
                      <p class="message-text">{reservation.message}</p>
                    </div>
                  {/if}
                </div>
                
                <div class="reservation-actions">
                  <button class="btn-delete" on:click={() => deleteReservation(reservation.id)}>
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
  .admin-reservations-page {
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

  .search-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .search-box {
    position: relative;
    margin-bottom: 1rem;
  }

  .search-input {
    width: 100%;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255,255,255,0.15);
  }

  .search-input::placeholder {
    color: rgba(255,255,255,0.5);
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.5);
  }

  .stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .stat-item {
    background: rgba(255,255,255,0.1);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.8);
  }

  .reservations-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: rgba(255,255,255,0.7);
  }

  .btn-clear {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    margin-top: 1rem;
  }

  .btn-clear:hover {
    transform: translateY(-1px);
  }

  .reservations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  .reservation-card {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.3s ease;
  }

  .reservation-card:hover {
    transform: translateY(-2px);
  }

  .reservation-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .reservation-info h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #ffd700;
  }

  .reservation-email, .reservation-date {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
    margin-bottom: 0.2rem;
  }

  .status-badge {
    background: linear-gradient(45deg, #00ff00, #00cc00);
    color: #000;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .reservation-details {
    margin-bottom: 1rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .detail-label {
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
  }

  .detail-value {
    color: #fff;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .message-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .message-text {
    background: rgba(255,255,255,0.05);
    padding: 0.8rem;
    border-radius: 6px;
    margin-top: 0.5rem;
    font-style: italic;
    line-height: 1.4;
    color: rgba(255,255,255,0.8);
  }

  .reservation-actions {
    display: flex;
    justify-content: flex-end;
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
    .admin-reservations-page {
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

    .reservations-grid {
      grid-template-columns: 1fr;
    }

    .reservation-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .detail-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
    }

    .reservation-actions {
      justify-content: center;
    }
  }
</style>
