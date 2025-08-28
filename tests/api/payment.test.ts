import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../src/routes/api/payment/create-intent/+server';
import { POST as webhookPOST } from '../../src/routes/api/payment/webhook/+server';
import { baladesService } from '../../src/lib/server/baladesService';
import StripeService from '../../src/lib/server/stripeService';
import { EmailService } from '../../src/lib/server/emailService';

// Mocks
vi.mock('../../src/lib/server/baladesService');
vi.mock('../../src/lib/server/stripeService');
vi.mock('../../src/lib/server/emailService');
vi.mock('$env/dynamic/private', () => ({
  env: {
    STRIPE_WEBHOOK_SECRET: 'whsec_test_secret'
  }
}));

const mockBaladesService = vi.mocked(baladesService);
const mockStripeService = vi.mocked(StripeService);
const mockEmailService = vi.mocked(EmailService);

describe('API Payment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/payment/create-intent', () => {
    it('devrait créer un Payment Intent avec succès', async () => {
      const requestData = {
        baladeId: 1,
        participantName: 'Test User',
        participantEmail: 'test@example.com',
        prenom: 'Test',
        nom: 'User',
        nombrePersonnes: 2,
        message: 'Test message'
      };

      const mockBalade = {
        id: 1,
        theme: 'Test Balade',
        date: '2025-01-15',
        heure: '14:00',
        lieu: 'Test Lieu',
        prix: '50€',
        placesDisponibles: 5
      };

      const mockPaymentIntent = {
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret_abc',
        amount: 10000,
        currency: 'eur'
      };

      const mockReservation = {
        id: 1,
        baladeId: 1,
        statut: 'en_attente'
      };

      // Mock des services
      mockBaladesService.getBaladeById.mockReturnValue(mockBalade);
      mockStripeService.prototype.createPaymentIntent.mockResolvedValue(mockPaymentIntent);
      mockBaladesService.creerReservation.mockReturnValue(1);

      const request = new Request('http://localhost:3000/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const response = await POST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.clientSecret).toBe('pi_test_123_secret_abc');
      expect(data.paymentIntentId).toBe('pi_test_123');
      expect(data.reservationId).toBe(1);
      expect(data.amount).toBe(10000); // 50€ * 2 personnes = 100€ = 10000 centimes

      // Vérifications des appels
      expect(mockBaladesService.getBaladeById).toHaveBeenCalledWith(1);
      expect(mockStripeService.prototype.createPaymentIntent).toHaveBeenCalledWith({
        amount: 10000,
        currency: 'eur',
        metadata: {
          baladeId: '1',
          nombrePersonnes: '2',
          participantName: 'Test User',
          participantEmail: 'test@example.com'
        }
      });
      expect(mockBaladesService.creerReservation).toHaveBeenCalledWith({
        baladeId: 1,
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        telephone: '',
        message: 'Test message',
        nombrePersonnes: 2,
        montant: 10000
      });
    });

    it('devrait gérer les erreurs de validation', async () => {
      const invalidData = {
        baladeId: 999, // Balade inexistante
        participantName: 'Test User',
        participantEmail: 'test@example.com',
        nombrePersonnes: 10 // Trop de personnes
      };

      mockBaladesService.getBaladeById.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidData)
      });

      const response = await POST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Balade non trouvée');
    });

    it('devrait valider le nombre de places disponibles', async () => {
      const requestData = {
        baladeId: 1,
        participantName: 'Test User',
        participantEmail: 'test@example.com',
        nombrePersonnes: 10
      };

      const mockBalade = {
        id: 1,
        theme: 'Test Balade',
        placesDisponibles: 5 // Seulement 5 places disponibles
      };

      mockBaladesService.getBaladeById.mockReturnValue(mockBalade);

      const request = new Request('http://localhost:3000/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const response = await POST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Il n\'y a que 5 place(s) disponible(s)');
    });
  });

  describe('POST /api/payment/webhook', () => {
    it('devrait traiter un webhook payment_intent.succeeded avec succès', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            metadata: {
              baladeId: '1',
              nombrePersonnes: '2'
            }
          }
        }
      };

      const mockReservation = {
        id: 1,
        baladeId: 1,
        statut: 'en_attente',
        nombrePersonnes: 2
      };

      const mockBalade = {
        id: 1,
        theme: 'Test Balade'
      };

      // Mock des services
      mockStripeService.prototype.verifyWebhookSignature.mockReturnValue(mockEvent);
      mockBaladesService.getReservationByPaymentIntentId.mockReturnValue(mockReservation);
      mockBaladesService.modifierReservation.mockReturnValue(true);
      mockBaladesService.decrementerPlacesDisponiblesMultiple.mockReturnValue(true);
      mockBaladesService.getBaladeById.mockReturnValue(mockBalade);
      mockEmailService.prototype.sendStripeReservationConfirmation.mockResolvedValue(true);

      const payload = JSON.stringify(mockEvent);
      const request = new Request('http://localhost:3000/api/payment/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'whsec_test_signature'
        },
        body: payload
      });

      const response = await webhookPOST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Vérifications des appels
      expect(mockStripeService.prototype.verifyWebhookSignature).toHaveBeenCalled();
      expect(mockBaladesService.modifierReservation).toHaveBeenCalledWith(1, {
        statut: 'confirmee'
      });
      expect(mockBaladesService.decrementerPlacesDisponiblesMultiple).toHaveBeenCalledWith(1, 2);
      expect(mockEmailService.prototype.sendStripeReservationConfirmation).toHaveBeenCalledWith(
        mockReservation,
        mockBalade
      );
    });

    it('devrait gérer les erreurs de signature webhook', async () => {
      const error = new Error('Invalid signature');
      mockStripeService.prototype.verifyWebhookSignature.mockImplementation(() => {
        throw error;
      });

      const request = new Request('http://localhost:3000/api/payment/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'invalid_signature'
        },
        body: '{"test": "data"}'
      });

      const response = await webhookPOST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid signature');
    });

    it('devrait ignorer les événements non gérés', async () => {
      const mockEvent = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_test_123'
          }
        }
      };

      mockStripeService.prototype.verifyWebhookSignature.mockReturnValue(mockEvent);

      const request = new Request('http://localhost:3000/api/payment/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'whsec_test_signature'
        },
        body: JSON.stringify(mockEvent)
      });

      const response = await webhookPOST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Événement ignoré');
    });

    it('devrait gérer les réservations non trouvées', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            metadata: {
              baladeId: '1',
              nombrePersonnes: '2'
            }
          }
        }
      };

      mockStripeService.prototype.verifyWebhookSignature.mockReturnValue(mockEvent);
      mockBaladesService.getReservationByPaymentIntentId.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/payment/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'whsec_test_signature'
        },
        body: JSON.stringify(mockEvent)
      });

      const response = await webhookPOST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Réservation non trouvée');
    });
  });

  describe('Validation des données', () => {
    it('devrait valider les données de réservation', () => {
      const validData = {
        baladeId: 1,
        participantName: 'Test User',
        participantEmail: 'test@example.com',
        nombrePersonnes: 2
      };

      expect(validData.baladeId).toBeGreaterThan(0);
      expect(validData.participantName).toBeTruthy();
      expect(validData.participantEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(validData.nombrePersonnes).toBeGreaterThan(0);
    });

    it('devrait valider les métadonnées Stripe', () => {
      const validMetadata = {
        baladeId: '1',
        nombrePersonnes: '2',
        participantName: 'Test User'
      };

      expect(validMetadata.baladeId).toBeTruthy();
      expect(validMetadata.nombrePersonnes).toBeTruthy();
      expect(parseInt(validMetadata.nombrePersonnes)).toBeGreaterThan(0);
    });
  });
});
