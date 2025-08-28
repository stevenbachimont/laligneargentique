import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';

export const GET: RequestHandler = async () => {
  try {
    // Récupérer toutes les réservations
    const reservations = baladesService.getAllReservations();
    
    // Filtrer les réservations en attente
    const reservationsEnAttente = reservations.filter(r => r.statut === 'en_attente');
    
    // Ajouter les détails de la balade pour chaque réservation
    const reservationsAvecDetails = reservationsEnAttente.map(reservation => {
      const balade = baladesService.getBaladeById(reservation.baladeId);
      return {
        ...reservation,
        balade: balade ? {
          id: balade.id,
          theme: balade.theme,
          date: balade.date,
          heure: balade.heure,
          lieu: balade.lieu,
          placesDisponibles: balade.placesDisponibles
        } : null
      };
    });

    return json({
      success: true,
      reservations: reservationsAvecDetails,
      total: reservationsEnAttente.length
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations en attente:', error);
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      reservations: [],
      total: 0
    }, { status: 500 });
  }
};
