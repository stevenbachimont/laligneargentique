import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EmailService } from '$lib/server/emailService';
import { ValidationService } from '$lib/server/validationService';

interface ContactData {
  nom: string;
  prenom: string;
  email: string;
  message: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data: ContactData = await request.json();

    // Validation des données
    const errors: string[] = [];
    
    if (!data.nom || data.nom.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }
    
    if (!data.prenom || data.prenom.trim().length < 2) {
      errors.push('Le prénom doit contenir au moins 2 caractères');
    }
    
    if (!data.email || !ValidationService.isValidEmail(data.email)) {
      errors.push('L\'adresse email n\'est pas valide');
    }
    
    if (!data.message || data.message.trim().length < 10) {
      errors.push('Le message doit contenir au moins 10 caractères');
    }

    if (errors.length > 0) {
      return json({ 
        error: 'Données invalides', 
        details: errors 
      }, { status: 400 });
    }

    // Nettoyage des données
    const sanitizedData = {
      nom: data.nom.trim(),
      prenom: data.prenom.trim(),
      email: data.email.trim().toLowerCase(),
      message: data.message.trim()
    };

    // Envoi des emails
    const emailService = new EmailService();
    await emailService.sendContactMessage(sanitizedData);

    return json({ 
      success: true, 
      message: 'Message envoyé avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message de contact:', error);
    
    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes('Configuration email manquante')) {
        return json({ 
          error: 'Configuration du serveur email manquante. Veuillez contacter l\'administrateur.' 
        }, { status: 500 });
      }
      
      if (error.message.includes('Erreur lors de l\'envoi des emails')) {
        return json({ 
          error: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.' 
        }, { status: 500 });
      }
    }

    return json({ 
      error: 'Erreur interne du serveur. Veuillez réessayer plus tard.' 
    }, { status: 500 });
  }
}; 