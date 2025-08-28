<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import StripePaymentForm from '$lib/components/StripePaymentForm.svelte';
  import StripeClientService from '$lib/client/stripeClient';
  import type { PaymentIntentResponse } from '$lib/client/stripeClient';

  // Récupérer les paramètres de l'URL
  $: baladeId = $page.url.searchParams.get('baladeId') || $page.url.searchParams.get('id');

  // Variables pour le formulaire
  let reservationForm = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    nombrePersonnes: 1,
    message: ''
  };

  let balade: any = null;
  let isLoading = true;
  let isCreatingPayment = false;
  let paymentIntent: PaymentIntentResponse | null = null;
  let showPaymentForm = false;
  let errorMessage = '';
  let successMessage = '';

  // Validation côté client
  let errors: Record<string, string> = {};

  onMount(async () => {
    if (baladeId) {
      await loadBalade();
    }
  });

  async function loadBalade() {
    try {
      const response = await fetch(`/api/balades/${baladeId}`);
      if (response.ok) {
        const data = await response.json();
        balade = data.balade;
      } else {
        errorMessage = 'Balade non trouvée';
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la balade:', error);
      errorMessage = 'Erreur lors du chargement de la balade';
    } finally {
      isLoading = false;
    }
  }

  function validateField(field: string, value: string | number): boolean {
    errors[field] = '';
    
    switch (field) {
      case 'prenom':
        if (typeof value === 'string' && value.length < 2) {
          errors[field] = 'Le prénom doit contenir au moins 2 caractères';
          return false;
        }
        if (typeof value === 'string' && !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          errors[field] = 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes';
          return false;
        }
        break;
        
      case 'nom':
        if (typeof value === 'string' && value.length < 2) {
          errors[field] = 'Le nom doit contenir au moins 2 caractères';
          return false;
        }
        if (typeof value === 'string' && !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          errors[field] = 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes';
          return false;
        }
        break;
        
      case 'email':
        if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors[field] = 'Veuillez entrer une adresse email valide';
            return false;
          }
        }
        break;
        
      case 'telephone':
        if (typeof value === 'string' && value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          errors[field] = 'Le numéro de téléphone ne peut contenir que des chiffres, espaces, tirets, plus et parenthèses';
          return false;
        }
        break;

      case 'nombrePersonnes':
        if (typeof value === 'number') {
          if (value < 1) {
            errors[field] = 'Le nombre de personnes doit être au moins 1';
            return false;
          }
          if (value > balade.placesDisponibles) {
            errors[field] = `Le nombre de personnes ne peut pas dépasser ${balade.placesDisponibles}`;
            return false;
          }
        }
        break;
        
      case 'message':
        if (typeof value === 'string' && value && value.length < 10) {
          errors[field] = 'Le message doit contenir au moins 10 caractères';
          return false;
        }
        if (typeof value === 'string' && value && value.length > 1000) {
          errors[field] = 'Le message ne peut pas dépasser 1000 caractères';
          return false;
        }
        break;
    }
    
    return true;
  }

  function validateForm(): boolean {
    const fields = ['prenom', 'nom', 'email', 'nombrePersonnes'];
    let isValid = true;
    
    fields.forEach(field => {
      if (!validateField(field, reservationForm[field as keyof typeof reservationForm])) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  async function handleCreatePaymentIntent() {
    if (!validateForm()) {
      return;
    }

    if (!baladeId) {
      errorMessage = 'ID de balade manquant';
      return;
    }

    isCreatingPayment = true;
    errorMessage = '';

    try {
      const paymentIntentData = {
        baladeId: parseInt(baladeId),
        participantName: `${reservationForm.prenom} ${reservationForm.nom}`,
        participantEmail: reservationForm.email,
        prenom: reservationForm.prenom,
        nom: reservationForm.nom,
        telephone: reservationForm.telephone,
        nombrePersonnes: reservationForm.nombrePersonnes,
        message: reservationForm.message
      };

      const result = await StripeClientService.createPaymentIntent(paymentIntentData);
      
      if (result.success && result.clientSecret) {
        paymentIntent = result;
        showPaymentForm = true;
      } else {
        errorMessage = result.error || 'Erreur lors de la création du paiement';
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'intention de paiement:', error);
      errorMessage = 'Erreur lors de la création du paiement';
    } finally {
      isCreatingPayment = false;
    }
  }

  function handlePaymentSuccess(paymentIntentData: any) {
    successMessage = 'Paiement réussi ! Votre réservation a été confirmée.';
    
    // Rediriger vers une page de confirmation avec l'ID de réservation
    setTimeout(() => {
      const reservationId = paymentIntent?.reservationId || paymentIntentData.reservationId;
      if (reservationId) {
        goto(`/photographie/argentique/reservation/confirmation?paymentId=${reservationId}`);
      } else {
        goto('/photographie/argentique');
      }
    }, 3000);
  }

  function handlePaymentError(error: string) {
    errorMessage = error;
    showPaymentForm = false;
  }

  function goBack() {
    goto('/photographie/argentique');
  }
</script>

<svelte:head>
  <title>Réservation avec paiement - {balade?.theme || 'Balade'}</title>
</svelte:head>

<div class="reservation-container">
  {#if isLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement de la balade...</p>
    </div>
  {:else if errorMessage && !balade}
    <div class="error-container">
      <h2>Erreur</h2>
      <p>{errorMessage}</p>
      <button on:click={goBack} class="btn-secondary">Retour aux balades</button>
    </div>
  {:else if balade}
    <div class="reservation-content">
      <!-- En-tête de la balade -->
      <div class="balade-header">
        <button on:click={goBack} class="back-button">← Retour</button>
        <h1>Réservation : {balade.theme}</h1>
        <div class="balade-details">
          <p><strong>Date :</strong> {balade.date}</p>
          <p><strong>Heure :</strong> {balade.heure}</p>
          <p><strong>Lieu :</strong> {balade.lieu}</p>
          <p><strong>Prix :</strong> {balade.prix}</p>
          <p><strong>Places disponibles :</strong> {balade.placesDisponibles}</p>
        </div>
      </div>

      {#if successMessage}
        <div class="success-message">
          <h2>🎉 Réservation confirmée !</h2>
          <p>{successMessage}</p>
          <p>Redirection en cours...</p>
        </div>
      {:else if showPaymentForm && paymentIntent}
        <!-- Formulaire de paiement Stripe -->
        <StripePaymentForm
          clientSecret={paymentIntent.clientSecret!}
          amount={paymentIntent.amount!}
          baladeTheme={balade.theme}
          baladeDate={balade.date}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      {:else}
        <!-- Formulaire de réservation -->
        <div class="reservation-form-container">
          <h2>Informations de réservation</h2>
          
          {#if errorMessage}
            <div class="error-message">{errorMessage}</div>
          {/if}

          <form on:submit|preventDefault={handleCreatePaymentIntent} class="reservation-form">
            <div class="form-group">
              <label for="prenom">Prénom *</label>
              <input
                type="text"
                id="prenom"
                bind:value={reservationForm.prenom}
                class:error={errors.prenom}
                required
              />
              {#if errors.prenom}
                <span class="error-text">{errors.prenom}</span>
              {/if}
            </div>

            <div class="form-group">
              <label for="nom">Nom *</label>
              <input
                type="text"
                id="nom"
                bind:value={reservationForm.nom}
                class:error={errors.nom}
                required
              />
              {#if errors.nom}
                <span class="error-text">{errors.nom}</span>
              {/if}
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                bind:value={reservationForm.email}
                class:error={errors.email}
                required
              />
              {#if errors.email}
                <span class="error-text">{errors.email}</span>
              {/if}
            </div>

            <div class="form-group">
              <label for="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                bind:value={reservationForm.telephone}
                class:error={errors.telephone}
              />
              {#if errors.telephone}
                <span class="error-text">{errors.telephone}</span>
              {/if}
            </div>

            <div class="form-group">
              <label for="nombrePersonnes">Nombre de personnes *</label>
              <input
                type="number"
                id="nombrePersonnes"
                bind:value={reservationForm.nombrePersonnes}
                class:error={errors.nombrePersonnes}
                min="1"
                max={balade.placesDisponibles}
                required
              />
              {#if errors.nombrePersonnes}
                <span class="error-text">{errors.nombrePersonnes}</span>
              {/if}
            </div>

            <div class="form-group">
              <label for="message">Message (optionnel)</label>
              <textarea
                id="message"
                bind:value={reservationForm.message}
                class:error={errors.message}
                rows="4"
                placeholder="Informations supplémentaires, questions, etc."
              ></textarea>
              {#if errors.message}
                <span class="error-text">{errors.message}</span>
              {/if}
            </div>

            <div class="form-summary">
              <h3>Récapitulatif</h3>
              <p><strong>Balade :</strong> {balade.theme}</p>
              <p><strong>Prix :</strong> {balade.prix}</p>
              <p><strong>Paiement sécurisé</strong> par Stripe</p>
            </div>

            <button type="submit" disabled={isCreatingPayment} class="btn-primary">
              {#if isCreatingPayment}
                <span class="spinner"></span>
                Préparation du paiement...
              {:else}
                Continuer vers le paiement
              {/if}
            </button>
          </form>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .reservation-container {
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

  .reservation-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .balade-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
  }

  .back-button {
    background: none;
    border: none;
    color: #667eea;
    font-size: 1rem;
    cursor: pointer;
    margin-bottom: 1rem;
    padding: 0;
  }

  .back-button:hover {
    text-decoration: underline;
  }

  .balade-header h1 {
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    font-size: 2rem;
  }

  .balade-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .balade-details p {
    margin: 0;
    color: #666;
  }

  .reservation-form-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .reservation-form-container h2 {
    color: #1a1a1a;
    margin-bottom: 2rem;
    text-align: center;
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid #fcc;
  }

  .success-message {
    text-align: center;
    padding: 2rem;
    background: #f0f9ff;
    border-radius: 8px;
    border: 1px solid #bae6fd;
  }

  .success-message h2 {
    color: #059669;
    margin-bottom: 1rem;
  }

  .reservation-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: #1a1a1a;
  }

  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .form-group input.error,
  .form-group textarea.error {
    border-color: #dc3545;
  }

  .error-text {
    color: #dc3545;
    font-size: 0.85rem;
  }

  .form-summary {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .form-summary h3 {
    margin: 0 0 1rem 0;
    color: #1a1a1a;
  }

  .form-summary p {
    margin: 0.5rem 0;
    color: #666;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .btn-secondary:hover {
    background: #5a6268;
  }

  @media (max-width: 768px) {
    .reservation-container {
      padding: 1rem;
    }

    .reservation-content {
      padding: 1.5rem;
    }

    .balade-header h1 {
      font-size: 1.5rem;
    }

    .balade-details {
      grid-template-columns: 1fr;
    }

    .btn-primary {
      padding: 0.875rem 1.5rem;
      font-size: 0.9rem;
    }
  }
</style>
