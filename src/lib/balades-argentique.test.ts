import { describe, it, expect } from 'vitest';
import baladesData from './balades-argentique.json';

describe('balades-argentique.json', () => {
  it('devrait avoir la structure correcte', () => {
    expect(baladesData).toHaveProperty('baladesProgrammees');
    expect(Array.isArray(baladesData.baladesProgrammees)).toBe(true);
  });

  it('devrait contenir au moins une balade', () => {
    expect(baladesData.baladesProgrammees.length).toBeGreaterThan(0);
  });

  it('devrait avoir les bonnes balades avec leurs propriétés', () => {
    const balades = baladesData.baladesProgrammees;
    
    // Vérifier la première balade (Architecture médiévale)
    expect(balades[0]).toMatchObject({
      id: 1,
      theme: 'Architecture médiévale',
      lieu: 'Quartier du Bouffay',
      prix: '45€'
    });

    // Vérifier la deuxième balade (Street Art & Contemporain)
    expect(balades[1]).toMatchObject({
      id: 2,
      theme: 'Street Art & Contemporain',
      lieu: 'Île de Nantes',
      prix: '45€'
    });

    // Vérifier la troisième balade (Nature en ville)
    expect(balades[2]).toMatchObject({
      id: 3,
      theme: 'Nature en ville',
      lieu: 'Jardin des Plantes',
      prix: '45€'
    });
  });

  it('devrait avoir toutes les propriétés requises pour chaque balade', () => {
    const balades = baladesData.baladesProgrammees;
    
    balades.forEach((balade, index) => {
      expect(balade).toHaveProperty('id');
      expect(balade).toHaveProperty('date');
      expect(balade).toHaveProperty('heure');
      expect(balade).toHaveProperty('lieu');
      expect(balade).toHaveProperty('theme');
      expect(balade).toHaveProperty('placesDisponibles');
      expect(balade).toHaveProperty('placesInitiales');
      expect(balade).toHaveProperty('prix');
      expect(balade).toHaveProperty('description');
      expect(balade).toHaveProperty('consignes');
      expect(balade).toHaveProperty('materiel');
      expect(balade).toHaveProperty('coordonnees');
      expect(balade).toHaveProperty('parcours');

      // Vérifier que les propriétés sont du bon type
      expect(typeof balade.id).toBe('number');
      expect(typeof balade.theme).toBe('string');
      expect(typeof balade.lieu).toBe('string');
      expect(typeof balade.prix).toBe('string');
      expect(typeof balade.placesInitiales).toBe('number');
      expect(Array.isArray(balade.consignes)).toBe(true);
      expect(Array.isArray(balade.materiel)).toBe(true);
      expect(Array.isArray(balade.coordonnees)).toBe(true);
      expect(Array.isArray(balade.parcours)).toBe(true);
    });
  });

  it('devrait avoir des consignes et du matériel pour chaque balade', () => {
    const balades = baladesData.baladesProgrammees;
    
    balades.forEach((balade, index) => {
      expect(balade.consignes.length).toBeGreaterThan(0);
      expect(balade.materiel.length).toBeGreaterThan(0);
    });
  });

  it('devrait avoir des coordonnées GPS valides', () => {
    const balades = baladesData.baladesProgrammees;
    
    balades.forEach((balade, index) => {
      balade.coordonnees.forEach((coord: any) => {
        expect(coord).toHaveProperty('lat');
        expect(coord).toHaveProperty('lng');
        expect(coord).toHaveProperty('name');
        expect(typeof coord.lat).toBe('number');
        expect(typeof coord.lng).toBe('number');
        expect(typeof coord.name).toBe('string');
      });
    });
  });

  it('devrait avoir un parcours détaillé pour chaque balade', () => {
    const balades = baladesData.baladesProgrammees;
    
    balades.forEach((balade, index) => {
      expect(balade.parcours.length).toBeGreaterThan(0);
      
      balade.parcours.forEach((etape: any) => {
        expect(etape).toHaveProperty('titre');
        expect(etape).toHaveProperty('description');
        expect(etape).toHaveProperty('duree');
        expect(etape).toHaveProperty('distance');
        expect(typeof etape.titre).toBe('string');
        expect(typeof etape.description).toBe('string');
        expect(typeof etape.duree).toBe('string');
        expect(typeof etape.distance).toBe('string');
      });
    });
  });

  it('devrait avoir des IDs uniques', () => {
    const balades = baladesData.baladesProgrammees;
    const ids = balades.map(balade => balade.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('devrait avoir des thèmes uniques', () => {
    const balades = baladesData.baladesProgrammees;
    const themes = balades.map(balade => balade.theme);
    const uniqueThemes = new Set(themes);
    expect(uniqueThemes.size).toBe(themes.length);
  });
});
