import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Page from './+page.svelte';

describe('/photographie/portfolioPhoto', () => {
  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/portfolio photo/i);
  });

  it('affiche les séries photographiques', () => {
    render(Page);
    
    // Vérifier que les séries sont présentes
    expect(screen.getByText('Street')).toBeInTheDocument();
    expect(screen.getByText('Portraits')).toBeInTheDocument();
    expect(screen.getByText('Paysages')).toBeInTheDocument();
    expect(screen.getByText('Quotidien')).toBeInTheDocument();
  });

  it('ouvre le modal quand on clique sur une série', async () => {
    render(Page);
    
    // Cliquer sur la série Street
    const streetCard = screen.getByText('Street').closest('.series-card');
    await fireEvent.click(streetCard);
    
    // Vérifier que le modal s'ouvre en cherchant des éléments spécifiques au modal
    expect(screen.getByRole('button', { name: /‹/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /›/ })).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 4/)).toBeInTheDocument();
  });

  it('affiche les boutons de navigation du carrousel', async () => {
    render(Page);
    
    // Ouvrir le modal
    const streetCard = screen.getByText('Street').closest('.series-card');
    await fireEvent.click(streetCard);
    
    // Vérifier que les boutons de navigation sont présents
    expect(screen.getByRole('button', { name: /‹/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /›/ })).toBeInTheDocument();
  });

  it('affiche le compteur d\'images', async () => {
    render(Page);
    
    // Ouvrir le modal
    const streetCard = screen.getByText('Street').closest('.series-card');
    await fireEvent.click(streetCard);
    
    // Vérifier que le compteur est présent
    expect(screen.getByText(/1 \/ 4/)).toBeInTheDocument();
  });
});
