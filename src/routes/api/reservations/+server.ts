import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesPrismaService } from '$lib/services/baladesPrismaService';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const reservationData = await request.json();
    
    // Validation des données requises
    const { baladeId, prenom, nom, email, nombrePersonnes, message } = reservationData;
    
    if (!baladeId || !prenom || !nom || !email || !nombrePersonnes || !message) {
      return json({
        success: false,
        error: 'Données manquantes pour la réservation'
      }, { status: 400 });
    }

    // Créer la réservation
    const success = await baladesPrismaService.creerReservation(reservationData);
    
    if (success) {
      // Mettre à jour les places disponibles
      await baladesPrismaService.reserverPlaces(baladeId, nombrePersonnes);
      
      return json({
        success: true,
        message: 'Réservation créée avec succès'
      });
    } else {
      return json({
        success: false,
        error: 'Échec de la création de la réservation'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Erreur lors de la création de la réservation:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la création de la réservation'
    }, { status: 500 });
  }
};
