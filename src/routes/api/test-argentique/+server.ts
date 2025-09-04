import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ValidationService } from '$lib/server/validationService';
import type { EmailData } from '$lib/server/types';
import { withAdminSecurity } from '$lib/server/adminMiddleware';
import { env } from '$env/dynamic/private';

async function handler({ request }: { request: Request }) {
  try {
    // Vérifier que nous sommes en mode développement
    if (env.NODE_ENV === 'production') {
      return json({
        error: 'Endpoint de test non disponible en production'
      }, { status: 404 });
    }

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
      validation: validation,
      warning: 'Endpoint de test - Ne pas utiliser en production'
    });

  } catch (error) {
    console.error('🧪 Test API - Erreur:', error);
    return json({ 
      error: 'Erreur lors du test', 
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export const POST = withAdminSecurity(handler);
