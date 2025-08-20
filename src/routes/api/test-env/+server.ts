import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET() {
	return json({
		emailUser: env.EMAIL_USER ? 'Configuré' : 'Non configuré',
		emailPassword: env.EMAIL_APP_PASSWORD ? 'Configuré' : 'Non configuré',
		adminEmail: env.ADMIN_EMAIL ? 'Configuré' : 'Non configuré',
		nodeEnv: env.NODE_ENV || 'Non défini'
	});
}
