import { describe, it, expect, beforeEach } from 'vitest';
import { invitationService } from '$lib/server/invitationService';
import { baladesService } from '$lib/server/baladesService';

describe('InvitationService', () => {
  beforeEach(() => {
    // Nettoyer les invitations avant chaque test
    invitationService.clearAllInvitations();
    
    // Réinitialiser les places de la balade ID 9
    const balade = baladesService.getBaladeById(9);
    if (balade) {
      // Remettre 10 places disponibles
      baladesService.reserverPlaces(9, balade.placesDisponibles - 10);
    }
  });

  describe('Création d\'invitations', () => {
    it('devrait créer une invitation avec succès', () => {
      const result = invitationService.createInvitations({
        baladeId: 9, // Balade d'invitation existante
        emails: ['test@example.com'],
        nombrePersonnes: 1,
        message: 'Test invitation'
      });

      expect(result.success).toBe(true);
      expect(result.invitations).toHaveLength(1);
      expect(result.invitations![0].email).toBe('test@example.com');
      expect(result.invitations![0].baladeId).toBe(9);
      expect(result.invitations![0].statut).toBe('envoyee');
    });

    it('devrait créer plusieurs invitations pour une balade', () => {
      const result = invitationService.createInvitations({
        baladeId: 9,
        emails: ['user1@example.com', 'user2@example.com'],
        nombrePersonnes: 1, // 1 personne par invitation = 2 places au total
        message: 'Invitations multiples'
      });

      expect(result.success).toBe(true);
      expect(result.invitations).toHaveLength(2);
      expect(result.invitations![0].email).toBe('user1@example.com');
      expect(result.invitations![1].email).toBe('user2@example.com');
    });

    it('devrait échouer si la balade n\'existe pas', () => {
      const result = invitationService.createInvitations({
        baladeId: 999, // Balade inexistante
        emails: ['test@example.com'],
        nombrePersonnes: 1
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Balade non trouvée');
    });

    it('devrait échouer si pas assez de places', () => {
      const result = invitationService.createInvitations({
        baladeId: 9,
        emails: ['test@example.com'],
        nombrePersonnes: 100, // Trop de places
        message: 'Trop de places'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Pas assez de places');
    });
  });

  describe('Validation des codes d\'invitation', () => {
    beforeEach(() => {
      // Créer une invitation de test
      invitationService.createInvitations({
        baladeId: 9,
        emails: ['test@example.com'],
        nombrePersonnes: 1,
        message: 'Test validation'
      });
    });

    it('devrait valider un code avec le bon email', () => {
      const invitations = invitationService.getAllInvitations();
      const invitation = invitations[0];

      const result = invitationService.isValidCodeWithEmail(
        invitation.code,
        'test@example.com'
      );

      expect(result.valid).toBe(true);
      expect(result.invitation).toBeDefined();
      expect(result.invitation!.code).toBe(invitation.code);
    });

    it('devrait échouer avec le mauvais email', () => {
      const invitations = invitationService.getAllInvitations();
      const invitation = invitations[0];

      const result = invitationService.isValidCodeWithEmail(
        invitation.code,
        'wrong@example.com'
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('n\'est pas valide pour cette adresse email');
    });

    it('devrait échouer avec un code inexistant', () => {
      const result = invitationService.isValidCodeWithEmail(
        'INVALID123',
        'test@example.com'
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Code d\'invitation invalide');
    });

    it('devrait échouer si le code est déjà utilisé', () => {
      const invitations = invitationService.getAllInvitations();
      const invitation = invitations[0];

      // Marquer l'invitation comme utilisée
      invitationService.markInvitationAsUsed(invitation.id);

      const result = invitationService.isValidCodeWithEmail(
        invitation.code,
        'test@example.com'
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain('déjà été utilisé');
    });
  });

  describe('Prévention des doublons', () => {
    beforeEach(() => {
      // Créer une invitation de test
      invitationService.createInvitations({
        baladeId: 9,
        emails: ['test@example.com'],
        nombrePersonnes: 1,
        message: 'Test doublon'
      });
    });

    it('devrait détecter une réservation existante', () => {
      const invitations = invitationService.getAllInvitations();
      const invitation = invitations[0];

      // Marquer l'invitation comme utilisée
      invitationService.markInvitationAsUsed(invitation.id);

      const result = invitationService.hasExistingReservation(
        'test@example.com',
        9
      );

      expect(result.hasReservation).toBe(true);
      expect(result.invitation).toBeDefined();
    });

    it('devrait ne pas détecter de réservation si pas d\'invitation utilisée', () => {
      const result = invitationService.hasExistingReservation(
        'test@example.com',
        9
      );

      expect(result.hasReservation).toBe(false);
    });

    it('devrait ne pas détecter de réservation pour un autre email', () => {
      const invitations = invitationService.getAllInvitations();
      const invitation = invitations[0];

      // Marquer l'invitation comme utilisée
      invitationService.markInvitationAsUsed(invitation.id);

      const result = invitationService.hasExistingReservation(
        'other@example.com',
        9
      );

      expect(result.hasReservation).toBe(false);
    });
  });

  describe('Gestion des invitations', () => {
    it('devrait récupérer toutes les invitations', () => {
      // Créer quelques invitations
      invitationService.createInvitations({
        baladeId: 9,
        emails: ['user1@example.com', 'user2@example.com'],
        nombrePersonnes: 1
      });

      const invitations = invitationService.getAllInvitations();
      expect(invitations).toHaveLength(2);
    });

    it('devrait récupérer une invitation par ID', () => {
      const result = invitationService.createInvitations({
        baladeId: 9,
        emails: ['test@example.com'],
        nombrePersonnes: 1
      });

      const invitation = invitationService.getInvitationById(result.invitations![0].id);
      expect(invitation).toBeDefined();
      expect(invitation!.email).toBe('test@example.com');
    });

    it('devrait retourner null pour un ID inexistant', () => {
      const invitation = invitationService.getInvitationById(999);
      expect(invitation).toBeNull();
    });
  });
});
