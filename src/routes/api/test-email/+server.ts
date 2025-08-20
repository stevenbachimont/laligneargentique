import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EmailService } from '$lib/server/emailService';

export const GET: RequestHandler = async () => {
  try {
    const emailService = new EmailService();
    
    // Test de la connexion
    const isConnected = await emailService.verifyConnection();
    
    if (!isConnected) {
      return json({ 
        success: false, 
        error: 'Impossible de se connecter au serveur email',
        config: {
          hasEmailUser: !!process.env.EMAIL_USER,
          hasEmailPassword: !!process.env.EMAIL_APP_PASSWORD,
          hasSmtpHost: !!process.env.SMTP_HOST,
          hasSmtpUser: !!process.env.SMTP_USER,
          hasSmtpPass: !!process.env.SMTP_PASS
        }
      }, { status: 500 });
    }

    return json({ 
      success: true, 
      message: 'Configuration email valide',
      config: {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPassword: !!process.env.EMAIL_APP_PASSWORD,
        hasSmtpHost: !!process.env.SMTP_HOST,
        hasSmtpUser: !!process.env.SMTP_USER,
        hasSmtpPass: !!process.env.SMTP_PASS,
        adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER
      }
    });

  } catch (error) {
    console.error('Erreur lors du test de configuration email:', error);
    
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      config: {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPassword: !!process.env.EMAIL_APP_PASSWORD,
        hasSmtpHost: !!process.env.SMTP_HOST,
        hasSmtpUser: !!process.env.SMTP_USER,
        hasSmtpPass: !!process.env.SMTP_PASS
      }
    }, { status: 500 });
  }
};
