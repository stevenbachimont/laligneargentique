import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ValidationService } from '$lib/server/validationService';
import type { EmailData } from '$lib/server/types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data: EmailData = await request.json();
    
    console.log('🧪 Test API - Données reçues:', data);
    
    // Test de validation
    const validation = ValidationService.validateArgentiqueReservation(data);
    console.log('🧪 Test API - Résultat validation:', validation);
    
    if (!validation.isValid) {
      return json({ 
        error: 'Données invalides', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Test de nettoyage
    const sanitizedData = ValidationService.sanitizeData(data);
    console.log('🧪 Test API - Données nettoyées:', sanitizedData);

    return json({ 
      success: true, 
      message: 'Test de validation réussi',
      originalData: data,
      sanitizedData: sanitizedData,
      validation: validation
    });

  } catch (error) {
    console.error('🧪 Test API - Erreur:', error);
    return json({ 
      error: 'Erreur lors du test', 
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
};
