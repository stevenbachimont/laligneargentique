import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Page from './+page.svelte';

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le titre et les champs du formulaire', () => {
    render(Page);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/contact/i);
    expect(screen.getByLabelText(/^Prénom \*$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nom \*$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email \*$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Message \*$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
  });

  it('permet de saisir et soumettre le formulaire (succès)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(Page);
    
    // Remplir tous les champs avec des données valides
    await fireEvent.input(screen.getByLabelText(/^Prénom \*$/i), { target: { value: 'Jean' } });
    await fireEvent.input(screen.getByLabelText(/^Nom \*$/i), { target: { value: 'Dupont' } });
    await fireEvent.input(screen.getByLabelText(/^Email \*$/i), { target: { value: 'jean.dupont@exemple.com' } });
    await fireEvent.input(screen.getByLabelText(/^Message \*$/i), { target: { value: 'Bonjour ! Je souhaite vous contacter pour un projet.' } });
    
    // Soumettre le formulaire
    await fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));
    
    expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@exemple.com',
        message: 'Bonjour ! Je souhaite vous contacter pour un projet.'
      })
    });
    expect(await screen.findByText(/message envoyé/i)).toBeInTheDocument();
  });

  it('affiche un message d\'erreur si l\'envoi échoue', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erreur lors de l\'envoi du message.' })
    });

    render(Page);
    
    // Remplir tous les champs avec des données valides
    await fireEvent.input(screen.getByLabelText(/^Prénom \*$/i), { target: { value: 'Jean' } });
    await fireEvent.input(screen.getByLabelText(/^Nom \*$/i), { target: { value: 'Dupont' } });
    await fireEvent.input(screen.getByLabelText(/^Email \*$/i), { target: { value: 'jean.dupont@exemple.com' } });
    await fireEvent.input(screen.getByLabelText(/^Message \*$/i), { target: { value: 'Bonjour ! Je souhaite vous contacter pour un projet.' } });
    
    // Soumettre le formulaire
    await fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));
    
    expect(mockFetch).toHaveBeenCalled();
    expect(await screen.findByText(/erreur lors de l'envoi du message\./i)).toBeInTheDocument();
  });
});
