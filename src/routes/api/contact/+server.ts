import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY } from '$env/static/private';

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

    // Envoi via EmailJS côté serveur
    const emailjs = await import('emailjs-com');
    
    const result = await emailjs.default.send(
      VITE_EMAILJS_SERVICE_ID,
      VITE_EMAILJS_TEMPLATE_ID,
      {
        nom,
        prenom,
        email,
        message
      },
      VITE_EMAILJS_PUBLIC_KEY
    );

    return json({ success: true, result });
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    return json({ error: 'Erreur lors de l\'envoi du message' }, { status: 500 });
  }
}; 