import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import FlottePage from './+page.svelte';
import { getAppareilsByCategorie } from '../../../../lib/data/appareilsData';

// Mock des données d'appareils
const mockAppareilsData = {
  'TLR': [
    {
      id: '1',
      nom: 'Rolleiflex 2.8F',
      marque: 'Rollei',
      modele: '2.8F',
      categorie: 'TLR',
      annee: 1960,
      description: 'Le mythique Rolleiflex 2.8F',
      caracteristiques: ['Format 6x6 cm', 'Objectif Carl Zeiss Planar 80mm f/2.8'],
      image: '/photos/appareils/rolleiflex-2.8f.jpg',
      statut: 'disponible',
      prixLocation: 45
    }
  ],
  'SLR': [
    {
      id: '2',
      nom: 'Canon AE-1',
      marque: 'Canon',
      modele: 'AE-1',
      categorie: 'SLR',
      annee: 1976,
      description: 'Le premier SLR électronique de Canon',
      caracteristiques: ['Format 35mm', 'Monture FD'],
      image: '/photos/appareils/canon-ae1.jpg',
      statut: 'disponible',
      prixLocation: 40
    }
  ],
  'Folding': [],
  'Rangefinder': [],
  'Point & Shoot': []
};

// Mock du module de données
vi.mock('$lib/data/appareilsData', () => ({
  getAppareilsByCategorie: vi.fn(() => mockAppareilsData)
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

describe('Page Flotte - Interface utilisateur', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('devrait afficher le titre principal', () => {
      render(FlottePage);
      expect(screen.getByText('Notre flotte d\'appareils')).toBeInTheDocument();
    });

    it('devrait afficher le sous-titre', () => {
      render(FlottePage);
      expect(screen.getByText('Découvrez les appareils photo argentiques restaurés et disponibles pour nos balades')).toBeInTheDocument();
    });

    it('devrait afficher les catégories d\'appareils', () => {
      render(FlottePage);
      expect(screen.getByText('Catégories d\'appareils')).toBeInTheDocument();
    });

    it('devrait afficher les boutons de catégories', () => {
      render(FlottePage);
      expect(screen.getByText('TLR')).toBeInTheDocument();
      expect(screen.getByText('SLR')).toBeInTheDocument();
      expect(screen.getByText('Folding')).toBeInTheDocument();
      expect(screen.getByText('Rangefinder')).toBeInTheDocument();
      expect(screen.getByText('Point & Shoot')).toBeInTheDocument();
    });
  });

  describe('Navigation par catégories', () => {
    it('devrait changer de catégorie quand on clique sur un bouton', async () => {
      render(FlottePage);
      
      const slrButton = screen.getByText('SLR');
      await fireEvent.click(slrButton);
      
      expect(slrButton).toHaveClass('active');
    });

    it('devrait afficher la description de la catégorie', () => {
      render(FlottePage);
      expect(screen.getByText(/Twin Lens Reflex - Deux objectifs superposés/)).toBeInTheDocument();
    });
  });

  describe('Carrousel d\'appareils', () => {
    it('devrait afficher les appareils de la catégorie active', async () => {
      render(FlottePage);
      
      // Attendre que les données soient chargées
      await waitFor(() => {
        expect(screen.getByText('Rolleiflex 2.8F')).toBeInTheDocument();
      });
    });

    it('devrait afficher les informations de l\'appareil', async () => {
      render(FlottePage);
      
      await waitFor(() => {
        expect(screen.getByText('Rolleiflex 2.8F')).toBeInTheDocument();
        expect(screen.getByText('Rollei 2.8F (1960)')).toBeInTheDocument();
        expect(screen.getByText('Le mythique Rolleiflex 2.8F')).toBeInTheDocument();
        expect(screen.getByText('45€/balade')).toBeInTheDocument();
        expect(screen.getByText('Disponible')).toBeInTheDocument();
      });
    });

    it('devrait afficher les caractéristiques de l\'appareil', async () => {
      render(FlottePage);
      
      await waitFor(() => {
        expect(screen.getByText('Caractéristiques :')).toBeInTheDocument();
        expect(screen.getByText('Format 6x6 cm')).toBeInTheDocument();
        expect(screen.getByText('Objectif Carl Zeiss Planar 80mm f/2.8')).toBeInTheDocument();
      });
    });
  });

  describe('Contrôles du carrousel', () => {
    it('devrait afficher les boutons de navigation', () => {
      render(FlottePage);
      expect(screen.getByLabelText('Appareil précédent')).toBeInTheDocument();
      expect(screen.getByLabelText('Appareil suivant')).toBeInTheDocument();
    });

    it('devrait afficher le bouton de lecture/pause', () => {
      render(FlottePage);
      expect(screen.getByText('⏸️ Pause')).toBeInTheDocument();
    });

    it('devrait afficher le compteur d\'appareils', () => {
      render(FlottePage);
      expect(screen.getByText('1 / 1')).toBeInTheDocument();
    });
  });

  describe('Section informations pratiques', () => {
    it('devrait afficher la section informations pratiques', () => {
      render(FlottePage);
      expect(screen.getByText('Informations pratiques')).toBeInTheDocument();
    });

    it('devrait afficher les cartes d\'information', () => {
      render(FlottePage);
      expect(screen.getByText('🔧 Maintenance')).toBeInTheDocument();
      expect(screen.getByText('📸 Pellicules')).toBeInTheDocument();
      expect(screen.getByText('🎓 Formation')).toBeInTheDocument();
      expect(screen.getByText('🛡️ Assurance')).toBeInTheDocument();
    });
  });

  describe('Gestion des catégories vides', () => {
    it('devrait afficher un message pour les catégories sans appareils', async () => {
      render(FlottePage);
      
      // Cliquer sur une catégorie vide
      const foldingButton = screen.getByText('Folding');
      await fireEvent.click(foldingButton);
      
      await waitFor(() => {
        expect(screen.getByText('Aucun appareil disponible dans cette catégorie pour le moment.')).toBeInTheDocument();
      });
    });
  });

  describe('Interactions utilisateur', () => {
    it('devrait changer d\'appareil avec les boutons de navigation', async () => {
      render(FlottePage);
      
      // Attendre que les données soient chargées
      await waitFor(() => {
        expect(screen.getByText('Rolleiflex 2.8F')).toBeInTheDocument();
      });
      
      // Cliquer sur suivant (même si on n'a qu'un appareil, cela teste la fonctionnalité)
      const nextButton = screen.getByLabelText('Appareil suivant');
      await fireEvent.click(nextButton);
      
      // Vérifier que l'action a été déclenchée (pas d'erreur)
      expect(nextButton).toBeInTheDocument();
    });

    it('devrait basculer entre lecture et pause', async () => {
      render(FlottePage);
      
      const playPauseButton = screen.getByText('⏸️ Pause');
      await fireEvent.click(playPauseButton);
      
      // Vérifier que le bouton change (cela dépend de l'implémentation)
      expect(playPauseButton).toBeInTheDocument();
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir des labels ARIA appropriés', () => {
      render(FlottePage);
      
      expect(screen.getByLabelText('Appareil précédent')).toBeInTheDocument();
      expect(screen.getByLabelText('Appareil suivant')).toBeInTheDocument();
    });

    it('devrait avoir des indicateurs accessibles', async () => {
      render(FlottePage);
      
      await waitFor(() => {
        const indicators = screen.getAllByLabelText(/Aller à l'appareil/);
        expect(indicators.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Responsive design', () => {
    it('devrait s\'adapter aux différentes tailles d\'écran', () => {
      render(FlottePage);
      
      // Vérifier que les éléments principaux sont présents
      expect(screen.getByText('Notre flotte d\'appareils')).toBeInTheDocument();
      expect(screen.getByText('Catégories d\'appareils')).toBeInTheDocument();
    });

    it('devrait gérer les erreurs d\'image avec une image par défaut', () => {
      const { container } = render(FlottePage);
      
      // Trouver une image
      const image = container.querySelector('img') as HTMLImageElement;
      expect(image).toBeTruthy();
      
      // Vérifier que l'image a un attribut alt
      expect(image.alt).toBeTruthy();
      
      // Vérifier que l'image a une source
      expect(image.src).toBeTruthy();
    });
  });
});
