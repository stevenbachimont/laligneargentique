import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

// Mock de fetch pour simuler l'API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock de window.location
Object.defineProperty(window, 'location', {
  value: {
    search: '?id=1&data=' + encodeURIComponent(JSON.stringify({
      id: 1,
      theme: 'Architecture médiévale',
      date: '2024-02-15',
      heure: '14:00',
      lieu: 'Quartier du Bouffay'
    }))
  },
  writable: true
});

describe('Page Réservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher le formulaire de réservation', async () => {
    // Mock de la réponse de l'API
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ 
        success: true, 
        balades: [{
          id: 1,
          theme: 'Architecture médiévale',
          date: '2024-02-15',
          heure: '14:00',
          lieu: 'Quartier du Bouffay',
          placesDisponibles: 3,
          description: 'Test description'
        }]
      })
    });

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));

    // Vérifier que le formulaire s'affiche
    expect(screen.getByText('Réservation - Architecture médiévale')).toBeInTheDocument();
    expect(screen.getByText('Architecture médiévale')).toBeInTheDocument();
  });

  it('devrait gérer la soumission du formulaire', async () => {
    // Mock de la réponse de l'API pour charger les balades
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ 
        success: true, 
        balades: [{
          id: 1,
          theme: 'Architecture médiévale',
          date: '2024-02-15',
          heure: '14:00',
          lieu: 'Quartier du Bouffay',
          placesDisponibles: 3,
          description: 'Test description'
        }]
      })
    });

    // Mock de la réponse pour la soumission
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: true, message: 'Réservation créée avec succès' })
    });

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));

    // Vérifier que le bouton de soumission est présent
    expect(screen.getByText('Confirmer ma réservation')).toBeInTheDocument();
  });
});
