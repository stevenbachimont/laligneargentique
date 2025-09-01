import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import PolitiqueConfidentialite from './+page.svelte';

describe('Politique de Confidentialité Page', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000/politique-confidentialite',
        pathname: '/politique-confidentialite'
      },
      writable: true
    });
  });

  describe('Page Structure', () => {
    it('should render the main page title', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Politique de Confidentialité')).toBeInTheDocument();
      expect(screen.getByText('Protection de vos données personnelles')).toBeInTheDocument();
    });

    it('should render the return button', () => {
      render(PolitiqueConfidentialite);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      expect(returnButton).toBeInTheDocument();
      expect(returnButton.closest('button')).toBeInTheDocument();
    });

    it('should render all main sections', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('🔒 Introduction')).toBeInTheDocument();
      expect(screen.getByText('👤 Responsable du traitement')).toBeInTheDocument();
      expect(screen.getByText('📊 Données collectées')).toBeInTheDocument();
      expect(screen.getByText('🎯 Finalités du traitement')).toBeInTheDocument();
      expect(screen.getByText('⚖️ Base légale')).toBeInTheDocument();
      expect(screen.getByText('📤 Destinataires des données')).toBeInTheDocument();
      expect(screen.getByText('⏰ Durée de conservation')).toBeInTheDocument();
      expect(screen.getByText('🛡️ Vos droits')).toBeInTheDocument();
      expect(screen.getByText('📝 Exercice de vos droits')).toBeInTheDocument();
      expect(screen.getByText('🔐 Sécurité des données')).toBeInTheDocument();
      expect(screen.getByText('🍪 Cookies')).toBeInTheDocument();
      expect(screen.getByText('🌍 Transferts de données')).toBeInTheDocument();
      expect(screen.getByText('📋 Modifications de la politique')).toBeInTheDocument();
      expect(screen.getByText('📞 Contact et réclamations')).toBeInTheDocument();
    });
  });

  describe('Content Sections', () => {
    it('should display controller information correctly', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getAllByText(/Steven Bachimont/)).toHaveLength(4);
      expect(screen.getByText('contact@stevenbachimont.com')).toBeInTheDocument();
      expect(screen.getAllByText(/stevenbachimont\.com/)).toHaveLength(2);
      expect(screen.getByText(/Organisation de balades photographiques argentiques/)).toBeInTheDocument();
    });

    it('should display data collection information', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Nom et prénom')).toBeInTheDocument();
      expect(screen.getByText('Adresse email')).toBeInTheDocument();
      expect(screen.getByText('Numéro de téléphone (optionnel)')).toBeInTheDocument();
      expect(screen.getByText('Date et heure de la balade')).toBeInTheDocument();
      expect(screen.getByText('Nombre de participants')).toBeInTheDocument();
      expect(screen.getByText('Messages et préférences')).toBeInTheDocument();
    });

    it('should display processing purposes', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Gestion des réservations')).toBeInTheDocument();
      expect(screen.getByText('Communication')).toBeInTheDocument();
      expect(screen.getByText('Paiement sécurisé')).toBeInTheDocument();
      expect(screen.getByText('Amélioration des services')).toBeInTheDocument();
      expect(screen.getByText('Obligations légales')).toBeInTheDocument();
    });

    it('should display legal basis', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Exécution du contrat')).toBeInTheDocument();
      expect(screen.getByText('Intérêt légitime')).toBeInTheDocument();
      expect(screen.getByText('Obligation légale')).toBeInTheDocument();
      expect(screen.getByText('Consentement')).toBeInTheDocument();
    });

    it('should display data recipients', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Stripe')).toBeInTheDocument();
      expect(screen.getByText('Hébergeur web')).toBeInTheDocument();
      expect(screen.getByText('Services d\'email')).toBeInTheDocument();
      expect(screen.getByText(/Autorités fiscales/)).toBeInTheDocument();
    });

    it('should display retention periods', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('5 ans après la dernière activité')).toBeInTheDocument();
      expect(screen.getByText('5 ans')).toBeInTheDocument();
      expect(screen.getByText('3 ans après le dernier contact')).toBeInTheDocument();
      expect(screen.getByText('13 mois maximum')).toBeInTheDocument();
    });

    it('should display user rights', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Droit d\'accès')).toBeInTheDocument();
      expect(screen.getByText('Droit de rectification')).toBeInTheDocument();
      expect(screen.getByText('Droit d\'effacement')).toBeInTheDocument();
      expect(screen.getByText('Droit à la portabilité')).toBeInTheDocument();
      expect(screen.getByText('Droit d\'opposition')).toBeInTheDocument();
      expect(screen.getByText('Droit de limitation')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to home page when return button is clicked', () => {
      render(PolitiqueConfidentialite);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      fireEvent.click(returnButton);
      
      // Should redirect to home page
      expect(window.location.href).toBe('/');
    });
  });

  describe('Contact Information', () => {
    it('should display contact methods correctly', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Par email')).toBeInTheDocument();
      expect(screen.getByText('Par courrier')).toBeInTheDocument();
      expect(screen.getByText('contact@stevenbachimont.com')).toBeInTheDocument();
      expect(screen.getAllByText(/Steven Bachimont/)).toHaveLength(4);
    });

    it('should display CNIL information', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Commission Nationale de l\'Informatique et des Libertés')).toBeInTheDocument();
      expect(screen.getByText('www.cnil.fr')).toBeInTheDocument();
      expect(screen.getByText('3 Place de Fontenoy, 75007 Paris')).toBeInTheDocument();
    });

    it('should have CNIL link with proper attributes', () => {
      render(PolitiqueConfidentialite);
      
      const cnilLink = screen.getByText('www.cnil.fr');
      expect(cnilLink.closest('a')).toHaveAttribute('href', 'https://www.cnil.fr');
      expect(cnilLink.closest('a')).toHaveAttribute('target', '_blank');
      expect(cnilLink.closest('a')).toHaveAttribute('rel', 'noopener');
    });
  });

  describe('Security Information', () => {
    it('should display security measures', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Chiffrement SSL/TLS pour les transmissions')).toBeInTheDocument();
      expect(screen.getByText('Stockage sécurisé des données')).toBeInTheDocument();
      expect(screen.getByText('Accès restreint aux données personnelles')).toBeInTheDocument();
      expect(screen.getByText('Sauvegardes régulières et sécurisées')).toBeInTheDocument();
      expect(screen.getByText('Mise à jour régulière des systèmes')).toBeInTheDocument();
    });

    it('should display organizational measures', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Formation du personnel à la protection des données')).toBeInTheDocument();
      expect(screen.getByText('Procédures de gestion des incidents')).toBeInTheDocument();
      expect(screen.getByText('Audits de sécurité réguliers')).toBeInTheDocument();
    });
  });

  describe('Cookies Information', () => {
    it('should display cookie types', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText('Cookies techniques')).toBeInTheDocument();
      expect(screen.getByText('Cookies analytiques')).toBeInTheDocument();
      expect(screen.getByText('Cookies de préférences')).toBeInTheDocument();
    });

    it('should display cookie management information', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText(/configurer votre navigateur/)).toBeInTheDocument();
      expect(screen.getByText(/affecter le fonctionnement du site/)).toBeInTheDocument();
    });
  });

  describe('Data Transfer Information', () => {
    it('should mention data processing location', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText(/France et dans l'Union Européenne/)).toBeInTheDocument();
      expect(screen.getByText(/pays tiers/)).toBeInTheDocument();
      expect(screen.getByText(/garanties appropriées/)).toBeInTheDocument();
    });
  });

  describe('Policy Updates', () => {
    it('should mention policy updates', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText(/peut être mise à jour/)).toBeInTheDocument();
      expect(screen.getByText(/évolutions de nos pratiques/)).toBeInTheDocument();
      expect(screen.getByText(/changements législatifs/)).toBeInTheDocument();
      expect(screen.getByText(/notifiées par email/)).toBeInTheDocument();
    });
  });

  describe('Response Time', () => {
    it('should mention response time commitment', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText(/30 jours/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(PolitiqueConfidentialite);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Politique de Confidentialité');
      
      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBeGreaterThan(0);
    });

    it('should have proper button accessibility', () => {
      render(PolitiqueConfidentialite);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      expect(returnButton.closest('button')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta', () => {
    it('should have proper page title', () => {
      render(PolitiqueConfidentialite);
      
      expect(document.title).toBe('Politique de Confidentialité - Balades Argentiques');
    });

    it('should have proper meta description', () => {
      render(PolitiqueConfidentialite);
      
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toHaveAttribute('content', 'Politique de confidentialité et protection des données personnelles');
    });
  });

  describe('Date Information', () => {
    it('should display last updated date', () => {
      render(PolitiqueConfidentialite);
      
      const lastUpdated = screen.getByText(/Dernière mise à jour/);
      expect(lastUpdated).toBeInTheDocument();
      
      // Should contain current date
      const currentDate = new Date().toLocaleDateString('fr-FR');
      expect(lastUpdated).toHaveTextContent(currentDate);
    });
  });

  describe('GDPR Compliance', () => {
    it('should mention data protection rights', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getAllByText(/données personnelles/)).toHaveLength(3); // Multiple occurrences
      expect(screen.getByText(/protection des données/)).toBeInTheDocument();
      expect(screen.getByText(/Droit d'accès/)).toBeInTheDocument();
      expect(screen.getByText(/Droit de rectification/)).toBeInTheDocument();
      expect(screen.getByText(/Droit d'effacement/)).toBeInTheDocument();
    });

    it('should mention data controller responsibilities', () => {
      render(PolitiqueConfidentialite);
      
      expect(screen.getByText(/Responsable du traitement/)).toBeInTheDocument();
      expect(screen.getByText(/responsable du traitement/)).toBeInTheDocument();
    });
  });
});
