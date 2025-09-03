import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';
import { invitationService } from '$lib/server/invitationService';

export const GET: RequestHandler = async () => {
  try {
    // Récupérer toutes les réservations payantes
    const reservationsPayantes = baladesService.getAllReservations();
    
    // Récupérer toutes les invitations (utilisées et non utilisées)
    const invitations = invitationService.getAllInvitations();
    
    // Enrichir les réservations avec les détails des balades
    const reservationsAvecDetails = reservationsPayantes.map(reservation => {
      const balade = baladesService.getBaladeById(reservation.baladeId);
      return {
        ...reservation,
        type: 'payante',
        balade: balade ? {
          theme: balade.theme,
          date: balade.date,
          heure: balade.heure,
          lieu: balade.lieu,
          prix: balade.prix
        } : null
      };
    });

    // Enrichir les invitations avec les détails des balades
    const invitationsAvecDetails = invitations.map(invitation => {
      const balade = baladesService.getBaladeById(invitation.baladeId);
      return {
        id: invitation.id,
        type: 'invitation',
        prenom: invitation.prenom || '',
        nom: invitation.nom || '',
        email: invitation.email,
        nombrePersonnes: invitation.nombrePersonnes,
        message: invitation.message || '',
        statut: invitation.statut,
        createdAt: invitation.dateCreation,
        code: invitation.code,
        balade: balade ? {
          theme: balade.theme,
          date: balade.date,
          heure: balade.heure,
          lieu: balade.lieu,
          prix: 'Gratuit'
        } : null
      };
    });

    // Combiner et trier par date de création (plus récentes en premier)
    const toutesReservations = [...reservationsAvecDetails, ...invitationsAvecDetails]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return json({
      success: true,
      reservations: toutesReservations,
      stats: {
        total: toutesReservations.length,
        payantes: reservationsAvecDetails.length,
        invitations: invitationsAvecDetails.length,
        confirmees: toutesReservations.filter(r => r.statut === 'confirmee' || r.statut === 'utilisee').length,
        enAttente: toutesReservations.filter(r => r.statut === 'en_attente' || r.statut === 'envoyee').length
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return json({
      success: false,
      error: 'Erreur lors de la récupération des réservations'
    }, { status: 500 });
  }
};