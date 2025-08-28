<script lang="ts">
  import { onMount } from 'svelte';
  import { getStripe } from '$lib/client/stripeClient';
  import StripeClientService from '$lib/client/stripeClient';
  import type { PaymentIntentResponse } from '$lib/client/stripeClient';

  export let clientSecret: string;
  export let amount: number;
  export let baladeTheme: string;
  export let baladeDate: string;
  export let onSuccess: (paymentIntent: any) => void;
  export let onError: (error: string) => void;

  let cardElement: HTMLElement;
  let stripe: any;
  let elements: any;
  let card: any;
  let isProcessing = false;
  let errorMessage = '';

  onMount(async () => {
    try {
      stripe = await getStripe();
      if (!stripe) {
        onError('Stripe non initialisé');
        return;
      }

      elements = stripe.elements();
      card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
      });

      card.mount(cardElement);
      card.on('change', handleCardChange);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Stripe:', error);
      onError('Erreur lors de l\'initialisation du paiement');
    }
  });

  function handleCardChange(event: any) {
    if (event.error) {
      errorMessage = event.error.message;
    } else {
      errorMessage = '';
    }
  }

  async function handleSubmit() {
    if (!stripe || !card) {
      onError('Stripe non initialisé');
      return;
    }

    isProcessing = true;
    errorMessage = '';

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
        },
      });

      if (error) {
        errorMessage = error.message;
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      errorMessage = 'Erreur lors du traitement du paiement';
      onError('Erreur lors du traitement du paiement');
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="stripe-payment-form">
  <div class="payment-header">
    <h3>Paiement sécurisé</h3>
    <p class="payment-details">
      <strong>{baladeTheme}</strong> - {baladeDate}
    </p>
    <p class="payment-amount">
      Montant : <strong>{StripeClientService.formatAmount(amount)}</strong>
    </p>
  </div>

  <form on:submit|preventDefault={handleSubmit} class="payment-form">
    <div class="card-element-container">
      <label for="card-element">Informations de carte</label>
      <div bind:this={cardElement} id="card-element" class="card-element"></div>
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
    </div>

    <button type="submit" disabled={isProcessing} class="payment-button">
      {#if isProcessing}
        <span class="loading-spinner"></span>
        Traitement en cours...
      {:else}
        Payer {StripeClientService.formatAmount(amount)}
      {/if}
    </button>
  </form>

  <div class="payment-security">
    <p>
      🔒 Paiement sécurisé par Stripe
    </p>
  </div>
</div>

<style>
  .stripe-payment-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .payment-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .payment-header h3 {
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .payment-details {
    color: #666;
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  .payment-amount {
    color: #1a1a1a;
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }

  .payment-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .card-element-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-element-container label {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 0.9rem;
  }

  .card-element {
    padding: 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    background: white;
    transition: border-color 0.2s ease;
  }

  .card-element:focus-within {
    border-color: #6772e5;
  }

  .error-message {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  .payment-button {
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

  .payment-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .payment-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .payment-security {
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e1e5e9;
  }

  .payment-security p {
    color: #666;
    font-size: 0.85rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    .stripe-payment-form {
      padding: 1.5rem;
      margin: 1rem;
    }

    .payment-button {
      padding: 0.875rem 1.5rem;
      font-size: 0.9rem;
    }
  }
</style>
