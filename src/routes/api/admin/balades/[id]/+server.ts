import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';
import { withAdminSecurity } from '$lib/server/adminMiddleware';

async function putHandler({ params, request }: { params: { id: string }; request: Request }) {
  try {
    const baladeId = parseInt(params.id);
    const baladeData = await request.json();
    
    // Validation des données
    if (!baladeData.theme || !baladeData.date || !baladeData.heure || !baladeData.lieu || !baladeData.prix || !baladeData.description) {
      return json({
        success: false,
        error: 'Tous les champs sont obligatoires'
      }, { status: 400 });
    }

    // Vérifier que la balade existe
    const existingBalade = baladesService.getBaladeById(baladeId);
    if (!existingBalade) {
      return json({
        success: false,
        error: 'Balade non trouvée'
      }, { status: 404 });
    }

    // Modifier la balade
    const updatedBalade = baladesService.modifierBalade(baladeId, {
      theme: baladeData.theme,
      date: baladeData.date,
      heure: baladeData.heure,
      lieu: baladeData.lieu,
      prix: baladeData.prix,
      placesDisponibles: baladeData.placesDisponibles || existingBalade.placesDisponibles,
      description: baladeData.description,
      statut: baladeData.statut || existingBalade.statut,
      parcours: baladeData.parcours || existingBalade.parcours,
      coordonnees: baladeData.coordonnees || existingBalade.coordonnees
    });

    if (updatedBalade) {
      return json({
        success: true,
        balade: updatedBalade,
        message: 'Balade modifiée avec succès'
      });
    } else {
      return json({
        success: false,
        error: 'Erreur lors de la modification de la balade'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors de la modification de la balade:', error);
    return json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

export const PUT = withAdminSecurity(putHandler);

async function deleteHandler({ params }: { params: { id: string } }) {
  try {
    const baladeId = parseInt(params.id);
    
    // Vérifier que la balade existe
    const existingBalade = baladesService.getBaladeById(baladeId);
    if (!existingBalade) {
      return json({
        success: false,
        error: 'Balade non trouvée'
      }, { status: 404 });
    }

    // Supprimer la balade
    const success = baladesService.supprimerBalade(baladeId);

    if (success) {
      return json({
        success: true,
        message: 'Balade supprimée avec succès'
      });
    } else {
      return json({
        success: false,
        error: 'Erreur lors de la suppression de la balade'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors de la suppression de la balade:', error);
    return json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

export const DELETE = withAdminSecurity(deleteHandler);
