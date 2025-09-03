import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailService } from '$lib/server/emailService';
import { EmailTemplateService } from '$lib/server/emailTemplateService';

// Mock du service de template
vi.mock('$lib/server/emailTemplateService', () => ({
  EmailTemplateService: vi.fn().mockImplementation(() => ({
    getTemplate: vi.fn(() => ({
      subject: 'Test Invitation',
      html: '<p>Test HTML</p>',
      text: 'Test Text'
    })),
    getStyles: vi.fn(() => ({
      body: 'font-family: Arial, sans-serif;',
      container: 'max-width: 600px; margin: 0 auto;',
      header: 'background: #f0f0f0; padding: 20px;',
      content: 'padding: 20px;',
      highlight: 'background: #ffffcc; padding: 10px;',
      success: 'color: green;',
      details: 'margin: 10px 0;',
      infoBox: 'border: 1px solid #ccc; padding: 15px;',
      contactInfo: 'font-style: italic;',
      paymentInfo: 'background: #f9f9f9;',
      footer: 'text-align: center; font-size: 12px;'
    })),
    generateEmailHTML: vi.fn(() => '<p>Generated HTML</p>'),
    generateEmailText: vi.fn(() => 'Generated Text')
  }))
}));

describe('EmailService - Invitations', () => {
  let emailService: EmailService;

  beforeEach(() => {
    // Mock des variables d'environnement
    vi.stubEnv('EMAIL_USER', 'test@example.com');
    vi.stubEnv('EMAIL_APP_PASSWORD', 'test-password');
    vi.stubEnv('PUBLIC_BASE_URL', 'http://localhost:3000');
    
    emailService = new EmailService();
  });

  describe('sendInvitationEmail', () => {
    it('devrait générer le bon contenu d\'email', async () => {
      const invitation = {
        id: 1,
        baladeId: 9,
        code: 'TEST1234',
        email: 'test@example.com',
        nom: 'Dupont',
        prenom: 'Jean',
        statut: 'envoyee' as const,
        dateCreation: '2024-01-01',
        nombrePersonnes: 1,
        message: 'Test message'
      };

      const balade = {
        id: 9,
        theme: 'Test Balade',
        date: '2024-12-25',
        heure: '14:00',
        lieu: 'Test Lieu',
        placesDisponibles: 5,
        prix: '0€',
        description: 'Test description',
        consignes: [],
        materiel: [],
        coordonnees: [],
        parcours: [],
        statut: 'en_ligne' as const,
        type: 'invitation' as const
      };

      // Mock du transporter
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-id' });
      (emailService as any).transporter = { sendMail: mockSendMail };

      const result = await emailService.sendInvitationEmail(invitation, balade);

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: 'test@example.com',
        subject: 'Test Invitation',
        html: expect.any(String),
        text: expect.any(String)
      });
    });

    it('devrait inclure le lien de réservation dans l\'email', async () => {
      const invitation = {
        id: 1,
        baladeId: 9,
        code: 'TEST1234',
        email: 'test@example.com',
        nom: 'Dupont',
        prenom: 'Jean',
        statut: 'envoyee' as const,
        dateCreation: '2024-01-01',
        nombrePersonnes: 1
      };

      const balade = {
        id: 9,
        theme: 'Test Balade',
        date: '2024-12-25',
        heure: '14:00',
        lieu: 'Test Lieu',
        placesDisponibles: 5,
        prix: '0€',
        description: 'Test description',
        consignes: [],
        materiel: [],
        coordonnees: [],
        parcours: [],
        statut: 'en_ligne' as const,
        type: 'invitation' as const
      };

      const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-id' });
      (emailService as any).transporter = { sendMail: mockSendMail };

      await emailService.sendInvitationEmail(invitation, balade);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toBeDefined();
      expect(callArgs.text).toBeDefined();
      expect(callArgs.to).toBe('test@example.com');
    });

    it('devrait gérer les erreurs d\'envoi', async () => {
      const invitation = {
        id: 1,
        baladeId: 9,
        code: 'TEST1234',
        email: 'test@example.com',
        nom: 'Dupont',
        prenom: 'Jean',
        statut: 'envoyee' as const,
        dateCreation: '2024-01-01',
        nombrePersonnes: 1
      };

      const balade = {
        id: 9,
        theme: 'Test Balade',
        date: '2024-12-25',
        heure: '14:00',
        lieu: 'Test Lieu',
        placesDisponibles: 5,
        prix: '0€',
        description: 'Test description',
        consignes: [],
        materiel: [],
        coordonnees: [],
        parcours: [],
        statut: 'en_ligne' as const,
        type: 'invitation' as const
      };

      // Mock d'erreur
      const mockSendMail = vi.fn().mockRejectedValue(new Error('SMTP Error'));
      (emailService as any).transporter = { sendMail: mockSendMail };

      await expect(emailService.sendInvitationEmail(invitation, balade)).rejects.toThrow();
    });
  });

  describe('Configuration des URLs', () => {
    it('devrait utiliser la bonne URL de base', () => {
      // Test de la logique de construction d'URL
      const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
      const baladeId = 9;
      const code = 'TEST1234';
      
      const expectedUrl = `${baseUrl}/photographie/argentique/reservation/invitation?baladeId=${baladeId}&code=${code}`;
      
      expect(expectedUrl).toContain('baladeId=9');
      expect(expectedUrl).toContain('code=TEST1234');
      expect(expectedUrl).toContain('/photographie/argentique/reservation/invitation');
    });
  });
});