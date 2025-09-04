import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';
import { withAdminSecurity } from '$lib/server/adminMiddleware';

async function handler({ request }: { request: Request }) {
  try {
    const { reservationId, present } = await request.json();
    
    if (typeof reservationId !== 'number' || typeof present !== 'boolean') {
      return json({
        success: false,
        error: 'Paramètres invalides'
      }, { status: 400 });
    }

    // Mettre à jour la présence dans la base de données
    const success = baladesService.updatePresence(reservationId, present);
    
    if (success) {
      return json({
        success: true,
        message: `Présence mise à jour pour la réservation ${reservationId}`
      });
    } else {
      return json({
        success: false,
        error: 'Erreur lors de la mise à jour de la présence'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la présence:', error);
    return json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

export const POST = withAdminSecurity(handler);
