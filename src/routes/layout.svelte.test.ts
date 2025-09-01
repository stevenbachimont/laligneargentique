import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Layout from './+layout.svelte';

describe('Layout Component', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000',
        pathname: '/'
      },
      writable: true
    });
  });

  describe('Basic Structure', () => {
    it('should render the main navigation menu', () => {
      render(Layout);
      
      expect(screen.getByText('Steven Bachimont')).toBeInTheDocument();
      expect(screen.getAllByText('Web')).toHaveLength(2); // Navigation + Footer
      expect(screen.getAllByText('Photographie')).toHaveLength(3); // Navigation + Footer + Partenaires
    });

    it('should render the footer', () => {
      render(Layout);
      
      expect(screen.getByText('Plan du site')).toBeInTheDocument();
      expect(screen.getByText('Partenaires')).toBeInTheDocument();
      expect(screen.getByText('Mentions légales')).toBeInTheDocument();
    });
  });

  describe('Mobile Menu', () => {
    it('should toggle mobile menu when hamburger is clicked', async () => {
      render(Layout);
      
      const menuButton = screen.getByLabelText('Menu');
      const nav = screen.getByRole('navigation');
      
      // Click hamburger to open menu
      fireEvent.click(menuButton);
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Menu should be open
      expect(nav).toHaveClass('open');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(Layout);
      
      const menuButton = screen.getByLabelText('Menu');
      expect(menuButton).toBeInTheDocument();
    });

    it('should have proper navigation role', () => {
      render(Layout);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });
});
