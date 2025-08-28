import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../../src/routes/api/captcha/generate/+server';
import { POST as validatePOST } from '../../src/routes/api/captcha/validate/+server';
import { captchaService } from '../../src/lib/server/captchaService';

describe('Captcha API Endpoints', () => {
  describe('/api/captcha/generate', () => {
    it('devrait générer un nouveau captcha avec position cible', async () => {
      const response = await POST();
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.captchaId).toBeDefined();
      expect(data.imageUrl).toMatch(/^\/images\/captcha\/.+\.(png|jpg|jpeg|gif|webp)$/i);
      expect(data.targetPosition).toBeDefined();
      expect(typeof data.targetPosition.x).toBe('number');
      expect(typeof data.targetPosition.y).toBe('number');
    });

    it('devrait retourner une image dans un format supporté', async () => {
      const response = await POST();
      const data = await response.json();
      
      // Vérifier que l'image est dans un format supporté
      const supportedFormats = /\.(png|jpg|jpeg|gif|webp)$/i;
      expect(data.imageUrl).toMatch(supportedFormats);
    });
  });

  describe('/api/captcha/validate', () => {
    let captchaId: string;
    let targetPosition: { x: number; y: number };

    beforeEach(async () => {
      // Générer un nouveau captcha pour chaque test
      const generateResponse = await POST();
      const generateData = await generateResponse.json();
      captchaId = generateData.captchaId;
      targetPosition = generateData.targetPosition;
    });

    it('devrait valider une position correcte', async () => {
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          captchaId, 
          position: targetPosition 
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.valid).toBe(true);
      expect(data.type).toBe('sharpness');
    });

    it('devrait valider une position dans la tolérance', async () => {
      const tolerancePosition = { 
        x: targetPosition.x + 15, 
        y: targetPosition.y + 15 
      };

      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          captchaId, 
          position: tolerancePosition 
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.valid).toBe(true);
      expect(data.type).toBe('sharpness');
    });

    it('devrait rejeter une position hors tolérance', async () => {
      const outOfTolerancePosition = { 
        x: targetPosition.x + 25, 
        y: targetPosition.y + 25 
      };

      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          captchaId, 
          position: outOfTolerancePosition 
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.valid).toBe(false);
      expect(data.type).toBe('sharpness');
    });

    it('devrait rejeter une requête sans captchaId', async () => {
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          position: { x: 50, y: 50 } 
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(data.error).toBe('Captcha ID requis');
      expect(response.status).toBe(400);
    });

    it('devrait rejeter une requête sans position', async () => {
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          captchaId 
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(data.success).toBe(false);
      expect(data.error).toBe('Position requise');
      expect(response.status).toBe(400);
    });

    it('devrait rejeter un captchaId invalide', async () => {
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          captchaId: 'invalid-id', 
          position: { x: 50, y: 50 } 
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.valid).toBe(false);
      expect(data.type).toBe('sharpness');
    });
  });
});
