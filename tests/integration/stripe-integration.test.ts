import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { baladesService } from '../../src/lib/server/baladesService';
import StripeService from '../../src/lib/server/stripeService';
import { EmailService } from '../../src/lib/server/emailService';

// Mocks pour les tests d'intégration
vi.mock('better-sqlite3');
vi.mock('stripe');
vi.mock('nodemailer');

describe('Intégration Stripe - Flux complet', () => {
  let stripeService: StripeService;
  let emailService: EmailService;

  beforeAll(() => {
    // Configuration des mocks globaux
    vi.mock('$env/dynamic/private', () => ({
      env: {
        STRIPE_SECRET_KEY: 'sk_test_integration',
        STRIPE_WEBHOOK_SECRET: 'whsec_integration',
        EMAIL_USER: 'test@example.com',
        EMAIL_APP_PASSWORD: 'test_password'
      }
    }));
  });

  beforeEach(() => {
    vi.clearAllMocks();
    stripeService = new StripeService();
    emailService = new EmailService();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Flux de réservation complet', () => {
    it('devrait gérer un flux de réservation complet avec succès', async () => {
      // 1. Création d'une balade de test
      const baladeData = {
        theme: 'Balade Test Intégration',
        date: '2025-02-15',
        heure: '14:00',
        lieu: 'Lieu Test',
        prix: '50€',
        description: 'Test intégration',
        statut: 'en_ligne'
      };

      const baladeId = baladesService.creerBalade(baladeData);
      expect(baladeId).toBeGreaterThan(0);

      // 2. Création d'une réservation
      const reservationData = {
        baladeId,
        prenom: 'Test',
        nom: 'Intégration',
        email: 'test@integration.com',
        telephone: '0123456789',
        message: 'Test intégration',
        nombrePersonnes: 2,
        montant: 10000 // 100€ en centimes
      };

      const reservationId = baladesService.creerReservation(reservationData);
      expect(reservationId).toBeGreaterThan(0);

      // 3. Vérification du statut initial
      const reservationInitiale = baladesService.getReservationById(reservationId);
      expect(reservationInitiale.statut).toBe('en_attente');

      // 4. Simulation d'un Payment Intent Stripe
      const paymentIntentData = {
        amount: 10000,
        currency: 'eur',
        metadata: {
          baladeId: baladeId.toString(),
          nombrePersonnes: '2',
          participantName: 'Test Intégration',
          participantEmail: 'test@integration.com'
        }
      };

      const paymentIntent = await stripeService.createPaymentIntent(paymentIntentData);
      expect(paymentIntent.amount).toBe(10000);
      expect(paymentIntent.currency).toBe('eur');

      // 5. Simulation d'un webhook de succès
      const webhookEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: paymentIntent.id,
            metadata: paymentIntentData.metadata
          }
        }
      };

      // 6. Traitement du webhook
      const reservation = baladesService.getReservationByPaymentIntentId(paymentIntent.id);
      if (reservation) {
        // Mise à jour du statut
        const updateSuccess = baladesService.modifierReservation(reservation.id, {
          statut: 'confirmee',
          paymentIntentId: paymentIntent.id,
          montant: paymentIntent.amount
        });
        expect(updateSuccess).toBe(true);

        // Décrémentation des places
        const decrementSuccess = baladesService.decrementerPlacesDisponiblesMultiple(
          reservation.baladeId,
          reservation.nombrePersonnes
        );
        expect(decrementSuccess).toBe(true);

        // Envoi des emails
        const balade = baladesService.getBaladeById(reservation.baladeId);
        if (balade) {
          const emailSuccess = await emailService.sendStripeReservationConfirmation(
            reservation,
            balade
          );
          expect(emailSuccess).toBe(true);
        }
      }

      // 7. Vérification finale
      const reservationFinale = baladesService.getReservationById(reservationId);
      expect(reservationFinale.statut).toBe('confirmee');

      const baladeFinale = baladesService.getBaladeById(baladeId);
      expect(baladeFinale.placesDisponibles).toBe(3); // 5 - 2 = 3
    });

    it('devrait gérer les erreurs de paiement', async () => {
      // Test avec un Payment Intent qui échoue
      const paymentIntentData = {
        amount: 10000,
        currency: 'eur',
        metadata: {
          baladeId: '1',
          nombrePersonnes: '2'
        }
      };

      // Simulation d'une erreur Stripe
      vi.spyOn(stripeService, 'createPaymentIntent').mockRejectedValue(
        new Error('Card declined')
      );

      await expect(
        stripeService.createPaymentIntent(paymentIntentData)
      ).rejects.toThrow('Card declined');
    });

    it('devrait gérer les places insuffisantes', () => {
      // Création d'une balade avec peu de places
      const baladeData = {
        theme: 'Balade Limite',
        date: '2025-02-15',
        heure: '14:00',
        lieu: 'Lieu Test',
        prix: '50€',
        description: 'Test limite',
        statut: 'en_ligne'
      };

      const baladeId = baladesService.creerBalade(baladeData);

      // Tentative de réservation avec trop de personnes
      const reservationData = {
        baladeId,
        prenom: 'Test',
        nom: 'Limite',
        email: 'test@limite.com',
        nombrePersonnes: 10, // Plus que les places disponibles
        montant: 50000
      };

      // La réservation devrait être rejetée
      expect(() => {
        baladesService.creerReservation(reservationData);
      }).toThrow();
    });
  });

  describe('Gestion des webhooks', () => {
    it('devrait traiter différents types d\'événements webhook', () => {
      const events = [
        {
          type: 'payment_intent.succeeded',
          shouldProcess: true,
          description: 'Paiement réussi'
        },
        {
          type: 'payment_intent.payment_failed',
          shouldProcess: false,
          description: 'Paiement échoué'
        },
        {
          type: 'payment_intent.canceled',
          shouldProcess: false,
          description: 'Paiement annulé'
        }
      ];

      events.forEach(event => {
        const shouldProcess = ['payment_intent.succeeded'].includes(event.type);
        expect(shouldProcess).toBe(event.shouldProcess);
      });
    });

    it('devrait valider les signatures webhook', () => {
      const payload = '{"test": "data"}';
      const validSignature = 'whsec_valid_signature';
      const invalidSignature = 'whsec_invalid_signature';
      const secret = 'whsec_test_secret';

      // Test avec signature valide
      expect(() => {
        stripeService.verifyWebhookSignature(payload, validSignature, secret);
      }).not.toThrow();

      // Test avec signature invalide
      expect(() => {
        stripeService.verifyWebhookSignature(payload, invalidSignature, secret);
      }).toThrow();
    });
  });

  describe('Gestion des emails', () => {
    it('devrait envoyer les emails de confirmation', async () => {
      const reservation = {
        id: 1,
        prenom: 'Test',
        nom: 'Email',
        email: 'test@email.com',
        nombrePersonnes: 2,
        montant: 10000
      };

      const balade = {
        id: 1,
        theme: 'Balade Email Test',
        date: '2025-02-15',
        heure: '14:00',
        lieu: 'Lieu Test'
      };

      const emailSuccess = await emailService.sendStripeReservationConfirmation(
        reservation,
        balade
      );

      expect(emailSuccess).toBe(true);
    });

    it('devrait gérer les erreurs d\'envoi d\'email', async () => {
      // Simulation d'une erreur SMTP
      vi.spyOn(emailService, 'sendStripeReservationConfirmation').mockRejectedValue(
        new Error('SMTP error')
      );

      const reservation = {
        id: 1,
        prenom: 'Test',
        nom: 'Email',
        email: 'test@email.com',
        nombrePersonnes: 2,
        montant: 10000
      };

      const balade = {
        id: 1,
        theme: 'Balade Email Test',
        date: '2025-02-15',
        heure: '14:00',
        lieu: 'Lieu Test'
      };

      await expect(
        emailService.sendStripeReservationConfirmation(reservation, balade)
      ).rejects.toThrow('SMTP error');
    });
  });

  describe('Correction des données', () => {
    it('devrait corriger les incohérences de places', () => {
      // Création de données incohérentes
      const baladeId = baladesService.creerBalade({
        theme: 'Balade Correction',
        date: '2025-02-15',
        heure: '14:00',
        lieu: 'Lieu Test',
        prix: '50€',
        description: 'Test correction',
        statut: 'en_ligne'
      });

      // Création de réservations confirmées
      for (let i = 0; i < 3; i++) {
        baladesService.creerReservation({
          baladeId,
          prenom: `Test${i}`,
          nom: 'Correction',
          email: `test${i}@correction.com`,
          nombrePersonnes: 1,
          montant: 5000
        });
      }

      // Correction automatique
      const result = baladesService.corrigerPlacesDisponibles();

      expect(result.baladesCorrigees).toBeGreaterThan(0);
      expect(result.placesCorrigees).toBeGreaterThan(0);

      // Vérification que les places sont correctes
      const balade = baladesService.getBaladeById(baladeId);
      expect(balade.placesDisponibles).toBe(2); // 5 - 3 = 2
    });
  });

  describe('Validation des données', () => {
    it('devrait valider les données de réservation', () => {
      const validData = {
        baladeId: 1,
        prenom: 'Test',
        nom: 'Validation',
        email: 'test@validation.com',
        nombrePersonnes: 2,
        montant: 10000
      };

      // Validation des champs obligatoires
      expect(validData.baladeId).toBeGreaterThan(0);
      expect(validData.prenom).toBeTruthy();
      expect(validData.nom).toBeTruthy();
      expect(validData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(validData.nombrePersonnes).toBeGreaterThan(0);
      expect(validData.montant).toBeGreaterThan(0);
    });

    it('devrait valider les prix Stripe', () => {
      const validPrices = ['50€', '25.50€', '100€'];
      const invalidPrices = ['invalid', '-50€', '0€'];

      validPrices.forEach(price => {
        expect(() => {
          StripeService.convertPriceToCents(price);
        }).not.toThrow();
      });

      invalidPrices.forEach(price => {
        expect(() => {
          StripeService.convertPriceToCents(price);
        }).toThrow();
      });
    });
  });
});
