import { describe, it, expect, beforeEach, vi } from 'vitest';
import { baladesService, baladesStore } from './baladesService';
import baladesData from '../balades-argentique.json';

// Mock de fs/promises
vi.mock('fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined)
}));

// Mock de path
vi.mock('path', () => ({
  join: vi.fn().mockReturnValue('/mock/path/balades-argentique.json')
}));

describe('BaladesService', () => {
  beforeEach(() => {
    // Réinitialiser le store avant chaque test
    baladesStore.set([...baladesData.baladesProgrammees]);
    
    // Réinitialiser les places disponibles dans le service
    const balades = baladesService.getBalades();
    balades.forEach(balade => {
      balade.placesDisponibles = balade.placesInitiales;
    });
  });

  describe('getBalades', () => {
    it('devrait retourner toutes les balades', () => {
      const balades = baladesService.getBalades();
      expect(balades).toHaveLength(3);
      expect(balades[0].theme).toBe('Architecture médiévale');
      expect(balades[1].theme).toBe('Street Art & Contemporain');
      expect(balades[2].theme).toBe('Nature en ville');
    });
  });

  describe('getBaladeById', () => {
    it('devrait retourner la balade avec l\'ID spécifié', () => {
      const balade = baladesService.getBaladeById(1);
      expect(balade).toBeDefined();
      expect(balade?.theme).toBe('Architecture médiévale');
    });

    it('devrait retourner undefined pour un ID inexistant', () => {
      const balade = baladesService.getBaladeById(999);
      expect(balade).toBeUndefined();
    });
  });

  describe('reserverPlaces', () => {
    it('devrait réduire le nombre de places disponibles', async () => {
      const baladeInitiale = baladesService.getBaladeById(1);
      const placesInitiales = baladeInitiale?.placesDisponibles || 0;

      await baladesService.reserverPlaces(1, 2);

      const baladeApres = baladesService.getBaladeById(1);
      expect(baladeApres?.placesDisponibles).toBe(placesInitiales - 2);
    });

    it('devrait lever une erreur si pas assez de places', async () => {
      await expect(baladesService.reserverPlaces(1, 10)).rejects.toThrow('Pas assez de places disponibles');
    });

    it('devrait lever une erreur pour une balade inexistante', async () => {
      await expect(baladesService.reserverPlaces(999, 1)).rejects.toThrow('Balade non trouvée');
    });
  });

  describe('annulerReservation', () => {
    it('devrait remettre les places disponibles', async () => {
      // D'abord réserver des places
      await baladesService.reserverPlaces(1, 2);
      const baladeApresReservation = baladesService.getBaladeById(1);
      const placesApresReservation = baladeApresReservation?.placesDisponibles || 0;

      // Puis annuler la réservation
      await baladesService.annulerReservation(1, 2);

      const baladeApresAnnulation = baladesService.getBaladeById(1);
      expect(baladeApresAnnulation?.placesDisponibles).toBe(placesApresReservation + 2);
    });

    it('devrait lever une erreur si on rembourse trop de places', async () => {
      await expect(baladesService.annulerReservation(1, 10)).rejects.toThrow('Impossible de rembourser plus de places que le nombre initial');
    });
  });

  describe('reinitialiserPlaces', () => {
    it('devrait remettre le nombre initial de places', async () => {
      // D'abord réserver des places
      await baladesService.reserverPlaces(1, 2);

      // Puis réinitialiser
      await baladesService.reinitialiserPlaces(1);

      const balade = baladesService.getBaladeById(1);
      expect(balade?.placesDisponibles).toBe(balade?.placesInitiales);
    });
  });

  describe('isBaladeComplete', () => {
    it('devrait retourner true si la balade est complète', () => {
      // Réserver toutes les places
      baladesService.getBaladeById(1)!.placesDisponibles = 0;
      expect(baladesService.isBaladeComplete(1)).toBe(true);
    });

    it('devrait retourner false si la balade a encore des places', () => {
      baladesService.getBaladeById(1)!.placesDisponibles = 3;
      expect(baladesService.isBaladeComplete(1)).toBe(false);
    });
  });

  describe('getBaladeStatus', () => {
    it('devrait retourner "complete" si pas de places', () => {
      baladesService.getBaladeById(1)!.placesDisponibles = 0;
      expect(baladesService.getBaladeStatus(1)).toBe('complete');
    });

    it('devrait retourner "limite" si 2 places ou moins', () => {
      baladesService.getBaladeById(1)!.placesDisponibles = 2;
      expect(baladesService.getBaladeStatus(1)).toBe('limite');
    });

    it('devrait retourner "disponible" si plus de 2 places', () => {
      baladesService.getBaladeById(1)!.placesDisponibles = 3;
      expect(baladesService.getBaladeStatus(1)).toBe('disponible');
    });
  });

  describe('Store Svelte', () => {
    it('devrait mettre à jour le store lors d\'une réservation', async () => {
      let storeValue: any[] = [];
      const unsubscribe = baladesStore.subscribe(value => {
        storeValue = value;
      });

      // Attendre que le store soit initialisé
      await new Promise(resolve => setTimeout(resolve, 10));

      const baladeInitiale = storeValue.find(b => b.id === 1);
      const placesInitiales = baladeInitiale?.placesDisponibles || 0;

      await baladesService.reserverPlaces(1, 1);

      const baladeDansStore = storeValue.find(b => b.id === 1);
      expect(baladeDansStore?.placesDisponibles).toBe(placesInitiales - 1);

      unsubscribe();
    });
  });
});
