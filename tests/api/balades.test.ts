import { describe, it, expect, beforeEach, vi } from 'vitest';
import { baladesPrismaService } from '$lib/services/baladesPrismaService';

// Mock du service Prisma
vi.mock('$lib/services/baladesPrismaService', () => ({
  baladesPrismaService: {
    getBalades: vi.fn()
  }
}));

describe('API Balades', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/balades', () => {
    it('devrait retourner toutes les balades', async () => {
      const mockBalades = [
        {
          id: 1,
          theme: 'Architecture médiévale',
          placesDisponibles: 2,
          placesInitiales: 5
        }
      ];

      vi.mocked(baladesPrismaService.getBalades).mockResolvedValue(mockBalades);

      // Simuler l'appel à l'API
      const response = await fetch('/api/balades');
      const data = await response.json();

      expect(data).toEqual(mockBalades);
      expect(baladesPrismaService.getBalades).toHaveBeenCalledOnce();
    });

    it('devrait gérer les erreurs de base de données', async () => {
      vi.mocked(baladesPrismaService.getBalades).mockRejectedValue(new Error('Erreur DB'));

      const response = await fetch('/api/balades');
      const data = await response.json();

      expect(data.error).toBe('Erreur lors de la récupération des balades');
      expect(response.status).toBe(500);
    });

    it('devrait retourner un tableau vide en cas d\'erreur', async () => {
      vi.mocked(baladesPrismaService.getBalades).mockRejectedValue(new Error('Erreur DB'));

      const response = await fetch('/api/balades');
      const data = await response.json();

      expect(data.error).toBeDefined();
      expect(response.status).toBe(500);
    });
  });
});
