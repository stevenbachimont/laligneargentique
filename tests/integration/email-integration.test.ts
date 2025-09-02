import { describe, it, expect, beforeEach } from 'vitest';
import { EmailService } from '../../src/lib/server/emailService';
import { EmailTemplateService } from '../../src/lib/server/emailTemplateService';
import { setupEmailMocks, resetEmailMocks, expectEmailsSent, expectEmailToClient, expectEmailToAdmin } from '../utils/emailMocks';

// Configuration des mocks
setupEmailMocks();

describe('Intégration Email - Système de Templates', () => {
  let emailService: EmailService;
  let templateService: EmailTemplateService;

  beforeEach(() => {
    resetEmailMocks();
    emailService = new EmailService();
    templateService = new EmailTemplateService();
  });

  describe('Flux complet d\'envoi d\'emails', () => {
    it('devrait envoyer un email de réservation argentique avec template', async () => {
      const data = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        telephone: '0123456789',
        dateSouhaitee: '2024-12-25',
        nombrePersonnes: 2,
        message: 'Test de réservation'
      };

      const result = await emailService.sendArgentiqueReservation(data);

      expect(result).toBe(true);
      expectEmailsSent(2);
      expectEmailToClient('jean.dupont@example.com');
      expectEmailToAdmin();
    });

    it('devrait envoyer un email de confirmation Stripe avec template', async () => {
      const reservation = {
        id: 'res_123',
        nom: 'Martin',
        prenom: 'Sophie',
        email: 'sophie.martin@example.com',
        nombrePersonnes: 1,
        montant: 4500,
        paymentIntentId: 'pi_123'
      };

      const balade = {
        theme: 'Balade photo Nantes',
        date: '2024-12-25',
        heure: '14:00',
        lieu: 'Place du Commerce'
      };

      const result = await emailService.sendStripeReservationConfirmation(reservation, balade);

      expect(result).toBe(true);
      expectEmailsSent(2);
      expectEmailToClient('sophie.martin@example.com');
      expectEmailToAdmin();
    });

    it('devrait envoyer un email de contact avec template', async () => {
      const data = {
        nom: 'Durand',
        prenom: 'Marie',
        email: 'marie.durand@example.com',
        message: 'Bonjour, j\'ai une question sur vos balades'
      };

      const result = await emailService.sendContactMessage(data);

      expect(result).toBe(true);
      expectEmailsSent(2);
      expectEmailToClient('marie.durand@example.com');
      expectEmailToAdmin();
    });

    it('devrait envoyer un email de question avec template', async () => {
      const data = {
        reservationData: {
          dateSouhaitee: '2024-12-25',
          nombrePersonnes: 2
        },
        question: 'Puis-je amener mon propre appareil photo ?',
        clientEmail: 'client@example.com',
        clientName: 'Client Test'
      };

      const result = await emailService.sendReservationQuestion(data);

      expect(result).toBe(true);
      expectEmailsSent(2);
      expectEmailToClient('client@example.com');
      expectEmailToAdmin();
    });
  });

  describe('Génération de templates', () => {
    it('devrait générer des templates valides pour tous les types d\'emails', () => {
      // Test argentique
      const argentiqueTemplate = templateService.getTemplate('argentique', 'client', {
        prenom: 'Test',
        nom: 'User'
      });
      expect(argentiqueTemplate.subject).toContain('La Ligne Argentique');

      // Test Stripe
      const stripeTemplate = templateService.getTemplate('stripe', 'client', {
        prenom: 'Test',
        nom: 'User',
        theme: 'Balade photo',
        date: '25 décembre 2024',
        heure: '14:00',
        lieu: 'Place du Commerce',
        nombrePersonnes: 1,
        montant: '45.00€'
      });
      expect(stripeTemplate.subject).toContain('Confirmation de réservation');

      // Test contact
      const contactTemplate = templateService.getTemplate('contact', 'client', {
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        message: 'Test message'
      });
      expect(contactTemplate.subject).toContain('Confirmation de votre message');

      // Test question
      const questionTemplate = templateService.getTemplate('question', 'client', {
        clientName: 'Test User',
        question: 'Test question'
      });
      expect(questionTemplate.subject).toContain('Confirmation de votre question');
    });

    it('devrait générer du HTML et du texte valides', () => {
      const template = templateService.getTemplate('argentique', 'client', {
        prenom: 'Test',
        nom: 'User'
      });
      const styles = templateService.getStyles();

      const html = templateService.generateEmailHTML(template, styles);
      const text = templateService.generateEmailText(template);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="fr">');
      expect(html).toContain('Test User');
      expect(html).toContain('La Ligne Argentique');

      expect(text).toContain('La Ligne Argentique');
      expect(text).toContain('Test User');
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs d\'envoi d\'email', async () => {
      // Simuler une erreur en modifiant le mock
      const { mockTransporter } = require('../utils/emailMocks');
      mockTransporter.sendMail.mockRejectedValue(new Error('Erreur SMTP'));

      const data = {
        nom: 'Test',
        prenom: 'Error',
        email: 'error@example.com',
        telephone: '0123456789',
        dateSouhaitee: '2024-12-25',
        nombrePersonnes: 1,
        message: 'Test'
      };

      await expect(emailService.sendArgentiqueReservation(data))
        .rejects.toThrow('Erreur lors de l\'envoi des emails');
    });

    it('devrait gérer les templates inexistants', () => {
      expect(() => {
        templateService.getTemplate('inexistant', 'client', {});
      }).toThrow('Template non trouvé: inexistant.client');
    });
  });

  describe('Vérification de connexion', () => {
    it('devrait vérifier la connexion email', async () => {
      const result = await emailService.verifyConnection();
      expect(result).toBe(true);
    });
  });
});
