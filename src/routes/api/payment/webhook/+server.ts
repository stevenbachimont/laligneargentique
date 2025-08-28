import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import StripeService from '$lib/server/stripeService';
import { baladesService } from '$lib/server/baladesService';
import { EmailService } from '$lib/server/emailService';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return json({ error: 'Signature manquante' }, { status: 400 });
  }

  try {
    // Vérification de la signature du webhook
    const event = StripeService.verifyWebhookSignature(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook reçu:', event.type);

    // Traitement selon le type d'événement
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return json({ received: true });

  } catch (error) {
    console.error('Erreur webhook:', error);
    return json(
      { error: 'Erreur de traitement du webhook' },
      { status: 400 }
    );
  }
};

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const { baladeId, participantName, participantEmail, nombrePersonnes } = paymentIntent.metadata;
    const nbPersonnes = parseInt(nombrePersonnes) || 1;
    
    console.log(`Paiement réussi pour la balade ${baladeId} - ${participantName} (${nbPersonnes} personne(s))`);

    // Trouver et confirmer la réservation existante
    const reservations = baladesService.getReservationsByBalade(parseInt(baladeId));
    const reservation = reservations.find(r => r.paymentIntentId === paymentIntent.id);
    
    if (reservation) {
      // Mettre à jour le statut de la réservation
      baladesService.modifierReservation(reservation.id, {
        statut: 'confirmee'
      });

      // Décrémenter le nombre de places disponibles en une seule fois
      const decrementationReussie = baladesService.decrementerPlacesDisponiblesMultiple(parseInt(baladeId), nbPersonnes);
      
      if (decrementationReussie) {
        console.log(`Réservation confirmée avec succès: ${reservation.id} (${nbPersonnes} place(s) réservée(s))`);
      } else {
        console.error(`Erreur lors de la décrémentation des places pour la balade ${baladeId}`);
      }

      // Récupérer les détails de la balade
      const balade = baladesService.getBaladeById(parseInt(baladeId));
      
      if (balade) {
        // Envoyer les emails de confirmation
        const emailService = new EmailService();
        await emailService.sendStripeReservationConfirmation(reservation, balade);
        console.log('Emails de confirmation envoyés avec succès');
      } else {
        console.error('Balade non trouvée pour l\'envoi d\'email');
      }
    } else {
      console.error('Réservation non trouvée pour le payment intent:', paymentIntent.id);
    }

  } catch (error) {
    console.error('Erreur lors du traitement du paiement réussi:', error);
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  try {
    const { baladeId, participantName } = paymentIntent.metadata;
    
    console.log(`Paiement échoué pour la balade ${baladeId} - ${participantName}`);

    // TODO: Envoyer un email d'échec de paiement
    // await sendPaymentFailureEmail(paymentIntent.metadata);

  } catch (error) {
    console.error('Erreur lors du traitement de l\'échec de paiement:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  try {
    const { baladeId, participantName } = paymentIntent.metadata;
    
    console.log(`Paiement annulé pour la balade ${baladeId} - ${participantName}`);

    // TODO: Envoyer un email d'annulation
    // await sendPaymentCanceledEmail(paymentIntent.metadata);

  } catch (error) {
    console.error('Erreur lors du traitement de l\'annulation de paiement:', error);
  }
}
