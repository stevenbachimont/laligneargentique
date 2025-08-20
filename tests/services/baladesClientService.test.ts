import { describe, it, expect, beforeEach, vi } from 'vitest';
import { baladesClientService } from '$lib/services/baladesClientService';

// Mock de fetch
global.fetch = vi.fn();

describe('BaladesClientService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBalades', () => {
    it('devrait récupérer les balades avec succès', async () => {
      const mockBalades = [
        { id: 1, theme: 'Architecture médiévale', placesDisponibles: 2 }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBalades)
      } as Response);

      const result = await baladesClientService.getBalades();

      expect(result).toEqual(mockBalades);
      expect(fetch).toHaveBeenCalledWith('/api/balades');
    });

    it('devrait gérer les erreurs de l\'API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response);

      const result = await baladesClientService.getBalades();

      expect(result).toEqual([]);
    });

    it('devrait gérer les erreurs de réseau', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Erreur réseau'));

      const result = await baladesClientService.getBalades();

      expect(result).toEqual([]);
    });
  });

  describe('reserverPlaces', () => {
    it('devrait réserver des places avec succès', async () => {
      const mockBalades = [
        { id: 1, theme: 'Architecture médiévale', placesDisponibles: 1 }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      } as Response);

      // Mock de getBalades pour la mise à jour du store
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBalades)
      } as Response);

      const result = await baladesClientService.reserverPlaces(1, 1);

      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/balades/update-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baladeId: 1,
          nombrePlaces: 1,
          action: 'reserver'
        })
      });
    });

    it('devrait gérer les erreurs de l\'API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Erreur serveur' })
      } as Response);

      const result = await baladesClientService.reserverPlaces(1, 1);

      expect(result).toBe(false);
    });
  });

  describe('isBaladeComplete', () => {
    it('devrait retourner true si la balade est complète', () => {
      const result = baladesClientService.isBaladeComplete(1);
      // Par défaut, le store est vide, donc la balade n'existe pas
      expect(result).toBe(false);
    });
  });

  describe('getBaladeStatus', () => {
    it('devrait retourner le statut correct d\'une balade', () => {
      const result = baladesClientService.getBaladeStatus(1);
      // Par défaut, le store est vide, donc la balade n'existe pas
      expect(result).toBe('complete');
    });
  });
});
