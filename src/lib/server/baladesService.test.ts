import { describe, it, expect, vi, beforeEach } from 'vitest';
import { baladesService } from './baladesService';

// Mock de la base de données
vi.mock('./database', () => ({
  default: {
    prepare: vi.fn(() => ({
      all: vi.fn(() => [
        {
          id: 1,
          theme: 'Architecture médiévale',
          date: '2024-03-15',
          heure: '14:00',
          lieu: 'Quartier du Bouffay',
          places_disponibles: 3,
          prix: '45€',
          description: 'Découverte des façades historiques',
          consignes: JSON.stringify(['Apportez des chaussures confortables']),
          materiel: JSON.stringify(['Appareil photo fourni']),
          coordonnees: JSON.stringify([{ lat: 47.2138, lng: -1.5561, name: 'Test' }]),
          parcours: JSON.stringify([{ titre: 'Test', description: 'Test', duree: '30 min', distance: '0 km' }]),
          statut: 'en_ligne'
        },
        {
          id: 2,
          theme: 'Street Art & Contemporain',
          date: '2024-03-22',
          heure: '15:00',
          lieu: 'Île de Nantes',
          places_disponibles: 2,
          prix: '50€',
          description: 'Capture des œuvres d\'art urbain',
          consignes: JSON.stringify(['Prévoir une veste']),
          materiel: JSON.stringify(['Pellicules incluses']),
          coordonnees: JSON.stringify([{ lat: 47.2140, lng: -1.5565, name: 'Test' }]),
          parcours: JSON.stringify([{ titre: 'Test', description: 'Test', duree: '30 min', distance: '0 km' }]),
          statut: 'en_ligne'
        }
      ]),
      get: vi.fn((id) => {
        if (id === 1) {
          return {
            id: 1,
            theme: 'Architecture médiévale',
            date: '2024-03-15',
            heure: '14:00',
            lieu: 'Quartier du Bouffay',
            places_disponibles: 3,
            prix: '45€',
            description: 'Découverte des façades historiques',
            consignes: JSON.stringify(['Apportez des chaussures confortables']),
            materiel: JSON.stringify(['Appareil photo fourni']),
            coordonnees: JSON.stringify([{ lat: 47.2138, lng: -1.5561, name: 'Test' }]),
            parcours: JSON.stringify([{ titre: 'Test', description: 'Test', duree: '30 min', distance: '0 km' }]),
            statut: 'en_ligne'
          };
        }
        return null;
      }),
      run: vi.fn(() => ({ changes: 1, lastInsertRowid: 1 }))
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
      expect(balades).toHaveLength(2);
      expect(balades[0].theme).toBe('Architecture médiévale');
      expect(balades[0].statut).toBe('en_ligne');
    });
  });

  describe('getBaladeById', () => {
    it('devrait retourner une balade par ID', () => {
      const balade = baladesService.getBaladeById(1);
      expect(balade?.theme).toBe('Architecture médiévale');
      expect(balade?.statut).toBe('en_ligne');
    });

    it('devrait retourner null pour un ID inexistant', () => {
      const balade = baladesService.getBaladeById(999);
      expect(balade).toBeNull();
    });
  });

  describe('getBaladesEnLigne', () => {
    it('devrait retourner seulement les balades en ligne', () => {
      const balades = baladesService.getBaladesEnLigne();
      expect(balades).toHaveLength(2);
      expect(balades[0].statut).toBe('en_ligne');
      expect(balades[1].statut).toBe('en_ligne');
    });
  });

  describe('getBaladesFutures', () => {
    it('devrait retourner les balades futures en ligne', () => {
      const balades = baladesService.getBaladesFutures();
      expect(balades).toBeDefined();
      expect(Array.isArray(balades)).toBe(true);
    });
  });

  describe('getBaladesArchivees', () => {
    it('devrait retourner les balades passées', () => {
      const balades = baladesService.getBaladesArchivees();
      expect(balades).toBeDefined();
      expect(Array.isArray(balades)).toBe(true);
    });
  });

  describe('hasPlacesAvailable', () => {
    it('devrait retourner true si assez de places', () => {
      const result = baladesService.hasPlacesAvailable(1, 2);
      expect(result).toBe(true);
    });

    it('devrait retourner false si pas assez de places', () => {
      const result = baladesService.hasPlacesAvailable(1, 5);
      expect(result).toBe(false);
    });
  });

  describe('creerBalade', () => {
    it('devrait créer une balade', () => {
      const baladeData = {
        theme: 'Nouvelle Balade',
        date: '2024-12-25',
        heure: '10:00',
        lieu: 'Test Location',
        prix: '50€',
        placesDisponibles: 5,
        description: 'Description test',
        consignes: ['Test consigne'],
        materiel: ['Test materiel'],
        coordonnees: [{ lat: 47.2138, lng: -1.5561, name: 'Test' }],
        parcours: [{ titre: 'Test', description: 'Test', duree: '30 min', distance: '0 km' }]
      };
      const result = baladesService.creerBalade(baladeData);
      expect(result).toBeDefined();
    });
  });

  describe('modifierBalade', () => {
    it('devrait modifier une balade', () => {
      const baladeData = {
        theme: 'Architecture médiévale',
        date: '2024-02-15',
        heure: '14:00',
        lieu: 'Quartier du Bouffay',
        prix: '45€',
        placesDisponibles: 3,
        description: 'Test description'
      };
      const result = baladesService.modifierBalade(1, baladeData);
      expect(result).toBeDefined();
    });
  });

  describe('supprimerBalade', () => {
    it('devrait supprimer une balade existante', () => {
      const result = baladesService.supprimerBalade(1);
      expect(result).toBe(true);
    });
  });

  describe('supprimerReservation', () => {
    it('devrait supprimer une réservation', () => {
      const result = baladesService.supprimerReservation(1);
      expect(result).toBe(true);
    });
  });
});
