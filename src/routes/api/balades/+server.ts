import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const admin = searchParams.get('admin');
    
    // Si c'est un appel admin, retourner toutes les balades
    // Sinon, retourner seulement les balades en ligne
    const balades = admin === 'true' 
      ? baladesService.getAllBalades()
      : baladesService.getBaladesEnLigne();
    
    return json({
      success: true,
      balades
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des balades:', error);
    return json({
      success: false,
      error: 'Erreur lors de la récupération des balades'
    }, { status: 500 });
  }
};
