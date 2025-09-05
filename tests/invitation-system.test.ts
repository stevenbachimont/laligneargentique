import { describe, it, expect } from 'vitest';
import { invitationService } from '$lib/server/invitationService';

describe('Système d\'invitations - Intégration', () => {
  describe('Flux de base', () => {
    it('devrait créer une invitation', () => {
      const result = invitationService.createInvitations({
        baladeId: 9,
        emails: ['user@example.com'],
        nombrePersonnes: 1,
        message: 'Test'
      });
      
      expect(result).toBeDefined();
    });

    it('devrait valider un code', () => {
      const result = invitationService.isValidCodeWithEmail('TEST123', 'user@example.com');
      expect(result).toBeDefined();
    });
  });
});