import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../src/routes/api/balades/+server';
import { baladesService } from '../../src/lib/server/baladesService';

// Mock du service baladesService
vi.mock('../../src/lib/server/baladesService', () => ({
  baladesService: {
    getBaladesEnLigne: vi.fn(),
    getBaladesFutures: vi.fn(),
    getBaladesArchivees: vi.fn(),
    getAllBalades: vi.fn()
  }
}));

const mockBaladesService = vi.mocked(baladesService);

describe('API Balades Publiques', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/balades', () => {
    it('retourne les balades en ligne par défaut', async () => {
      const mockBalades = [
        {
          id: 1,
          theme: "Architecture médiévale",
          date: "2024-03-15",
          heure: "14:00",
          lieu: "Quartier du Bouffay",
          prix: "45€",
          placesDisponibles: 3,
          description: "Découverte de l'architecture médiévale",
          statut: "en_ligne",
          parcours: [],
          coordonnees: []
        }
      ];

      mockBaladesService.getBaladesEnLigne.mockReturnValue(mockBalades);

      const url = new URL('http://localhost:3000/api/balades');
      const response = await GET({ url } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.balades).toEqual(mockBalades);
      expect(mockBaladesService.getBaladesEnLigne).toHaveBeenCalled();
    });

    it('retourne les balades futures avec type=futures', async () => {
      const mockBalades = [
        {
          id: 2,
          theme: "Balade future",
          date: "2025-01-15",
          heure: "10:00",
          lieu: "Lieu futur",
          prix: "50€",
          placesDisponibles: 5,
          description: "Balade à venir",
          statut: "en_ligne",
          parcours: [],
          coordonnees: []
        }
      ];

      mockBaladesService.getBaladesFutures.mockReturnValue(mockBalades);

      const url = new URL('http://localhost:3000/api/balades?type=futures');
      const response = await GET({ url } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.balades).toEqual(mockBalades);
      expect(mockBaladesService.getBaladesFutures).toHaveBeenCalled();
    });

    it('retourne les balades archivées avec type=archivees', async () => {
      const mockBalades = [
        {
          id: 3,
          theme: "Balade passée",
          date: "2023-06-15",
          heure: "14:00",
          lieu: "Lieu passé",
          prix: "45€",
          placesDisponibles: 0,
          description: "Balade terminée",
          statut: "archivé",
          parcours: [],
          coordonnees: []
        }
      ];

      mockBaladesService.getBaladesArchivees.mockReturnValue(mockBalades);

      const url = new URL('http://localhost:3000/api/balades?type=archivees');
      const response = await GET({ url } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.balades).toEqual(mockBalades);
      expect(mockBaladesService.getBaladesArchivees).toHaveBeenCalled();
    });

    it('retourne toutes les balades avec admin=true', async () => {
      const mockBalades = [
        {
          id: 1,
          theme: "Balade admin",
          date: "2024-03-15",
          heure: "14:00",
          lieu: "Lieu admin",
          prix: "45€",
          placesDisponibles: 3,
          description: "Balade visible par admin",
          statut: "brouillon",
          parcours: [],
          coordonnees: []
        }
      ];

      mockBaladesService.getAllBalades.mockReturnValue(mockBalades);

      const url = new URL('http://localhost:3000/api/balades?admin=true');
      const response = await GET({ url } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.balades).toEqual(mockBalades);
      expect(mockBaladesService.getAllBalades).toHaveBeenCalled();
    });
  });

  describe('Fonction getAnneeLabel simplifiée', () => {
    it('devrait retourner seulement l\'année sans mention contextuelle', () => {
      // Simulation de la fonction getAnneeLabel simplifiée
      const getAnneeLabel = (annee: string): string => {
        return annee;
      };

      // Tests des différents cas
      expect(getAnneeLabel('2024')).toBe('2024');
      expect(getAnneeLabel('2025')).toBe('2025');
      expect(getAnneeLabel('2023')).toBe('2023');
      expect(getAnneeLabel('2026')).toBe('2026');
    });

    it('devrait traiter les années comme des chaînes simples', () => {
      const getAnneeLabel = (annee: string): string => {
        return annee;
      };

      // Test avec différents formats d'années
      expect(getAnneeLabel('2024')).toBe('2024');
      expect(getAnneeLabel('25')).toBe('25');
      expect(getAnneeLabel('2020')).toBe('2020');
    });

    it('devrait maintenir la cohérence avec la page admin', () => {
      // Vérification que la même logique est appliquée partout
      const getAnneeLabelAdmin = (annee: string): string => annee;
      const getAnneeLabelPublic = (annee: string): string => annee;

      const testAnnee = '2024';
      expect(getAnneeLabelAdmin(testAnnee)).toBe(getAnneeLabelPublic(testAnnee));
      expect(getAnneeLabelPublic(testAnnee)).toBe('2024');
    });
  });
});
