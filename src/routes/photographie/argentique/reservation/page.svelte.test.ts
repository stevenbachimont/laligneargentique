import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Page from './+page.svelte';

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
    
    // Vérifier que le statut des places est affiché (sans dépendre du nombre exact)
    const placesElement = screen.getByText(/places disponibles|Complet/);
    expect(placesElement).toBeInTheDocument();
  });

  it('affiche les consignes de sécurité', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('📋 Consignes et Matériel')).toBeInTheDocument();
    expect(screen.getByText('📸 Consignes de sécurité')).toBeInTheDocument();
    
    // Vérifier qu'au moins une consigne est affichée
    const consignesElements = screen.getAllByText(/Apportez des vêtements|Chaussures de marche|Appareil photo fourni/);
    expect(consignesElements.length).toBeGreaterThan(0);
  });

  it('affiche le matériel fourni', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('🎒 Matériel fourni')).toBeInTheDocument();
    
    // Vérifier qu'au moins un élément de matériel est affiché
    const materielElements = screen.getAllByText(/Appareil photo argentique|Pellicule|Guide technique|Support pour développement/);
    expect(materielElements.length).toBeGreaterThan(0);
  });

  it('affiche le plan et parcours', async () => {
    render(Page);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('🗺️ Plan et Parcours')).toBeInTheDocument();
    expect(screen.getByText('🗺️ Parcours de la balade')).toBeInTheDocument();
    
    // Vérifier qu'au moins une étape du parcours est affichée
    const parcoursElements = screen.getAllByText(/Place du Bouffay|Rue Kervégan|Place Saint-Pierre|Rue de la Fosse|Quai de la Fosse/);
    expect(parcoursElements.length).toBeGreaterThan(0);
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
    expect(dateInput.value).toBeTruthy();
    expect(dateInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Format de date YYYY-MM-DD
    
    // Vérifier que le message est pré-rempli
    const messageTextarea = screen.getByLabelText('Message (préférences, questions...)') as HTMLTextAreaElement;
    expect(messageTextarea.value).toContain('Architecture médiévale');
    expect(messageTextarea.value).toContain('Quartier du Bouffay');
    
    // Vérifier que le nombre de personnes est configuré
    const nombrePersonnesSelect = screen.getByLabelText('Nombre de personnes *') as HTMLSelectElement;
    // Vérifier seulement qu'il y a des options disponibles
    expect(nombrePersonnesSelect.options.length).toBeGreaterThan(0);
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
