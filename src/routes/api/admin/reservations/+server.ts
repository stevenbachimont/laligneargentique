import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { baladesService } from '$lib/server/baladesService';
import { invitationService } from '$lib/server/invitationService';

export const GET: RequestHandler = async () => {
  try {
    // Récupérer toutes les réservations
    const toutesReservations = baladesService.getAllReservations();
    console.log('🔍 Toutes les réservations récupérées:', toutesReservations.length);
    
    // Récupérer toutes les invitations (utilisées et non utilisées)
    const invitations = invitationService.getAllInvitations();
    console.log('🔍 Invitations récupérées:', invitations.length);
    
    // Récupérer toutes les balades passées (même celles sans réservations)
    const baladesPassees = baladesService.getBaladesArchivees();
    console.log('🔍 Balades passées récupérées:', baladesPassees.length);
    

    
    // Séparer les réservations payantes et d'invitation
    const reservationsPayantes = [];
    const reservationsInvitation = [];
    
    toutesReservations.forEach(reservation => {
      const balade = baladesService.getBaladeById(reservation.baladeId);
      console.log(`🔍 Réservation ${reservation.id}: baladeId=${reservation.baladeId}, balade trouvée:`, !!balade, 'type:', balade?.type);
      
      if (balade && balade.type === 'invitation') {
        // C'est une réservation pour une balade d'invitation
        reservationsInvitation.push({
          ...reservation,
          type: 'invitation',
          statut: reservation.statut || 'envoyee', // Statut par défaut pour les invitations
          createdAt: reservation.createdAt,
          code: `INV-${reservation.id}`, // Code généré pour les anciennes réservations
          balade: {
            id: balade.id,
            theme: balade.theme,
            date: balade.date,
            heure: balade.heure,
            lieu: balade.lieu,
            prix: 'Gratuit'
          }
        });
      } else {
        // C'est une réservation payante
        reservationsPayantes.push({
          ...reservation,
          type: 'payante',
          statut: reservation.statut || 'en_attente',
          balade: balade ? {
            id: balade.id,
            theme: balade.theme,
            date: balade.date,
            heure: balade.heure,
            lieu: balade.lieu,
            prix: balade.prix
          } : null
        });
      }
    });
    
    console.log('🔍 Réservations payantes:', reservationsPayantes.length);
    console.log('🔍 Réservations d\'invitation:', reservationsInvitation.length);

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
          id: balade.id, // Ajouter l'ID de la balade
          theme: balade.theme,
          date: balade.date,
          heure: balade.heure,
          lieu: balade.lieu,
          prix: 'Gratuit'
        } : null
      };
    });

    // Créer des entrées pour les balades passées sans réservations
    const baladesPasseesSansReservations = baladesPassees
      .filter(balade => {
        // Vérifier si cette balade a déjà des réservations
        const aDesReservations = [...reservationsPayantes, ...reservationsInvitation, ...invitationsAvecDetails]
          .some(reservation => reservation.balade?.id === balade.id);
        return !aDesReservations;
      })
      .map(balade => ({
        id: -balade.id, // ID négatif pour distinguer des vraies réservations
        type: balade.type || 'payante',
        prenom: '',
        nom: '',
        email: '',
        nombrePersonnes: 0,
        message: '',
        statut: 'pas_de_reservation',
        createdAt: balade.date,
        balade: {
          id: balade.id,
          theme: balade.theme,
          date: balade.date,
          heure: balade.heure,
          lieu: balade.lieu,
          prix: balade.prix
        }
      }));
    
    console.log('🔍 Balades passées sans réservations:', baladesPasseesSansReservations.length);
    
    // Combiner toutes les données : réservations payantes + réservations d'invitation + invitations + balades passées sans réservations
    const toutesReservationsCombinees = [
      ...reservationsPayantes, 
      ...reservationsInvitation, 
      ...invitationsAvecDetails,
      ...baladesPasseesSansReservations
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return json({
      success: true,
      reservations: toutesReservationsCombinees,
      stats: {
        total: toutesReservationsCombinees.length,
        payantes: reservationsPayantes.length,
        invitations: reservationsInvitation.length + invitationsAvecDetails.length,
        confirmees: toutesReservationsCombinees.filter(r => r.statut === 'confirmee' || r.statut === 'utilisee').length,
        enAttente: toutesReservationsCombinees.filter(r => r.statut === 'en_attente' || r.statut === 'envoyee').length
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