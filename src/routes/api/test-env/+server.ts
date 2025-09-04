import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { withAdminSecurity } from '$lib/server/adminMiddleware';

async function handler() {
	// Vérifier que nous sommes en mode développement
	if (env.NODE_ENV === 'production') {
		return json({
			error: 'Endpoint de test non disponible en production'
		}, { status: 404 });
	}

	return json({
		emailUser: env.EMAIL_USER ? 'Configuré' : 'Non configuré',
		emailPassword: env.EMAIL_APP_PASSWORD ? 'Configuré' : 'Non configuré',
		adminEmail: env.ADMIN_EMAIL ? 'Configuré' : 'Non configuré',
		nodeEnv: env.NODE_ENV || 'Non défini',
		warning: 'Endpoint de test - Ne pas utiliser en production'
	});
}

export const GET = withAdminSecurity(handler);
