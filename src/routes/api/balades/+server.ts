import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';

export const GET: RequestHandler = async () => {
  try {
    const balades = baladesService.getAllBalades();
    
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
