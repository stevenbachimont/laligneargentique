import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/web/outils', () => {
  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Outils web' })).toBeInTheDocument();
  });

  it('affiche la description de la page', () => {
    render(Page);
    expect(screen.getByText(/Applications web utiles que j'ai développées, classées par thématique/)).toBeInTheDocument();
  });

  it('affiche les catégories d\'outils', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: '📷 Photographie' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '🎵 Musique' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '🛠️ Autres' })).toBeInTheDocument();
  });

  it('affiche les outils de photographie', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Générateur de métadonnées photo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Calculateur de développement' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gestionnaire de pellicules' })).toBeInTheDocument();
  });

  it('affiche les outils de musique', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Séquenceur musical' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Convertisseur de formats audio' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Générateur de partitions' })).toBeInTheDocument();
  });

  it('affiche les autres outils', () => {
    render(Page);
    expect(screen.getByRole('heading', { name: 'Gestionnaire de tâches' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Convertisseur de devises' })).toBeInTheDocument();
  });

  it('affiche les statuts des outils', () => {
    render(Page);
    const actifStatuses = screen.getAllByText('Actif');
    const enDevStatuses = screen.getAllByText('En développement');
    const archiveStatuses = screen.getAllByText('Archivé');
    
    expect(actifStatuses.length).toBeGreaterThan(0);
    expect(enDevStatuses.length).toBeGreaterThan(0);
    expect(archiveStatuses.length).toBeGreaterThan(0);
  });

  it('rend les cartes d\'outils cliquables', () => {
    render(Page);
    const toolCards = screen.getAllByRole('button');
    
    expect(toolCards.length).toBeGreaterThan(0);
    toolCards.forEach(card => {
      expect(card).toHaveAttribute('tabindex', '0');
    });
  });

  it('affiche les appels à l\'action sur les cartes', () => {
    render(Page);
    const ctaTexts = screen.getAllByText('Cliquez pour visiter l\'outil');
    expect(ctaTexts.length).toBeGreaterThan(0);
  });
});
