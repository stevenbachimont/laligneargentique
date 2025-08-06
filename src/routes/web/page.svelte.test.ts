import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Page from './+page.svelte';

// Mock de fetch global
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('/web', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le titre principal', () => {
    render(Page);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/développement web/i);
  });

  it('récupère les projets depuis l\'API', async () => {
    // Mock des données de test
    const mockProjects = [
      {
        id: 1,
        title: "Projet Test",
        description: "Description du projet test",
        date: "2024",
        projects: [
          {
            title: "Sous-projet",
            description: "Description du sous-projet",
            technologies: ["React", "TypeScript"]
          }
        ]
      }
    ];

    // Mock de la réponse fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjects
    });

    render(Page);

    // Attendre que l'API soit appelée
    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('https://api.stevenbachimont.com/api/projects');
    });
  });

  it('gère les erreurs d\'API', async () => {
    // Mock d'une erreur fetch
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    // Spy sur console.error pour vérifier qu'il est appelé
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(Page);

    // Attendre que l'erreur soit gérée
    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching projects:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
}); 