import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';
import { EmailService } from '$lib/server/emailService';
import { ValidationService } from '$lib/server/validationService';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validation des données requises
    const { baladeId, prenom, nom, email, nombrePersonnes, message } = data;
    
    if (!baladeId || !prenom || !nom || !email || !nombrePersonnes) {
      return json({
        success: false,
        error: 'Données manquantes pour la réservation'
      }, { status: 400 });
    }

    // Validation de l'email
    if (!ValidationService.isValidEmail(email)) {
      return json({
        success: false,
        error: 'Adresse email invalide'
      }, { status: 400 });
    }

    // Vérifier si la balade existe et a des places disponibles
    if (!baladesService.hasPlacesAvailable(baladeId, nombrePersonnes)) {
      return json({
        success: false,
        error: 'Pas assez de places disponibles pour cette balade'
      }, { status: 400 });
    }

    // Créer la réservation
    const success = baladesService.creerReservation({
      baladeId,
      prenom,
      nom,
      email,
      nombrePersonnes,
      message
    });

    if (!success) {
      return json({
        success: false,
        error: 'Erreur lors de la création de la réservation'
      }, { status: 500 });
    }

    // Récupérer les détails de la balade pour l'email
    const balade = baladesService.getBaladeById(baladeId);
    if (!balade) {
      return json({
        success: false,
        error: 'Balade non trouvée'
      }, { status: 404 });
    }

    // Envoyer l'email de confirmation
    try {
      const emailService = new EmailService();
      await emailService.sendArgentiqueReservation({
        nom,
        prenom,
        email,
        telephone: '',
        dateSouhaitee: balade.date,
        nombrePersonnes,
        message: message || `Réservation pour la balade "${balade.theme}" le ${balade.date} à ${balade.heure} au ${balade.lieu}`
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // On continue même si l'email échoue
    }

    return json({
      success: true,
      message: 'Réservation créée avec succès',
      balade: {
        theme: balade.theme,
        date: balade.date,
        heure: balade.heure,
        lieu: balade.lieu
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    return json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
};
