import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';

export const POST: RequestHandler = async () => {
  try {
    console.log('🔧 Début de la correction des places disponibles...');
    
    // Corriger les places disponibles
    const result = baladesService.corrigerPlacesDisponibles();
    
    return json({
      success: true,
      message: 'Places corrigées avec succès',
      result
    });
    
  } catch (error) {
    console.error('Erreur lors de la correction des places:', error);
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
};
