import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/photographie', () => {
  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/photographie/i);
  });

  it('affiche les catégories', () => {
    render(Page);
    // Utiliser getAllByRole pour les titres h2 et vérifier leur contenu
    const headings = screen.getAllByRole('heading', { level: 2 });
    const titles = headings.map(h => h.textContent);
    
    expect(titles).toContain('Street');
    expect(titles).toContain('Portraits');
    expect(titles).toContain('Paysages');
    expect(titles).toContain('Quotidien');
  });
}); 