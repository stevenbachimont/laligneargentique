import { describe, it, expect } from 'vitest';
import { baladesService } from '$lib/server/baladesService';

describe('BaladesService - Filtrage des balades d\'invitation', () => {
  describe('getBaladesInvitation', () => {
    it('devrait retourner uniquement les balades d\'invitation futures', () => {
      const balades = baladesService.getBaladesInvitation();
      
      // Vérifier que toutes les balades retournées sont des invitations
      balades.forEach(balade => {
        expect(balade.type).toBe('invitation');
        expect(balade.statut).toBe('en_ligne');
        const baladeDate = new Date(balade.date);
        const today = new Date(new Date().toISOString().split('T')[0]);
        expect(baladeDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
      });
    });

    it('devrait inclure la balade d\'invitation de test', () => {
      const balades = baladesService.getBaladesInvitation();
      
      // Vérifier qu'on a au moins la balade de test
      const baladeTest = balades.find(b => b.id === 9);
      expect(baladeTest).toBeDefined();
      expect(baladeTest!.theme).toBe('invit test');
      expect(baladeTest!.type).toBe('invitation');
    });

    it('ne devrait pas inclure les balades payantes', () => {
      const balades = baladesService.getBaladesInvitation();
      
      // Aucune balade payante ne devrait être retournée
      const baladesPayantes = balades.filter(b => b.type === 'payante');
      expect(baladesPayantes).toHaveLength(0);
    });

    it('ne devrait pas inclure les balades passées', () => {
      const balades = baladesService.getBaladesInvitation();
      const today = new Date().toISOString().split('T')[0];
      
      // Aucune balade passée ne devrait être retournée
      const baladesPassees = balades.filter(b => b.date < today);
      expect(baladesPassees).toHaveLength(0);
    });

    it('ne devrait pas inclure les balades en brouillon', () => {
      const balades = baladesService.getBaladesInvitation();
      
      // Aucune balade en brouillon ne devrait être retournée
      const baladesBrouillon = balades.filter(b => b.statut === 'brouillon');
      expect(baladesBrouillon).toHaveLength(0);
    });
  });

  describe('getBaladeById', () => {
    it('devrait retourner la balade d\'invitation de test', () => {
      const balade = baladesService.getBaladeById(9);
      
      expect(balade).toBeDefined();
      expect(balade!.id).toBe(9);
      expect(balade!.theme).toBe('invit test');
      expect(balade!.type).toBe('invitation');
      expect(balade!.statut).toBe('en_ligne');
    });

    it('devrait retourner null pour un ID inexistant', () => {
      const balade = baladesService.getBaladeById(999);
      expect(balade).toBeNull();
    });
  });

  describe('hasPlacesAvailable', () => {
    it('devrait retourner true si des places sont disponibles', () => {
      const hasPlaces = baladesService.hasPlacesAvailable(9, 1);
      expect(hasPlaces).toBe(true);
    });

    it('devrait retourner false si pas assez de places', () => {
      const hasPlaces = baladesService.hasPlacesAvailable(9, 100);
      expect(hasPlaces).toBe(false);
    });

    it('devrait retourner false pour une balade inexistante', () => {
      const hasPlaces = baladesService.hasPlacesAvailable(999, 1);
      expect(hasPlaces).toBe(false);
    });
  });

  describe('reserverPlaces', () => {
    it('devrait réserver des places avec succès', () => {
      const baladeAvant = baladesService.getBaladeById(9);
      const placesAvant = baladeAvant!.placesDisponibles;
      
      const success = baladesService.reserverPlaces(9, 1);
      
      expect(success).toBe(true);
      
      const baladeApres = baladesService.getBaladeById(9);
      expect(baladeApres!.placesDisponibles).toBe(placesAvant - 1);
    });

    it('devrait échouer si pas assez de places', () => {
      const success = baladesService.reserverPlaces(9, 100);
      expect(success).toBe(false);
    });

    it('devrait échouer pour une balade inexistante', () => {
      const success = baladesService.reserverPlaces(999, 1);
      expect(success).toBe(false);
    });
  });
});