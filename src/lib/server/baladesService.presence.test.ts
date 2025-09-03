import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de la base de données
vi.mock('./database', () => ({
  default: {
    prepare: vi.fn(() => ({
      run: vi.fn()
    }))
  }
}));

// Import après le mock
import { baladesService } from './baladesService';

describe('BaladesService - Presence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('met à jour la présence avec succès', async () => {
    const mockRun = vi.fn().mockReturnValue({ changes: 1 });
    const mockPrepare = vi.fn().mockReturnValue({ run: mockRun });
    
    // Mock du module database
    const { default: mockDb } = await import('./database');
    mockDb.prepare = mockPrepare;

    const result = baladesService.updatePresence(1, true);

    expect(result).toBe(true);
    expect(mockPrepare).toHaveBeenCalledWith(
      'UPDATE reservations SET present = ? WHERE id = ?'
    );
    expect(mockRun).toHaveBeenCalledWith(1, 1);
  });

  it('retourne false si aucune ligne n\'est mise à jour', async () => {
    const mockRun = vi.fn().mockReturnValue({ changes: 0 });
    const mockPrepare = vi.fn().mockReturnValue({ run: mockRun });
    
    // Mock du module database
    const { default: mockDb } = await import('./database');
    mockDb.prepare = mockPrepare;

    const result = baladesService.updatePresence(999, true);

    expect(result).toBe(false);
    expect(mockPrepare).toHaveBeenCalledWith(
      'UPDATE reservations SET present = ? WHERE id = ?'
    );
    expect(mockRun).toHaveBeenCalledWith(1, 999);
  });

  it('gère les erreurs de base de données', async () => {
    const mockRun = vi.fn().mockImplementation(() => {
      throw new Error('Database error');
    });
    const mockPrepare = vi.fn().mockReturnValue({ run: mockRun });
    
    // Mock du module database
    const { default: mockDb } = await import('./database');
    mockDb.prepare = mockPrepare;

    const result = baladesService.updatePresence(1, true);

    expect(result).toBe(false);
  });
});
