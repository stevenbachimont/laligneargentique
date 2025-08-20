import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/services/baladesService';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { baladeId, nombrePlaces, action } = await request.json();
    
    if (!baladeId || !nombrePlaces || !action) {
      return json({ 
        error: 'Paramètres manquants: baladeId, nombrePlaces et action sont requis' 
      }, { status: 400 });
    }

    let success = false;
    
    switch (action) {
      case 'reserver':
        success = await baladesService.reserverPlaces(baladeId, nombrePlaces);
        break;
      case 'annuler':
        success = await baladesService.annulerReservation(baladeId, nombrePlaces);
        break;
      case 'reinitialiser':
        success = await baladesService.reinitialiserPlaces(baladeId);
        break;
      case 'sync':
        // Pour la synchronisation, on renvoie juste les données actuelles
        success = true;
        break;
      default:
        return json({ 
          error: 'Action non reconnue. Actions valides: reserver, annuler, reinitialiser, sync' 
        }, { status: 400 });
    }

    if (success) {
      // Récupérer les balades mises à jour pour les renvoyer au client
      const baladesMisesAJour = baladesService.getBalades();
      return json({ 
        success: true, 
        message: `Places mises à jour avec succès pour la balade ${baladeId}`,
        balades: baladesMisesAJour
      });
    } else {
      return json({ 
        error: 'Échec de la mise à jour des places' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des places:', error);
    return json({ 
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour des places' 
    }, { status: 500 });
  }
};
