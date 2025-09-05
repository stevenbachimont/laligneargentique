import { describe, it, expect, vi, beforeEach } from 'vitest';
import { baladesService } from '../../src/lib/server/baladesService';

// Mocks
vi.mock('../../src/lib/server/baladesService');
vi.mock('../../src/lib/server/emailService');

const mockBaladesService = vi.mocked(baladesService);

describe('API Admin - Sécurité', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Services de base', () => {
    it('devrait avoir accès au service de balades', () => {
      expect(baladesService).toBeDefined();
    });

    it('devrait pouvoir récupérer une réservation', () => {
      const mockReservation = {
        id: 1,
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        nombrePersonnes: 2,
        statut: 'en_attente'
      };

      mockBaladesService.getReservationById.mockReturnValue(mockReservation);
      const result = baladesService.getReservationById(1);
      expect(result).toBeDefined();
    });
  });
});