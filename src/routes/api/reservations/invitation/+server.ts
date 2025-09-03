import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invitationService } from '$lib/server/invitationService';
import { baladesService } from '$lib/server/baladesService';
import { EmailService } from '$lib/server/emailService';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { invitationCode, nom, prenom, email, telephone, message } = await request.json();

    // Validation des données
    if (!invitationCode || !nom || !prenom || !email) {
      return json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Valider le code d'invitation avec l'email
    const validation = invitationService.isValidCodeWithEmail(invitationCode, email);
    
    if (!validation.valid) {
      return json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const invitation = validation.invitation!;
    
    // Vérifier qu'il n'y a pas déjà une réservation pour cet email sur cette balade
    const existingReservation = invitationService.hasExistingReservation(email, invitation.baladeId);
    if (existingReservation.hasReservation) {
      return json(
        { success: false, error: 'Vous avez déjà une réservation pour cette balade avec cette adresse email' },
        { status: 400 }
      );
    }
    
    const balade = baladesService.getBaladeById(invitation.baladeId);

    if (!balade) {
      return json(
        { success: false, error: 'Balade non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier qu'il y a encore des places disponibles
    if (balade.placesDisponibles < invitation.nombrePersonnes) {
      return json(
        { success: false, error: 'Plus assez de places disponibles pour cette balade' },
        { status: 400 }
      );
    }

    // Créer la réservation
    const reservation = await baladesService.creerReservation({
      baladeId: invitation.baladeId,
      nom,
      email,
      prenom,
      nombrePersonnes: invitation.nombrePersonnes,
      message: message || '',
      statut: 'confirmee', // Directement confirmée pour les invitations
      montant: 0, // Gratuit
      paymentIntentId: null // Pas de paiement
    });

    if (!reservation) {
      return json(
        { success: false, error: 'Erreur lors de la création de la réservation' },
        { status: 500 }
      );
    }

    // Marquer l'invitation comme utilisée
    const markResult = invitationService.markAsUsed(invitationCode);
    
    if (!markResult.success) {
      console.error('Erreur lors du marquage de l\'invitation comme utilisée:', markResult.error);
      // On continue quand même car la réservation est créée
    }

    // Décrémenter le nombre de places disponibles
    const decrementationReussie = baladesService.decrementerPlacesDisponiblesMultiple(
      invitation.baladeId, 
      invitation.nombrePersonnes
    );
    
    if (!decrementationReussie) {
      console.error(`Erreur lors de la décrémentation des places pour la balade ${invitation.baladeId}`);
      // On continue quand même car la réservation est créée
    }

    // Envoyer les emails de confirmation
    try {
      const emailService = new EmailService();
      await emailService.sendStripeReservationConfirmation(reservation, balade);
      console.log('Emails de confirmation envoyés avec succès pour la réservation d\'invitation');
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails de confirmation:', emailError);
      // On continue quand même car la réservation est créée
    }

    return json({
      success: true,
      reservationId: reservation.id,
      message: 'Réservation confirmée avec succès !'
    });

  } catch (error) {
    console.error('Erreur lors de la réservation avec invitation:', error);
    return json(
      { success: false, error: 'Erreur lors de la réservation' },
      { status: 500 }
    );
  }
};
