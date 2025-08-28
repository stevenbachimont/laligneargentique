import { json } from '@sveltejs/kit';
import { captchaService } from '$lib/server/captchaService';

export async function POST() {
  try {
    const challenge = captchaService.generateCaptcha();
    
    return json({
      success: true,
      captchaId: challenge.id,
      imageUrl: challenge.imageUrl,
      targetPosition: challenge.targetPosition
    });
  } catch (error) {
    console.error('Erreur lors de la génération du captcha:', error);
    
    return json({
      success: false,
      error: 'Erreur interne du serveur lors de la génération du captcha'
    }, { status: 500 });
  }
}
