import { json } from '@sveltejs/kit';
import { captchaService } from '$lib/server/captchaService';

export async function POST({ request }) {
  try {
    const { captchaId, position } = await request.json();
    
    if (!captchaId || !position) {
      return json({
        success: false,
        error: 'Captcha ID et position requis'
      }, { status: 400 });
    }

    const isValid = captchaService.validateCaptcha(captchaId, JSON.stringify(position));
    
    return json({
      success: true,
      valid: isValid
    });
  } catch (error) {
    console.error('Erreur lors de la validation du captcha:', error);
    return json({
      success: false,
      error: 'Erreur lors de la validation du captcha'
    }, { status: 500 });
  }
}
