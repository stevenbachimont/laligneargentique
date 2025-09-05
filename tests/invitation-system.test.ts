import { describe, it, expect, beforeEach } from 'vitest';
import { invitationService } from '$lib/server/invitationService';
import { baladesService } from '$lib/server/baladesService';

/**
 * Tests d'intégration du système d'invitation
 * Tests simples et utiles pour vérifier le bon fonctionnement
 */
describe('Système d\'invitation - Tests d\'intégration', () => {
  beforeEach(() => {
    invitationService.clearAllInvitations();
    
    // Réinitialiser les places de la balade ID 9 à 10 places
    const stmt = baladesService.db.prepare('UPDATE balades SET places_disponibles = 10 WHERE id = 9');
    stmt.run();
  });

  describe('Flux complet de réservation d\'invitation', () => {
    it('devrait permettre le flux complet : création → validation → réservation', () => {
      // 1. Créer une invitation
      const createResult = invitationService.createInvitations({
        baladeId: 9,
        emails: ['user@example.com'],
        nombrePersonnes: 1,
        message: 'Test flux complet'
      });

      expect(createResult.success).toBe(true);
      expect(createResult.invitations).toHaveLength(1);

      const invitation = createResult.invitations![0];

      // 2. Valider le code d'invitation
      const validation = invitationService.isValidCodeWithEmail(
        invitation.code,
        'user@example.com'
      );

      expect(validation.valid).toBe(true);
      expect(validation.invitation!.id).toBe(invitation.id);

      // 3. Vérifier qu'il n'y a pas de réservation existante
      const existingReservation = invitationService.hasExistingReservation(
        'user@example.com',
        9
      );

      expect(existingReservation.hasReservation).toBe(false);

      // 4. Marquer l'invitation comme utilisée (simulation de réservation)
      const markUsed = invitationService.markAsUsed(invitation.code);
      expect(markUsed.success).toBe(true);
      expect(markUsed.invitation).toBeDefined();
      expect(markUsed.invitation!.statut).toBe('utilisee');

      // 5. Vérifier que l'invitation est maintenant utilisée
      const updatedInvitation = invitationService.getInvitationById(invitation.id);
      expect(updatedInvitation).toBeDefined();
      expect(updatedInvitation!.statut).toBe('utilisee');

      // 6. Vérifier qu'une nouvelle tentative de réservation échoue
      const newValidation = invitationService.isValidCodeWithEmail(
        invitation.code,
        'user@example.com'
      );

      expect(newValidation.valid).toBe(false);
      expect(newValidation.error).toContain('déjà été utilisé');
    });

    it('devrait empêcher les réservations multiples avec le même email', () => {
      // Créer une invitation
      const createResult = invitationService.createInvitations({
        baladeId: 9,
        emails: ['user@example.com'],
        nombrePersonnes: 1,
        message: 'Test doublon'
      });

      const invitation = createResult.invitations![0];

      // Marquer comme utilisée
      invitationService.markAsUsed(invitation.code);

      // Vérifier qu'une nouvelle réservation est détectée
      const existingReservation = invitationService.hasExistingReservation(
        'user@example.com',
        9
      );

      expect(existingReservation.hasReservation).toBe(true);
      expect(existingReservation.invitation!.id).toBe(invitation.id);
    });

    it('devrait permettre des réservations avec des emails différents', () => {
      // Créer des invitations pour différents emails
      const createResult = invitationService.createInvitations({
        baladeId: 9,
        emails: ['user1@example.com', 'user2@example.com'],
        nombrePersonnes: 1,
        message: 'Test emails multiples'
      });

      expect(createResult.success).toBe(true);
      expect(createResult.invitations).toHaveLength(2);

      const [invitation1, invitation2] = createResult.invitations!;

      // Marquer la première comme utilisée
      invitationService.markInvitationAsUsed(invitation1.id);

      // Vérifier que la première est utilisée
      const existing1 = invitationService.hasExistingReservation(
        'user1@example.com',
        9
      );
      expect(existing1.hasReservation).toBe(true);

      // Vérifier que la seconde n'est pas utilisée
      const existing2 = invitationService.hasExistingReservation(
        'user2@example.com',
        9
      );
      expect(existing2.hasReservation).toBe(false);

      // La seconde invitation devrait toujours être valide
      const validation2 = invitationService.isValidCodeWithEmail(
        invitation2.code,
        'user2@example.com'
      );
      expect(validation2.valid).toBe(true);
    });
  });

  describe('Gestion des balades d\'invitation', () => {
    it('devrait retourner uniquement les balades d\'invitation valides', () => {
      const balades = baladesService.getBaladesInvitation();
      
      expect(balades.length).toBeGreaterThan(0);
      
      // Vérifier les critères de filtrage
      balades.forEach(balade => {
        expect(balade.type).toBe('invitation');
        expect(balade.statut).toBe('en_ligne');
        const baladeDate = new Date(balade.date);
        const today = new Date(new Date().toISOString().split('T')[0]);
        expect(baladeDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
      });
    });

    it('devrait vérifier les places disponibles', () => {
      // S'assurer que la balade a exactement 10 places
      const stmt = baladesService.db.prepare('UPDATE balades SET places_disponibles = 10 WHERE id = 9');
      stmt.run();
      
      const balade = baladesService.getBaladeById(9);
      
      expect(balade).toBeDefined();
      expect(balade!.placesDisponibles).toBe(10);
      
      // Tester la réservation de places
      const placesAvant = balade!.placesDisponibles;
      const success = baladesService.reserverPlaces(9, 1);
      
      expect(success).toBe(true);
      
      const baladeApres = baladesService.getBaladeById(9);
      expect(baladeApres!.placesDisponibles).toBe(placesAvant - 1);
    });
  });

  describe('Sécurité et validation', () => {
    it('devrait empêcher l\'utilisation d\'un code avec un mauvais email', () => {
      const createResult = invitationService.createInvitations({
        baladeId: 9,
        emails: ['authorized@example.com'],
        nombrePersonnes: 1,
        message: 'Test sécurité'
      });

      const invitation = createResult.invitations![0];

      // Tentative d'utilisation avec un mauvais email
      const validation = invitationService.isValidCodeWithEmail(
        invitation.code,
        'unauthorized@example.com'
      );

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('n\'est pas valide pour cette adresse email');
    });

    it('devrait empêcher l\'utilisation de codes inexistants', () => {
      const validation = invitationService.isValidCodeWithEmail(
        'FAKE1234',
        'any@example.com'
      );

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('Code d\'invitation invalide');
    });

    it('devrait empêcher la création d\'invitations pour des balades inexistantes', () => {
      const result = invitationService.createInvitations({
        baladeId: 999, // Balade inexistante
        emails: ['test@example.com'],
        nombrePersonnes: 1,
        message: 'Test balade inexistante'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Balade non trouvée');
    });
  });
});
