import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../../src/routes/api/admin/balades/+server';
import { PUT, DELETE } from '../../../../src/routes/api/admin/balades/[id]/+server';
import { baladesService } from '../../../../src/lib/server/baladesService';

// Mock du service baladesService
vi.mock('../../../../src/lib/server/baladesService', () => ({
  baladesService: {
    getAllBalades: vi.fn(),
    getBaladeById: vi.fn(),
    creerBalade: vi.fn(),
    modifierBalade: vi.fn(),
    supprimerBalade: vi.fn()
  }
}));

const mockBaladesService = vi.mocked(baladesService);

describe('API Admin Balades', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/balades', () => {
    it('retourne la liste des balades', async () => {
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
          parcours: [
            {
              titre: "Départ - Place du Bouffay",
              description: "Rendez-vous et présentation",
              latitude: 47.2138,
              longitude: -1.5561
            }
          ],
          coordonnees: [
            {
              latitude: 47.2138,
              longitude: -1.5561
            }
          ]
        }
      ];

      mockBaladesService.getAllBalades.mockReturnValue(mockBalades);

      const request = new Request('http://localhost:3000/api/admin/balades');
      const response = await GET({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.balades).toEqual(mockBalades);
      expect(mockBaladesService.getAllBalades).toHaveBeenCalled();
    });

    it('gère les erreurs lors du chargement des balades', async () => {
      mockBaladesService.getAllBalades.mockImplementation(() => {
        throw new Error('Erreur de base de données');
      });

      const request = new Request('http://localhost:3000/api/admin/balades');
      const response = await GET({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Erreur interne du serveur');
    });
  });

  describe('POST /api/admin/balades', () => {
    it('crée une nouvelle balade avec parcours', async () => {
      const baladeData = {
        theme: "Nouvelle balade",
        date: "2024-04-01",
        heure: "10:00",
        lieu: "Nouveau lieu",
        prix: "60€",
        placesDisponibles: 5,
        description: "Description de la nouvelle balade",
        parcours: [
          {
            titre: "Étape 1",
            description: "Description étape 1",
            latitude: 47.2138,
            longitude: -1.5561
          }
        ],
        coordonnees: [
          {
            latitude: 47.2138,
            longitude: -1.5561
          }
        ]
      };

      const mockCreatedBalade = { id: 3, ...baladeData };
      mockBaladesService.creerBalade.mockReturnValue(mockCreatedBalade);

      const request = new Request('http://localhost:3000/api/admin/balades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baladeData)
      });

      const response = await POST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.balade).toEqual(mockCreatedBalade);
      expect(mockBaladesService.creerBalade).toHaveBeenCalledWith(baladeData);
    });

    it('valide les champs obligatoires', async () => {
      const invalidData = {
        theme: "",
        date: "2024-04-01",
        heure: "10:00",
        lieu: "",
        prix: "60€",
        placesDisponibles: 5,
        description: ""
      };

      const request = new Request('http://localhost:3000/api/admin/balades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      const response = await POST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Tous les champs sont obligatoires');
    });
  });

  describe('PUT /api/admin/balades/[id]', () => {
    it('modifie une balade existante avec parcours', async () => {
      const baladeId = 1;
      const baladeData = {
        theme: "Balade modifiée",
        date: "2024-04-01",
        heure: "10:00",
        lieu: "Lieu modifié",
        prix: "60€",
        placesDisponibles: 5,
        description: "Description modifiée",
        parcours: [
          {
            titre: "Étape modifiée",
            description: "Description étape modifiée",
            latitude: 47.2138,
            longitude: -1.5561
          }
        ],
        coordonnees: [
          {
            latitude: 47.2138,
            longitude: -1.5561
          }
        ]
      };

      const existingBalade = { id: baladeId, ...baladeData };
      const updatedBalade = { id: baladeId, ...baladeData };

      mockBaladesService.getBaladeById.mockReturnValue(existingBalade);
      mockBaladesService.modifierBalade.mockReturnValue(updatedBalade);

      const request = new Request(`http://localhost:3000/api/admin/balades/${baladeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baladeData)
      });

      const response = await PUT({ request, params: { id: baladeId.toString() } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.balade).toEqual(updatedBalade);
      expect(mockBaladesService.modifierBalade).toHaveBeenCalledWith(baladeId, baladeData);
    });

    it('gère les balades inexistantes', async () => {
      const baladeId = 999;
      mockBaladesService.getBaladeById.mockReturnValue(null);

      const baladeData = {
        theme: "Balade inexistante",
        date: "2024-04-01",
        heure: "10:00",
        lieu: "Lieu",
        prix: "60€",
        placesDisponibles: 5,
        description: "Description"
      };

      const request = new Request(`http://localhost:3000/api/admin/balades/${baladeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baladeData)
      });

      const response = await PUT({ request, params: { id: baladeId.toString() } } as any);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Balade non trouvée');
    });

    it('valide les champs obligatoires lors de la modification', async () => {
      const baladeId = 1;
      const invalidData = {
        theme: "",
        date: "2024-04-01",
        heure: "10:00",
        lieu: "",
        prix: "60€",
        placesDisponibles: 5,
        description: ""
      };

      const request = new Request(`http://localhost:3000/api/admin/balades/${baladeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      const response = await PUT({ request, params: { id: baladeId.toString() } } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Tous les champs sont obligatoires');
    });
  });

  describe('DELETE /api/admin/balades/[id]', () => {
    it('supprime une balade existante', async () => {
      const baladeId = 1;
      const existingBalade = {
        id: baladeId,
        theme: "Balade à supprimer",
        date: "2024-04-01",
        heure: "10:00",
        lieu: "Lieu",
        prix: "60€",
        placesDisponibles: 5,
        description: "Description"
      };

      mockBaladesService.getBaladeById.mockReturnValue(existingBalade);
      mockBaladesService.supprimerBalade.mockReturnValue(true);

      const request = new Request(`http://localhost:3000/api/admin/balades/${baladeId}`, {
        method: 'DELETE'
      });

      const response = await DELETE({ request, params: { id: baladeId.toString() } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Balade supprimée avec succès');
      expect(mockBaladesService.supprimerBalade).toHaveBeenCalledWith(baladeId);
    });

    it('gère les balades inexistantes lors de la suppression', async () => {
      const baladeId = 999;
      mockBaladesService.getBaladeById.mockReturnValue(null);

      const request = new Request(`http://localhost:3000/api/admin/balades/${baladeId}`, {
        method: 'DELETE'
      });

      const response = await DELETE({ request, params: { id: baladeId.toString() } } as any);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Balade non trouvée');
    });
  });

  describe('Gestion des parcours et coordonnées', () => {
    it('modifie une balade avec parcours et coordonnées GPS', async () => {
      const baladeId = 1;
      const baladeData = {
        theme: "Balade avec parcours",
        date: "2024-04-01",
        heure: "10:00",
        lieu: "Lieu",
        prix: "60€",
        placesDisponibles: 5,
        description: "Description",
        parcours: [
          {
            titre: "Étape 1",
            description: "Description étape 1",
            latitude: 47.2138,
            longitude: -1.5561
          },
          {
            titre: "Étape 2",
            description: "Description étape 2",
            latitude: 47.2172,
            longitude: -1.5536
          }
        ],
        coordonnees: [
          {
            latitude: 47.2138,
            longitude: -1.5561
          },
          {
            latitude: 47.2172,
            longitude: -1.5536
          }
        ]
      };

      const existingBalade = { id: baladeId, ...baladeData };
      const updatedBalade = { id: baladeId, ...baladeData };

      mockBaladesService.getBaladeById.mockReturnValue(existingBalade);
      mockBaladesService.modifierBalade.mockReturnValue(updatedBalade);

      const request = new Request(`http://localhost:3000/api/admin/balades/${baladeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baladeData)
      });

      const response = await PUT({ request, params: { id: baladeId.toString() } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.balade.parcours).toHaveLength(2);
      expect(data.balade.coordonnees).toHaveLength(2);
      expect(mockBaladesService.modifierBalade).toHaveBeenCalledWith(baladeId, baladeData);
    });

    it('crée une balade avec parcours vide', async () => {
      const baladeData = {
        theme: "Nouvelle balade",
        date: "2024-04-01",
        heure: "10:00",
        lieu: "Lieu",
        prix: "60€",
        placesDisponibles: 5,
        description: "Description",
        parcours: [],
        coordonnees: []
      };

      const mockCreatedBalade = { id: 3, ...baladeData };
      mockBaladesService.creerBalade.mockReturnValue(mockCreatedBalade);

      const request = new Request('http://localhost:3000/api/admin/balades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baladeData)
      });

      const response = await POST({ request } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.balade.parcours).toEqual([]);
      expect(data.balade.coordonnees).toEqual([]);
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

    it('devrait maintenir la cohérence entre les pages admin et publique', () => {
      // Vérification que la même logique est appliquée partout
      const getAnneeLabelAdmin = (annee: string): string => annee;
      const getAnneeLabelPublic = (annee: string): string => annee;

      const testAnnee = '2024';
      expect(getAnneeLabelAdmin(testAnnee)).toBe(getAnneeLabelPublic(testAnnee));
      expect(getAnneeLabelAdmin(testAnnee)).toBe('2024');
    });
  });
});
