import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { nom, prenom, email, telephone, dateSouhaitee, nombrePersonnes, message } = await request.json();

    // Validation côté serveur
    if (!nom || !prenom || !email || !dateSouhaitee || !nombrePersonnes) {
      return json({ error: 'Les champs nom, prénom, email, date souhaitée et nombre de personnes sont requis' }, { status: 400 });
    }

    if (nombrePersonnes < 1 || nombrePersonnes > 5) {
      return json({ error: 'Le nombre de personnes doit être entre 1 et 5' }, { status: 400 });
    }

    // Envoi via l'API EmailJS directement
    const response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: VITE_EMAILJS_SERVICE_ID,
        template_id: VITE_EMAILJS_TEMPLATE_ID,
        user_id: VITE_EMAILJS_PUBLIC_KEY,
        template_params: {
          nom,
          prenom,
          email,
          telephone: telephone || 'Non renseigné',
          dateSouhaitee,
          nombrePersonnes,
          message: message || 'Aucun message',
          type: 'Demande de balade argentique'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`EmailJS API error: ${response.status}`);
    }

    const result = await response.json();
    return json({ success: true, result });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande argentique:', error);
    return json({ error: 'Erreur lors de l\'envoi de la demande' }, { status: 500 });
  }
}; 