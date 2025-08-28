import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import StripeService from '$lib/server/stripeService';
import { baladesService } from '$lib/server/baladesService';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { baladeId, participantName, participantEmail, prenom, nom, telephone, message, nombrePersonnes } = await request.json();

    // Validation des données
    if (!baladeId || !participantName || !participantEmail) {
      return json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Validation du nombre de personnes
    const nbPersonnes = nombrePersonnes || 1;
    if (nbPersonnes < 1) {
      return json(
        { success: false, error: 'Le nombre de personnes doit être au moins 1' },
        { status: 400 }
      );
    }

    // Récupération de la balade
    const balade = await baladesService.getBaladeById(baladeId);
    if (!balade) {
      return json(
        { success: false, error: 'Balade non trouvée' },
        { status: 404 }
      );
    }

    // Vérification des places disponibles
    if (balade.placesDisponibles < nbPersonnes) {
      return json(
        { success: false, error: `Il n'y a que ${balade.placesDisponibles} place(s) disponible(s) pour cette balade` },
        { status: 400 }
      );
    }

    // Conversion du prix en centimes et calcul du montant total
    const prixUnitaire = StripeService.convertPriceToCents(balade.prix);
    const amountInCents = prixUnitaire * nbPersonnes;

    // Création de l'intention de paiement
    const paymentIntentData = {
      amount: amountInCents,
      currency: 'eur',
      metadata: {
        baladeId: baladeId.toString(),
        participantName,
        participantEmail,
        nombrePersonnes: nbPersonnes.toString(),
        baladeDate: balade.date,
        baladeTheme: balade.theme,
      },
    };

    const paymentIntent = await StripeService.createPaymentIntent(paymentIntentData);

    // Créer une réservation temporaire avec le statut "en_attente"
    const reservation = await baladesService.creerReservation({
      baladeId: parseInt(baladeId),
      nom: nom || participantName,
      email: participantEmail,
      prenom: prenom || '',
      nombrePersonnes: nbPersonnes,
      message: message || '',
      statut: 'en_attente',
      paymentIntentId: paymentIntent.paymentIntentId,
      montant: amountInCents,
    });

    if (!reservation) {
      return json(
        { success: false, error: 'Erreur lors de la création de la réservation' },
        { status: 500 }
      );
    }

    return json({
      success: true,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId,
      reservationId: reservation.id,
      amount: amountInCents,
      currency: 'eur',
      balade: {
        id: balade.id,
        theme: balade.theme,
        date: balade.date,
        heure: balade.heure,
        lieu: balade.lieu,
        prix: balade.prix,
        placesDisponibles: balade.placesDisponibles,
      },
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'intention de paiement:', error);
    
    return json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
};
