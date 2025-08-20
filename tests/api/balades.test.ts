import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Mock de Prisma
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    balade: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn()
    }
  }))
}));

describe('API Balades', () => {
  let mockPrisma: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = new PrismaClient();
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

      mockPrisma.balade.findMany.mockResolvedValue(mockBalades);

      // Simuler l'appel à l'API
      const response = await fetch('/api/balades');
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.balades).toEqual(mockBalades);
    });

    it('devrait gérer les erreurs de base de données', async () => {
      mockPrisma.balade.findMany.mockRejectedValue(new Error('Erreur DB'));

      const response = await fetch('/api/balades');
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBe('Erreur lors de la récupération des balades');
    });
  });
});
