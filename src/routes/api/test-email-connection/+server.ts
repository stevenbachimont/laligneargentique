import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createTransport } from 'nodemailer';

export async function GET() {
	try {
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
			emailPassword: env.EMAIL_APP_PASSWORD ? 'Configuré' : 'Manquant'
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
