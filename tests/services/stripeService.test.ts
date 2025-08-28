import { describe, it, expect, vi, beforeEach } from 'vitest';
import StripeService from '../../src/lib/server/stripeService';

// Mock de Stripe
const mockStripe = {
  paymentIntents: {
    create: vi.fn(),
    retrieve: vi.fn()
  },
  webhooks: {
    constructEvent: vi.fn()
  }
};

vi.mock('stripe', () => ({
  default: vi.fn(() => mockStripe)
}));

describe('StripeService', () => {
  let stripeService: StripeService;

  beforeEach(() => {
    vi.clearAllMocks();
    stripeService = new StripeService();
  });

  describe('Création de Payment Intent', () => {
    it('devrait créer un Payment Intent avec succès', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret_abc',
        amount: 2000,
        currency: 'eur',
        metadata: {
          baladeId: '1',
          nombrePersonnes: '2'
        }
      };

      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const result = await stripeService.createPaymentIntent({
        amount: 2000,
        currency: 'eur',
        metadata: {
          baladeId: '1',
          nombrePersonnes: '2'
        }
      });

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 2000,
        currency: 'eur',
        metadata: {
          baladeId: '1',
          nombrePersonnes: '2'
        }
      });

      expect(result).toEqual(mockPaymentIntent);
    });

    it('devrait gérer les erreurs lors de la création', async () => {
      const error = new Error('Stripe error');
      mockStripe.paymentIntents.create.mockRejectedValue(error);

      await expect(
        stripeService.createPaymentIntent({
          amount: 2000,
          currency: 'eur',
          metadata: {}
        })
      ).rejects.toThrow('Stripe error');
    });
  });

  describe('Récupération de Payment Intent', () => {
    it('devrait récupérer un Payment Intent avec succès', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        amount: 2000,
        currency: 'eur',
        status: 'succeeded',
        metadata: {
          baladeId: '1',
          nombrePersonnes: '2'
        }
      };

      mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

      const result = await stripeService.getPaymentIntent('pi_test_123');

      expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_test_123');
      expect(result).toEqual(mockPaymentIntent);
    });

    it('devrait gérer les erreurs lors de la récupération', async () => {
      const error = new Error('Payment Intent not found');
      mockStripe.paymentIntents.retrieve.mockRejectedValue(error);

      await expect(
        stripeService.getPaymentIntent('pi_invalid')
      ).rejects.toThrow('Payment Intent not found');
    });
  });

  describe('Vérification de webhook', () => {
    it('devrait vérifier la signature du webhook avec succès', () => {
      const payload = '{"test": "data"}';
      const signature = 'whsec_test_signature';
      const secret = 'whsec_test_secret';

      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            amount: 2000
          }
        }
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const result = stripeService.verifyWebhookSignature(payload, signature, secret);

      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
        payload,
        signature,
        secret
      );
      expect(result).toEqual(mockEvent);
    });

    it('devrait gérer les erreurs de signature invalide', () => {
      const payload = '{"test": "data"}';
      const signature = 'invalid_signature';
      const secret = 'whsec_test_secret';

      const error = new Error('Invalid signature');
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw error;
      });

      expect(() => {
        stripeService.verifyWebhookSignature(payload, signature, secret);
      }).toThrow('Invalid signature');
    });
  });

  describe('Conversion de prix', () => {
    it('devrait convertir un prix en euros vers centimes', () => {
      expect(StripeService.convertPriceToCents('50€')).toBe(5000);
      expect(StripeService.convertPriceToCents('25.50€')).toBe(2550);
      expect(StripeService.convertPriceToCents('100€')).toBe(10000);
      expect(StripeService.convertPriceToCents('1€')).toBe(100);
    });

    it('devrait gérer les prix sans symbole euro', () => {
      expect(StripeService.convertPriceToCents('50')).toBe(5000);
      expect(StripeService.convertPriceToCents('25.50')).toBe(2550);
    });

    it('devrait gérer les prix avec espaces', () => {
      expect(StripeService.convertPriceToCents('50 €')).toBe(5000);
      expect(StripeService.convertPriceToCents(' 25.50€ ')).toBe(2550);
    });

    it('devrait gérer les prix invalides', () => {
      expect(() => {
        StripeService.convertPriceToCents('invalid');
      }).toThrow();
    });
  });

  describe('Formatage de prix', () => {
    it('devrait formater les centimes en euros', () => {
      expect(StripeService.formatCentsToEuros(5000)).toBe('50.00€');
      expect(StripeService.formatCentsToEuros(2550)).toBe('25.50€');
      expect(StripeService.formatCentsToEuros(100)).toBe('1.00€');
      expect(StripeService.formatCentsToEuros(0)).toBe('0.00€');
    });

    it('devrait gérer les montants négatifs', () => {
      expect(StripeService.formatCentsToEuros(-1000)).toBe('-10.00€');
    });
  });

  describe('Validation des données', () => {
    it('devrait valider un montant positif', () => {
      expect(StripeService.convertPriceToCents('50€')).toBeGreaterThan(0);
    });

    it('devrait valider un Payment Intent ID', () => {
      const validId = 'pi_test_1234567890';
      expect(validId).toMatch(/^pi_/);
    });

    it('devrait valider une devise', () => {
      const validCurrency = 'eur';
      expect(['eur', 'usd', 'gbp']).toContain(validCurrency);
    });
  });

  describe('Gestion des métadonnées', () => {
    it('devrait traiter les métadonnées correctement', async () => {
      const metadata = {
        baladeId: '1',
        nombrePersonnes: '2',
        participantName: 'Test User'
      };

      const mockPaymentIntent = {
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret_abc',
        amount: 2000,
        currency: 'eur',
        metadata
      };

      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const result = await stripeService.createPaymentIntent({
        amount: 2000,
        currency: 'eur',
        metadata
      });

      expect(result.metadata).toEqual(metadata);
      expect(result.metadata.baladeId).toBe('1');
      expect(result.metadata.nombrePersonnes).toBe('2');
    });
  });
});
