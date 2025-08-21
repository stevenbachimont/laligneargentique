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
    // Mock de la réponse de l'API
    const mockBalades = [
      {
        id: 1,
        date: '2024-02-15',
        heure: '14:00',
        lieu: 'Quartier du Bouffay',
        theme: 'Architecture médiévale',
        placesDisponibles: 3,
        prix: '45€',
        description: 'Test description',
        consignes: ['Test consigne'],
        materiel: ['Test materiel'],
        coordonnees: [{ lat: 47.2138, lng: -1.5561, name: 'Test' }],
        parcours: [{ titre: 'Test', description: 'Test', duree: '30 min', distance: '0 km' }]
      }
    ];

    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, balades: mockBalades })
    });

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier que la page s'affiche correctement
    expect(screen.getByText('La ligne Argentique')).toBeInTheDocument();
    expect(screen.getByText('Architecture médiévale')).toBeInTheDocument();
  });

  it('devrait gérer les erreurs de chargement', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Erreur réseau'));

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier que la page s'affiche même en cas d'erreur
    expect(screen.getByText('La ligne Argentique')).toBeInTheDocument();
  });
});
