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
    
    // Remplir le formulaire avec des données valides
    const prenomInput = screen.getByLabelText(/^Prénom \*$/i);
    const nomInput = screen.getByLabelText(/^Nom \*$/i);
    const emailInput = screen.getByLabelText(/^Email \*$/i);
    const messageInput = screen.getByLabelText(/^Message \*$/i);
    
    await fireEvent.input(prenomInput, { target: { value: 'Jean' } });
    await fireEvent.input(nomInput, { target: { value: 'Dupont' } });
    await fireEvent.input(emailInput, { target: { value: 'jean@exemple.com' } });
    await fireEvent.input(messageInput, { target: { value: 'Bonjour ! Ceci est un message de test pour valider le formulaire.' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    await fireEvent.click(submitButton);
    
    // Vérifier que fetch a été appelé
    expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@exemple.com',
        message: 'Bonjour ! Ceci est un message de test pour valider le formulaire.'
      })
    });
    
    // Vérifier le message de succès
    expect(await screen.findByText(/message envoyé/i)).toBeInTheDocument();
  });

  it('affiche un message d\'erreur si l\'envoi échoue', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erreur lors de l\'envoi du message.' })
    });

    render(Page);
    
    // Remplir le formulaire avec des données valides
    const prenomInput = screen.getByLabelText(/^Prénom \*$/i);
    const nomInput = screen.getByLabelText(/^Nom \*$/i);
    const emailInput = screen.getByLabelText(/^Email \*$/i);
    const messageInput = screen.getByLabelText(/^Message \*$/i);
    
    await fireEvent.input(prenomInput, { target: { value: 'Jean' } });
    await fireEvent.input(nomInput, { target: { value: 'Dupont' } });
    await fireEvent.input(emailInput, { target: { value: 'jean@exemple.com' } });
    await fireEvent.input(messageInput, { target: { value: 'Bonjour ! Ceci est un message de test pour valider le formulaire.' } });
    
    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    await fireEvent.click(submitButton);
    
    // Vérifier que fetch a été appelé
    expect(mockFetch).toHaveBeenCalled();
    
    // Vérifier le message d'erreur
    expect(await screen.findByText(/erreur lors de l'envoi du message\./i)).toBeInTheDocument();
  });
});
