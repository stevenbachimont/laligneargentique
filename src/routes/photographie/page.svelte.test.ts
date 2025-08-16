import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/photographie', () => {
  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/photographie/i);
  });

  it('affiche les deux blocs principaux', () => {
    render(Page);
    // Vérifier que les deux blocs principaux sont présents
    const headings = screen.getAllByRole('heading', { level: 2 });
    const titles = headings.map(h => h.textContent);
    
    expect(titles).toContain('Portfolio Photo');
    expect(titles).toContain('La ligne Argentique');
  });

  it('affiche les liens vers les pages dédiées', () => {
    render(Page);
    
    // Vérifier le lien vers le portfolio photo
    const portfolioLink = screen.getByRole('link', { name: /voir le portfolio complet/i });
    expect(portfolioLink).toHaveAttribute('href', '/photographie/portfolioPhoto');
    
    // Vérifier le lien vers les balades argentiques
    const argentiqueLink = screen.getByRole('link', { name: /voir toutes les balades/i });
    expect(argentiqueLink).toHaveAttribute('href', '/photographie/argentique');
  });
}); 