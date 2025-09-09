import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../src/routes/api/appareils/+server';
import { appareilsPhotos, getAppareilsByCategorie, getAppareilsDisponibles } from '$lib/data/appareilsData';

// Mock des données
vi.mock('$lib/data/appareilsData', () => ({
  appareilsPhotos: [
    {
      id: '1',
      nom: 'Rolleiflex 2.8F',
      marque: 'Rollei',
      modele: '2.8F',
      categorie: 'TLR',
      annee: 1960,
      description: 'Test description',
      caracteristiques: ['Test 1', 'Test 2'],
      image: '/test/image.jpg',
      statut: 'disponible',
      prixLocation: 45
    },
    {
      id: '2',
      nom: 'Canon AE-1',
      marque: 'Canon',
      modele: 'AE-1',
      categorie: 'SLR',
      annee: 1976,
      description: 'Test description',
      caracteristiques: ['Test 1', 'Test 2'],
      image: '/test/image.jpg',
      statut: 'maintenance',
      prixLocation: 40
    }
  ],
  getAppareilsByCategorie: vi.fn(() => ({
    'TLR': [{
      id: '1',
      nom: 'Rolleiflex 2.8F',
      marque: 'Rollei',
      modele: '2.8F',
      categorie: 'TLR',
      annee: 1960,
      description: 'Test description',
      caracteristiques: ['Test 1', 'Test 2'],
      image: '/test/image.jpg',
      statut: 'disponible',
      prixLocation: 45
    }],
    'SLR': [{
      id: '2',
      nom: 'Canon AE-1',
      marque: 'Canon',
      modele: 'AE-1',
      categorie: 'SLR',
      annee: 1976,
      description: 'Test description',
      caracteristiques: ['Test 1', 'Test 2'],
      image: '/test/image.jpg',
      statut: 'maintenance',
      prixLocation: 40
    }]
  })),
  getAppareilsDisponibles: vi.fn(() => [{
    id: '1',
    nom: 'Rolleiflex 2.8F',
    marque: 'Rollei',
    modele: '2.8F',
    categorie: 'TLR',
    annee: 1960,
    description: 'Test description',
    caracteristiques: ['Test 1', 'Test 2'],
    image: '/test/image.jpg',
    statut: 'disponible',
    prixLocation: 45
  }])
}));

describe('API Appareils - Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/appareils', () => {
    it('devrait retourner tous les appareils sans paramètres', async () => {
      const request = new Request('http://localhost/api/appareils');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils).toBeDefined();
      expect(Array.isArray(data.appareils)).toBe(true);
      expect(data.total).toBe(2);
    });

    it('devrait filtrer par catégorie', async () => {
      const request = new Request('http://localhost/api/appareils?categorie=TLR');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils).toBeDefined();
      expect(Array.isArray(data.appareils)).toBe(true);
      expect(getAppareilsByCategorie).toHaveBeenCalled();
    });

    it('devrait filtrer les appareils disponibles', async () => {
      const request = new Request('http://localhost/api/appareils?disponible=true');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils).toBeDefined();
      expect(Array.isArray(data.appareils)).toBe(true);
      expect(getAppareilsDisponibles).toHaveBeenCalled();
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

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de manière appropriée', async () => {
      // Mock d'une erreur
      vi.mocked(getAppareilsByCategorie).mockImplementation(() => {
        throw new Error('Erreur de test');
      });

      const request = new Request('http://localhost/api/appareils?categorie=TLR');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
      expect(data.appareils).toEqual([]);
      expect(data.total).toBe(0);
    });
  });

  describe('Structure de réponse', () => {
    it('devrait avoir la structure de réponse correcte', async () => {
      const request = new Request('http://localhost/api/appareils');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('appareils');
      expect(data).toHaveProperty('total');
      expect(typeof data.success).toBe('boolean');
      expect(Array.isArray(data.appareils)).toBe(true);
      expect(typeof data.total).toBe('number');
    });

    it('devrait inclure toutes les propriétés des appareils', async () => {
      const request = new Request('http://localhost/api/appareils');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      if (data.appareils.length > 0) {
        const appareil = data.appareils[0];
        expect(appareil).toHaveProperty('id');
        expect(appareil).toHaveProperty('nom');
        expect(appareil).toHaveProperty('marque');
        expect(appareil).toHaveProperty('modele');
        expect(appareil).toHaveProperty('categorie');
        expect(appareil).toHaveProperty('annee');
        expect(appareil).toHaveProperty('description');
        expect(appareil).toHaveProperty('caracteristiques');
        expect(appareil).toHaveProperty('image');
        expect(appareil).toHaveProperty('statut');
        expect(appareil).toHaveProperty('prixLocation');
      }
    });
  });
});
