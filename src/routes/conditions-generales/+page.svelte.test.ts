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
    });

    it('should render the return button', () => {
      render(ConditionsGenerales);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      expect(returnButton).toBeInTheDocument();
      expect(returnButton.closest('button')).toBeInTheDocument();
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

  describe('SEO and Meta', () => {
    it('should have proper page title', () => {
      render(ConditionsGenerales);
      
      expect(document.title).toBe('Conditions Générales de Vente - Balades Argentiques');
    });

    it('should have proper meta description', () => {
      render(ConditionsGenerales);
      
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toHaveAttribute('content', 'Conditions générales de vente pour les balades photographiques argentiques');
    });
  });
});
