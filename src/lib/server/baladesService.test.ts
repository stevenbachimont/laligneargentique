import { describe, it, expect, vi, beforeEach } from 'vitest';
import { baladesService } from './baladesService';

// Mock de la base de données
vi.mock('./database', () => ({
  default: {
    prepare: vi.fn(() => ({
      all: vi.fn(() => [
        {
          id: 1,
          date: '2024-02-15',
          heure: '14:00',
          lieu: 'Quartier du Bouffay',
          theme: 'Architecture médiévale',
          places_disponibles: 3,
          prix: '45€',
          description: 'Test description',
          consignes: JSON.stringify(['Test consigne']),
          materiel: JSON.stringify(['Test materiel']),
          coordonnees: JSON.stringify([{ lat: 47.2138, lng: -1.5561, name: 'Test' }]),
          parcours: JSON.stringify([{ titre: 'Test', description: 'Test', duree: '30 min', distance: '0 km' }])
        }
      ]),
      get: vi.fn((id) => {
        if (id === 1) {
          return {
            id: 1,
            date: '2024-02-15',
            heure: '14:00',
            lieu: 'Quartier du Bouffay',
            theme: 'Architecture médiévale',
            places_disponibles: 3,
            prix: '45€',
            description: 'Test description',
            consignes: JSON.stringify(['Test consigne']),
            materiel: JSON.stringify(['Test materiel']),
            coordonnees: JSON.stringify([{ lat: 47.2138, lng: -1.5561, name: 'Test' }]),
            parcours: JSON.stringify([{ titre: 'Test', description: 'Test', duree: '30 min', distance: '0 km' }])
          };
        }
        return null;
      }),
      run: vi.fn(() => ({ changes: 1 }))
    }))
  }
}));

describe('BaladesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBalades', () => {
    it('devrait retourner toutes les balades', () => {
      const balades = baladesService.getAllBalades();
      expect(balades).toHaveLength(1);
      expect(balades[0].id).toBe(1);
      expect(balades[0].theme).toBe('Architecture médiévale');
    });
  });

  describe('getBaladeById', () => {
    it('devrait retourner une balade par ID', () => {
      const balade = baladesService.getBaladeById(1);
      expect(balade).toBeDefined();
      expect(balade?.theme).toBe('Architecture médiévale');
    });

    it('devrait retourner null pour un ID inexistant', () => {
      const balade = baladesService.getBaladeById(999);
      expect(balade).toBeNull();
    });
  });

  describe('hasPlacesAvailable', () => {
    it('devrait retourner true si assez de places', () => {
      const hasPlaces = baladesService.hasPlacesAvailable(1, 2);
      expect(hasPlaces).toBe(true);
    });

    it('devrait retourner false si pas assez de places', () => {
      const hasPlaces = baladesService.hasPlacesAvailable(1, 5);
      expect(hasPlaces).toBe(false);
    });
  });

  describe('getBaladeStatus', () => {
    it('devrait retourner le bon statut', () => {
      const status = baladesService.getBaladeStatus(1);
      expect(status).toBe('disponible');
    });
  });

  describe('modifierBalade', () => {
    it('devrait retourner null pour une balade inexistante', () => {
      const baladeData = {
        theme: 'Balade inexistante',
        date: '2024-04-01',
        heure: '10:00',
        lieu: 'Lieu',
        prix: '60€',
        placesDisponibles: 5,
        description: 'Description'
      };

      const result = baladesService.modifierBalade(999, baladeData);
      expect(result).toBeNull();
    });
  });

  describe('creerBalade', () => {
    it('devrait créer une nouvelle balade', () => {
      const baladeData = {
        theme: 'Nouvelle balade',
        date: '2024-04-01',
        heure: '10:00',
        lieu: 'Nouveau lieu',
        prix: '60€',
        placesDisponibles: 5,
        description: 'Description de la nouvelle balade'
      };

      const result = baladesService.creerBalade(baladeData);
      expect(result).toBeDefined();
    });
  });

  describe('supprimerBalade', () => {
    it('devrait supprimer une balade existante', () => {
      const result = baladesService.supprimerBalade(1);
      expect(result).toBe(true);
    });
  });
});
