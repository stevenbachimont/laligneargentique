import { describe, it, expect } from 'vitest';
import baladesData from './balades-argentique.json';

describe('Intégration balades-argentique.json', () => {
  it('devrait avoir une structure cohérente pour toutes les balades', () => {
    const balades = baladesData.baladesProgrammees;
    
    balades.forEach((balade, index) => {
      // Vérifier que chaque balade a un ID unique et séquentiel
      expect(balade.id).toBe(index + 1);
      
      // Vérifier que le prix est cohérent
      expect(balade.prix).toBe('45€');
      
      // Vérifier que les places disponibles sont dans une plage raisonnable
      expect(balade.placesDisponibles).toBeGreaterThanOrEqual(0);
      expect(balade.placesDisponibles).toBeLessThanOrEqual(5);
      
      // Vérifier que les dates sont au format correct
      expect(balade.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      
      // Vérifier que les heures sont au format correct
      expect(balade.heure).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  it('devrait avoir des coordonnées GPS cohérentes pour Nantes', () => {
    const balades = baladesData.baladesProgrammees;
    
    balades.forEach((balade) => {
      balade.coordonnees.forEach((coord: any) => {
        // Vérifier que les coordonnées sont dans la région de Nantes
        expect(coord.lat).toBeGreaterThan(47.0);
        expect(coord.lat).toBeLessThan(48.0);
        expect(coord.lng).toBeGreaterThan(-2.0);
        expect(coord.lng).toBeLessThan(-1.0);
        
        // Vérifier que les noms ne sont pas vides
        expect(coord.name.length).toBeGreaterThan(0);
      });
    });
  });

  it('devrait avoir des parcours cohérents', () => {
    const balades = baladesData.baladesProgrammees;
    
    balades.forEach((balade) => {
      const parcours = balade.parcours;
      
      // Vérifier qu'il y a au moins 5 étapes
      expect(parcours.length).toBeGreaterThanOrEqual(5);
      
      // Vérifier que la première étape commence par "Départ"
      expect(parcours[0].titre).toMatch(/^Départ/);
      
      // Vérifier que la dernière étape contient "Retour"
      const lastStep = parcours[parcours.length - 1];
      expect(lastStep.titre).toMatch(/Retour/);
      
      // Vérifier que toutes les étapes ont une durée
      parcours.forEach((etape: any) => {
        expect(etape.duree).toMatch(/^\d+ min$/);
        expect(etape.distance).toMatch(/^\d+\.?\d* km$/);
      });
    });
  });

  it('devrait avoir des consignes et matériel pertinents', () => {
    const balades = baladesData.baladesProgrammees;
    
    balades.forEach((balade) => {
      // Vérifier que les consignes contiennent des mots-clés importants
      const consignesText = balade.consignes.join(' ').toLowerCase();
      expect(consignesText).toMatch(/vêtements|chaussures|appareil|photo/);
      
      // Vérifier que le matériel contient des éléments techniques
      const materielText = balade.materiel.join(' ').toLowerCase();
      expect(materielText).toMatch(/appareil|pellicule|objectif|guide/);
    });
  });

  it('devrait avoir des thèmes et lieux cohérents', () => {
    const balades = baladesData.baladesProgrammees;
    
    // Vérifier que les thèmes sont uniques et descriptifs
    const themes = balades.map(b => b.theme);
    const uniqueThemes = new Set(themes);
    expect(uniqueThemes.size).toBe(themes.length);
    
    // Vérifier que les lieux sont des endroits réels de Nantes
    const lieux = balades.map(b => b.lieu);
    expect(lieux).toContain('Quartier du Bouffay');
    expect(lieux).toContain('Île de Nantes');
    expect(lieux).toContain('Jardin des Plantes');
  });

  it('devrait avoir des descriptions cohérentes avec les thèmes', () => {
    const balades = baladesData.baladesProgrammees;
    
    balades.forEach((balade) => {
      const description = balade.description.toLowerCase();
      const theme = balade.theme.toLowerCase();
      
      // Vérifier que la description correspond au thème
      if (theme.includes('architecture')) {
        expect(description).toMatch(/architecture|historique|façade/);
      } else if (theme.includes('street art')) {
        expect(description).toMatch(/art|urbain|contemporain/);
      } else if (theme.includes('nature')) {
        expect(description).toMatch(/nature|botanique|jardin/);
      }
    });
  });

  it('devrait être prêt pour la production', () => {
    const balades = baladesData.baladesProgrammees;
    
    // Vérifier qu'il n'y a pas de données de test
    balades.forEach((balade) => {
      expect(balade.theme).not.toMatch(/test|example|placeholder/);
      expect(balade.description).not.toMatch(/test|example|placeholder/);
      expect(balade.lieu).not.toMatch(/test|example|placeholder/);
    });
    
    // Vérifier que toutes les données sont complètes
    balades.forEach((balade) => {
      expect(balade.theme.length).toBeGreaterThan(5);
      expect(balade.description.length).toBeGreaterThan(20);
      expect(balade.lieu.length).toBeGreaterThan(5);
    });
  });
});
