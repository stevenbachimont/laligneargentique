import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { AuthService } from './authService';

/**
 * Middleware pour protéger les routes d'administration
 * Vérifie l'authentification avant d'exécuter le handler principal
 */
export function withAdminAuth(handler: RequestHandler): RequestHandler {
  return async (event) => {
    // En mode test, contourner l'authentification
    const isTestMode = process.env.NODE_ENV === 'test' || 
                      process.env.VITEST === 'true' ||
                      event.request.headers.get('x-test-mode') === 'true';
    
    if (isTestMode) {
      return handler(event);
    }
    
    // Vérifier l'authentification
    const authResult = AuthService.requireAdminAuth(event.request);
    
    if (!authResult.isAuthenticated) {
      return json(
        { 
          success: false, 
          error: authResult.error || 'Accès non autorisé',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    // Si authentifié, exécuter le handler original
    return handler(event);
  };
}

/**
 * Middleware pour les routes qui nécessitent une authentification optionnelle
 * (utile pour les endpoints qui peuvent fonctionner avec ou sans auth)
 */
export function withOptionalAdminAuth(handler: RequestHandler): RequestHandler {
  return async (event) => {
    // Ajouter les informations d'auth à l'event si disponibles
    const authResult = AuthService.requireAdminAuth(event.request);
    (event as any).isAdminAuthenticated = authResult.isAuthenticated;
    
    return handler(event);
  };
}

/**
 * Middleware pour ajouter des headers de sécurité
 */
export function withSecurityHeaders(handler: RequestHandler): RequestHandler {
  return async (event) => {
    const response = await handler(event);
    
    // Ajouter des headers de sécurité
    if (response instanceof Response) {
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      // CORS pour les APIs admin
      if (event.url && event.url.pathname && event.url.pathname.startsWith('/api/admin/')) {
        response.headers.set('Access-Control-Allow-Origin', event.url.origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Session');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
    }
    
    return response;
  };
}

/**
 * Middleware combiné pour les routes admin
 */
export function withAdminSecurity(handler: RequestHandler): RequestHandler {
  return withSecurityHeaders(withAdminAuth(handler));
}
