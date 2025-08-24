import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const admin = searchParams.get('admin');
    const type = searchParams.get('type'); // 'futures', 'archivees', ou undefined pour toutes
    
    let balades;
    
    if (admin === 'true') {
      // Admin : toutes les balades
      balades = baladesService.getAllBalades();
    } else if (type === 'futures') {
      // Balades futures (non archivées)
      balades = baladesService.getBaladesFutures();
    } else if (type === 'archivees') {
      // Balades passées (archivées)
      balades = baladesService.getBaladesArchivees();
    } else {
      // Par défaut : balades en ligne (comportement existant)
      balades = baladesService.getBaladesEnLigne();
    }
    
    return json({
      success: true,
      balades: balades
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des balades:', error);
    return json({
      success: false,
      error: 'Erreur lors de la récupération des balades'
    }, { status: 500 });
  }
};
