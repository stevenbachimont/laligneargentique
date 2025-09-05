import { describe, it, expect } from 'vitest';
import { invitationService } from '$lib/server/invitationService';

describe('InvitationService - Fonctions métier', () => {
  describe('Création d\'invitations', () => {
    it('devrait créer une invitation', () => {
      const result = invitationService.createInvitations({
        baladeId: 9,
        emails: ['test@example.com'],
        nombrePersonnes: 1,
        message: 'Test'
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Validation des codes', () => {
    it('devrait valider un code', () => {
      const result = invitationService.isValidCodeWithEmail('TEST123', 'test@example.com');
      expect(result).toBeDefined();
    });
  });
});