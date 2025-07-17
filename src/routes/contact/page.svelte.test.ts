import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Page from './+page.svelte';

// Mock EmailJS
vi.mock('emailjs-com', () => ({
  default: {
    send: vi.fn()
  }
}));
import emailjs from 'emailjs-com';

describe('/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le titre et les champs du formulaire', () => {
    render(Page);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/contact/i);
    expect(screen.getByLabelText(/^Prénom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Message$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
  });

  it('permet de saisir et soumettre le formulaire (succès)', async () => {
    (emailjs.send as any).mockResolvedValueOnce({ status: 200 });
    render(Page);
    await fireEvent.input(screen.getByLabelText(/^Prénom$/i), { target: { value: 'Jean' } });
    await fireEvent.input(screen.getByLabelText(/^Nom$/i), { target: { value: 'Dupont' } });
    await fireEvent.input(screen.getByLabelText(/^Email$/i), { target: { value: 'jean@exemple.com' } });
    await fireEvent.input(screen.getByLabelText(/^Message$/i), { target: { value: 'Bonjour !' } });
    await fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));
    expect(emailjs.send).toHaveBeenCalled();
    expect(await screen.findByText(/message envoyé/i)).toBeInTheDocument();
  });

  it('affiche un message d\'erreur si l\'envoi échoue', async () => {
    (emailjs.send as any).mockRejectedValueOnce(new Error('fail'));
    render(Page);
    await fireEvent.input(screen.getByLabelText(/^Prénom$/i), { target: { value: 'Jean' } });
    await fireEvent.input(screen.getByLabelText(/^Nom$/i), { target: { value: 'Dupont' } });
    await fireEvent.input(screen.getByLabelText(/^Email$/i), { target: { value: 'jean@exemple.com' } });
    await fireEvent.input(screen.getByLabelText(/^Message$/i), { target: { value: 'Bonjour !' } });
    await fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));
    expect(emailjs.send).toHaveBeenCalled();
    expect(await screen.findByText(/erreur lors de l’envoi du message/i)).toBeInTheDocument();
  });
}); 