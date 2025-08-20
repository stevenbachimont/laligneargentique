import { json } from '@sveltejs/kit';
import { baladesPrismaService } from '$lib/services/baladesPrismaService';

export async function GET() {
  try {
    const balades = await baladesPrismaService.getBalades();
    return json(balades);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des balades:', error);
    return json({ error: 'Erreur lors de la récupération des balades' }, { status: 500 });
  }
}
