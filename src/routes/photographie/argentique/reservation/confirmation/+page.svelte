<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // Variables pour le formulaire
  $: reservationData = $page.url.searchParams.get('data');
  let reservation: any = null;
  let isVisible = false;

  // Variables pour la question
  let question = '';
  let isSubmittingQuestion = false;
  let questionSent = false;
  let questionError = '';

  onMount(() => {
    // Récupérer les données de réservation depuis l'URL
    if (reservationData) {
      try {
        reservation = JSON.parse(decodeURIComponent(reservationData));
      } catch (e) {
        console.error('Erreur lors du parsing des données de réservation:', e);
      }
    }

    setTimeout(() => { isVisible = true; }, 100);
  });

  async function sendQuestion() {
    if (!question.trim()) {
      questionError = 'Veuillez saisir votre question.';
      return;
    }

    isSubmittingQuestion = true;
    questionError = '';

    try {
      const response = await fetch('/api/question-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationData: reservation,
          question: question.trim(),
          clientEmail: reservation.email,
          clientName: `${reservation.prenom} ${reservation.nom}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        questionSent = true;
        question = '';
      } else {
        questionError = data.error || 'Erreur lors de l\'envoi de votre question.';
      }
    } catch (err) {
      questionError = 'Erreur lors de l\'envoi de votre question.';
    } finally {
      isSubmittingQuestion = false;
    }
  }

  function retourArgentique() {
    window.location.href = '/photographie/argentique';
  }

  function nouvelleReservation() {
    window.location.href = '/photographie/argentique';
  }

  function retourAccueil() {
    window.location.href = '/';
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
</script>

<div class="confirmation-page">
  <div class="confirmation-container {isVisible ? 'fade-in' : ''}">
    <div class="success-icon">
      <div class="checkmark">✓</div>
    </div>

    <div class="confirmation-header">
      <h1>🎉 Réservation confirmée !</h1>
      <p class="subtitle">Votre demande de réservation a été envoyée avec succès</p>
    </div>

    {#if reservation}
      <div class="reservation-details">
        <h2>📋 Détails de votre réservation</h2>
        
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Balade :</span>
            <span class="detail-value">{reservation.theme}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Date :</span>
            <span class="detail-value">{formatDate(reservation.dateSouhaitee)}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Heure :</span>
            <span class="detail-value">{reservation.heure}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Lieu :</span>
            <span class="detail-value">{reservation.lieu}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Nombre de personnes :</span>
            <span class="detail-value">{reservation.nombrePersonnes} personne{reservation.nombrePersonnes > 1 ? 's' : ''}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">Prix :</span>
            <span class="detail-value">{reservation.prix}</span>
          </div>
        </div>

        <div class="participant-info">
          <h3>👤 Informations du participant</h3>
          <div class="participant-details">
            <p><strong>Nom :</strong> {reservation.nom} {reservation.prenom}</p>
            <!-- Email et téléphone masqués pour la confidentialité -->
          </div>
        </div>

        {#if reservation.message}
          <div class="message-info">
            <h3>💬 Votre message</h3>
            <p class="message-text">{reservation.message}</p>
          </div>
        {/if}
      </div>
    {/if}

    <div class="next-steps">
      <h3>📅 Prochaines étapes</h3>
      <div class="steps-list">
        <div class="step">
          <span class="step-number">1</span>
          <div class="step-content">
            <h4>Confirmation par email</h4>
            <p>Vous allez recevoir un email de confirmation dans les prochaines minutes</p>
          </div>
        </div>
        
        <div class="step">
          <span class="step-number">2</span>
          <div class="step-content">
            <h4>Validation de la réservation</h4>
            <p>Je vous recontacterai dans les 24h pour confirmer votre place et vous donner tous les détails pratiques</p>
          </div>
        </div>
        
        <div class="step">
          <span class="step-number">3</span>
          <div class="step-content">
            <h4>Préparation de la balade</h4>
            <p>Vous recevrez un email avec le lieu de rendez-vous exact, les consignes et le matériel à prévoir</p>
          </div>
        </div>
      </div>
    </div>

    <div class="question-section">
      <h3>❓ Une question ?</h3>
      <p>Si vous avez des questions sur votre réservation, n'hésitez pas à me les poser :</p>
      
      {#if questionSent}
        <div class="success-message">
          <h4>✅ Question envoyée !</h4>
          <p>Votre question a été envoyée avec succès. Je vous répondrai dans les plus brefs délais.</p>
        </div>
      {:else}
        <div class="question-form">
          <textarea 
            bind:value={question}
            placeholder="Posez votre question ici..."
            rows="4"
            class="question-input"
            disabled={isSubmittingQuestion}
          ></textarea>
          
          {#if questionError}
            <p class="error-message">{questionError}</p>
          {/if}
          
          <button 
            class="btn-question" 
            on:click={sendQuestion}
            disabled={isSubmittingQuestion || !question.trim()}
          >
            {isSubmittingQuestion ? 'Envoi en cours...' : 'Envoyer ma question'}
          </button>
        </div>
      {/if}
      
      
    </div>

    <div class="action-buttons">
      <button class="btn-primary" on:click={nouvelleReservation}>
        📸 Réserver une autre balade
      </button>
      
      <button class="btn-secondary" on:click={retourArgentique}>
        🗺️ Voir toutes les balades
      </button>
      
      <button class="btn-tertiary" on:click={retourAccueil}>
        🏠 Retour à l'accueil
      </button>
    </div>
  </div>
</div>

<style>
  .confirmation-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
    padding: 2rem 0;
  }

  .confirmation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(255,255,255,0.05);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    opacity: 0;
    transform: translateY(30px);
  }

  .success-icon {
    text-align: center;
    margin-bottom: 2rem;
  }

  .checkmark {
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, #00ff00, #00cc00);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: #000;
    font-weight: bold;
    margin: 0 auto;
    box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
  }

  .confirmation-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .confirmation-header h1 {
    font-size: 2.5rem;
    color: #00ff00;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #00ff00, #00cc00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 1.2rem;
    color: rgba(255,255,255,0.8);
    margin: 0;
  }

  .reservation-details {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .reservation-details h2 {
    color: #ffd700;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    text-align: center;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: rgba(255,255,255,0.03);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .detail-label {
    color: rgba(255,255,255,0.7);
    font-weight: 500;
  }

  .detail-value {
    color: #ffd700;
    font-weight: 600;
  }

  .participant-info, .message-info {
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .participant-info h3, .message-info h3 {
    color: #ffd700;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  .participant-details p {
    margin: 0.5rem 0;
    color: rgba(255,255,255,0.9);
  }

  .message-text {
    background: rgba(255,255,255,0.05);
    padding: 1rem;
    border-radius: 8px;
    border-left: 3px solid #ffd700;
    font-style: italic;
    line-height: 1.6;
  }

  .next-steps {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .next-steps h3 {
    color: #ffd700;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    text-align: center;
  }

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .step-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .step-content h4 {
    color: #ffd700;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .step-content p {
    color: rgba(255,255,255,0.8);
    margin: 0;
    line-height: 1.5;
  }

  .question-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
    text-align: center;
  }

  .question-section h3 {
    color: #ffd700;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .question-section p {
    color: rgba(255,255,255,0.8);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .question-form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
  }

  .question-input {
    width: 100%;
    padding: 1rem;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    color: #fff;
    font-size: 1rem;
    line-height: 1.5;
    resize: vertical;
    min-height: 100px;
  }

  .question-input:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }

  .error-message {
    color: #ff6b6b;
    font-size: 0.9rem;
    margin-top: -0.5rem;
    text-align: center;
  }

  .btn-question {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 250px;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .btn-question:hover {
    background: linear-gradient(45deg, #ffed4e, #ffd700);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  }

  .btn-question:disabled {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.5);
    cursor: not-allowed;
    box-shadow: none;
  }

  .success-message {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .success-message h4 {
    color: #00ff00;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  .success-message p {
    color: rgba(255,255,255,0.8);
    margin: 0;
    line-height: 1.5;
  }

  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .contact-method {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: rgba(255,255,255,0.9);
    font-size: 1rem;
  }

  .contact-icon {
    font-size: 1.2rem;
  }

  .contact-note {
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
    margin-top: 1rem;
    text-align: center;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .btn-primary, .btn-secondary, .btn-tertiary {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 250px;
    justify-content: center;
  }

  .btn-primary {
    background: linear-gradient(45deg, #00ff00, #00cc00);
    color: #000;
    box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
  }

  .btn-primary:hover {
    background: linear-gradient(45deg, #00cc00, #00ff00);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 255, 0, 0.4);
  }

  .btn-secondary {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .btn-secondary:hover {
    background: linear-gradient(45deg, #ffed4e, #ffd700);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  }

  .btn-tertiary {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .btn-tertiary:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
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
    .confirmation-container {
      margin: 1rem;
      padding: 1.5rem;
    }

    .confirmation-header h1 {
      font-size: 2rem;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }

    .action-buttons {
      gap: 0.8rem;
    }

    .btn-primary, .btn-secondary, .btn-tertiary {
      min-width: 200px;
      padding: 0.8rem 1.5rem;
    }

    .question-input {
      padding: 0.8rem;
      font-size: 0.95rem;
    }

    .btn-question {
      min-width: 200px;
      padding: 0.8rem 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .confirmation-container {
      margin: 0.5rem;
      padding: 1rem;
    }

    .confirmation-header h1 {
      font-size: 1.8rem;
    }

    .checkmark {
      width: 60px;
      height: 60px;
      font-size: 2rem;
    }

    .btn-primary, .btn-secondary, .btn-tertiary {
      min-width: 180px;
      padding: 0.7rem 1.2rem;
      font-size: 0.9rem;
    }

    .question-input {
      padding: 0.7rem;
      font-size: 0.9rem;
      min-height: 80px;
    }

    .btn-question {
      min-width: 180px;
      padding: 0.7rem 1.2rem;
      font-size: 0.9rem;
    }
  }
</style>
