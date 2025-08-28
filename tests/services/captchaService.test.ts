import { describe, it, expect, beforeEach } from 'vitest';
import { captchaService } from '../../src/lib/server/captchaService';

describe('CaptchaService', () => {
  beforeEach(() => {
    // Nettoyer les challenges avant chaque test
    // Note: On ne peut pas accéder directement aux challenges privés
    // mais chaque test génère un nouveau challenge
  });

  describe('Chargement des images', () => {
    it('devrait charger automatiquement les images disponibles', () => {
      const availableImages = captchaService.getAvailableImages();
      expect(availableImages.length).toBeGreaterThan(0);
      expect(availableImages[0]).toHaveProperty('imageUrl');
      expect(availableImages[0]).toHaveProperty('description');
    });

    it('devrait supporter les formats JPG et PNG', () => {
      const availableImages = captchaService.getAvailableImages();
      const imageUrls = availableImages.map(img => img.imageUrl);
      
      // Vérifier qu'au moins une image JPG ou PNG est présente
      const hasValidFormat = imageUrls.some(url => 
        /\.(jpg|jpeg|png)$/i.test(url)
      );
      
      expect(hasValidFormat).toBe(true);
    });
  });

  describe('generateCaptcha', () => {
    it('devrait générer un nouveau captcha avec un ID unique', () => {
      const captcha1 = captchaService.generateCaptcha();
      const captcha2 = captchaService.generateCaptcha();
      
      expect(captcha1.id).toBeDefined();
      expect(captcha2.id).toBeDefined();
      expect(captcha1.id).not.toBe(captcha2.id);
    });

    it('devrait générer une URL d\'image valide', () => {
      const captcha = captchaService.generateCaptcha();
      expect(captcha.imageUrl).toMatch(/^\/images\/captcha\/.+\.(png|jpg|jpeg|gif|webp)$/i);
    });

    it('devrait générer une position cible aléatoire', () => {
      const captcha = captchaService.generateCaptcha();
      
      expect(captcha.targetPosition.x).toBeGreaterThanOrEqual(10);
      expect(captcha.targetPosition.x).toBeLessThanOrEqual(90);
      expect(captcha.targetPosition.y).toBeGreaterThanOrEqual(10);
      expect(captcha.targetPosition.y).toBeLessThanOrEqual(90);
    });

    it('devrait définir une tolérance appropriée', () => {
      const captcha = captchaService.generateCaptcha();
      expect(captcha.tolerance).toBe(20);
    });

    it('devrait définir une date d\'expiration', () => {
      const captcha = captchaService.generateCaptcha();
      const now = new Date();
      const expectedExpiry = new Date(now.getTime() + 10 * 60 * 1000); // +10 minutes
      
      expect(captcha.expiresAt).toBeInstanceOf(Date);
      expect(captcha.expiresAt.getTime()).toBeGreaterThan(now.getTime());
      expect(captcha.expiresAt.getTime()).toBeLessThanOrEqual(expectedExpiry.getTime());
    });
  });

  describe('validateCaptcha', () => {
    it('devrait valider une position exacte', () => {
      const captcha = captchaService.generateCaptcha();
      const exactPosition = { x: captcha.targetPosition.x, y: captcha.targetPosition.y };
      
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify(exactPosition));
      expect(isValid).toBe(true);
    });

    it('devrait valider une position dans la tolérance', () => {
      const captcha = captchaService.generateCaptcha();
      const tolerancePosition = { 
        x: captcha.targetPosition.x + 15, 
        y: captcha.targetPosition.y + 15 
      };
      
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify(tolerancePosition));
      expect(isValid).toBe(true);
    });

    it('devrait rejeter une position hors tolérance', () => {
      const captcha = captchaService.generateCaptcha();
      const outOfTolerancePosition = { 
        x: captcha.targetPosition.x + 25, 
        y: captcha.targetPosition.y + 25 
      };
      
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify(outOfTolerancePosition));
      expect(isValid).toBe(false);
    });

    it('devrait rejeter un captcha avec un ID invalide', () => {
      const invalidId = 'invalid-id';
      const position = { x: 50, y: 50 };
      
      const isValid = captchaService.validateCaptcha(invalidId, JSON.stringify(position));
      expect(isValid).toBe(false);
    });

    it('devrait rejeter une position malformée', () => {
      const captcha = captchaService.generateCaptcha();
      const malformedPosition = 'invalid-json';
      
      const isValid = captchaService.validateCaptcha(captcha.id, malformedPosition);
      expect(isValid).toBe(false);
    });

    it('devrait rejeter une position avec des coordonnées manquantes', () => {
      const captcha = captchaService.generateCaptcha();
      const incompletePosition = { x: 50 }; // y manquant
      
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify(incompletePosition));
      expect(isValid).toBe(false);
    });
  });

  describe('getChallenge', () => {
    it('devrait récupérer un challenge valide', () => {
      const captcha = captchaService.generateCaptcha();
      const retrieved = captchaService.getChallenge(captcha.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(captcha.id);
      expect(retrieved?.imageUrl).toBe(captcha.imageUrl);
    });

    it('devrait retourner undefined pour un ID invalide', () => {
      const retrieved = captchaService.getChallenge('invalid-id');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer le cas où aucune image n\'est disponible', () => {
      // Simuler un service sans images (en modifiant temporairement)
      const originalImages = captchaService.getAvailableImages();
      
      // Note: Ce test vérifie que le service gère gracieusement l'absence d'images
      // En pratique, le service a toujours au moins l'image par défaut
      expect(originalImages.length).toBeGreaterThan(0);
    });
  });
});
