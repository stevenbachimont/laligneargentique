import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';
import { EmailService } from '$lib/server/emailService';
import { withAdminSecurity } from '$lib/server/adminMiddleware';

async function handler({ request }: { request: Request }) {
  try {
    const { reservationId } = await request.json();
    
    if (!reservationId) {
      return json({
        success: false,
        error: 'ID de réservation manquant'
      }, { status: 400 });
    }

    console.log(`🔧 Confirmation manuelle de la réservation ${reservationId}...`);
    
    // Récupérer la réservation
    const reservation = baladesService.getReservationById(reservationId);
    if (!reservation) {
      return json({
        success: false,
        error: 'Réservation non trouvée'
      }, { status: 404 });
    }

    console.log(`   Réservation trouvée: ${reservation.prenom} ${reservation.nom} (${reservation.nombrePersonnes} pers.)`);

    // Confirmer la réservation
    const confirmationReussie = baladesService.modifierReservation(reservationId, {
      statut: 'confirmee'
    });

    if (!confirmationReussie) {
      return json({
        success: false,
        error: 'Erreur lors de la confirmation de la réservation'
      }, { status: 500 });
    }

    console.log('   ✅ Réservation confirmée');

    // Décrémenter les places
    const decrementationReussie = baladesService.decrementerPlacesDisponiblesMultiple(
      reservation.baladeId, 
      reservation.nombrePersonnes
    );

    if (!decrementationReussie) {
      console.log('   ⚠️  Erreur lors de la décrémentation des places');
    } else {
      console.log(`   ✅ ${reservation.nombrePersonnes} place(s) décrémentée(s)`);
    }

    // Récupérer les détails de la balade
    const balade = baladesService.getBaladeById(reservation.baladeId);
    
    if (balade) {
      // Envoyer les emails de confirmation
      try {
        const emailService = new EmailService();
        await emailService.sendStripeReservationConfirmation(reservation, balade);
        console.log('   ✅ Emails de confirmation envoyés');
      } catch (emailError) {
        console.error('   ❌ Erreur lors de l\'envoi des emails:', emailError);
      }
    }

    // Récupérer la réservation mise à jour
    const reservationMiseAJour = baladesService.getReservationById(reservationId);
    const baladeMiseAJour = baladesService.getBaladeById(reservation.baladeId);

    return json({
      success: true,
      message: 'Réservation confirmée avec succès',
      reservation: reservationMiseAJour,
      balade: baladeMiseAJour,
      placesDecrémentées: decrementationReussie
    });
    
  } catch (error) {
    console.error('Erreur lors de la confirmation manuelle:', error);
    
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export const POST = withAdminSecurity(handler);
