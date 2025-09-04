import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createTransport } from 'nodemailer';
import { withAdminSecurity } from '$lib/server/adminMiddleware';

async function handler() {
	try {
		// Vérifier que nous sommes en mode développement
		if (env.NODE_ENV === 'production') {
			return json({
				error: 'Endpoint de test non disponible en production'
			}, { status: 404 });
		}

		// Vérifier que les variables sont présentes
		if (!env.EMAIL_USER || !env.EMAIL_APP_PASSWORD) {
			return json({
				success: false,
				error: 'Variables d\'environnement manquantes',
				emailUser: env.EMAIL_USER ? 'Configuré' : 'Manquant',
				emailPassword: env.EMAIL_APP_PASSWORD ? 'Configuré' : 'Manquant'
			}, { status: 500 });
		}

		// Créer le transporteur
		const transporter = createTransport({
			service: 'gmail',
			auth: {
				user: env.EMAIL_USER,
				pass: env.EMAIL_APP_PASSWORD
			}
		});

		// Tester la connexion
		await transporter.verify();

		return json({
			success: true,
			message: 'Connexion email réussie',
			emailUser: env.EMAIL_USER,
			emailPassword: env.EMAIL_APP_PASSWORD ? 'Configuré' : 'Manquant',
			warning: 'Endpoint de test - Ne pas utiliser en production'
		});

	} catch (error) {
		console.error('Erreur de test de connexion email:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Erreur inconnue',
			details: error instanceof Error ? error.stack : undefined,
			emailUser: env.EMAIL_USER || 'Non configuré',
			emailPassword: env.EMAIL_APP_PASSWORD ? 'Configuré' : 'Non configuré'
		}, { status: 500 });
	}
}

export const GET = withAdminSecurity(handler);
