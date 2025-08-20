import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Page from './+page.svelte';
import baladesData from '$lib/balades-argentique.json';

// Mock de window.open
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true
});

describe('/photographie/argentique', () => {
  it('affiche le titre principal', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByRole('heading', { name: 'La ligne Argentique' })).toBeInTheDocument();
  });

  it('affiche le sous-titre', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText(/Découvrez Nantes à travers l'objectif d'un appareil photo argentique ancien/)).toBeInTheDocument();
  });

  it('affiche la section présentation', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByRole('heading', { name: 'Une expérience photographique unique' })).toBeInTheDocument();
    expect(screen.getByText(/Je vous propose des balades photographiques guidées/)).toBeInTheDocument();
  });

  it('affiche les fonctionnalités', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('Appareils fournis')).toBeInTheDocument();
    expect(screen.getByText('Techniques enseignées')).toBeInTheDocument();
    expect(screen.getByText('Lieux insolites')).toBeInTheDocument();
    expect(screen.getByText('Groupe limité')).toBeInTheDocument();
  });

  it('affiche toutes les balades programmées', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Vérifier que toutes les balades du JSON sont affichées
    baladesData.baladesProgrammees.forEach(balade => {
      expect(screen.getByText(balade.theme)).toBeInTheDocument();
      expect(screen.getByText(`📍 ${balade.lieu}`)).toBeInTheDocument();
      expect(screen.getAllByText(balade.prix).length).toBeGreaterThan(0);
      expect(screen.getByText(balade.description)).toBeInTheDocument();
    });
  });

  it('affiche les dates et heures des balades', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Vérifier que les heures sont affichées (avec l'emoji 🕐)
    expect(screen.getByText('🕐 14:00')).toBeInTheDocument();
    expect(screen.getByText('🕐 10:00')).toBeInTheDocument();
    expect(screen.getByText('🕐 16:00')).toBeInTheDocument();
  });

    it('affiche le nombre de places disponibles ou "Complet"', async () => {
    render(Page);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier que les places disponibles sont affichées
    // La première balade devrait afficher "Complet" car elle a 0 places disponibles
    expect(screen.getAllByText('Complet').length).toBeGreaterThan(0);
    expect(screen.getByText('2 places disponibles')).toBeInTheDocument();
    expect(screen.getByText('4 places disponibles')).toBeInTheDocument();
  });

    it('affiche les boutons de réservation avec le bon état', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier qu'il y a des boutons de réservation
    const reserveButtons = screen.getAllByRole('button', { name: /Réserver|Complet/ });
    expect(reserveButtons.length).toBeGreaterThan(0);
    
    // Vérifier que le bouton "Complet" est présent et désactivé
    const completButton = screen.getByRole('button', { name: 'Complet' });
    expect(completButton).toBeInTheDocument();
    expect(completButton).toBeDisabled();
    
    // Vérifier que les autres boutons "Réserver" sont activés
    const activeButtons = screen.getAllByRole('button', { name: 'Réserver' });
    activeButtons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
    
    // Vérifier les messages de statut
    expect(screen.getByText('Places épuisées')).toBeInTheDocument();
    expect(screen.getAllByText('Inscriptions ouvertes').length).toBeGreaterThan(0);
  });

  it('affiche les icônes des fonctionnalités', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('📷')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
    expect(screen.getByText('🏛️')).toBeInTheDocument();
    expect(screen.getByText('👥')).toBeInTheDocument();
  });

  it('affiche les descriptions des fonctionnalités', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText(/Appareils photo argentiques restaurés/)).toBeInTheDocument();
    expect(screen.getByText(/Composition, exposition, développement/)).toBeInTheDocument();
    expect(screen.getByText(/Découverte des quartiers historiques/)).toBeInTheDocument();
    expect(screen.getByText(/Maximum 5 participants par balade pour un accompagnement personnalisé/)).toBeInTheDocument();
  });
});
