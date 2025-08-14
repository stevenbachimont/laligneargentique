import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/web', () => {
  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/développement web/i);
  });

  it('affiche les deux blocs principaux', () => {
    render(Page);
    // Vérifier que les deux blocs principaux sont présents
    const headings = screen.getAllByRole('heading', { level: 2 });
    const titles = headings.map(h => h.textContent);
    
    expect(titles).toContain('Portfolio Web');
    expect(titles).toContain('Outils Web');
  });

  it('affiche les liens vers les pages dédiées', () => {
    render(Page);
    
    // Vérifier le lien vers le portfolio web
    const portfolioLink = screen.getByRole('link', { name: /voir le portfolio complet/i });
    expect(portfolioLink).toHaveAttribute('href', '/web/portfolioWeb');
    
    // Vérifier le lien vers les outils
    const toolsLink = screen.getByRole('link', { name: /voir tous les outils/i });
    expect(toolsLink).toHaveAttribute('href', '/web/outils');
  });

  it('affiche les fonctionnalités du portfolio', () => {
    render(Page);
    
    // Vérifier que les fonctionnalités du portfolio sont mentionnées
    expect(screen.getByText(/projets chronologiques/i)).toBeInTheDocument();
    expect(screen.getByText(/technologies utilisées/i)).toBeInTheDocument();
    expect(screen.getByText(/statuts de progression/i)).toBeInTheDocument();
  });

  it('affiche les catégories d\'outils', () => {
    render(Page);
    
    // Vérifier que les catégories d'outils sont mentionnées dans les descriptions
    expect(screen.getByText(/outils pour l'argentique/i)).toBeInTheDocument();
    expect(screen.getByText(/création et édition/i)).toBeInTheDocument();
    expect(screen.getByText(/productivité et utilitaires/i)).toBeInTheDocument();
  });
}); 