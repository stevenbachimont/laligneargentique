import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// Variables d'environnement EmailJS avec valeurs par défaut
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service_id';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template_id';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key';

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

    // Envoi via l'API EmailJS directement
    const response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          nom,
          prenom,
          email,
          message
        }
      })
    });

    if (!response.ok) {
      throw new Error(`EmailJS API error: ${response.status}`);
    }

    const result = await response.json();
    return json({ success: true, result });
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    return json({ error: 'Erreur lors de l\'envoi du message' }, { status: 500 });
  }
}; 