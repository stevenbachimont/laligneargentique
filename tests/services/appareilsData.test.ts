import { describe, it, expect } from 'vitest';
import { 
  appareilsPhotos, 
  getAppareilsByCategorie, 
  getAppareilById, 
  getAppareilsDisponibles,
  type AppareilPhoto 
} from '../../src/lib/data/appareilsData';

describe('AppareilsData - Données des appareils photos', () => {
  describe('Structure des données', () => {
    it('devrait avoir des appareils définis', () => {
      expect(appareilsPhotos).toBeDefined();
      expect(Array.isArray(appareilsPhotos)).toBe(true);
      expect(appareilsPhotos.length).toBeGreaterThan(0);
    });

    it('devrait avoir des appareils avec toutes les propriétés requises', () => {
      appareilsPhotos.forEach(appareil => {
        expect(appareil.id).toBeDefined();
        expect(appareil.nom).toBeDefined();
        expect(appareil.marque).toBeDefined();
        expect(appareil.modele).toBeDefined();
        expect(appareil.categorie).toBeDefined();
        expect(appareil.annee).toBeDefined();
        expect(appareil.description).toBeDefined();
        expect(appareil.caracteristiques).toBeDefined();
        expect(appareil.image).toBeDefined();
        expect(appareil.statut).toBeDefined();
        expect(appareil.prixLocation).toBeDefined();
      });
    });

    it('devrait avoir des catégories valides', () => {
      const categoriesValides = ['TLR', 'SLR', 'Folding', 'Rangefinder', 'Point & Shoot'];
      appareilsPhotos.forEach(appareil => {
        expect(categoriesValides).toContain(appareil.categorie);
      });
    });

    it('devrait avoir des statuts valides', () => {
      const statutsValides = ['disponible', 'maintenance', 'reserve'];
      appareilsPhotos.forEach(appareil => {
        expect(statutsValides).toContain(appareil.statut);
      });
    });
  });

  describe('Fonction getAppareilsByCategorie', () => {
    it('devrait retourner un objet avec les catégories', () => {
      const appareilsParCategorie = getAppareilsByCategorie();
      expect(appareilsParCategorie).toBeDefined();
      expect(typeof appareilsParCategorie).toBe('object');
    });

    it('devrait avoir toutes les catégories présentes', () => {
      const appareilsParCategorie = getAppareilsByCategorie();
      const categoriesAttendues = ['TLR', 'SLR', 'Folding', 'Rangefinder', 'Point & Shoot'];
      
      categoriesAttendues.forEach(categorie => {
        expect(appareilsParCategorie[categorie]).toBeDefined();
        expect(Array.isArray(appareilsParCategorie[categorie])).toBe(true);
      });
    });

    it('devrait avoir des appareils dans chaque catégorie', () => {
      const appareilsParCategorie = getAppareilsByCategorie();
      
      Object.values(appareilsParCategorie).forEach(appareilsCategorie => {
        expect(appareilsCategorie.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Fonction getAppareilById', () => {
    it('devrait retourner un appareil existant', () => {
      const appareil = getAppareilById('1');
      expect(appareil).toBeDefined();
      expect(appareil?.id).toBe('1');
    });

    it('devrait retourner undefined pour un ID inexistant', () => {
      const appareil = getAppareilById('inexistant');
      expect(appareil).toBeUndefined();
    });
  });

  describe('Fonction getAppareilsDisponibles', () => {
    it('devrait retourner seulement les appareils disponibles', () => {
      const appareilsDisponibles = getAppareilsDisponibles();
      expect(appareilsDisponibles).toBeDefined();
      expect(Array.isArray(appareilsDisponibles)).toBe(true);
      
      appareilsDisponibles.forEach(appareil => {
        expect(appareil.statut).toBe('disponible');
      });
    });

    it('devrait avoir au moins un appareil disponible', () => {
      const appareilsDisponibles = getAppareilsDisponibles();
      expect(appareilsDisponibles.length).toBeGreaterThan(0);
    });
  });

  describe('Données spécifiques', () => {
    it('devrait avoir le Rolleiflex 2.8F', () => {
      const rolleiflex = appareilsPhotos.find(a => a.nom === 'Rolleiflex 2.8F');
      expect(rolleiflex).toBeDefined();
      expect(rolleiflex?.marque).toBe('Rollei');
      expect(rolleiflex?.categorie).toBe('TLR');
      expect(rolleiflex?.prixLocation).toBe(45);
    });

    it('devrait avoir le Canon AE-1', () => {
      const canon = appareilsPhotos.find(a => a.nom === 'Canon AE-1');
      expect(canon).toBeDefined();
      expect(canon?.marque).toBe('Canon');
      expect(canon?.categorie).toBe('SLR');
      expect(canon?.prixLocation).toBe(40);
    });

    it('devrait avoir des caractéristiques pour chaque appareil', () => {
      appareilsPhotos.forEach(appareil => {
        expect(appareil.caracteristiques).toBeDefined();
        expect(Array.isArray(appareil.caracteristiques)).toBe(true);
        expect(appareil.caracteristiques.length).toBeGreaterThan(0);
      });
    });

    it('devrait avoir des images définies', () => {
      appareilsPhotos.forEach(appareil => {
        expect(appareil.image).toBeDefined();
        expect(appareil.image).toMatch(/^\/flotte\//);
      });
    });
  });
});
