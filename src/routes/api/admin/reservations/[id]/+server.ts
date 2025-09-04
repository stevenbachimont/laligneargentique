import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';
import { withAdminSecurity } from '$lib/server/adminMiddleware';

async function handler({ params }: { params: { id: string } }) {
  try {
    const reservationId = parseInt(params.id);
    
    // Supprimer la réservation
    const success = baladesService.supprimerReservation(reservationId);

    if (success) {
      return json({
        success: true,
        message: 'Réservation supprimée avec succès'
      });
    } else {
      return json({
        success: false,
        error: 'Erreur lors de la suppression de la réservation'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    return json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

export const DELETE = withAdminSecurity(handler);
