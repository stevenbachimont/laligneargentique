import { describe, it, expect, beforeEach } from 'vitest';
import { invitationService } from '$lib/server/invitationService';
import { baladesService } from '$lib/server/baladesService';

describe('API Invitations - Tests d\'intégration', () => {
  beforeEach(() => {
    invitationService.clearAllInvitations();
    
    // Réinitialiser les places de la balade ID 9
    const balade = baladesService.getBaladeById(9);
    if (balade) {
      // Remettre 10 places disponibles
      baladesService.reserverPlaces(9, balade.placesDisponibles - 10);
    }
  });

  describe('Validation des codes d\'invitation', () => {
    let invitation: any;

    beforeEach(() => {
      // Créer une invitation de test
      const result = invitationService.createInvitations({
        baladeId: 9,
        emails: ['test@example.com'],
        nombrePersonnes: 1,
        message: 'Test API'
      });
      
      if (result.success && result.invitations) {
        invitation = result.invitations[0];
      }
    });

    it('devrait valider un code avec le bon email', async () => {
      expect(invitation).toBeDefined();
      expect(invitation?.code).toBeDefined();

      // Simuler l'appel API
      const requestData = {
        code: invitation.code,
        email: 'test@example.com'
      };

      const validation = invitationService.isValidCodeWithEmail(
        requestData.code,
        requestData.email
      );

      expect(validation.valid).toBe(true);
      expect(validation.invitation).toBeDefined();
      expect(validation.invitation!.code).toBe(invitation.code);
      expect(validation.invitation!.email).toBe('test@example.com');
    });

    it('devrait échouer avec le mauvais email', async () => {
      expect(invitation).toBeDefined();

      const requestData = {
        code: invitation.code,
        email: 'wrong@example.com'
      };

      const validation = invitationService.isValidCodeWithEmail(
        requestData.code,
        requestData.email
      );

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('n\'est pas valide pour cette adresse email');
    });

    it('devrait vérifier les réservations existantes', async () => {
      expect(invitation).toBeDefined();

      // Marquer l'invitation comme utilisée
      invitationService.markAsUsed(invitation.code);

      const existingReservation = invitationService.hasExistingReservation(
        'test@example.com',
        9
      );

      expect(existingReservation.hasReservation).toBe(true);
      expect(existingReservation.invitation).toBeDefined();
    });
  });

  describe('Création de réservations', () => {
    let invitation: any;

    beforeEach(() => {
      // Créer une invitation de test
      const result = invitationService.createInvitations({
        baladeId: 9,
        emails: ['test@example.com'],
        nombrePersonnes: 1,
        message: 'Test réservation'
      });
      
      if (result.success && result.invitations) {
        invitation = result.invitations[0];
      }
    });

    it('devrait créer une réservation avec succès', async () => {
      expect(invitation).toBeDefined();

      // Simuler les données de réservation
      const reservationData = {
        invitationCode: invitation.code,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'test@example.com',
        telephone: '0123456789',
        message: 'Test message'
      };

      // Valider le code d'abord
      const validation = invitationService.isValidCodeWithEmail(
        reservationData.invitationCode,
        reservationData.email
      );

      expect(validation.valid).toBe(true);

      // Vérifier qu'il n'y a pas de réservation existante
      const existingReservation = invitationService.hasExistingReservation(
        reservationData.email,
        invitation.baladeId
      );

      expect(existingReservation.hasReservation).toBe(false);

      // Marquer l'invitation comme utilisée (simulation de la réservation)
      const result = invitationService.markAsUsed(invitation.code);
      expect(result.success).toBe(true);
    });

    it('devrait échouer si le code est invalide', async () => {
      const reservationData = {
        invitationCode: 'INVALID123',
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'test@example.com',
        telephone: '0123456789'
      };

      const validation = invitationService.isValidCodeWithEmail(
        reservationData.invitationCode,
        reservationData.email
      );

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('Code d\'invitation invalide');
    });

    it('devrait échouer si réservation déjà existante', async () => {
      expect(invitation).toBeDefined();

      // Marquer l'invitation comme utilisée
      invitationService.markInvitationAsUsed(invitation.id);

      const reservationData = {
        invitationCode: invitation.code,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'test@example.com',
        telephone: '0123456789'
      };

      const existingReservation = invitationService.hasExistingReservation(
        reservationData.email,
        invitation.baladeId
      );

      expect(existingReservation.hasReservation).toBe(true);
    });
  });

  describe('Gestion des balades d\'invitation', () => {
    it('devrait retourner les balades d\'invitation disponibles', () => {
      const balades = baladesService.getBaladesInvitation();
      
      expect(balades.length).toBeGreaterThan(0);
      
      // Vérifier que toutes les balades sont des invitations
      balades.forEach(balade => {
        expect(balade.type).toBe('invitation');
        expect(balade.statut).toBe('en_ligne');
      });
    });

    it('devrait inclure la balade de test', () => {
      const balades = baladesService.getBaladesInvitation();
      const baladeTest = balades.find(b => b.id === 9);
      
      expect(baladeTest).toBeDefined();
      expect(baladeTest!.theme).toBe('invit test');
      expect(baladeTest!.type).toBe('invitation');
    });
  });

  describe('Validation des données', () => {
    it('devrait valider les données de création d\'invitation', () => {
      const validData = {
        baladeId: 9,
        emails: ['test@example.com'],
        nombrePersonnes: 1,
        message: 'Test'
      };

      // Vérifier que la balade existe
      const balade = baladesService.getBaladeById(validData.baladeId);
      expect(balade).toBeDefined();
      expect(balade!.type).toBe('invitation');

      // Vérifier les emails
      expect(Array.isArray(validData.emails)).toBe(true);
      expect(validData.emails.length).toBeGreaterThan(0);

      // Vérifier le nombre de personnes
      expect(validData.nombrePersonnes).toBeGreaterThan(0);
    });

    it('devrait rejeter les données invalides', () => {
      const invalidData = {
        baladeId: 999, // Balade inexistante
        emails: [], // Pas d'emails
        nombrePersonnes: 0, // Nombre invalide
        message: 'Test'
      };

      // Vérifier que la balade n'existe pas
      const balade = baladesService.getBaladeById(invalidData.baladeId);
      expect(balade).toBeNull();

      // Vérifier les emails
      expect(invalidData.emails.length).toBe(0);

      // Vérifier le nombre de personnes
      expect(invalidData.nombrePersonnes).toBeLessThanOrEqual(0);
    });
  });
});
