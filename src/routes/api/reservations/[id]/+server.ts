import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const reservationId = parseInt(params.id);
    
    if (isNaN(reservationId)) {
      return json({ error: 'ID de réservation invalide' }, { status: 400 });
    }

    const reservation = baladesService.getReservationById(reservationId);
    
    if (!reservation) {
      return json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    // Récupérer les détails de la balade
    const balade = baladesService.getBaladeById(reservation.baladeId);
    
    if (!balade) {
      return json({ error: 'Balade non trouvée' }, { status: 404 });
    }

    // Formater la réponse
    const response = {
      id: reservation.id,
      balade: {
        theme: balade.theme,
        date: balade.date,
        heure: balade.heure,
        lieu: balade.lieu
      },
      participant: {
        nom: reservation.nom,
        prenom: reservation.prenom || '',
        email: reservation.email
      },
      nombrePersonnes: reservation.nombrePersonnes || 1,
      montant: reservation.montant ? `${(reservation.montant / 100).toFixed(2)}€` : '0.00€',
      statut: reservation.statut || 'confirmée',
      paymentIntentId: reservation.paymentIntentId
    };

    return json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    return json({ error: 'Erreur serveur' }, { status: 500 });
  }
};
