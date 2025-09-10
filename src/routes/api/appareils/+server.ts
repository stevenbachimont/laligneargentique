import { json } from '@sveltejs/kit';
import { appareilsPhotos, getAppareilsByCategorie, getAppareilsDisponibles } from '../../../../data/appareilsData';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const categorie = url.searchParams.get('categorie');
  const disponible = url.searchParams.get('disponible');
  
  try {
    let result;
    
    if (categorie) {
      const appareilsParCategorie = getAppareilsByCategorie();
      result = appareilsParCategorie[categorie] || [];
    } else if (disponible === 'true') {
      result = getAppareilsDisponibles();
    } else {
      result = appareilsPhotos;
    }
    
    return json({
      success: true,
      appareils: result,
      total: result.length
    });
  } catch (error) {
    console.error('Erreur lors du chargement des appareils:', error);
    return json({
      success: false,
      error: 'Erreur lors du chargement des appareils',
      appareils: [],
      total: 0
    }, { status: 500 });
  }
};
