import { describe, it, expect, beforeEach } from 'vitest';
import { captchaService } from '../../src/lib/server/captchaService';

describe('CaptchaService', () => {
  beforeEach(() => {
    // Réinitialiser le service avant chaque test
    // Note: En production, on pourrait ajouter une méthode reset() au service
  });

  describe('generateCaptcha', () => {
    it('devrait générer un captcha avec tous les champs requis', () => {
      const captcha = captchaService.generateCaptcha();
      
      expect(captcha).toBeDefined();
      expect(captcha.id).toBeDefined();
      expect(captcha.imageUrl).toBeDefined();
      expect(captcha.targetPosition).toBeDefined();
      expect(captcha.tolerance).toBeDefined();
      expect(captcha.expiresAt).toBeDefined();
      expect(captcha.id.length).toBeGreaterThan(0);
      expect(captcha.imageUrl.length).toBeGreaterThan(0);
      expect(typeof captcha.targetPosition.x).toBe('number');
      expect(typeof captcha.targetPosition.y).toBe('number');
      expect(typeof captcha.tolerance).toBe('number');
      expect(captcha.targetPosition.x).toBeGreaterThanOrEqual(10);
      expect(captcha.targetPosition.x).toBeLessThanOrEqual(90);
      expect(captcha.targetPosition.y).toBeGreaterThanOrEqual(10);
      expect(captcha.targetPosition.y).toBeLessThanOrEqual(90);
      expect(captcha.tolerance).toBe(25);
    });

    it('devrait générer des URLs d\'images valides', () => {
      const captcha = captchaService.generateCaptcha();
      
      expect(captcha.imageUrl).toMatch(/^\/images\/captcha\/.+\.(png|jpg|jpeg)$/);
    });

    it('devrait générer des IDs uniques', () => {
      const captcha1 = captchaService.generateCaptcha();
      const captcha2 = captchaService.generateCaptcha();
      
      expect(captcha1.id).not.toBe(captcha2.id);
    });

    it('devrait générer des positions cibles dans la plage attendue', () => {
      const captcha = captchaService.generateCaptcha();
      
      expect(captcha.targetPosition.x).toBeGreaterThanOrEqual(10);
      expect(captcha.targetPosition.x).toBeLessThanOrEqual(90);
      expect(captcha.targetPosition.y).toBeGreaterThanOrEqual(10);
      expect(captcha.targetPosition.y).toBeLessThanOrEqual(90);
    });
  });

  describe('validateCaptcha', () => {
    it('devrait valider une position correcte', () => {
      const captcha = captchaService.generateCaptcha();
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify(captcha.targetPosition));
      
      expect(isValid).toBe(true);
    });

    it('devrait valider une position dans la tolérance', () => {
      const captcha = captchaService.generateCaptcha();
      const tolerancePosition = {
        x: captcha.targetPosition.x + 20, // Dans la tolérance de ±25
        y: captcha.targetPosition.y + 20
      };
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify(tolerancePosition));
      
      expect(isValid).toBe(true);
    });

    it('devrait rejeter une position hors tolérance', () => {
      const captcha = captchaService.generateCaptcha();
      const outOfTolerancePosition = {
        x: captcha.targetPosition.x + 30, // Hors tolérance
        y: captcha.targetPosition.y + 30
      };
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify(outOfTolerancePosition));
      
      expect(isValid).toBe(false);
    });

    it('devrait rejeter un ID de captcha invalide', () => {
      const isValid = captchaService.validateCaptcha('invalid-id', JSON.stringify({ x: 50, y: 50 }));
      
      expect(isValid).toBe(false);
    });

    it('devrait accepter une position sous forme de JSON string', () => {
      const captcha = captchaService.generateCaptcha();
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify(captcha.targetPosition));
      
      expect(isValid).toBe(true);
    });

    it('devrait rejeter une position invalide', () => {
      const captcha = captchaService.generateCaptcha();
      const isValid = captchaService.validateCaptcha(captcha.id, 'invalid-json');
      
      expect(isValid).toBe(false);
    });

    it('devrait rejeter une position sans coordonnées', () => {
      const captcha = captchaService.generateCaptcha();
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify({ x: 50 }));
      
      expect(isValid).toBe(false);
    });

    it('devrait supprimer le captcha après validation réussie', () => {
      const captcha = captchaService.generateCaptcha();
      
      // Première validation (devrait réussir)
      const isValid1 = captchaService.validateCaptcha(captcha.id, JSON.stringify(captcha.targetPosition));
      expect(isValid1).toBe(true);
      
      // Deuxième validation avec la même position (devrait échouer car supprimé)
      const isValid2 = captchaService.validateCaptcha(captcha.id, JSON.stringify(captcha.targetPosition));
      expect(isValid2).toBe(false);
    });
  });

  describe('getChallenge', () => {
    it('devrait retourner un défi valide', () => {
      const captcha = captchaService.generateCaptcha();
      const challenge = captchaService.getChallenge(captcha.id);
      
      expect(challenge).toBeDefined();
      expect(challenge?.id).toBe(captcha.id);
      expect(challenge?.imageUrl).toBe(captcha.imageUrl);
      expect(challenge?.targetPosition.x).toBe(captcha.targetPosition.x);
      expect(challenge?.targetPosition.y).toBe(captcha.targetPosition.y);
      expect(challenge?.tolerance).toBe(captcha.tolerance);
    });

    it('devrait retourner null pour un ID invalide', () => {
      const challenge = captchaService.getChallenge('invalid-id');
      
      expect(challenge).toBeNull();
    });
  });

  describe('Expiration', () => {
    it('devrait gérer l\'expiration des captchas', () => {
      // Créer un captcha avec une expiration dans le passé
      const captcha = captchaService.generateCaptcha();
      
      // Simuler l'expiration en modifiant la date
      const originalExpiresAt = captcha.expiresAt;
      captcha.expiresAt = new Date(Date.now() - 1000); // Expiré il y a 1 seconde
      
      // La validation devrait échouer
      const isValid = captchaService.validateCaptcha(captcha.id, JSON.stringify(captcha.targetPosition));
      expect(isValid).toBe(false);
      
      // Restaurer la date originale pour éviter les effets de bord
      captcha.expiresAt = originalExpiresAt;
    });
  });
});
