import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
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

  it('devrait afficher les détails de la balade', async () => {
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

    // Vérifier que les détails de la balade s'affichent
    expect(screen.getByText('Réservation - Architecture médiévale')).toBeInTheDocument();
    expect(screen.getAllByText('Architecture médiévale')).toHaveLength(2); // Titre et dans le résumé
    expect(screen.getByText('📍 Quartier du Bouffay')).toBeInTheDocument();
    expect(screen.getByText('🕐 14:00')).toBeInTheDocument();
    expect(screen.getByText('3 places disponibles')).toBeInTheDocument();
  });

  it('devrait afficher le résumé de réservation', async () => {
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

    // Vérifier que le résumé de réservation s'affiche
    expect(screen.getByText('📋 Récapitulatif de votre réservation')).toBeInTheDocument();
    expect(screen.getByText('Réserver votre place')).toBeInTheDocument();
    expect(screen.getByText('Cliquez sur le bouton ci-dessous pour procéder à la réservation et au paiement')).toBeInTheDocument();
  });

  it('devrait afficher le bouton de réservation et paiement', async () => {
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

    // Vérifier que le bouton de réservation est présent
    const reserverButton = screen.getByText('🎯 Réserver et Payer');
    expect(reserverButton).toBeInTheDocument();
    expect(reserverButton.closest('button')).toBeInTheDocument();
  });

  it('devrait rediriger vers la page de paiement lors du clic sur le bouton', async () => {
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

    // Mock de window.location.href
    const originalHref = window.location.href;
    Object.defineProperty(window, 'location', {
      value: {
        href: originalHref,
        pathname: '/photographie/argentique/reservation'
      },
      writable: true
    });

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));

    // Cliquer sur le bouton de réservation
    const reserverButton = screen.getByText('🎯 Réserver et Payer');
    fireEvent.click(reserverButton);

    // Vérifier que la redirection se fait vers la page de paiement
    expect(window.location.href).toContain('/photographie/argentique/reservation/paiement');
  });

  it('devrait afficher les consignes et le matériel', async () => {
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

    // Vérifier que les sections consignes et matériel s'affichent
    expect(screen.getByText('📋 Consignes et Matériel')).toBeInTheDocument();
    expect(screen.getByText('📸 Consignes de sécurité')).toBeInTheDocument();
    expect(screen.getByText('🎒 Matériel fourni')).toBeInTheDocument();
  });

  it('devrait afficher le bouton de retour', async () => {
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

    // Vérifier que le bouton de retour est présent
    const retourButton = screen.getByText('← Retour aux balades');
    expect(retourButton).toBeInTheDocument();
    expect(retourButton.closest('button')).toBeInTheDocument();
  });

  it('devrait gérer les erreurs de chargement des données', async () => {
    // Mock d'une réponse d'erreur de l'API
    mockFetch.mockRejectedValueOnce(new Error('Erreur réseau'));

    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));

    // Vérifier qu'un message d'erreur s'affiche
    expect(screen.getByText('Balade non trouvée')).toBeInTheDocument();
    expect(screen.getByText('La balade demandée n\'existe pas ou n\'est plus disponible.')).toBeInTheDocument();
  });
});
