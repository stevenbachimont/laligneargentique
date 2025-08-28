<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  // Récupérer les paramètres de l'URL
  $: paymentId = $page.url.searchParams.get('paymentId');

  let reservation: any = null;
  let isLoading = true;
  let errorMessage = '';

  onMount(async () => {
    if (paymentId) {
      await loadReservation();
    }
  });

  async function loadReservation() {
    try {
      // Récupérer les détails de la réservation depuis l'API
      const response = await fetch(`/api/reservations/${paymentId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      reservation = await response.json();
    } catch (error) {
      console.error('Erreur lors du chargement de la réservation:', error);
      errorMessage = 'Erreur lors du chargement de la réservation';
    } finally {
      isLoading = false;
    }
  }

  function goToBalades() {
    goto('/photographie/argentique');
  }

  function goToHome() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Réservation confirmée - La Ligne Argentique</title>
</svelte:head>

<div class="confirmation-container">
  {#if isLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement de la confirmation...</p>
    </div>
  {:else if errorMessage}
    <div class="error-container">
      <h2>Erreur</h2>
      <p>{errorMessage}</p>
      <button on:click={goToBalades} class="btn-secondary">Retour aux balades</button>
    </div>
  {:else if reservation}
    <div class="confirmation-content">
      <div class="success-icon">
        <div class="checkmark">✓</div>
      </div>

      <h1>🎉 Réservation confirmée !</h1>
      
      <div class="confirmation-details">
        <div class="detail-section">
          <h3>Détails de la balade</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Thème :</span>
              <span class="value">{reservation.balade.theme}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date :</span>
              <span class="value">{reservation.balade.date}</span>
            </div>
            <div class="detail-item">
              <span class="label">Heure :</span>
              <span class="value">{reservation.balade.heure}</span>
            </div>
            <div class="detail-item">
              <span class="label">Lieu :</span>
              <span class="value">{reservation.balade.lieu}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3>Informations participant</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Nom :</span>
              <span class="value">{reservation.participant.prenom} {reservation.participant.nom}</span>
            </div>
            <div class="detail-item">
              <span class="label">Email :</span>
              <span class="value">{reservation.participant.email}</span>
            </div>
            <div class="detail-item">
              <span class="label">Nombre de personnes :</span>
              <span class="value">{reservation.nombrePersonnes || 1}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3>Paiement</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Montant :</span>
              <span class="value">{reservation.montant}</span>
            </div>
            <div class="detail-item">
              <span class="label">Statut :</span>
              <span class="value status-confirmed">
                {reservation.statut === 'confirmee' ? 'Confirmé' : 
                 reservation.statut === 'en_attente' ? 'Paiement reçu - En cours de confirmation' : 
                 reservation.statut}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Référence :</span>
              <span class="value">{reservation.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="next-steps">
        <h3>Prochaines étapes</h3>
        <ul>
          <li>📧 Un email de confirmation vous a été envoyé</li>
          <li>📱 Conservez cette page pour référence</li>
          <li>📍 Rendez-vous au point de départ 10 minutes avant l'heure</li>
          <li>📸 N'oubliez pas votre appareil photo argentique !</li>
        </ul>
      </div>

      <div class="action-buttons">
        <button on:click={goToBalades} class="btn-primary">
          Voir toutes les balades
        </button>
        <button on:click={goToHome} class="btn-secondary">
          Retour à l'accueil
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .confirmation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    color: white;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-container {
    text-align: center;
    color: white;
    padding: 2rem;
  }

  .confirmation-content {
    background: white;
    border-radius: 12px;
    padding: 3rem 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .success-icon {
    margin-bottom: 2rem;
  }

  .checkmark {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 auto;
    animation: bounce 0.6s ease-in-out;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  .confirmation-content h1 {
    color: #1a1a1a;
    margin: 0 0 2rem 0;
    font-size: 2.5rem;
  }

  .confirmation-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .detail-section {
    text-align: left;
  }

  .detail-section h3 {
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 0.5rem;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-item .label {
    font-weight: 600;
    color: #666;
  }

  .detail-item .value {
    color: #1a1a1a;
    font-weight: 500;
  }

  .status-confirmed {
    color: #059669 !important;
    font-weight: 600;
  }

  .next-steps {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: left;
  }

  .next-steps h3 {
    color: #0369a1;
    margin: 0 0 1rem 0;
  }

  .next-steps ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .next-steps li {
    margin: 0.5rem 0;
    color: #0369a1;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .btn-secondary:hover {
    background: #5a6268;
  }

  @media (max-width: 768px) {
    .confirmation-container {
      padding: 1rem;
    }

    .confirmation-content {
      padding: 2rem 1.5rem;
    }

    .confirmation-content h1 {
      font-size: 2rem;
    }

    .detail-grid {
      grid-template-columns: 1fr;
    }

    .action-buttons {
      flex-direction: column;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
    }
  }
</style>
