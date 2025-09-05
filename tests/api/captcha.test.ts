import { describe, it, expect } from 'vitest';
import { POST } from '../../src/routes/api/captcha/generate/+server';

describe('Captcha - Sécurité', () => {
  describe('Génération', () => {
    it('devrait générer un captcha', async () => {
      const response = await POST();
      const data = await response.json();
      
      expect(data.success).toBe(true);
      expect(data.captchaId).toBeDefined();
    });
  });
});