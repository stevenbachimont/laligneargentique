import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './+server';
import { baladesService } from '$lib/server/baladesService';

// Mock du service balades
vi.mock('$lib/server/baladesService', () => ({
  baladesService: {
    updatePresence: vi.fn()
  }
}));

describe('API Presence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('met à jour la présence avec succès', async () => {
    // Mock du service
    (baladesService.updatePresence as any).mockReturnValue(true);

    // Créer une requête mock
    const request = new Request('http://localhost:3000/api/admin/reservations/presence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reservationId: 1,
        present: true
      })
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Présence mise à jour pour la réservation 1');
    expect(baladesService.updatePresence).toHaveBeenCalledWith(1, true);
  });

  it('retourne une erreur si les données sont invalides', async () => {
    // Créer une requête avec des données invalides
    const request = new Request('http://localhost:3000/api/admin/reservations/presence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reservationId: 'invalid',
        present: 'invalid'
      })
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Paramètres invalides');
  });

  it('retourne une erreur si la mise à jour échoue', async () => {
    // Mock du service pour retourner false
    (baladesService.updatePresence as any).mockReturnValue(false);

    const request = new Request('http://localhost:3000/api/admin/reservations/presence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reservationId: 1,
        present: true
      })
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Erreur lors de la mise à jour de la présence');
  });

  it('gère les erreurs de parsing JSON', async () => {
    // Créer une requête avec un JSON invalide
    const request = new Request('http://localhost:3000/api/admin/reservations/presence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: 'invalid json'
    });

    const response = await POST({ request } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Erreur interne du serveur');
  });
});
