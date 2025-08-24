import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const baladeData = await request.json();
    
    // Validation des données
    if (!baladeData.theme || !baladeData.date || !baladeData.heure || !baladeData.lieu || !baladeData.prix || !baladeData.description) {
      return json({
        success: false,
        error: 'Tous les champs sont obligatoires'
      }, { status: 400 });
    }

    // Créer la nouvelle balade
    const newBalade = baladesService.creerBalade({
      theme: baladeData.theme,
      date: baladeData.date,
      heure: baladeData.heure,
      lieu: baladeData.lieu,
      prix: baladeData.prix,
      placesDisponibles: baladeData.placesDisponibles || 5,
      description: baladeData.description,
      statut: baladeData.statut || 'en_ligne',
      consignes: [
        'Appareil photo argentique requis',
        'Pellicule 400 ISO recommandée',
        'Arrivée 10 minutes avant le départ'
      ],
      materiel: [
        'Appareil photo argentique',
        'Pellicules',
        'Guide technique fourni'
      ],
      coordonnees: [
        { lat: 47.2138, lng: -1.5561, name: baladeData.lieu }
      ],
      parcours: [
        {
          titre: `Départ - ${baladeData.lieu}`,
          description: 'Point de rendez-vous et présentation du matériel',
          duree: '30 min',
          distance: '0 km'
        }
      ]
    });

    if (newBalade) {
      return json({
        success: true,
        balade: newBalade,
        message: 'Balade créée avec succès'
      });
    } else {
      return json({
        success: false,
        error: 'Erreur lors de la création de la balade'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors de la création de la balade:', error);
    return json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
};
