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
    });

    it('should render the return button', () => {
      render(PolitiqueConfidentialite);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      expect(returnButton).toBeInTheDocument();
      expect(returnButton.closest('button')).toBeInTheDocument();
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

  describe('SEO and Meta', () => {
    it('should have proper page title', () => {
      render(PolitiqueConfidentialite);
      
      expect(document.title).toBe('Politique de Confidentialité - La Ligne Argentiques');
    });

    it('should have proper meta description', () => {
      render(PolitiqueConfidentialite);
      
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toHaveAttribute('content', 'Politique de confidentialité et protection des données personnelles');
    });
  });
});
