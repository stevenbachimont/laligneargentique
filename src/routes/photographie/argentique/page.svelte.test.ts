import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Page from './+page.svelte';

// Les mocks sont maintenant dans vitest-setup-client.ts
// Pas besoin de mocks supplémentaires ici

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
    
    // Attendre que les données soient chargées via l'API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Vérifier qu'il y a des balades affichées
    const baladeCards = screen.getAllByText(/Architecture médiévale|Street Art|Nature en ville/);
    expect(baladeCards.length).toBeGreaterThan(0);
    
    // Vérifier que les éléments de base sont présents
    const lieuElements = screen.getAllByText(/📍/);
    const heureElements = screen.getAllByText(/🕐/);
    const prixElements = screen.getAllByText(/💰/);
    
    expect(lieuElements.length).toBeGreaterThan(0); // Emoji de lieu
    expect(heureElements.length).toBeGreaterThan(0); // Emoji d'heure
    expect(prixElements.length).toBeGreaterThan(0); // Emoji de prix
  });

  it('affiche les dates et heures des balades', async () => {
    render(Page);
    
    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Vérifier que les heures sont affichées (avec l'emoji 🕐)
    const heureElements = screen.getAllByText(/🕐/);
    expect(heureElements.length).toBeGreaterThan(0);
    
    // Vérifier qu'il y a au moins une heure affichée
    const heures = heureElements.map(el => el.textContent);
    expect(heures.some(text => text && /\d{1,2}:\d{2}/.test(text))).toBe(true);
  });

  it('affiche le nombre de places disponibles', async () => {
    render(Page);

    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));

    // Vérifier que les places disponibles sont affichées
    // Utiliser une regex pour capturer n'importe quel nombre de places
    const placesElements = screen.getAllByText(/places disponibles/);
    expect(placesElements.length).toBeGreaterThan(0);
    
    // Vérifier qu'il y a au moins une balade avec des places disponibles
    const placesText = placesElements.map(el => el.textContent);
    expect(placesText.some(text => text && text.includes('places disponibles'))).toBe(true);
  });

  it('affiche les boutons de réservation avec le bon état', async () => {
    render(Page);
    
    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));

    // Vérifier qu'il y a des boutons de réservation
    const reserveButtons = screen.getAllByRole('button', { name: 'Réserver' });
    expect(reserveButtons.length).toBeGreaterThan(0);
    
    // Vérifier que tous les boutons "Réserver" sont activés
    reserveButtons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
    
    // Vérifier les messages de statut
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

  it('permet d\'actualiser les balades', async () => {
    render(Page);
    
    // Attendre que les données soient chargées
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Vérifier que le bouton d'actualisation est présent
    const refreshButton = screen.getByRole('button', { name: /🔄 Actualiser/ });
    expect(refreshButton).toBeInTheDocument();
    
    // Le bouton devrait être cliquable
    expect(refreshButton).not.toBeDisabled();
  });
});
