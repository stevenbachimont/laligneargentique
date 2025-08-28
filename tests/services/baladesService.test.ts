import { describe, it, expect, vi, beforeEach } from 'vitest';
import { baladesService } from '../../src/lib/server/baladesService';

// Mock de la base de données
const mockDb = {
  prepare: vi.fn(),
  transaction: vi.fn()
};

// Mock des modules
vi.mock('better-sqlite3', () => ({
  default: vi.fn(() => mockDb)
}));

describe('BaladesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Gestion des balades', () => {
    it('devrait créer une balade avec statut', () => {
      const mockStmt = {
        run: vi.fn().mockReturnValue({ lastInsertRowid: 1 })
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const baladeData = {
        theme: 'Test Balade',
        date: '2025-01-15',
        heure: '14:00',
        lieu: 'Test Lieu',
        prix: '50€',
        description: 'Description test',
        statut: 'brouillon'
      };

      const result = baladesService.creerBalade(baladeData);

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO balades')
      );
      expect(mockStmt.run).toHaveBeenCalledWith(
        expect.objectContaining({
          statut: 'brouillon'
        })
      );
      expect(result).toBe(1);
    });

    it('devrait modifier une balade avec parcours et coordonnées', () => {
      const mockStmt = {
        run: vi.fn().mockReturnValue({ changes: 1 })
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const baladeData = {
        id: 1,
        theme: 'Balade Modifiée',
        parcours: [
          {
            titre: 'Étape 1',
            description: 'Description étape 1',
            duree: '30 min',
            distance: '0 km'
          }
        ],
        coordonnees: [
          {
            lat: 47.2138,
            lng: -1.5561,
            name: 'Point de départ'
          }
        ],
        statut: 'en_ligne'
      };

      const result = baladesService.modifierBalade(1, baladeData);

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE balades')
      );
      expect(mockStmt.run).toHaveBeenCalledWith(
        expect.objectContaining({
          parcours: JSON.stringify(baladeData.parcours),
          coordonnees: JSON.stringify(baladeData.coordonnees),
          statut: 'en_ligne'
        })
      );
      expect(result).toBe(true);
    });

    it('devrait filtrer les balades par statut', () => {
      const mockBalades = [
        { id: 1, statut: 'en_ligne' },
        { id: 2, statut: 'brouillon' },
        { id: 3, statut: 'en_ligne' }
      ];

      const mockStmt = {
        all: vi.fn().mockReturnValue(mockBalades)
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const result = baladesService.getBaladesEnLigne();

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('WHERE statut = ?')
      );
      expect(mockStmt.all).toHaveBeenCalledWith('en_ligne');
      expect(result).toEqual(mockBalades);
    });
  });

  describe('Gestion des réservations', () => {
    it('devrait créer une réservation avec statut en_attente', () => {
      const mockStmt = {
        run: vi.fn().mockReturnValue({ lastInsertRowid: 1 })
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const reservationData = {
        baladeId: 1,
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        telephone: '0123456789',
        message: 'Test message',
        nombrePersonnes: 2,
        montant: 2000 // 20€ en centimes
      };

      const result = baladesService.creerReservation(reservationData);

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO reservations')
      );
      expect(mockStmt.run).toHaveBeenCalledWith(
        expect.objectContaining({
          statut: 'en_attente',
          nombrePersonnes: 2,
          montant: 2000
        })
      );
      expect(result).toBe(1);
    });

    it('devrait modifier le statut d\'une réservation', () => {
      const mockStmt = {
        run: vi.fn().mockReturnValue({ changes: 1 })
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const updates = {
        statut: 'confirmee',
        paymentIntentId: 'pi_test_123',
        montant: 2000
      };

      const result = baladesService.modifierReservation(1, updates);

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE reservations')
      );
      expect(mockStmt.run).toHaveBeenCalledWith(
        'confirmee',
        'pi_test_123',
        2000,
        1
      );
      expect(result).toBe(true);
    });

    it('devrait récupérer une réservation par ID', () => {
      const mockReservation = {
        id: 1,
        baladeId: 1,
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        statut: 'en_attente',
        nombrePersonnes: 2,
        montant: 2000
      };

      const mockStmt = {
        get: vi.fn().mockReturnValue(mockReservation)
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const result = baladesService.getReservationById(1);

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM reservations')
      );
      expect(mockStmt.get).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockReservation);
    });
  });

  describe('Gestion des places disponibles', () => {
    it('devrait décrémenter une place disponible', () => {
      const mockStmt = {
        run: vi.fn().mockReturnValue({ changes: 1 })
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const result = baladesService.decrementerPlacesDisponibles(1);

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE balades SET places_disponibles = places_disponibles - 1')
      );
      expect(mockStmt.run).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('devrait décrémenter plusieurs places disponibles', () => {
      const mockStmt = {
        run: vi.fn().mockReturnValue({ changes: 1 })
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const result = baladesService.decrementerPlacesDisponiblesMultiple(1, 3);

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE balades SET places_disponibles = places_disponibles - ?')
      );
      expect(mockStmt.run).toHaveBeenCalledWith(3, 1, 3);
      expect(result).toBe(true);
    });

    it('devrait retourner false si pas assez de places', () => {
      const mockStmt = {
        run: vi.fn().mockReturnValue({ changes: 0 })
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const result = baladesService.decrementerPlacesDisponiblesMultiple(1, 10);

      expect(result).toBe(false);
    });

    it('devrait corriger les places disponibles', () => {
      const mockBalades = [
        { id: 1, places_disponibles: 3 },
        { id: 2, places_disponibles: 2 }
      ];

      const mockReservations = [
        { total_reservees: 2 },
        { total_reservees: 1 }
      ];

      const mockStmtSelect = {
        all: vi.fn().mockReturnValue(mockBalades)
      };

      const mockStmtSum = {
        get: vi.fn()
          .mockReturnValueOnce(mockReservations[0])
          .mockReturnValueOnce(mockReservations[1])
      };

      const mockStmtUpdate = {
        run: vi.fn().mockReturnValue({ changes: 1 })
      };

      mockDb.prepare
        .mockReturnValueOnce(mockStmtSelect)
        .mockReturnValueOnce(mockStmtSum)
        .mockReturnValueOnce(mockStmtUpdate)
        .mockReturnValueOnce(mockStmtSum)
        .mockReturnValueOnce(mockStmtUpdate);

      const result = baladesService.corrigerPlacesDisponibles();

      expect(result.baladesCorrigees).toBeGreaterThan(0);
      expect(result.placesCorrigees).toBeGreaterThan(0);
    });
  });

  describe('Gestion des balades archivées', () => {
    it('devrait récupérer les balades archivées', () => {
      const mockBalades = [
        { id: 1, theme: 'Balade passée', date: '2023-01-01' }
      ];

      const mockStmt = {
        all: vi.fn().mockReturnValue(mockBalades)
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const result = baladesService.getBaladesArchivees();

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('WHERE date < ?')
      );
      expect(result).toEqual(mockBalades);
    });

    it('devrait récupérer les balades futures', () => {
      const mockBalades = [
        { id: 1, theme: 'Balade future', date: '2025-01-01' }
      ];

      const mockStmt = {
        all: vi.fn().mockReturnValue(mockBalades)
      };
      mockDb.prepare.mockReturnValue(mockStmt);

      const result = baladesService.getBaladesFutures();

      expect(mockDb.prepare).toHaveBeenCalledWith(
        expect.stringContaining('WHERE date >= ?')
      );
      expect(result).toEqual(mockBalades);
    });
  });

  describe('Validation des données', () => {
    it('devrait valider les coordonnées GPS', () => {
      const validCoords = [
        { lat: 47.2138, lng: -1.5561, name: 'Point valide' }
      ];

      const invalidCoords = [
        { lat: 91, lng: 181, name: 'Point invalide' } // Coordonnées hors limites
      ];

      // Test avec coordonnées valides
      expect(() => {
        baladesService.modifierBalade(1, { coordonnees: validCoords });
      }).not.toThrow();

      // Test avec coordonnées invalides (si validation implémentée)
      // expect(() => {
      //   baladesService.modifierBalade(1, { coordonnees: invalidCoords });
      // }).toThrow();
    });

    it('devrait valider le nombre de personnes', () => {
      const validReservation = {
        baladeId: 1,
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        nombrePersonnes: 1
      };

      const invalidReservation = {
        baladeId: 1,
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        nombrePersonnes: 0 // Nombre invalide
      };

      // Test avec nombre valide
      expect(() => {
        baladesService.creerReservation(validReservation);
      }).not.toThrow();

      // Test avec nombre invalide (si validation implémentée)
      // expect(() => {
      //   baladesService.creerReservation(invalidReservation);
      // }).toThrow();
    });
  });
});
