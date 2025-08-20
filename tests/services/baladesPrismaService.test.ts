import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Mock de Prisma
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    balade: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn()
    },
    reservation: {
      create: vi.fn()
    }
  }))
}));

// Mock des stores Svelte
vi.mock('svelte/store', () => ({
  writable: vi.fn(() => ({
    set: vi.fn(),
    subscribe: vi.fn()
  }))
}));

describe('BaladesPrismaService', () => {
  let mockPrisma: any;
  let baladesPrismaService: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Importer le service après avoir mocké les dépendances
    const { baladesPrismaService: service } = await import('$lib/services/baladesPrismaService');
    baladesPrismaService = service;
    
    // Récupérer l'instance mockée de Prisma
    mockPrisma = new PrismaClient();
  });

  describe('getBalades', () => {
    it('devrait récupérer toutes les balades avec succès', async () => {
      const mockBalades = [
        {
          id: 1,
          theme: 'Architecture médiévale',
          placesDisponibles: 2,
          placesInitiales: 5,
          consignes: [],
          materiel: [],
          coordonnees: [],
          parcours: []
        }
      ];

      mockPrisma.balade.findMany.mockResolvedValue(mockBalades);

      const result = await baladesPrismaService.getBalades();

      expect(result).toEqual(mockBalades);
      expect(mockPrisma.balade.findMany).toHaveBeenCalledWith({
        include: {
          consignes: true,
          materiel: true,
          coordonnees: true,
          parcours: true,
        },
        orderBy: {
          date: 'asc'
        }
      });
    });

    it('devrait gérer les erreurs de base de données', async () => {
      mockPrisma.balade.findMany.mockRejectedValue(new Error('Erreur DB'));

      const result = await baladesPrismaService.getBalades();

      expect(result).toEqual([]);
    });
  });

  describe('getBaladeById', () => {
    it('devrait récupérer une balade par ID avec succès', async () => {
      const mockBalade = {
        id: 1,
        theme: 'Architecture médiévale',
        placesDisponibles: 2,
        placesInitiales: 5,
        consignes: [],
        materiel: [],
        coordonnees: [],
        parcours: []
      };

      mockPrisma.balade.findUnique.mockResolvedValue(mockBalade);

      const result = await baladesPrismaService.getBaladeById(1);

      expect(result).toEqual(mockBalade);
      expect(mockPrisma.balade.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          consignes: true,
          materiel: true,
          coordonnees: true,
          parcours: true,
        }
      });
    });

    it('devrait retourner null si la balade n\'existe pas', async () => {
      mockPrisma.balade.findUnique.mockResolvedValue(null);

      const result = await baladesPrismaService.getBaladeById(999);

      expect(result).toBeNull();
    });
  });

  describe('reserverPlaces', () => {
    it('devrait réserver des places avec succès', async () => {
      const mockBalade = {
        id: 1,
        placesDisponibles: 5,
        placesInitiales: 10,
        consignes: [],
        materiel: [],
        coordonnees: [],
        parcours: []
      };

      const mockBaladeMiseAJour = {
        ...mockBalade,
        placesDisponibles: 3
      };

      mockPrisma.balade.findUnique.mockResolvedValue(mockBalade);
      mockPrisma.balade.update.mockResolvedValue(mockBaladeMiseAJour);
      mockPrisma.balade.findMany.mockResolvedValue([mockBaladeMiseAJour]);

      const result = await baladesPrismaService.reserverPlaces(1, 2);

      expect(result).toBe(true);
      expect(mockPrisma.balade.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          placesDisponibles: 3
        },
        include: {
          consignes: true,
          materiel: true,
          coordonnees: true,
          parcours: true,
        }
      });
    });

    it('devrait échouer si pas assez de places', async () => {
      const mockBalade = {
        id: 1,
        placesDisponibles: 1,
        placesInitiales: 10,
        consignes: [],
        materiel: [],
        coordonnees: [],
        parcours: []
      };

      mockPrisma.balade.findUnique.mockResolvedValue(mockBalade);

      const result = await baladesPrismaService.reserverPlaces(1, 3);

      expect(result).toBe(false);
    });
  });

  describe('creerReservation', () => {
    it('devrait créer une réservation avec succès', async () => {
      const reservationData = {
        baladeId: 1,
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean@example.com',
        dateSouhaitee: '2024-01-15',
        nombrePersonnes: 2,
        message: 'Test'
      };

      const mockReservation = { id: 1, ...reservationData };
      mockPrisma.reservation.create.mockResolvedValue(mockReservation);

      const result = await baladesPrismaService.creerReservation(reservationData);

      expect(result).toBe(true);
      expect(mockPrisma.reservation.create).toHaveBeenCalledWith({
        data: reservationData
      });
    });
  });
});
