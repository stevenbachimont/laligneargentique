import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

// Initialisation de Stripe avec la clé secrète
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export interface PaymentIntentData {
  amount: number; // Montant en centimes
  currency: string;
  metadata: {
    baladeId: string;
    participantName: string;
    participantEmail: string;
    baladeDate: string;
    baladeTheme: string;
  };
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export class StripeService {
  /**
   * Crée une intention de paiement pour une réservation
   */
  static async createPaymentIntent(data: PaymentIntentData): Promise<PaymentIntentResponse> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: data.metadata,
        description: `Réservation balade: ${data.metadata.baladeTheme} - ${data.metadata.baladeDate}`,
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Erreur lors de la création du PaymentIntent:', error);
      throw new Error('Impossible de créer l\'intention de paiement');
    }
  }

  /**
   * Récupère les détails d'une intention de paiement
   */
  static async getPaymentIntent(paymentIntentId: string) {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Erreur lors de la récupération du PaymentIntent:', error);
      throw new Error('Impossible de récupérer l\'intention de paiement');
    }
  }

  /**
   * Vérifie la signature d'un webhook
   */
  static verifyWebhookSignature(payload: string, signature: string, webhookSecret: string) {
    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.error('Erreur de vérification de signature webhook:', error);
      throw new Error('Signature webhook invalide');
    }
  }

  /**
   * Convertit un prix en euros vers centimes (format Stripe)
   */
  static convertPriceToCents(priceInEuros: string): number {
    // Extrait le nombre du prix (ex: "45€" -> 45)
    const priceMatch = priceInEuros.match(/(\d+)/);
    if (!priceMatch) {
      throw new Error('Format de prix invalide');
    }
    
    const euros = parseInt(priceMatch[1]);
    return euros * 100; // Conversion en centimes
  }

  /**
   * Formate un montant en centimes vers euros
   */
  static formatCentsToEuros(cents: number): string {
    return `${(cents / 100).toFixed(2)}€`;
  }
}

export default StripeService;
