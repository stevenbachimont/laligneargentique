import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../../src/routes/api/captcha/generate/+server';
import { POST as validatePOST } from '../../src/routes/api/captcha/validate/+server';
import { captchaService } from '../../src/lib/server/captchaService';

describe('Captcha API Endpoints', () => {
  describe('/api/captcha/generate', () => {
    it('devrait générer un nouveau captcha', async () => {
      const response = await POST();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.captchaId).toBeDefined();
      expect(data.imageUrl).toBeDefined();
      expect(data.captchaId.length).toBeGreaterThan(0);
      expect(data.imageUrl).toMatch(/^\/images\/captcha\/.+\.(png|jpg|jpeg)$/);
    });

    it('devrait gérer les erreurs de génération', async () => {
      // Simuler une erreur en modifiant temporairement le service
      const originalGenerate = captchaService.generateCaptcha;
      captchaService.generateCaptcha = () => {
        throw new Error('Erreur de génération');
      };

      const response = await POST();
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();

      // Restaurer la méthode originale
      captchaService.generateCaptcha = originalGenerate;
    });
  });

  describe('/api/captcha/validate', () => {
    let captchaId: string;
    let targetSharpness: number;

    beforeEach(async () => {
      // Générer un captcha pour les tests
      const generateResponse = await POST();
      const generateData = await generateResponse.json();
      captchaId = generateData.captchaId;
      
      // Récupérer la valeur cible
      const challenge = captchaService.getChallenge(captchaId);
      targetSharpness = challenge?.targetSharpness || 75;
    });

    it('devrait valider une réponse correcte', async () => {
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          captchaId,
          sharpness: targetSharpness.toString()
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.valid).toBe(true);
    });

    it('devrait valider une réponse dans la tolérance', async () => {
      const toleranceValue = targetSharpness + 5; // Dans la tolérance de ±25
      
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          captchaId,
          sharpness: toleranceValue.toString()
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.valid).toBe(true);
    });

    it('devrait rejeter une réponse hors tolérance', async () => {
      const outOfToleranceValue = targetSharpness + 25; // Hors tolérance
      
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          captchaId,
          sharpness: outOfToleranceValue.toString()
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.valid).toBe(false);
    });

    it('devrait rejeter un ID de captcha invalide', async () => {
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          captchaId: 'invalid-id',
          sharpness: '75'
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.valid).toBe(false);
    });

    it('devrait rejeter une requête sans captchaId', async () => {
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sharpness: '75'
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Captcha ID et valeur de netteté requis');
    });

    it('devrait rejeter une requête sans sharpness', async () => {
      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          captchaId: 'some-id'
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Captcha ID et valeur de netteté requis');
    });

    it('devrait gérer les erreurs de validation', async () => {
      // Simuler une erreur en modifiant temporairement le service
      const originalValidate = captchaService.validateCaptcha;
      captchaService.validateCaptcha = () => {
        throw new Error('Erreur de validation');
      };

      const request = new Request('http://localhost/api/captcha/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          captchaId,
          sharpness: '75'
        })
      });

      const response = await validatePOST({ request });
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();

      // Restaurer la méthode originale
      captchaService.validateCaptcha = originalValidate;
    });
  });
});
