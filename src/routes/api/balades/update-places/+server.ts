import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesPrismaService } from '$lib/services/baladesPrismaService';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { baladeId, nombrePlaces, action } = await request.json();
    
    // Validation des paramètres selon l'action
    if (!action) {
      return json({ 
        error: 'Paramètre manquant: action est requis' 
      }, { status: 400 });
    }

    // Pour les actions autres que sync, nombrePlaces est requis
    if (action !== 'sync' && (!baladeId || !nombrePlaces)) {
      return json({ 
        error: 'Paramètres manquants: baladeId et nombrePlaces sont requis pour cette action' 
      }, { status: 400 });
    }

    let success = false;
    
    switch (action) {
      case 'reserver':
        success = await baladesPrismaService.reserverPlaces(baladeId, nombrePlaces);
        break;
      case 'annuler':
        success = await baladesPrismaService.annulerReservation(baladeId, nombrePlaces);
        break;
      case 'reinitialiser':
        success = await baladesPrismaService.reinitialiserPlaces(baladeId);
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
      const baladesMisesAJour = await baladesPrismaService.getBalades();
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
