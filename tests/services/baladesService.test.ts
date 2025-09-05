import { describe, it, expect } from 'vitest';
import { baladesService } from '$lib/server/baladesService';

describe('BaladesService - Fonctions métier', () => {
  describe('Balades d\'invitation', () => {
    it('devrait retourner les balades d\'invitation', () => {
      const balades = baladesService.getBaladesInvitation();
      expect(balades).toBeDefined();
      expect(Array.isArray(balades)).toBe(true);
    });

    it('devrait inclure la balade de test', () => {
      const balades = baladesService.getBaladesInvitation();
      const baladeTest = balades.find(b => b.id === 9);
      expect(baladeTest).toBeDefined();
    });
  });

  describe('Gestion des places', () => {
    it('devrait décrémenter les places disponibles', () => {
      const result = baladesService.decrementerPlacesDisponibles(1, 1);
      expect(result).toBeDefined();
    });

    it('devrait gérer les places disponibles', () => {
      const result = baladesService.decrementerPlacesDisponiblesMultiple(1, 1);
      expect(result).toBeDefined();
    });
  });
});