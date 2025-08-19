import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EmailService } from '$lib/server/emailService';

interface QuestionData {
  reservationData: any;
  question: string;
  clientEmail: string;
  clientName: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data: QuestionData = await request.json();
    
    console.log('❓ Question reçue pour la réservation:', data);

    // Envoi de l'email avec la question
    const emailService = new EmailService();
    await emailService.sendReservationQuestion(data);

    return json({ 
      success: true, 
      message: 'Votre question a été envoyée avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la question:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Configuration email manquante')) {
        return json({ 
          error: 'Configuration du serveur email manquante. Veuillez contacter l\'administrateur.' 
        }, { status: 500 });
      }
      
      if (error.message.includes('Erreur lors de l\'envoi des emails')) {
        return json({ 
          error: 'Erreur lors de l\'envoi de votre question. Veuillez réessayer plus tard.' 
        }, { status: 500 });
      }
    }

    return json({ 
      error: 'Erreur interne du serveur. Veuillez réessayer plus tard.' 
    }, { status: 500 });
  }
};
