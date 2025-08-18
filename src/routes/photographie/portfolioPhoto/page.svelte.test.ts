import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/photographie/portfolioPhoto', () => {
  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Portfolio Photo' })).toBeInTheDocument();
  });

  it('affiche les séries photographiques', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Street' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Portraits' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Paysages' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quotidien' })).toBeInTheDocument();
  });

  it('affiche les descriptions des séries', () => {
    render(Page);
    expect(screen.getByText('Captures de moments urbains')).toBeInTheDocument();
    expect(screen.getByText('Portraits en noir et blanc')).toBeInTheDocument();
    expect(screen.getByText('Vues panoramiques')).toBeInTheDocument();
    expect(screen.getByText('Vues quotidiennes')).toBeInTheDocument();
  });

  it('affiche les vignettes des séries', () => {
    render(Page);
    const thumbnails = screen.getAllByAltText(/Aperçu Street|Aperçu Portraits|Aperçu Paysages|Aperçu Quotidien/);
    expect(thumbnails.length).toBeGreaterThan(0);
  });

  it('rend les cartes de séries cliquables', () => {
    render(Page);
    const seriesCards = screen.getAllByRole('button');
    
    expect(seriesCards.length).toBeGreaterThan(0);
    seriesCards.forEach(card => {
      expect(card).toHaveAttribute('tabindex', '0');
    });
  });
});
