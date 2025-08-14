import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/web/outils', () => {
  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/outils web/i);
  });

  it('affiche les catégories d\'outils', () => {
    render(Page);
    
    // Vérifier que les catégories sont présentes
    expect(screen.getByText('📷 Photographie')).toBeInTheDocument();
    expect(screen.getByText('🎵 Musique')).toBeInTheDocument();
    expect(screen.getByText('🛠️ Autres')).toBeInTheDocument();
  });

  it('affiche les outils de photographie', () => {
    render(Page);
    
    // Vérifier que les outils de photographie sont présents
    expect(screen.getByText('Générateur de métadonnées photo')).toBeInTheDocument();
    expect(screen.getByText('Calculateur de développement')).toBeInTheDocument();
    expect(screen.getByText('Gestionnaire de pellicules')).toBeInTheDocument();
  });

  it('affiche les outils de musique', () => {
    render(Page);
    
    // Vérifier que les outils de musique sont présents
    expect(screen.getByText('Séquenceur musical')).toBeInTheDocument();
    expect(screen.getByText('Convertisseur de formats audio')).toBeInTheDocument();
    expect(screen.getByText('Générateur de partitions')).toBeInTheDocument();
  });

  it('affiche les autres outils', () => {
    render(Page);
    
    // Vérifier que les autres outils sont présents
    expect(screen.getByText('Gestionnaire de tâches')).toBeInTheDocument();
    expect(screen.getByText('Convertisseur de devises')).toBeInTheDocument();
  });

  it('affiche les liens vers les outils', () => {
    render(Page);
    
    // Vérifier que les liens sont présents
    const links = screen.getAllByRole('link', { name: /visiter l'outil/i });
    expect(links.length).toBeGreaterThan(0);
    
    // Vérifier que les liens ont des URLs
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).toMatch(/^https?:\/\//);
    });
  });

  it('affiche les statuts des outils', () => {
    render(Page);
    
    // Vérifier que les statuts sont présents en utilisant getAllByText pour éviter les conflits
    const actifElements = screen.getAllByText('Actif');
    const enDeveloppementElements = screen.getAllByText('En développement');
    const archiveElements = screen.getAllByText('Archivé');
    
    expect(actifElements.length).toBeGreaterThan(0);
    expect(enDeveloppementElements.length).toBeGreaterThan(0);
    expect(archiveElements.length).toBeGreaterThan(0);
  });
});
