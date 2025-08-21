import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Page from './+page.svelte';

// Mock fetch globalement
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('/photographie', () => {
  beforeEach(() => {
    // Mock de la réponse de l'API pour les balades
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        balades: [
          {
            id: 1,
            theme: 'Architecture médiévale',
            date: '2024-03-15',
            heure: '14:00',
            lieu: 'Quartier du Bouffay',
            placesDisponibles: 3,
            prix: '45€',
            description: 'Découverte des façades historiques'
          },
          {
            id: 2,
            theme: 'Street Art & Contemporain',
            date: '2024-03-22',
            heure: '10:00',
            lieu: 'Île de Nantes',
            placesDisponibles: 2,
            prix: '45€',
            description: 'Capture des œuvres d\'art urbain'
          }
        ]
      })
    });
  });
  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Photographie' })).toBeInTheDocument();
  });

  it('affiche la description de la page', () => {
    render(Page);
    expect(screen.getByText(/Découvrez mes séries photographiques et mes balades argentiques guidées/)).toBeInTheDocument();
  });

  it('affiche les deux blocs principaux', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Portfolio Photo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'La ligne Argentique' })).toBeInTheDocument();
  });

  it('affiche les descriptions des blocs', () => {
    render(Page);
    expect(screen.getByText(/Découvrez mes séries photographiques : Street, Portraits, Paysages et Quotidien/)).toBeInTheDocument();
    expect(screen.getByText(/Découvrez Nantes à travers l'objectif d'un appareil photo argentique/)).toBeInTheDocument();
  });

  it('affiche les aperçus des blocs', () => {
    render(Page);
    // Vérifier les icônes et textes séparément
    expect(screen.getByText('📸')).toBeInTheDocument();
    expect(screen.getByText('Séries Street, Portraits, Paysages')).toBeInTheDocument();
    expect(screen.getByText('🎨')).toBeInTheDocument();
    expect(screen.getByText('Histoires visuelles')).toBeInTheDocument();
  });

  it('affiche les balades programmées', async () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Prochaines balades' })).toBeInTheDocument();
    
    // Attendre que les balades soient chargées
    await screen.findByText('Architecture médiévale');
    expect(screen.getByText('Street Art & Contemporain')).toBeInTheDocument();
    // Note: La troisième balade n'est pas affichée dans l'aperçu de la page principale
  });

  it('affiche les appels à l\'action', () => {
    render(Page);
    expect(screen.getByText('Voir le portfolio')).toBeInTheDocument();
    expect(screen.getByText('Renseignements et réservations ici')).toBeInTheDocument();
  });

  it('rend les blocs cliquables', () => {
    render(Page);
    const portfolioBlock = screen.getByRole('button', { name: /Portfolio Photo/ });
    const argentiqueBlock = screen.getByRole('button', { name: /La ligne Argentique/ });
    
    expect(portfolioBlock).toBeInTheDocument();
    expect(argentiqueBlock).toBeInTheDocument();
    expect(portfolioBlock).toHaveAttribute('tabindex', '0');
    expect(argentiqueBlock).toHaveAttribute('tabindex', '0');
  });
}); 