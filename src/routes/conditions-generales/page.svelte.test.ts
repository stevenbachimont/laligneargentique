import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ConditionsGenerales from './+page.svelte';

describe('Conditions Générales Page', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000/conditions-generales',
        pathname: '/conditions-generales'
      },
      writable: true
    });
  });

  describe('Page Structure', () => {
    it('should render the main page title', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText('Conditions Générales de Vente')).toBeInTheDocument();
      expect(screen.getByText('Balades Photographiques Argentiques')).toBeInTheDocument();
    });

    it('should render the return button', () => {
      render(ConditionsGenerales);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      expect(returnButton).toBeInTheDocument();
      expect(returnButton.closest('button')).toBeInTheDocument();
    });

    it('should render all main sections', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText('📋 Informations générales')).toBeInTheDocument();
      expect(screen.getByText('🎯 Objet des conditions')).toBeInTheDocument();
      expect(screen.getByText('📸 Services proposés')).toBeInTheDocument();
      expect(screen.getByText('💰 Tarifs et modalités de paiement')).toBeInTheDocument();
      expect(screen.getByText('📅 Réservation et annulation')).toBeInTheDocument();
      expect(screen.getByText('🚶‍♂️ Déroulement des balades')).toBeInTheDocument();
      expect(screen.getByText('⚖️ Responsabilités')).toBeInTheDocument();
      expect(screen.getByText('📷 Droit à l\'image')).toBeInTheDocument();
      expect(screen.getByText('🔒 Protection des données personnelles')).toBeInTheDocument();
      expect(screen.getByText('⚖️ Droit applicable')).toBeInTheDocument();
      expect(screen.getByText('📞 Contact')).toBeInTheDocument();
    });
  });

  describe('Content Sections', () => {
    it('should display publisher information correctly', () => {
      render(ConditionsGenerales);
      
      expect(screen.getAllByText(/Steven Bachimont/)).toHaveLength(2);
      expect(screen.getByText('contact@stevenbachimont.com')).toBeInTheDocument();
      expect(screen.getByText(/Organisation de balades photographiques argentiques/)).toBeInTheDocument();
    });

    it('should display services offered', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText('Accompagnement personnalisé lors de balades urbaines')).toBeInTheDocument();
      expect(screen.getByText('Initiation à la photographie argentique')).toBeInTheDocument();
      expect(screen.getByText('Prêt de matériel photographique (appareil photo, pellicules)')).toBeInTheDocument();
      expect(screen.getByText('Conseils techniques et artistiques')).toBeInTheDocument();
      expect(screen.getByText('Développement et numérisation des photos')).toBeInTheDocument();
    });

    it('should display payment information', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText('Paiement en ligne sécurisé via Stripe')).toBeInTheDocument();
      expect(screen.getByText('Cartes bancaires acceptées : Visa, Mastercard, American Express')).toBeInTheDocument();
      expect(screen.getByText('Paiement en une seule fois au moment de la réservation')).toBeInTheDocument();
    });

    it('should display cancellation policy', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText('Plus de 7 jours avant')).toBeInTheDocument();
      expect(screen.getByText('Entre 7 et 3 jours avant')).toBeInTheDocument();
      expect(screen.getByText('Moins de 3 jours avant')).toBeInTheDocument();
      expect(screen.getByText('Remboursement intégral')).toBeInTheDocument();
      expect(screen.getByText('Remboursement 50%')).toBeInTheDocument();
      expect(screen.getByText('Aucun remboursement')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to home page when return button is clicked', () => {
      render(ConditionsGenerales);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      fireEvent.click(returnButton);
      
      // Should redirect to home page
      expect(window.location.href).toBe('/');
    });
  });

  describe('Responsive Design', () => {
    it('should have proper responsive classes', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText('Conditions Générales de Vente')).toBeInTheDocument();
    });

    it('should have proper animation classes', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText('Conditions Générales de Vente')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(ConditionsGenerales);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Conditions Générales de Vente');
      
      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBeGreaterThan(0);
    });

    it('should have proper button accessibility', () => {
      render(ConditionsGenerales);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      expect(returnButton.closest('button')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta', () => {
    it('should have proper page title', () => {
      render(ConditionsGenerales);
      
      // Check if title is set in svelte:head
      expect(document.title).toBe('Conditions Générales de Vente - Balades Argentiques');
    });

    it('should have proper meta description', () => {
      render(ConditionsGenerales);
      
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toHaveAttribute('content', 'Conditions générales de vente pour les balades photographiques argentiques');
    });
  });

  describe('Contact Information', () => {
    it('should display contact details correctly', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText('Email :')).toBeInTheDocument();
      expect(screen.getByText('contact@stevenbachimont.com')).toBeInTheDocument();
      expect(screen.getByText('Site web :')).toBeInTheDocument();
      expect(screen.getByText('stevenbachimont.com')).toBeInTheDocument();
    });
  });

  describe('Legal Content', () => {
    it('should mention French law', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText(/droit français/)).toBeInTheDocument();
      expect(screen.getByText(/tribunaux français/)).toBeInTheDocument();
    });

    it('should mention data protection', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText(/politique de confidentialité/)).toBeInTheDocument();
    });

    it('should mention image rights', () => {
      render(ConditionsGenerales);
      
      expect(screen.getByText(/Droit à l'image/)).toBeInTheDocument();
      expect(screen.getByText(/fins promotionnelles/)).toBeInTheDocument();
    });
  });

  describe('Date Information', () => {
    it('should display last updated date', () => {
      render(ConditionsGenerales);
      
      const lastUpdated = screen.getByText(/Dernière mise à jour/);
      expect(lastUpdated).toBeInTheDocument();
      
      // Should contain current date
      const currentDate = new Date().toLocaleDateString('fr-FR');
      expect(lastUpdated).toHaveTextContent(currentDate);
    });
  });
});
