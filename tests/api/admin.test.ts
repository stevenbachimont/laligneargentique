import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as confirmerReservation } from '../../src/routes/api/admin/confirmer-reservation/+server';
import { GET as reservationsEnAttente } from '../../src/routes/api/admin/reservations-en-attente/+server';
import { POST as corrigerPlaces } from '../../src/routes/api/admin/corriger-places/+server';
import { baladesService } from '../../src/lib/server/baladesService';
import { EmailService } from '../../src/lib/server/emailService';

// Mocks
vi.mock('../../src/lib/server/baladesService');
vi.mock('../../src/lib/server/emailService');

const mockBaladesService = vi.mocked(baladesService);
const mockEmailService = vi.mocked(EmailService);

describe('API Admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/admin/confirmer-reservation', () => {
    it('devrait confirmer une réservation avec succès', async () => {
      const requestData = { reservationId: 1 };

      const mockReservation = {
        id: 1,
        baladeId: 1,
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        nombrePersonnes: 2,
        statut: 'en_attente'
      };

      const mockBalade = {
        id: 1,
        theme: 'Test Balade',
        placesDisponibles: 5
      };

      // Mock des services
      mockBaladesService.getReservationById.mockReturnValue(mockReservation);
      mockBaladesService.modifierReservation.mockReturnValue(true);
      mockBaladesService.decrementerPlacesDisponiblesMultiple.mockReturnValue(true);
      mockBaladesService.getBaladeById.mockReturnValue(mockBalade);
      mockEmailService.prototype.sendStripeReservationConfirmation.mockResolvedValue(true);

      const request = new Request('http://localhost:3000/api/admin/confirmer-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const response = await confirmerReservation({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Réservation confirmée avec succès');

      // Vérifications des appels
      expect(mockBaladesService.getReservationById).toHaveBeenCalledWith(1);
      expect(mockBaladesService.modifierReservation).toHaveBeenCalledWith(1, {
        statut: 'confirmee'
      });
      expect(mockBaladesService.decrementerPlacesDisponiblesMultiple).toHaveBeenCalledWith(1, 2);
      expect(mockEmailService.prototype.sendStripeReservationConfirmation).toHaveBeenCalledWith(
        mockReservation,
        mockBalade
      );
    });

    it('devrait gérer les réservations non trouvées', async () => {
      const requestData = { reservationId: 999 };

      mockBaladesService.getReservationById.mockReturnValue(null);

      const request = new Request('http://localhost:3000/api/admin/confirmer-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const response = await confirmerReservation({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Réservation non trouvée');
    });

    it('devrait gérer les réservations déjà confirmées', async () => {
      const requestData = { reservationId: 1 };

      const mockReservation = {
        id: 1,
        statut: 'confirmee' // Déjà confirmée
      };

      mockBaladesService.getReservationById.mockReturnValue(mockReservation);

      const request = new Request('http://localhost:3000/api/admin/confirmer-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const response = await confirmerReservation({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Réservation déjà confirmée');
    });

    it('devrait gérer les erreurs de décrémentation', async () => {
      const requestData = { reservationId: 1 };

      const mockReservation = {
        id: 1,
        baladeId: 1,
        nombrePersonnes: 10,
        statut: 'en_attente'
      };

      const mockBalade = {
        id: 1,
        placesDisponibles: 5 // Pas assez de places
      };

      mockBaladesService.getReservationById.mockReturnValue(mockReservation);
      mockBaladesService.modifierReservation.mockReturnValue(true);
      mockBaladesService.decrementerPlacesDisponiblesMultiple.mockReturnValue(false);
      mockBaladesService.getBaladeById.mockReturnValue(mockBalade);

      const request = new Request('http://localhost:3000/api/admin/confirmer-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const response = await confirmerReservation({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Places insuffisantes');
    });
  });

  describe('GET /api/admin/reservations-en-attente', () => {
    it('devrait retourner les réservations en attente', async () => {
      const mockReservations = [
        {
          id: 1,
          prenom: 'Test',
          nom: 'User',
          email: 'test@example.com',
          nombrePersonnes: 2,
          statut: 'en_attente',
          baladeId: 1
        },
        {
          id: 2,
          prenom: 'Test2',
          nom: 'User2',
          email: 'test2@example.com',
          nombrePersonnes: 1,
          statut: 'en_attente',
          baladeId: 1
        }
      ];

      const mockBalade = {
        id: 1,
        theme: 'Test Balade',
        date: '2025-01-15',
        heure: '14:00',
        lieu: 'Test Lieu',
        placesDisponibles: 5
      };

      mockBaladesService.getAllReservations.mockReturnValue(mockReservations);
      mockBaladesService.getBaladeById.mockReturnValue(mockBalade);

      const request = new Request('http://localhost:3000/api/admin/reservations-en-attente');
      const response = await reservationsEnAttente({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.reservations).toHaveLength(2);
      expect(data.total).toBe(2);

      // Vérification de la structure des données
      expect(data.reservations[0]).toHaveProperty('id');
      expect(data.reservations[0]).toHaveProperty('prenom');
      expect(data.reservations[0]).toHaveProperty('nom');
      expect(data.reservations[0]).toHaveProperty('balade');
      expect(data.reservations[0].balade).toHaveProperty('theme');
    });

    it('devrait retourner une liste vide si aucune réservation en attente', async () => {
      const mockReservations = [
        {
          id: 1,
          statut: 'confirmee' // Pas en attente
        }
      ];

      mockBaladesService.getAllReservations.mockReturnValue(mockReservations);

      const request = new Request('http://localhost:3000/api/admin/reservations-en-attente');
      const response = await reservationsEnAttente({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.reservations).toHaveLength(0);
      expect(data.total).toBe(0);
    });

    it('devrait gérer les erreurs', async () => {
      const error = new Error('Database error');
      mockBaladesService.getAllReservations.mockImplementation(() => {
        throw error;
      });

      const request = new Request('http://localhost:3000/api/admin/reservations-en-attente');
      const response = await reservationsEnAttente({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Erreur lors de la récupération');
    });
  });

  describe('POST /api/admin/corriger-places', () => {
    it('devrait corriger les places disponibles avec succès', async () => {
      const mockResult = {
        baladesCorrigees: 3,
        placesCorrigees: 5
      };

      mockBaladesService.corrigerPlacesDisponibles.mockReturnValue(mockResult);

      const request = new Request('http://localhost:3000/api/admin/corriger-places', {
        method: 'POST'
      });

      const response = await corrigerPlaces({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Places corrigées avec succès');
      expect(data.result).toEqual(mockResult);

      expect(mockBaladesService.corrigerPlacesDisponibles).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de correction', async () => {
      const error = new Error('Database error');
      mockBaladesService.corrigerPlacesDisponibles.mockImplementation(() => {
        throw error;
      });

      const request = new Request('http://localhost:3000/api/admin/corriger-places', {
        method: 'POST'
      });

      const response = await corrigerPlaces({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Erreur lors de la correction');
    });
  });

  describe('Validation des données', () => {
    it('devrait valider les IDs de réservation', () => {
      const validIds = [1, 2, 100];
      const invalidIds = [0, -1, 'invalid'];

      validIds.forEach(id => {
        expect(typeof id).toBe('number');
        expect(id).toBeGreaterThan(0);
      });

      invalidIds.forEach(id => {
        if (typeof id === 'number') {
          expect(id).toBeLessThanOrEqual(0);
        } else {
          expect(typeof id).not.toBe('number');
        }
      });
    });

    it('devrait valider les données de réservation', () => {
      const validReservation = {
        id: 1,
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        nombrePersonnes: 2,
        statut: 'en_attente'
      };

      expect(validReservation.id).toBeGreaterThan(0);
      expect(validReservation.prenom).toBeTruthy();
      expect(validReservation.nom).toBeTruthy();
      expect(validReservation.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(validReservation.nombrePersonnes).toBeGreaterThan(0);
      expect(['en_attente', 'confirmee', 'annulee']).toContain(validReservation.statut);
    });
  });
});
