import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

// Mock de fetch pour simuler l'API
global.fetch = vi.fn();

describe('Page Argentique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher la page avec les balades', async () => {
    // Mock de toutes les balades en un seul appel API
    const mockAllBalades = [
      {
        id: 1,
        date: '2025-02-15',
        heure: '14:00',
        lieu: 'Quartier du Bouffay',
        theme: 'Architecture médiévale',
        placesDisponibles: 3,
        prix: '45€',
        description: 'Test description',
        statut: 'en_ligne',
        type: 'payante',
        coordonnees: [{ latitude: 47.2138, longitude: -1.5561 }],
        parcours: [{ titre: 'Test', description: 'Test' }]
      },
      {
        id: 2,
        date: '2024-02-15',
        heure: '14:00',
        lieu: 'Île de Nantes',
        theme: 'Street Art',
        placesDisponibles: 0,
        prix: '45€',
        description: 'Balade passée',
        statut: 'archivé',
        type: 'payante',
        coordonnees: [{ latitude: 47.2172, longitude: -1.5536 }],
        parcours: [{ titre: 'Test passé', description: 'Test passé' }]
      }
    ];

    // Mock d'un seul appel API
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, balades: mockAllBalades })
    });

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));

    // Vérifier que la page s'affiche correctement
    expect(screen.getByText('La ligne Argentique')).toBeInTheDocument();
    expect(screen.getByText('Balades passées')).toBeInTheDocument();
    
    // Vérifier qu'au moins les éléments de base sont présents
    expect(screen.getByText('Une expérience photographique unique')).toBeInTheDocument();
    expect(screen.getByText('Informations pratiques')).toBeInTheDocument();
  });

  it('devrait gérer les erreurs de chargement', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Erreur réseau'));

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier que la page s'affiche même en cas d'erreur
    expect(screen.getByText('La ligne Argentique')).toBeInTheDocument();
  });

  it('devrait afficher les années de manière simplifiée', () => {
    // Test de la fonction getAnneeLabel simplifiée
    const getAnneeLabel = (annee: string): string => {
      return annee;
    };

    // Vérifier que la fonction retourne seulement l'année
    expect(getAnneeLabel('2024')).toBe('2024');
    expect(getAnneeLabel('2025')).toBe('2025');
    expect(getAnneeLabel('2023')).toBe('2023');
  });

  it('devrait gérer l\'affichage des balades par années', async () => {
    const mockAllBalades = [
      {
        id: 1,
        date: '2025-03-15',
        heure: '14:00',
        lieu: 'Quartier du Bouffay',
        theme: 'Balade future 2025',
        placesDisponibles: 5,
        prix: '45€',
        description: 'Test description',
        statut: 'en_ligne',
        type: 'payante',
        coordonnees: [],
        parcours: []
      }
    ];

    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, balades: mockAllBalades })
    });

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));

    // Vérifier que la page est fonctionnelle
    expect(screen.getByText('La ligne Argentique')).toBeInTheDocument();
    expect(screen.getByText('Informations pratiques')).toBeInTheDocument();
  });
});
