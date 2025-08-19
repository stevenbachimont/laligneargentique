import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { EmailService } from '$lib/server/emailService';
import { ValidationService } from '$lib/server/validationService';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { nom, prenom, email, message } = await request.json();

    // Validation côté serveur
    if (!nom || !prenom || !email || !message) {
      return json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    if (message.length < 10) {
      return json({ error: 'Le message doit contenir au moins 10 caractères' }, { status: 400 });
    }

    // Validation de l'email
    if (!ValidationService.isValidEmail(email)) {
      return json({ error: 'L\'adresse email n\'est pas valide' }, { status: 400 });
    }

    // Nettoyage des données
    const sanitizedData = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    };

    // Envoi de l'email via le service natif
    const emailService = new EmailService();
    await emailService.sendContactMessage(sanitizedData);

    return json({ 
      success: true, 
      message: 'Message envoyé avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    
    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes('Configuration email manquante')) {
        return json({ 
          error: 'Configuration du serveur email manquante. Veuillez contacter l\'administrateur.' 
        }, { status: 500 });
      }
      
      if (error.message.includes('Erreur lors de l\'envoi des emails')) {
        return json({ 
          error: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.' 
        }, { status: 500 });
      }
    }

    return json({ 
      error: 'Erreur interne du serveur. Veuillez réessayer plus tard.' 
    }, { status: 500 });
  }
}; 