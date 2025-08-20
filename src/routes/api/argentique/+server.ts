import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EmailService } from '$lib/server/emailService';
import { ValidationService } from '$lib/server/validationService';
import type { EmailData } from '$lib/server/types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data: EmailData = await request.json();

    // Validation des données
    const validation = ValidationService.validateArgentiqueReservation(data);
    if (!validation.isValid) {
      return json({ 
        error: 'Données invalides', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Nettoyage des données
    const sanitizedData = ValidationService.sanitizeData(data);

    // Envoi des emails
    const emailService = new EmailService();
    await emailService.sendArgentiqueReservation(sanitizedData);

    return json({ 
      success: true, 
      message: 'Réservation envoyée avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande argentique:', error);
    
    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes('Configuration email manquante')) {
        return json({ 
          error: 'Configuration du serveur email manquante. Veuillez contacter l\'administrateur.' 
        }, { status: 500 });
      }
      
      if (error.message.includes('Erreur lors de l\'envoi des emails')) {
        return json({ 
          error: 'Erreur lors de l\'envoi des emails. Veuillez réessayer plus tard.' 
        }, { status: 500 });
      }
    }

    return json({ 
      error: 'Erreur interne du serveur. Veuillez réessayer plus tard.' 
    }, { status: 500 });
  }
}; 