import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import MentionsLegales from './+page.svelte';

describe('Mentions Légales Page', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000/mentions-legales',
        pathname: '/mentions-legales'
      },
      writable: true
    });
  });

  describe('Page Structure', () => {
    it('should render the main page title', () => {
      render(MentionsLegales);
      
      expect(screen.getByText('Mentions Légales')).toBeInTheDocument();
    });

    it('should render the return button', () => {
      render(MentionsLegales);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      expect(returnButton).toBeInTheDocument();
      expect(returnButton.closest('button')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to home page when return button is clicked', () => {
      render(MentionsLegales);
      
      const returnButton = screen.getByText('← Retour à l\'accueil');
      fireEvent.click(returnButton);
      
      // Should redirect to home page
      expect(window.location.href).toBe('/');
    });
  });

  describe('SEO and Meta', () => {
    it('should have proper page title', () => {
      render(MentionsLegales);
      
      expect(document.title).toBe('Mentions Légales - Balades Argentiques');
    });

    it('should have proper meta description', () => {
      render(MentionsLegales);
      
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toHaveAttribute('content', 'Mentions légales du site stevenbachimont.com - Balades photographiques argentiques');
    });
  });
});
