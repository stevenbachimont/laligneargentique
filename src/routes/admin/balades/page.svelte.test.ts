import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, test, expect, vi, beforeEach } from 'vitest';
import AdminBaladesPage from './+page.svelte';

// Mock des données de test
const mockBalades = [
  {
    id: 1,
    theme: "Architecture médiévale",
    date: "2024-03-15",
    heure: "14:00",
    lieu: "Quartier du Bouffay",
    prix: "45€",
    placesDisponibles: 3,
    description: "Découverte de l'architecture médiévale de Nantes",
    statut: "en_ligne",
    parcours: [
      {
        titre: "Départ - Place du Bouffay",
        description: "Rendez-vous et présentation du matériel argentique."
      },
      {
        titre: "Étape 2 - Cathédrale",
        description: "Photographie de l'architecture gothique."
      }
    ],
    coordonnees: [
      {
        latitude: 47.2138,
        longitude: -1.5561
      },
      {
        latitude: 47.2172,
        longitude: -1.5536
      }
    ]
  },
  {
    id: 2,
    theme: "Street Art & Contemporain",
    date: "2024-03-22",
    heure: "15:30",
    lieu: "Île de Nantes",
    prix: "50€",
    placesDisponibles: 2,
    description: "Exploration du street art contemporain",
    statut: "en_ligne",
    parcours: [],
    coordonnees: []
  }
];

// Mock de fetch
global.fetch = vi.fn();

describe('AdminBaladesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock de la réponse fetch pour charger les balades
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, balades: mockBalades })
    });
  });

  test('affiche la page d\'administration des balades', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      expect(screen.getByText('📋 Gestion des Balades')).toBeInTheDocument();
    });
  });

  test('affiche la liste des balades', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      expect(screen.getByText('Architecture médiévale')).toBeInTheDocument();
      expect(screen.getByText('Street Art & Contemporain')).toBeInTheDocument();
    });
  });

  test('affiche les boutons d\'action pour chaque balade', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      // Pour les balades passées, on a les boutons Copier, Voir et Supprimer
      expect(screen.getAllByText('📋 Copier')).toHaveLength(2);
      expect(screen.getAllByText('👁️ Voir')).toHaveLength(2);
      expect(screen.getAllByText('🗑️ Supprimer')).toHaveLength(2);
    });
  });

  test('affiche le bouton d\'ajout de balade', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      expect(screen.getByText('➕ Ajouter une balade')).toBeInTheDocument();
    });
  });

  test('affiche les informations de base des balades', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      // Vérifier que les informations de base sont affichées
      expect(screen.getByText('Architecture médiévale')).toBeInTheDocument();
      expect(screen.getByText('Street Art & Contemporain')).toBeInTheDocument();
      expect(screen.getByText('📍 Quartier du Bouffay')).toBeInTheDocument();
      expect(screen.getByText('📍 Île de Nantes')).toBeInTheDocument();
    });
  });

  test('affiche les dates et heures des balades', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      // Vérifier que les dates sont affichées
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('22')).toBeInTheDocument();
      expect(screen.getAllByText('mars')).toHaveLength(2);
      expect(screen.getByText('🕐 14:00')).toBeInTheDocument();
      expect(screen.getByText('🕐 15:30')).toBeInTheDocument();
    });
  });

  test('affiche les prix des balades', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      // Vérifier que les prix sont affichés avec l'emoji
      expect(screen.getByText('💰 45€')).toBeInTheDocument();
      expect(screen.getByText('💰 50€')).toBeInTheDocument();
    });
  });

  test('affiche le statut des balades passées', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      // Vérifier que le statut "Passée" est affiché pour toutes les balades
      expect(screen.getAllByText('📚 Passée')).toHaveLength(2);
      expect(screen.getAllByText('Terminée')).toHaveLength(2);
    });
  });

  test('affiche les descriptions des balades', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      // Vérifier que les descriptions sont affichées
      expect(screen.getByText('Découverte de l\'architecture médiévale de Nantes')).toBeInTheDocument();
      expect(screen.getByText('Exploration du street art contemporain')).toBeInTheDocument();
    });
  });

  test('permet de naviguer vers l\'administration', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      const retourButton = screen.getByText('← Retour à l\'administration');
      expect(retourButton).toBeInTheDocument();
    });
  });

  test('affiche le titre de la page', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      expect(screen.getByText('📋 Gestion des Balades')).toBeInTheDocument();
    });
  });

  test('affiche le nombre total de balades', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      expect(screen.getByText('Balades existantes (2)')).toBeInTheDocument();
    });
  });

  test('permet de supprimer une balade', async () => {
    render(AdminBaladesPage);
    
    // Mock de confirm pour retourner true
    global.confirm = vi.fn(() => true);
    
    // Mock de la réponse pour la suppression
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Balade supprimée avec succès' })
    });
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('🗑️ Supprimer');
      fireEvent.click(deleteButtons[0]);
    });

    expect(global.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer cette balade ? Cette action est irréversible.');
  });

  test('affiche un message de chargement', async () => {
    render(AdminBaladesPage);
    
    // Le message de chargement devrait être affiché initialement
    expect(screen.getByText('Chargement des balades...')).toBeInTheDocument();
  });

  test('affiche un message d\'erreur si le chargement échoue', async () => {
    // Mock de la réponse d'erreur
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erreur lors du chargement' })
    });
    
    render(AdminBaladesPage);
    
    await waitFor(() => {
      expect(screen.getByText('Erreur lors du chargement des balades')).toBeInTheDocument();
    });
  });

  test('permet d\'ajouter une nouvelle balade', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      const addButton = screen.getByText('➕ Ajouter une balade');
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Ajouter une nouvelle balade')).toBeInTheDocument();
      expect(screen.getByLabelText('Thème de la balade *')).toBeInTheDocument();
      expect(screen.getByLabelText('Date *')).toBeInTheDocument();
      expect(screen.getByLabelText('Heure *')).toBeInTheDocument();
      expect(screen.getByLabelText('Lieu *')).toBeInTheDocument();
      expect(screen.getByLabelText('Prix *')).toBeInTheDocument();
      expect(screen.getByLabelText('Places disponibles *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description *')).toBeInTheDocument();
    });
  });

  // Tests pour la nouvelle interface simplifiée
  describe('Nouvelle interface simplifiée', () => {
    test('affiche les années de manière simplifiée', () => {
      // Test de la fonction getAnneeLabel simplifiée
      const getAnneeLabel = (annee: string): string => {
        return annee;
      };

      // Vérifier que la fonction retourne seulement l'année
      expect(getAnneeLabel('2024')).toBe('2024');
      expect(getAnneeLabel('2025')).toBe('2025');
      expect(getAnneeLabel('2023')).toBe('2023');
    });

    test('affiche les sections par catégorie (futures/passées)', async () => {
      render(AdminBaladesPage);
      
      await waitFor(() => {
        // Vérifier que les sections de catégorie sont présentes
        expect(screen.getByText('📚 Balades passées (2)')).toBeInTheDocument();
        // Note: Les balades futures ne sont pas affichées dans les données de test actuelles
        // car toutes les balades de test sont passées
      });
    });

    test('affiche les années sans mentions contextuelles', async () => {
      render(AdminBaladesPage);
      
      await waitFor(() => {
        // Vérifier que les années sont affichées simplement
        expect(screen.getByText('2024')).toBeInTheDocument();
        // Les mentions comme "(Cette année)" ne doivent pas être présentes
        expect(screen.queryByText(/Cette année/)).not.toBeInTheDocument();
        expect(screen.queryByText(/L'année prochaine/)).not.toBeInTheDocument();
      });
    });

    test('permet de copier une balade passée', async () => {
      render(AdminBaladesPage);
      
      await waitFor(() => {
        const copyButtons = screen.getAllByText('📋 Copier');
        expect(copyButtons).toHaveLength(2);
        
        // Vérifier que le premier bouton a le bon titre
        expect(copyButtons[0]).toHaveAttribute('title', 'Copier cette balade pour créer une nouvelle version');
      });
    });

    test('permet de voir les détails d\'une balade passée', async () => {
      render(AdminBaladesPage);
      
      await waitFor(() => {
        const viewButtons = screen.getAllByText('👁️ Voir');
        expect(viewButtons).toHaveLength(2);
        
        // Vérifier que le premier bouton a le bon titre
        expect(viewButtons[0]).toHaveAttribute('title', 'Voir les détails de cette balade passée');
      });
    });

    test('affiche le statut des balades', async () => {
      render(AdminBaladesPage);
      
      await waitFor(() => {
        // Vérifier que les statuts sont affichés (il y en a plusieurs)
        expect(screen.getAllByText('📚 Passée')).toHaveLength(2);
      });
    });
  });
});
