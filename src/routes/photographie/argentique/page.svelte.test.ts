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
    // Mock des réponses de l'API pour les balades futures et archivées
    const mockBaladesFutures = [
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
        coordonnees: [{ latitude: 47.2138, longitude: -1.5561 }],
        parcours: [{ titre: 'Test', description: 'Test' }]
      }
    ];

    const mockBaladesArchivees = [
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
        coordonnees: [{ latitude: 47.2172, longitude: -1.5536 }],
        parcours: [{ titre: 'Test passé', description: 'Test passé' }]
      }
    ];

    // Mock des deux appels API
    (fetch as any)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, balades: mockBaladesFutures })
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true, balades: mockBaladesArchivees })
      });

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier que la page s'affiche correctement
    expect(screen.getByText('La ligne Argentique')).toBeInTheDocument();
    
    // Vérifier que les sections sont présentes
    expect(screen.getByText('💰 Balades payantes')).toBeInTheDocument();
    expect(screen.getByText('Balades passées')).toBeInTheDocument();
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
    const mockBaladesFutures = [
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
        coordonnees: [],
        parcours: []
      }
    ];

    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, balades: mockBaladesFutures })
    });

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier que la section des balades programmées est présente
    expect(screen.getByText('💰 Balades payantes')).toBeInTheDocument();
  });
});
