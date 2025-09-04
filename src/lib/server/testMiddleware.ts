import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Middleware pour les tests qui contourne l'authentification
 * Utilisé uniquement en mode test pour permettre l'exécution des tests unitaires
 */
export function withTestAuth(handler: RequestHandler): RequestHandler {
  return async (event) => {
    // En mode test, on contourne complètement l'authentification
    // Vérifier si nous sommes en mode test
    const isTestMode = process.env.NODE_ENV === 'test' || 
                      process.env.VITEST === 'true' ||
                      event.request.headers.get('x-test-mode') === 'true';
    
    if (isTestMode) {
      // En mode test, exécuter directement le handler
      return handler(event);
    }
    
    // En mode normal, retourner une erreur d'authentification
    return json(
      { 
        success: false, 
        error: 'Authentification requise',
        code: 'UNAUTHORIZED'
      },
      { status: 401 }
    );
  };
}

/**
 * Middleware de sécurité pour les tests (sans authentification)
 */
export function withTestSecurity(handler: RequestHandler): RequestHandler {
  return async (event) => {
    const response = await handler(event);
    
    // Ajouter des headers de sécurité même en mode test
    if (response instanceof Response) {
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
    
    return response;
  };
}
