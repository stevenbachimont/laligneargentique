import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/web', () => {
  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Développement web' })).toBeInTheDocument();
  });

  it('affiche la description de la page', () => {
    render(Page);
    expect(screen.getByText(/Découvrez mes projets de développement web organisés en deux sections/)).toBeInTheDocument();
  });

  it('affiche les deux blocs principaux', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Portfolio Web' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Outils Web' })).toBeInTheDocument();
  });

  it('affiche les descriptions des blocs', () => {
    render(Page);
    expect(screen.getByText(/Mon parcours de développement web à travers une timeline chronologique/)).toBeInTheDocument();
    expect(screen.getByText(/Applications web utiles que j'ai développées, classées par thématique/)).toBeInTheDocument();
  });

  it('affiche les aperçus des blocs', () => {
    render(Page);
    // Vérifier les icônes et textes séparément
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('Projets chronologiques')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('Technologies utilisées')).toBeInTheDocument();
    expect(screen.getByText('📷')).toBeInTheDocument();
    expect(screen.getByText('Photographie')).toBeInTheDocument();
    expect(screen.getByText('🎵')).toBeInTheDocument();
    expect(screen.getByText('Musique')).toBeInTheDocument();
  });

  it('affiche les appels à l\'action', () => {
    render(Page);
    expect(screen.getByText('Cliquez pour voir le portfolio')).toBeInTheDocument();
    expect(screen.getByText('Cliquez pour voir les outils')).toBeInTheDocument();
  });

  it('rend les blocs cliquables', () => {
    render(Page);
    const portfolioBlock = screen.getByRole('button', { name: /Portfolio Web/ });
    const toolsBlock = screen.getByRole('button', { name: /Outils Web/ });
    
    expect(portfolioBlock).toBeInTheDocument();
    expect(toolsBlock).toBeInTheDocument();
    expect(portfolioBlock).toHaveAttribute('tabindex', '0');
    expect(toolsBlock).toHaveAttribute('tabindex', '0');
  });
}); 