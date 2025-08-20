import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
  try {
    const balades = await prisma.balade.findMany({
      include: {
        consignes: true,
        materiel: true,
        coordonnees: true,
        parcours: true,
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    return json({
      success: true,
      balades: balades
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des balades:', error);
    return json({
      success: false,
      error: 'Erreur lors de la récupération des balades'
    }, { status: 500 });
  }
};
