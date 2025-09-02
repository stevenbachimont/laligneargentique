import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailService } from '../../src/lib/server/emailService';
import { EmailTemplateService } from '../../src/lib/server/emailTemplateService';

// Mock des variables d'environnement
vi.mock('$env/dynamic/private', () => ({
  env: {
    EMAIL_USER: 'test@example.com',
    EMAIL_APP_PASSWORD: 'test-password',
    ADMIN_EMAIL: 'admin@example.com'
  }
}));

// Mock de nodemailer
const mockTransporter = {
  sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
  verify: vi.fn().mockResolvedValue(true)
};

vi.mock('nodemailer', () => ({
  createTransport: vi.fn().mockReturnValue(mockTransporter)
}));

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    vi.clearAllMocks();
    emailService = new EmailService();
  });

  describe('sendArgentiqueReservation', () => {
    it('devrait envoyer les emails de réservation argentique', async () => {
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
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
      
      // Vérifier que les deux emails ont été envoyés
      const calls = mockTransporter.sendMail.mock.calls;
      expect(calls[0][0].to).toBe('jean.dupont@example.com');
      expect(calls[1][0].to).toBe('admin@example.com');
    });

    it('devrait gérer les erreurs d\'envoi', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Erreur SMTP'));

      const data = {
        nom: 'Test',
        prenom: 'User',
        email: 'test@example.com',
        telephone: '0123456789',
        dateSouhaitee: '2024-12-25',
        nombrePersonnes: 1,
        message: 'Test'
      };

      await expect(emailService.sendArgentiqueReservation(data))
        .rejects.toThrow('Erreur lors de l\'envoi des emails');
    });
  });

  describe('sendStripeReservationConfirmation', () => {
    it('devrait envoyer les emails de confirmation Stripe', async () => {
      const reservation = {
        id: 'res_123',
        nom: 'Martin',
        prenom: 'Sophie',
        email: 'sophie.martin@example.com',
        nombrePersonnes: 1,
        montant: 4500, // 45€ en centimes
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
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
      
      // Vérifier que les deux emails ont été envoyés
      const calls = mockTransporter.sendMail.mock.calls;
      expect(calls[0][0].to).toBe('sophie.martin@example.com');
      expect(calls[1][0].to).toBe('admin@example.com');
    });
  });

  describe('sendContactMessage', () => {
    it('devrait envoyer les emails de contact', async () => {
      const data = {
        nom: 'Durand',
        prenom: 'Marie',
        email: 'marie.durand@example.com',
        message: 'Bonjour, j\'ai une question'
      };

      const result = await emailService.sendContactMessage(data);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
      
      // Vérifier que les deux emails ont été envoyés
      const calls = mockTransporter.sendMail.mock.calls;
      expect(calls[0][0].to).toBe('admin@example.com');
      expect(calls[1][0].to).toBe('marie.durand@example.com');
    });
  });

  describe('sendReservationQuestion', () => {
    it('devrait envoyer les emails de question sur réservation', async () => {
      const data = {
        reservationData: {
          dateSouhaitee: '2024-12-25',
          nombrePersonnes: 2
        },
        question: 'Puis-je amener mon appareil photo ?',
        clientEmail: 'client@example.com',
        clientName: 'Client Test'
      };

      const result = await emailService.sendReservationQuestion(data);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
      
      // Vérifier que les deux emails ont été envoyés
      const calls = mockTransporter.sendMail.mock.calls;
      expect(calls[0][0].to).toBe('admin@example.com');
      expect(calls[1][0].to).toBe('client@example.com');
    });
  });

  describe('verifyConnection', () => {
    it('devrait vérifier la connexion email', async () => {
      const result = await emailService.verifyConnection();
      expect(result).toBe(true);
      expect(mockTransporter.verify).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de connexion', async () => {
      mockTransporter.verify.mockRejectedValue(new Error('Connexion échouée'));
      
      const result = await emailService.verifyConnection();
      expect(result).toBe(false);
    });
  });
});

describe('EmailTemplateService', () => {
  let templateService: EmailTemplateService;

  beforeEach(() => {
    templateService = new EmailTemplateService();
  });

  describe('getTemplate', () => {
    it('devrait récupérer un template existant', () => {
      const template = templateService.getTemplate('argentique', 'client', {
        prenom: 'Jean',
        nom: 'Dupont'
      });

      expect(template).toBeDefined();
      expect(template.greeting).toContain('Jean Dupont');
    });

    it('devrait remplacer les variables dans le template', () => {
      const template = templateService.getTemplate('stripe', 'client', {
        prenom: 'Marie',
        nom: 'Martin',
        theme: 'Balade photo'
      });

      expect(template.subject).toContain('Marie Martin');
      expect(template.detailsFormat).toContain('Balade photo');
    });

    it('devrait lever une erreur pour un template inexistant', () => {
      expect(() => {
        templateService.getTemplate('inexistant', 'client', {});
      }).toThrow('Template non trouvé: inexistant.client');
    });
  });

  describe('generateEmailHTML', () => {
    it('devrait générer du HTML valide', () => {
      const template = templateService.getTemplate('argentique', 'client', {
        prenom: 'Test',
        nom: 'User'
      });
      const styles = templateService.getStyles();

      const html = templateService.generateEmailHTML(template, styles);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="fr">');
      expect(html).toContain('Test User');
    });
  });

  describe('generateEmailText', () => {
    it('devrait générer du texte valide', () => {
      const template = templateService.getTemplate('argentique', 'client', {
        prenom: 'Test',
        nom: 'User'
      });

      const text = templateService.generateEmailText(template);

      expect(text).toContain('La Ligne Argentique');
      expect(text).toContain('Test User');
    });
  });
});
