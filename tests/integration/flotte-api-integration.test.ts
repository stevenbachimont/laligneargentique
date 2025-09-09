import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../src/routes/api/appareils/+server';

// Mock des données d'appareils pour l'intégration API
vi.mock('$lib/data/appareilsData', () => {
  const mockAppareilsData = {
    'TLR': [
      {
        id: '1',
        nom: 'Rolleiflex 2.8F',
        marque: 'Rollei',
        modele: '2.8F',
        categorie: 'TLR',
        annee: 1960,
        description: 'Le mythique Rolleiflex 2.8F',
        caracteristiques: ['Format 6x6 cm', 'Objectif Carl Zeiss Planar 80mm f/2.8'],
        image: '/photos/appareils/rolleiflex-2.8f.jpg',
        statut: 'disponible',
        prixLocation: 45
      },
      {
        id: '2',
        nom: 'Yashica Mat 124G',
        marque: 'Yashica',
        modele: 'Mat 124G',
        categorie: 'TLR',
        annee: 1970,
        description: 'Un TLR abordable mais de qualité',
        caracteristiques: ['Format 6x6 cm', 'Objectif Yashinon 80mm f/3.5'],
        image: '/photos/appareils/yashica-mat-124g.jpg',
        statut: 'disponible',
        prixLocation: 35
      }
    ],
    'SLR': [
      {
        id: '3',
        nom: 'Canon AE-1',
        marque: 'Canon',
        modele: 'AE-1',
        categorie: 'SLR',
        annee: 1976,
        description: 'Le premier SLR électronique de Canon',
        caracteristiques: ['Format 35mm', 'Monture FD'],
        image: '/photos/appareils/canon-ae1.jpg',
        statut: 'disponible',
        prixLocation: 40
      }
    ],
    'Folding': [],
    'Rangefinder': [],
    'Point & Shoot': []
  };

  return {
    appareilsPhotos: mockAppareilsData.TLR.concat(mockAppareilsData.SLR),
    getAppareilsByCategorie: vi.fn(() => mockAppareilsData),
    getAppareilById: vi.fn((id: string) => {
      const allAppareils = mockAppareilsData.TLR.concat(mockAppareilsData.SLR);
      return allAppareils.find(a => a.id === id);
    }),
    getAppareilsDisponibles: vi.fn(() => {
      const allAppareils = mockAppareilsData.TLR.concat(mockAppareilsData.SLR);
      return allAppareils.filter(a => a.statut === 'disponible');
    })
  };
});

describe('Flotte - Tests d\'intégration API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('API et données', () => {
    it('devrait charger les données correctement via l\'API', async () => {
      const request = new Request('http://localhost/api/appareils');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils).toBeDefined();
      expect(data.total).toBe(3); // 2 TLR + 1 SLR
    });

    it('devrait filtrer par catégorie via l\'API', async () => {
      const request = new Request('http://localhost/api/appareils?categorie=TLR');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils.length).toBe(2);
      expect(data.appareils.every((a: any) => a.categorie === 'TLR')).toBe(true);
    });

    it('devrait filtrer les appareils disponibles via l\'API', async () => {
      const request = new Request('http://localhost/api/appareils?disponible=true');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils.every((a: any) => a.statut === 'disponible')).toBe(true);
    });

    it('devrait gérer les catégories inexistantes', async () => {
      const request = new Request('http://localhost/api/appareils?categorie=INEXISTANTE');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils).toEqual([]);
      expect(data.total).toBe(0);
    });
  });

  describe('Performance API', () => {
    it('devrait répondre rapidement', async () => {
      const startTime = Date.now();
      const request = new Request('http://localhost/api/appareils');
      const response = await GET({ request, url: new URL(request.url) });
      const loadTime = Date.now() - startTime;

      expect(response.status).toBe(200);
      expect(loadTime).toBeLessThan(100); // Moins de 100ms
    });

    it('devrait gérer plusieurs requêtes simultanées', async () => {
      const requests = [
        new Request('http://localhost/api/appareils'),
        new Request('http://localhost/api/appareils?categorie=TLR'),
        new Request('http://localhost/api/appareils?disponible=true')
      ];

      const responses = await Promise.all(
        requests.map(req => GET({ request: req, url: new URL(req.url) }))
      );

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Gestion des erreurs API', () => {
    it('devrait gérer les erreurs de données', async () => {
      // Mock d'une erreur en modifiant le mock existant
      const { getAppareilsByCategorie } = await import('../../src/lib/data/appareilsData');
      vi.mocked(getAppareilsByCategorie).mockImplementation(() => {
        throw new Error('Erreur de test');
      });

      const request = new Request('http://localhost/api/appareils?categorie=TLR');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });
});
