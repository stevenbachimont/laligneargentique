<script lang="ts">
  import { onMount } from 'svelte';

  let reservations: any[] = [];
  let isLoading = true;
  let errorMessage = '';

  onMount(async () => {
    await loadReservationsEnAttente();
  });

  async function loadReservationsEnAttente() {
    try {
      const response = await fetch('/api/admin/reservations-en-attente');
      const data = await response.json();
      
      if (data.success) {
        reservations = data.reservations;
      } else {
        errorMessage = data.error || 'Erreur lors du chargement';
      }
    } catch (error) {
      console.error('Erreur:', error);
      errorMessage = 'Erreur de connexion';
    } finally {
      isLoading = false;
    }
  }

  async function confirmerReservation(reservationId: number) {
    try {
      const response = await fetch('/api/admin/confirmer-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationId }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Réservation confirmée avec succès !');
        await loadReservationsEnAttente(); // Recharger la liste
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la confirmation');
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Gestion des réservations - Admin</title>
</svelte:head>

<div class="admin-container">
  <h1>🎞️ Gestion des réservations</h1>
  
  {#if isLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement des réservations...</p>
    </div>
  {:else if errorMessage}
    <div class="error">
      <p>{errorMessage}</p>
      <button on:click={loadReservationsEnAttente}>Réessayer</button>
    </div>
  {:else}
    <div class="reservations-list">
      <h2>Réservations en attente de confirmation ({reservations.length})</h2>
      
      {#if reservations.length === 0}
        <div class="no-reservations">
          <p>Aucune réservation en attente</p>
        </div>
      {:else}
        {#each reservations as reservation}
          <div class="reservation-card">
            <div class="reservation-header">
              <h3>Réservation #{reservation.id}</h3>
              <span class="status pending">En attente</span>
            </div>
            
            <div class="reservation-details">
              <div class="detail-row">
                <strong>Client :</strong> {reservation.prenom} {reservation.nom}
              </div>
              <div class="detail-row">
                <strong>Email :</strong> {reservation.email}
              </div>
              <div class="detail-row">
                <strong>Personnes :</strong> {reservation.nombrePersonnes}
              </div>
              {#if reservation.balade}
                <div class="detail-row">
                  <strong>Balade :</strong> {reservation.balade.theme}
                </div>
                <div class="detail-row">
                  <strong>Date :</strong> {formatDate(reservation.balade.date)} à {reservation.balade.heure}
                </div>
                <div class="detail-row">
                  <strong>Lieu :</strong> {reservation.balade.lieu}
                </div>
                <div class="detail-row">
                  <strong>Places restantes :</strong> {reservation.balade.placesDisponibles}
                </div>
              {/if}
              {#if reservation.message}
                <div class="detail-row">
                  <strong>Message :</strong> {reservation.message}
                </div>
              {/if}
            </div>
            
            <div class="reservation-actions">
              <button 
                on:click={() => confirmerReservation(reservation.id)}
                class="btn-confirm"
                disabled={!reservation.balade || reservation.balade.placesDisponibles < reservation.nombrePersonnes}
              >
                ✅ Confirmer la réservation
              </button>
              
              {#if reservation.balade && reservation.balade.placesDisponibles < reservation.nombrePersonnes}
                <p class="warning">⚠️ Places insuffisantes ({reservation.balade.placesDisponibles} disponibles pour {reservation.nombrePersonnes} personnes)</p>
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .admin-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error {
    text-align: center;
    color: #e74c3c;
    padding: 2rem;
  }

  .reservations-list h2 {
    color: #333;
    margin-bottom: 1.5rem;
  }

  .no-reservations {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .reservation-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .reservation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }

  .reservation-header h3 {
    margin: 0;
    color: #333;
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .status.pending {
    background: #fff3cd;
    color: #856404;
  }

  .reservation-details {
    margin-bottom: 1.5rem;
  }

  .detail-row {
    margin-bottom: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }

  .detail-row strong {
    min-width: 120px;
    color: #555;
  }

  .reservation-actions {
    text-align: center;
  }

  .btn-confirm {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }

  .btn-confirm:hover:not(:disabled) {
    background: #218838;
  }

  .btn-confirm:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .warning {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
</style>
