import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Page from './+page.svelte';
import baladesData from '$lib/balades-argentique.json';

// Mock de $app/stores
vi.mock('$app/stores', () => ({
  page: {
    subscribe: (fn: any) => {
      fn({
        url: {
          searchParams: {
            get: (param: string) => {
              if (param === 'id') return '1';
              if (param === 'data') return null;
              return null;
            }
          }
        }
      });
      return { unsubscribe: () => {} };
    }
  }
}));

// Mock de window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: vi.fn(),
    replace: vi.fn()
  },
  writable: true
});

// Mock de window.open
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true
});

describe('/photographie/argentique/reservation', () => {
  it('affiche le titre de la page avec le thème de la balade', async () => {
    render(Page);
    
    // Attendre que la balade soit chargée
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByRole('heading', { name: /Réservation - Architecture médiévale/ })).toBeInTheDocument();
  });

  it('affiche les détails de la balade', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Vérifier les informations de la balade
    expect(screen.getByText('Architecture médiévale')).toBeInTheDocument();
    expect(screen.getByText('📍 Quartier du Bouffay')).toBeInTheDocument();
    expect(screen.getByText('🕐 14:00')).toBeInTheDocument();
    expect(screen.getByText('💰 45€')).toBeInTheDocument();
    expect(screen.getByText(/Découverte des façades historiques/)).toBeInTheDocument();
    
    // Vérifier que le statut "Complet" est affiché car cette balade a 0 places disponibles
    expect(screen.getByText('Complet')).toBeInTheDocument();
  });

  it('affiche les consignes de sécurité', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('📋 Consignes et Matériel')).toBeInTheDocument();
    expect(screen.getByText('📸 Consignes de sécurité')).toBeInTheDocument();
    
    // Vérifier qu'au moins une consigne est affichée
    const consignes = baladesData.baladesProgrammees[0].consignes;
    expect(screen.getByText(consignes[0])).toBeInTheDocument();
  });

  it('affiche le matériel fourni', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('🎒 Matériel fourni')).toBeInTheDocument();
    
    // Vérifier qu'au moins un élément de matériel est affiché
    const materiel = baladesData.baladesProgrammees[0].materiel;
    expect(screen.getByText(materiel[0])).toBeInTheDocument();
  });

  it('affiche le plan et parcours', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('🗺️ Plan et Parcours')).toBeInTheDocument();
    expect(screen.getByText('🗺️ Parcours de la balade')).toBeInTheDocument();
    
    // Vérifier qu'au moins une étape du parcours est affichée
    const parcours = baladesData.baladesProgrammees[0].parcours;
    expect(screen.getByText(new RegExp(parcours[0].titre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
  });

  it('affiche le formulaire de réservation', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('Réserver votre place')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone')).toBeInTheDocument();
    expect(screen.getByLabelText('Date souhaitée *')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre de personnes *')).toBeInTheDocument();
  });

  it('pré-remplit le formulaire avec les données de la balade', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Vérifier que la date est pré-remplie
    const dateInput = screen.getByLabelText('Date souhaitée *') as HTMLInputElement;
    expect(dateInput.value).toBe('2024-02-15');
    
    // Vérifier que le message est pré-rempli
    const messageTextarea = screen.getByLabelText('Message (préférences, questions...)') as HTMLTextAreaElement;
    expect(messageTextarea.value).toContain('Architecture médiévale');
    expect(messageTextarea.value).toContain('Quartier du Bouffay');
    
    // Vérifier que le nombre de personnes est adapté aux places disponibles (0 dans ce cas)
    const nombrePersonnesSelect = screen.getByLabelText('Nombre de personnes *') as HTMLSelectElement;
    // Comme il n'y a pas de places disponibles, le select ne devrait pas avoir d'options valides
    const options = Array.from(nombrePersonnesSelect.options);
    expect(options.length).toBe(0);
  });

  it('affiche le bouton de retour', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByRole('button', { name: /← Retour aux balades/ })).toBeInTheDocument();
  });

  it('affiche le bouton pour ouvrir Google Maps', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByRole('button', { name: /🗺️ Ouvrir le parcours sur Google Maps/ })).toBeInTheDocument();
  });

  it('affiche le résumé du parcours', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('📊 Résumé du parcours')).toBeInTheDocument();
    expect(screen.getByText('Durée totale :')).toBeInTheDocument();
    expect(screen.getByText('Distance :')).toBeInTheDocument();
    expect(screen.getByText('Points photo :')).toBeInTheDocument();
    expect(screen.getByText('Type :')).toBeInTheDocument();
  });
});
