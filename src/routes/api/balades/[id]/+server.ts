import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const baladeId = parseInt(params.id);
    
    if (isNaN(baladeId)) {
      return json(
        { success: false, error: 'ID de balade invalide' },
        { status: 400 }
      );
    }

    const balade = await baladesService.getBaladeById(baladeId);
    
    if (!balade) {
      return json(
        { success: false, error: 'Balade non trouvée' },
        { status: 404 }
      );
    }

    return json({
      success: true,
      balade: balade
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la balade:', error);
    
    return json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
};
