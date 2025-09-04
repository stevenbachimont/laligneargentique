import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthService } from '$lib/server/authService';
import { withRateLimit } from '$lib/server/rateLimiter';

// POST - Authentification admin
async function postHandler({ request, getClientAddress }: { request: Request; getClientAddress: () => string }) {
  try {
    const { accessCode } = await request.json();

    if (!accessCode || typeof accessCode !== 'string') {
      return json(
        { success: false, error: 'Code d\'accès requis' },
        { status: 400 }
      );
    }

    const clientIP = getClientAddress();
    const result = AuthService.authenticateAdmin(accessCode, clientIP);

    if (!result.success) {
      return json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return json({
      success: true,
      sessionToken: result.sessionToken,
      message: 'Authentification réussie'
    });

  } catch (error) {
    console.error('Erreur lors de l\'authentification admin:', error);
    return json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(5, 15 * 60 * 1000)(postHandler);

// DELETE - Déconnexion admin
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const sessionToken = request.headers.get('x-admin-session') || 
                        request.headers.get('authorization')?.replace('Bearer ', '');

    if (!sessionToken) {
      return json(
        { success: false, error: 'Token de session manquant' },
        { status: 400 }
      );
    }

    const success = AuthService.invalidateSession(sessionToken);

    return json({
      success,
      message: success ? 'Déconnexion réussie' : 'Session non trouvée'
    });

  } catch (error) {
    console.error('Erreur lors de la déconnexion admin:', error);
    return json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
};

// GET - Vérifier le statut de la session
export const GET: RequestHandler = async ({ request }) => {
  try {
    const sessionToken = request.headers.get('x-admin-session') || 
                        request.headers.get('authorization')?.replace('Bearer ', '');

    if (!sessionToken) {
      return json(
        { success: false, isAuthenticated: false, error: 'Token de session manquant' },
        { status: 401 }
      );
    }

    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    const isValid = AuthService.validateSession(sessionToken, clientIP);

    return json({
      success: true,
      isAuthenticated: isValid,
      message: isValid ? 'Session valide' : 'Session invalide'
    });

  } catch (error) {
    console.error('Erreur lors de la vérification de session:', error);
    return json(
      { success: false, isAuthenticated: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
};
