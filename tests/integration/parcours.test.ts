import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import AdminBaladesPage from '../../src/routes/admin/balades/+page.svelte';

// Mock de fetch pour simuler les appels API
global.fetch = vi.fn();

describe('Intégration - Gestion des Parcours', () => {
  const mockBalade = {
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
      }
    ],
    coordonnees: [
      {
        lat: 47.2138,
        lng: -1.5561,
        name: "Place du Bouffay"
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock de la réponse pour charger les balades
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, balades: [mockBalade] })
    });
  });

  describe('Chargement des coordonnées GPS', () => {
    it('charge correctement les coordonnées GPS existantes', async () => {
      render(AdminBaladesPage);
      
      await waitFor(() => {
        const parcoursButtons = screen.getAllByText('🗺️ Parcours');
        fireEvent.click(parcoursButtons[0]);
      });

      await waitFor(() => {
        // Vérifier que les coordonnées sont affichées
        expect(screen.getByText('📍 47.2138, -1.5561')).toBeInTheDocument();
      });
    });

    it('gère les balades sans coordonnées GPS', async () => {
      const baladeSansCoordonnees = {
        ...mockBalade,
        coordonnees: []
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, balades: [baladeSansCoordonnees] })
      });

      render(AdminBaladesPage);
      
      await waitFor(() => {
        const parcoursButtons = screen.getAllByText('🗺️ Parcours');
        fireEvent.click(parcoursButtons[0]);
      });

      await waitFor(() => {
        // Vérifier que l'interface s'affiche correctement même sans coordonnées
        expect(screen.getByText('🗺️ Édition du parcours - Architecture médiévale')).toBeInTheDocument();
      });
    });
  });

  describe('Ajout d\'étapes', () => {
    it('permet d\'ajouter une nouvelle étape avec coordonnées GPS', async () => {
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
        
        // Remplir le formulaire
        const titreInput = screen.getByLabelText('Titre de l\'étape *');
        const latitudeInput = screen.getByLabelText('Latitude *');
        const longitudeInput = screen.getByLabelText('Longitude *');
        const descriptionInput = screen.getByLabelText('Description de l\'étape *');
        
        fireEvent.input(titreInput, { target: { value: 'Nouvelle étape' } });
        fireEvent.input(latitudeInput, { target: { value: '47.2200' } });
        fireEvent.input(longitudeInput, { target: { value: '-1.5500' } });
        fireEvent.input(descriptionInput, { target: { value: 'Description de la nouvelle étape' } });
        
        const saveButton = screen.getByText('Ajouter l\'étape');
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Nouvelle étape')).toBeInTheDocument();
        expect(screen.getByText('📍 47.22, -1.55')).toBeInTheDocument();
      });
    });
  });

  describe('Modification d\'étapes', () => {
    it('permet de modifier une étape existante', async () => {
      render(AdminBaladesPage);
      
      await waitFor(() => {
        const parcoursButtons = screen.getAllByText('🗺️ Parcours');
        fireEvent.click(parcoursButtons[0]);
      });

      await waitFor(() => {
        const editButtons = screen.getAllByText('✏️');
        fireEvent.click(editButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Modifier l\'étape')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Départ - Place du Bouffay')).toBeInTheDocument();
        expect(screen.getByDisplayValue('47.2138')).toBeInTheDocument();
        expect(screen.getByDisplayValue('-1.5561')).toBeInTheDocument();
      });
    });
  });

  describe('Réorganisation des étapes', () => {
    it('permet de déplacer les étapes vers le haut et le bas', async () => {
      const baladeAvecPlusieursEtapes = {
        ...mockBalade,
        parcours: [
          {
            titre: "Étape 1",
            description: "Première étape",
            duree: "30 min",
            distance: "0 km"
          },
          {
            titre: "Étape 2",
            description: "Deuxième étape",
            duree: "45 min",
            distance: "0.5 km"
          }
        ],
        coordonnees: [
          {
            lat: 47.2138,
            lng: -1.5561,
            name: "Étape 1"
          },
          {
            lat: 47.2172,
            lng: -1.5536,
            name: "Étape 2"
          }
        ]
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, balades: [baladeAvecPlusieursEtapes] })
      });

      render(AdminBaladesPage);
      
      await waitFor(() => {
        const parcoursButtons = screen.getAllByText('🗺️ Parcours');
        fireEvent.click(parcoursButtons[0]);
      });

      await waitFor(() => {
        const moveUpButtons = screen.getAllByText('⬆️');
        const moveDownButtons = screen.getAllByText('⬇️');
        
        // Le premier bouton up devrait être désactivé
        expect(moveUpButtons[0]).toBeDisabled();
        // Le dernier bouton down devrait être désactivé
        expect(moveDownButtons[1]).toBeDisabled();
        
        // Les boutons du milieu devraient être actifs
        expect(moveDownButtons[0]).not.toBeDisabled();
        expect(moveUpButtons[1]).not.toBeDisabled();
      });
    });
  });

  describe('Sauvegarde du parcours', () => {
    it('sauvegarde le parcours avec les nouvelles coordonnées', async () => {
      // Mock de la réponse pour la sauvegarde
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Parcours sauvegardé avec succès' })
      });
      
      render(AdminBaladesPage);
      
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

      // Vérifier que l'appel API a été fait avec les bonnes données
      expect(fetch).toHaveBeenCalledWith(
        '/api/admin/balades/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('parcours')
        })
      );
    });

    it('affiche une erreur si la sauvegarde échoue', async () => {
      // Mock d'une erreur de sauvegarde
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Erreur lors de la sauvegarde' })
      });
      
      render(AdminBaladesPage);
      
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
  });

  describe('Validation des données', () => {
    it('empêche la sauvegarde d\'une étape sans titre', async () => {
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
        // Remplir seulement la description, pas le titre
        const descriptionInput = screen.getByLabelText('Description de l\'étape *');
        fireEvent.input(descriptionInput, { target: { value: 'Description sans titre' } });
        
        const saveButton = screen.getByText('Ajouter l\'étape');
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Veuillez remplir le titre et la description de l\'étape')).toBeInTheDocument();
      });
    });

    it('empêche la sauvegarde d\'une étape sans description', async () => {
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
        // Remplir seulement le titre, pas la description
        const titreInput = screen.getByLabelText('Titre de l\'étape *');
        fireEvent.input(titreInput, { target: { value: 'Titre sans description' } });
        
        const saveButton = screen.getByText('Ajouter l\'étape');
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Veuillez remplir le titre et la description de l\'étape')).toBeInTheDocument();
      });
    });
  });

  describe('Interface utilisateur', () => {
    it('affiche le bon nombre d\'étapes', async () => {
      render(AdminBaladesPage);
      
      await waitFor(() => {
        const parcoursButtons = screen.getAllByText('🗺️ Parcours');
        fireEvent.click(parcoursButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Étapes du parcours (1)')).toBeInTheDocument();
      });
    });

    it('affiche un message quand il n\'y a pas d\'étapes', async () => {
      const baladeSansParcours = {
        ...mockBalade,
        parcours: [],
        coordonnees: []
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, balades: [baladeSansParcours] })
      });

      render(AdminBaladesPage);
      
      await waitFor(() => {
        const parcoursButtons = screen.getAllByText('🗺️ Parcours');
        fireEvent.click(parcoursButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Aucune étape définie. Cliquez sur "Ajouter une étape" pour commencer.')).toBeInTheDocument();
      });
    });
  });
});
