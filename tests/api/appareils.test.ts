import { describe, it, expect } from 'vitest';
import { GET } from '../../src/routes/api/appareils/+server';

describe('API Appareils - Endpoints', () => {

  describe('GET /api/appareils', () => {
    it('devrait retourner tous les appareils sans paramètres', async () => {
      const request = new Request('http://localhost/api/appareils');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils).toBeDefined();
      expect(Array.isArray(data.appareils)).toBe(true);
      expect(data.total).toBeGreaterThan(0);
    });

    it('devrait filtrer par catégorie', async () => {
      const request = new Request('http://localhost/api/appareils?categorie=TLR');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils).toBeDefined();
      expect(Array.isArray(data.appareils)).toBe(true);
      // Vérifier que tous les appareils retournés sont de la catégorie TLR
      data.appareils.forEach((appareil: any) => {
        expect(appareil.categorie).toBe('TLR');
      });
    });

    it('devrait filtrer les appareils disponibles', async () => {
      const request = new Request('http://localhost/api/appareils?disponible=true');
      const response = await GET({ request, url: new URL(request.url) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.appareils).toBeDefined();
      expect(Array.isArray(data.appareils)).toBe(true);
      // Vérifier que tous les appareils retournés sont disponibles
      data.appareils.forEach((appareil: any) => {
        expect(appareil.statut).toBe('disponible');
      });
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
