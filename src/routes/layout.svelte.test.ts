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

  describe('Menu Structure', () => {
    it('should render the main navigation menu', () => {
      render(Layout);
      
      expect(screen.getByText('Web')).toBeInTheDocument();
      expect(screen.getByText('Photographie')).toBeInTheDocument();
      expect(screen.getByText('A propos')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render the logo with correct link', () => {
      render(Layout);
      
      const logo = screen.getByText('Steven Bachimont');
      expect(logo).toBeInTheDocument();
      expect(logo.closest('a')).toHaveAttribute('href', '/');
    });
  });

  describe('Dropdown Menus', () => {
    it('should show Web dropdown menu on hover', async () => {
      render(Layout);
      
      const webLink = screen.getByText('Web');
      fireEvent.mouseEnter(webLink);
      
      // Wait for dropdown to appear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(screen.getByText('Portfolio Web')).toBeInTheDocument();
      expect(screen.getByText('Outils & Technologies')).toBeInTheDocument();
    });

    it('should show Photographie dropdown menu on hover', async () => {
      render(Layout);
      
      const photoLink = screen.getByText('Photographie');
      fireEvent.mouseEnter(photoLink);
      
      // Wait for dropdown to appear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(screen.getByText('La Ligne Argentiques')).toBeInTheDocument();
      expect(screen.getByText('Galerie Photos')).toBeInTheDocument();
    });

    it('should hide dropdown menu when mouse leaves', async () => {
      render(Layout);
      
      const webLink = screen.getByText('Web');
      fireEvent.mouseEnter(webLink);
      
      // Wait for dropdown to appear
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(screen.getByText('Portfolio Web')).toBeInTheDocument();
      
      fireEvent.mouseLeave(webLink);
      
      // Wait for dropdown to disappear
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // The dropdown should be hidden (not visible)
      const portfolioWeb = screen.queryByText('Portfolio Web');
      expect(portfolioWeb).toBeInTheDocument(); // Element still in DOM
      expect(portfolioWeb?.closest('.dropdown')).not.toHaveClass('active'); // But not active
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href attributes for main menu items', () => {
      render(Layout);
      
      const webLink = screen.getByText('Web').closest('a');
      const photoLink = screen.getByText('Photographie').closest('a');
      const aboutLink = screen.getByText('A propos').closest('a');
      const contactLink = screen.getByText('Contact').closest('a');
      
      expect(webLink).toHaveAttribute('href', '/web');
      expect(photoLink).toHaveAttribute('href', '/photographie');
      expect(aboutLink).toHaveAttribute('href', '/#about-section');
      expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('should have correct href attributes for dropdown items', async () => {
      render(Layout);
      
      const webLink = screen.getByText('Web');
      fireEvent.mouseEnter(webLink);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const portfolioWebLink = screen.getByText('Portfolio Web').closest('a');
      const outilsLink = screen.getByText('Outils & Technologies').closest('a');
      
      expect(portfolioWebLink).toHaveAttribute('href', '/web/portfolioWeb');
      expect(outilsLink).toHaveAttribute('href', '/web/outils');
    });

    it('should have correct href attributes for photography dropdown items', async () => {
      render(Layout);
      
      const photoLink = screen.getByText('Photographie');
      fireEvent.mouseEnter(photoLink);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const baladesLink = screen.getByText('La Ligne Argentiques').closest('a');
      const galerieLink = screen.getByText('Galerie Photos').closest('a');
      
      expect(baladesLink).toHaveAttribute('href', '/photographie/argentique');
      expect(galerieLink).toHaveAttribute('href', '/photographie/portfolioPhoto');
    });
  });

  describe('Mobile Menu', () => {
    it('should show hamburger menu button on mobile', () => {
      render(Layout);
      
      const menuButton = screen.getByLabelText('Menu');
      expect(menuButton).toBeInTheDocument();
    });

    it('should toggle mobile menu when hamburger is clicked', async () => {
      render(Layout);
      
      const menuButton = screen.getByLabelText('Menu');
      const nav = screen.getByRole('navigation');
      const hamburger = menuButton.querySelector('.hamburger');
      
      // Menu should be closed initially
      expect(nav).not.toHaveClass('open');
      expect(hamburger).not.toHaveClass('open');
      
      // Click hamburger to open menu
      fireEvent.click(menuButton);
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Menu should be open
      expect(nav).toHaveClass('open');
      expect(hamburger).toHaveClass('open');
      
      // Click hamburger again to close menu
      fireEvent.click(menuButton);
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Menu should be closed
      expect(nav).not.toHaveClass('open');
      expect(hamburger).not.toHaveClass('open');
    });

    it('should close mobile menu when a link is clicked', async () => {
      render(Layout);
      
      const menuButton = screen.getByLabelText('Menu');
      const nav = screen.getByRole('navigation');
      const hamburger = menuButton.querySelector('.hamburger');
      
      // Open mobile menu
      fireEvent.click(menuButton);
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(nav).toHaveClass('open');
      expect(hamburger).toHaveClass('open');
      
      // Click a link
      const contactLink = screen.getByText('Contact');
      fireEvent.click(contactLink);
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Menu should be closed
      expect(nav).not.toHaveClass('open');
      expect(hamburger).not.toHaveClass('open');
    });
  });

  describe('Dropdown State Management', () => {
    it('should only show one dropdown at a time', async () => {
      render(Layout);
      
      const webLink = screen.getByText('Web');
      const photoLink = screen.getByText('Photographie');
      
      // Hover over Web
      fireEvent.mouseEnter(webLink);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(screen.getByText('Portfolio Web')).toBeInTheDocument();
      
      // Hover over Photographie
      fireEvent.mouseEnter(photoLink);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Web dropdown should be hidden, photo dropdown should be visible
      expect(screen.queryByText('Portfolio Web')?.closest('.dropdown')).not.toHaveClass('active');
      expect(screen.getByText('La Ligne Argentiques')).toBeInTheDocument();
    });

    it('should maintain dropdown open when hovering over dropdown content', async () => {
      render(Layout);
      
      const webLink = screen.getByText('Web');
      fireEvent.mouseEnter(webLink);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(screen.getByText('Portfolio Web')).toBeInTheDocument();
      
      // Hover over dropdown content
      const portfolioWeb = screen.getByText('Portfolio Web');
      fireEvent.mouseEnter(portfolioWeb);
      
      // Dropdown should still be visible
      expect(screen.getByText('Portfolio Web')).toBeInTheDocument();
      expect(screen.getByText('Outils & Technologies')).toBeInTheDocument();
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

    it('should have proper link elements', () => {
      render(Layout);
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes for dropdown states', async () => {
      render(Layout);
      
      const webLink = screen.getByText('Web');
      const dropdownContainer = webLink.closest('.dropdown-container');
      const dropdown = dropdownContainer?.querySelector('.dropdown');
      
      expect(dropdown).toHaveClass('dropdown');
      expect(dropdown).not.toHaveClass('active');
      
      // Hover to activate dropdown
      fireEvent.mouseEnter(webLink);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(dropdown).toHaveClass('active');
    });

    it('should apply correct CSS classes for mobile menu states', async () => {
      render(Layout);
      
      const nav = screen.getByRole('navigation');
      const menuButton = screen.getByLabelText('Menu');
      const hamburger = menuButton.querySelector('.hamburger');
      
      // Initial state
      expect(nav).not.toHaveClass('open');
      expect(hamburger).not.toHaveClass('open');
      
      // Click to open
      fireEvent.click(menuButton);
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(nav).toHaveClass('open');
      expect(hamburger).toHaveClass('open');
    });
  });

  describe('Event Handling', () => {
    it('should handle mouse events correctly', async () => {
      render(Layout);
      
      const webLink = screen.getByText('Web');
      
      // Test mouse enter
      fireEvent.mouseEnter(webLink);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(screen.getByText('Portfolio Web')).toBeInTheDocument();
      
      // Test mouse leave
      fireEvent.mouseLeave(webLink);
      await new Promise(resolve => setTimeout(resolve, 300));
      expect(screen.queryByText('Portfolio Web')?.closest('.dropdown')).not.toHaveClass('active');
    });

    it('should handle click events correctly', () => {
      render(Layout);
      
      const contactLink = screen.getByText('Contact');
      const menuButton = screen.getByLabelText('Menu');
      
      // Open mobile menu
      fireEvent.click(menuButton);
      
      // Click contact link
      fireEvent.click(contactLink);
      
      // Menu should be closed
      const nav = screen.getByRole('navigation');
      expect(nav).not.toHaveClass('open');
    });
  });
});
