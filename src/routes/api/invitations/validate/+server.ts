import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invitationService } from '$lib/server/invitationService';
import { baladesService } from '$lib/server/baladesService';

// POST - Valider un code d'invitation
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { code, email } = await request.json();

    if (!code || typeof code !== 'string') {
      return json(
        { success: false, error: 'Code d\'invitation requis' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string') {
      return json(
        { success: false, error: 'Adresse email requise' },
        { status: 400 }
      );
    }

    // Valider le code avec l'email
    const validation = invitationService.isValidCodeWithEmail(code, email);
    
    if (!validation.valid) {
      return json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const invitation = validation.invitation!;
    
    // Vérifier qu'il n'y a pas déjà une réservation pour cet email sur cette balade
    const existingReservation = invitationService.hasExistingReservation(email, invitation.baladeId);
    if (existingReservation.hasReservation) {
      return json(
        { success: false, error: 'Vous avez déjà une réservation pour cette balade avec cette adresse email' },
        { status: 400 }
      );
    }
    
    const balade = baladesService.getBaladeById(invitation.baladeId);

    if (!balade) {
      return json(
        { success: false, error: 'Balade associée non trouvée' },
        { status: 404 }
      );
    }

    return json({
      success: true,
      invitation: {
        id: invitation.id,
        code: invitation.code,
        email: invitation.email,
        nombrePersonnes: invitation.nombrePersonnes,
        message: invitation.message
      },
      balade: {
        id: balade.id,
        theme: balade.theme,
        date: balade.date,
        heure: balade.heure,
        lieu: balade.lieu,
        prix: 'Gratuit (sur invitation)',
        placesDisponibles: balade.placesDisponibles,
        description: balade.description
      }
    });

  } catch (error) {
    console.error('Erreur lors de la validation du code d\'invitation:', error);
    return json(
      { success: false, error: 'Erreur lors de la validation du code' },
      { status: 500 }
    );
  }
};
