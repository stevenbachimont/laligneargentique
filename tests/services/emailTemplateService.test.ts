import { describe, it, expect, beforeEach } from 'vitest';
import { EmailTemplateService } from '../../src/lib/server/emailTemplateService';

describe('EmailTemplateService', () => {
  let templateService: EmailTemplateService;

  beforeEach(() => {
    templateService = new EmailTemplateService();
  });

  describe('getTemplate', () => {
    it('devrait récupérer un template argentique client', () => {
      const template = templateService.getTemplate('argentique', 'client', {
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean@example.com',
        dateSouhaitee: '25 décembre 2024',
        nombrePersonnes: 2,
        message: 'Test de réservation'
      });

      expect(template.subject).toContain('La Ligne Argentique');
      expect(template.greeting).toContain('Jean Dupont');
      expect(template.detailsFormat).toContain('25 décembre 2024');
      expect(template.detailsFormat).toContain('2');
      expect(template.detailsFormat).toContain('Test de réservation');
    });

    it('devrait récupérer un template Stripe client', () => {
      const template = templateService.getTemplate('stripe', 'client', {
        prenom: 'Marie',
        nom: 'Martin',
        nombrePersonnes: 1,
        montant: '45.00€',
        theme: 'Balade photo Nantes',
        date: '25 décembre 2024',
        heure: '14:00',
        lieu: 'Place du Commerce'
      });

      expect(template.subject).toContain('Confirmation de réservation');
      expect(template.successTitle).toContain('✅ Réservation confirmée');
      expect(template.detailsFormat).toContain('Balade photo Nantes');
      expect(template.detailsFormat).toContain('25 décembre 2024');
      expect(template.detailsFormat).toContain('14:00');
      expect(template.detailsFormat).toContain('Place du Commerce');
    });

    it('devrait récupérer un template de contact', () => {
      const template = templateService.getTemplate('contact', 'client', {
        nom: 'Durand',
        prenom: 'Pierre',
        email: 'pierre@example.com',
        message: 'Bonjour, j\'ai une question'
      });

      expect(template.subject).toContain('Confirmation de votre message');
      expect(template.greeting).toContain('Pierre Durand');
      expect(template.messageTitle).toContain('Votre message');
    });

    it('devrait récupérer un template de question', () => {
      const template = templateService.getTemplate('question', 'admin', {
        clientName: 'Client Test',
        clientEmail: 'client@example.com',
        dateSouhaitee: '25 décembre 2024',
        nombrePersonnes: 2,
        question: 'Puis-je amener mon appareil photo ?'
      });

      expect(template.subject).toContain('Client Test');
      expect(template.reservationFormat).toContain('25 décembre 2024');
      expect(template.reservationFormat).toContain('2');
      expect(template.questionTitle).toContain('Question');
    });

    it('devrait lever une erreur pour un template inexistant', () => {
      expect(() => {
        templateService.getTemplate('inexistant', 'client', {});
      }).toThrow('Template non trouvé: inexistant.client');
    });

    it('devrait lever une erreur pour un type inexistant', () => {
      expect(() => {
        templateService.getTemplate('argentique', 'inexistant', {});
      }).toThrow('Template non trouvé: argentique.inexistant');
    });
  });

  describe('getStyles', () => {
    it('devrait retourner les styles CSS', () => {
      const styles = templateService.getStyles();

      expect(styles.body).toContain('font-family: Arial');
      expect(styles.header).toContain('background: linear-gradient');
      expect(styles.highlight).toContain('background: #ffd700');
      expect(styles.success).toContain('background: #d4edda');
    });
  });

  describe('generateEmailHTML', () => {
    it('devrait générer du HTML valide pour un email argentique', () => {
      const template = templateService.getTemplate('argentique', 'client', {
        prenom: 'Test',
        nom: 'User'
      });
      const styles = templateService.getStyles();

      const html = templateService.generateEmailHTML(template, styles);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="fr">');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('Test User');
      expect(html).toContain('La Ligne Argentique');
    });

    it('devrait inclure les styles CSS dans le HTML', () => {
      const template = templateService.getTemplate('argentique', 'client', {
        prenom: 'Test',
        nom: 'User'
      });
      const styles = templateService.getStyles();

      const html = templateService.generateEmailHTML(template, styles);

      expect(html).toContain('<style>');
      expect(html).toContain('font-family: Arial');
      expect(html).toContain('background: linear-gradient');
    });
  });

  describe('generateEmailText', () => {
    it('devrait générer du texte valide pour un email argentique', () => {
      const template = templateService.getTemplate('argentique', 'client', {
        prenom: 'Test',
        nom: 'User'
      });

      const text = templateService.generateEmailText(template);

      expect(text).toContain('La Ligne Argentique');
      expect(text).toContain('Test User');
      expect(text).toContain('Confirmation de réservation');
    });

    it('devrait générer du texte valide pour un email Stripe', () => {
      const template = templateService.getTemplate('stripe', 'client', {
        prenom: 'Test',
        nom: 'User',
        theme: 'Balade photo',
        date: '25 décembre 2024',
        heure: '14:00',
        lieu: 'Place du Commerce',
        nombrePersonnes: 1,
        montant: '45.00€'
      });

      const text = templateService.generateEmailText(template);

      expect(text).toContain('RÉSERVATION CONFIRMÉE');
      expect(text).toContain('Test User');
      expect(text).toContain('Balade photo');
      expect(text).toContain('25 décembre 2024');
      expect(text).toContain('14:00');
      expect(text).toContain('Place du Commerce');
      expect(text).toContain('45.00€');
    });
  });

  describe('Remplacement de variables', () => {
    it('devrait remplacer toutes les variables dans un template', () => {
      const variables = {
        prenom: 'Alice',
        nom: 'Bernard',
        email: 'alice@example.com',
        theme: 'Balade urbaine',
        date: '1er janvier 2025',
        heure: '10:00',
        lieu: 'Quartier historique',
        nombrePersonnes: 3,
        montant: '135.00€'
      };

      const template = templateService.getTemplate('stripe', 'client', variables);

      // Vérifier que toutes les variables ont été remplacées
      expect(template.greeting).toContain('Alice Bernard');
      expect(template.detailsFormat).toContain('Balade urbaine');
      expect(template.detailsFormat).toContain('1er janvier 2025');
      expect(template.detailsFormat).toContain('10:00');
      expect(template.detailsFormat).toContain('Quartier historique');
      expect(template.detailsFormat).toContain('3');
      expect(template.detailsFormat).toContain('135.00€');
    });

    it('devrait gérer les variables manquantes', () => {
      const template = templateService.getTemplate('argentique', 'client', {
        prenom: 'Test',
        nom: 'User'
        // message manquant
      });

      expect(template.detailsFormat).toContain('Aucun message');
    });
  });
});
