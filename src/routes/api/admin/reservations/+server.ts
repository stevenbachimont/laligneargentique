import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';

export const GET: RequestHandler = async () => {
  try {
    const reservations = baladesService.getAllReservations();
    
    return json({
      success: true,
      reservations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return json({
      success: false,
      error: 'Erreur lors de la récupération des réservations'
    }, { status: 500 });
  }
};
