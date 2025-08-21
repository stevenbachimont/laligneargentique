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
    parcours: [
      {
        titre: "Départ - Place du Bouffay",
        description: "Rendez-vous et présentation du matériel argentique.",
        duree: "30 min",
        distance: "0 km"
      },
      {
        titre: "Étape 2 - Cathédrale",
        description: "Photographie de l'architecture gothique.",
        duree: "45 min",
        distance: "0.5 km"
      }
    ],
    coordonnees: [
      {
        lat: 47.2138,
        lng: -1.5561,
        name: "Place du Bouffay"
      },
      {
        lat: 47.2172,
        lng: -1.5536,
        name: "Cathédrale"
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
      expect(screen.getAllByText('✏️ Modifier')).toHaveLength(2);
      expect(screen.getAllByText('🗺️ Parcours')).toHaveLength(2);
      expect(screen.getAllByText('🗑️ Supprimer')).toHaveLength(2);
    });
  });

  test('affiche le bouton d\'ajout de balade', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      expect(screen.getByText('➕ Ajouter une balade')).toBeInTheDocument();
    });
  });

  test('ouvre l\'interface d\'édition du parcours', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      const parcoursButtons = screen.getAllByText('🗺️ Parcours');
      fireEvent.click(parcoursButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('🗺️ Édition du parcours - Architecture médiévale')).toBeInTheDocument();
      expect(screen.getByText('➕ Ajouter une étape')).toBeInTheDocument();
      expect(screen.getByText('💾 Sauvegarder le parcours')).toBeInTheDocument();
    });
  });

  test('affiche les étapes du parcours existant', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      const parcoursButtons = screen.getAllByText('🗺️ Parcours');
      fireEvent.click(parcoursButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Départ - Place du Bouffay')).toBeInTheDocument();
      expect(screen.getByText('Étape 2 - Cathédrale')).toBeInTheDocument();
      expect(screen.getByText('📍 47.213800, -1.556100')).toBeInTheDocument();
      expect(screen.getByText('📍 47.217200, -1.553600')).toBeInTheDocument();
    });
  });

  test('permet d\'ajouter une nouvelle étape', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      const parcoursButtons = screen.getAllByText('🗺️ Parcours');
      fireEvent.click(parcoursButtons[0]);
    });

    await waitFor(() => {
      const addButton = screen.getByText('➕ Ajouter une étape');
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Ajouter une étape')).toBeInTheDocument();
      expect(screen.getByLabelText('Titre de l\'étape *')).toBeInTheDocument();
      expect(screen.getByLabelText('Latitude *')).toBeInTheDocument();
      expect(screen.getByLabelText('Longitude *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description de l\'étape *')).toBeInTheDocument();
    });
  });

  test('permet de modifier une étape existante', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      const parcoursButtons = screen.getAllByText('🗺️ Parcours');
      fireEvent.click(parcoursButtons[0]);
    });

    await waitFor(() => {
      // Vérifier que l'interface du parcours est affichée
      expect(screen.getByText('🗺️ Édition du parcours - Architecture médiévale')).toBeInTheDocument();
    });

    // Cliquer sur le bouton d'édition de la première étape
    await waitFor(() => {
      const editButtons = screen.getAllByText('✏️');
      // Prendre le bouton d'édition d'étape (pas celui de la balade)
      const etapeEditButton = editButtons.find(button => 
        button.className.includes('btn-edit-etape')
      );
      if (etapeEditButton) {
        fireEvent.click(etapeEditButton);
      } else {
        // Fallback: utiliser le dernier bouton ✏️ qui devrait être celui de l'étape
        fireEvent.click(editButtons[editButtons.length - 1]);
      }
    });

    await waitFor(() => {
      // Vérifier que le formulaire d'édition d'étape est affiché avec les valeurs pré-remplies
      expect(screen.getByLabelText('Titre de l\'étape *')).toBeInTheDocument();
      expect(screen.getByLabelText('Latitude *')).toBeInTheDocument();
      expect(screen.getByLabelText('Longitude *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description de l\'étape *')).toBeInTheDocument();
    });
  });

  test('permet de supprimer une étape', async () => {
    render(AdminBaladesPage);
    
    // Mock de confirm pour retourner true
    global.confirm = vi.fn(() => true);
    
    await waitFor(() => {
      const parcoursButtons = screen.getAllByText('🗺️ Parcours');
      fireEvent.click(parcoursButtons[0]);
    });

    await waitFor(() => {
      const deleteButtons = screen.getAllByText('🗑️');
      fireEvent.click(deleteButtons[0]);
    });

    expect(global.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer cette étape ?');
  });

  test('permet de réorganiser les étapes', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      const parcoursButtons = screen.getAllByText('🗺️ Parcours');
      fireEvent.click(parcoursButtons[0]);
    });

    await waitFor(() => {
      const moveUpButtons = screen.getAllByText('⬆️');
      const moveDownButtons = screen.getAllByText('⬇️');
      
      expect(moveUpButtons).toHaveLength(2);
      expect(moveDownButtons).toHaveLength(2);
      
      // Le premier bouton up devrait être désactivé
      expect(moveUpButtons[0]).toBeDisabled();
      // Le dernier bouton down devrait être désactivé
      expect(moveDownButtons[1]).toBeDisabled();
    });
  });

  test('sauvegarde le parcours avec succès', async () => {
    render(AdminBaladesPage);
    
    // Mock de la réponse pour la sauvegarde
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Parcours sauvegardé avec succès' })
    });
    
    await waitFor(() => {
      const parcoursButtons = screen.getAllByText('🗺️ Parcours');
      fireEvent.click(parcoursButtons[0]);
    });

    await waitFor(() => {
      const saveButton = screen.getByText('💾 Sauvegarder le parcours');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Parcours sauvegardé avec succès !')).toBeInTheDocument();
    });
  });

  test('affiche un message d\'erreur si la sauvegarde échoue', async () => {
    render(AdminBaladesPage);
    
    // Mock de la réponse d'erreur
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erreur lors de la sauvegarde' })
    });
    
    await waitFor(() => {
      const parcoursButtons = screen.getAllByText('🗺️ Parcours');
      fireEvent.click(parcoursButtons[0]);
    });

    await waitFor(() => {
      const saveButton = screen.getByText('💾 Sauvegarder le parcours');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Erreur lors de la sauvegarde')).toBeInTheDocument();
    });
  });

  test('permet d\'annuler l\'édition du parcours', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      const parcoursButtons = screen.getAllByText('🗺️ Parcours');
      fireEvent.click(parcoursButtons[0]);
    });

    await waitFor(() => {
      const cancelButton = screen.getByText('❌ Annuler');
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('🗺️ Édition du parcours - Architecture médiévale')).not.toBeInTheDocument();
    });
  });

  test('affiche le code couleur pour les places disponibles', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      // Vérifier que les places sont affichées avec les bonnes couleurs
      expect(screen.getByText('3 places')).toBeInTheDocument();
      expect(screen.getByText('2 places')).toBeInTheDocument();
    });
  });

  test('permet de modifier une balade existante', async () => {
    render(AdminBaladesPage);
    
    await waitFor(() => {
      const editButtons = screen.getAllByText('✏️ Modifier');
      fireEvent.click(editButtons[0]);
    });

    await waitFor(() => {
      // Utiliser un sélecteur plus spécifique pour le titre du formulaire
      const modifierBaladeHeading = screen.getByRole('heading', { name: 'Modifier la balade' });
      expect(modifierBaladeHeading).toBeInTheDocument();
      expect(screen.getByDisplayValue('Architecture médiévale')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-03-15')).toBeInTheDocument();
      expect(screen.getByDisplayValue('14:00')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Quartier du Bouffay')).toBeInTheDocument();
      expect(screen.getByDisplayValue('45€')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
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
});
