import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaladesClientService } from '$lib/services/baladesClientService';

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
        json: () => Promise.resolve({ success: true, balades: mockBalades })
      } as Response);

      const result = await BaladesClientService.getBalades();

      expect(result).toEqual(mockBalades);
      expect(fetch).toHaveBeenCalledWith('/api/balades');
    });

    it('devrait gérer les erreurs de l\'API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response);

      const result = await BaladesClientService.getBalades();

      expect(result).toEqual([]);
    });

    it('devrait gérer les erreurs de réseau', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Erreur réseau'));

      const result = await BaladesClientService.getBalades();

      expect(result).toEqual([]);
    });
  });

  describe('updatePlaces', () => {
    it('devrait mettre à jour les places avec succès', async () => {
      const mockBalades = [
        { id: 1, theme: 'Architecture médiévale', placesDisponibles: 1 }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, balades: mockBalades })
      } as Response);

      const result = await BaladesClientService.updatePlaces(1, 1, 'reserver');

      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/balades/update-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baladeId: 1, nombrePlaces: 1, action: 'reserver' })
      });
    });

    it('devrait gérer les erreurs de l\'API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Erreur serveur' })
      } as Response);

      const result = await BaladesClientService.updatePlaces(1, 1, 'reserver');

      expect(result).toBe(false);
    });
  });

  describe('syncStore', () => {
    it('devrait synchroniser le store avec succès', async () => {
      const mockBalades = [
        { id: 1, theme: 'Architecture médiévale', placesDisponibles: 2 }
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, balades: mockBalades })
      } as Response);

      const result = await BaladesClientService.syncStore();

      expect(result).toBe(true);
    });

    it('devrait retourner false si aucune balade', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, balades: [] })
      } as Response);

      const result = await BaladesClientService.syncStore();

      expect(result).toBe(false);
    });
  });
});
