import { loadStripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface PaymentIntentRequest {
  baladeId: number;
  participantName: string;
  participantEmail: string;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  reservationId?: number;
  amount?: number;
  currency?: string;
  balade?: {
    id: number;
    theme: string;
    date: string;
    heure: string;
    lieu: string;
    prix: string;
    placesDisponibles: number;
  };
  error?: string;
}

export class StripeClientService {
  /**
   * Crée une intention de paiement
   */
  static async createPaymentIntent(data: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    try {
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur lors de la création de l\'intention de paiement:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  /**
   * Confirme un paiement avec Stripe
   */
  static async confirmPayment(clientSecret: string, paymentMethod: any) {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe non initialisé');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, paymentIntent };
    } catch (error) {
      console.error('Erreur lors de la confirmation du paiement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur de paiement',
      };
    }
  }

  /**
   * Formate un montant en centimes vers euros
   */
  static formatAmount(amount: number): string {
    return `${(amount / 100).toFixed(2)}€`;
  }
}

export default StripeClientService;
