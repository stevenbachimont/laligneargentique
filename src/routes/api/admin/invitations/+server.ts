import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invitationService } from '$lib/server/invitationService';
import { baladesService } from '$lib/server/baladesService';
import { EmailService } from '$lib/server/emailService';

// GET - Récupérer toutes les invitations
export const GET: RequestHandler = async () => {
  try {
    const invitations = invitationService.getAllInvitations();
    
    // Enrichir avec les détails des balades
    const invitationsWithBalades = invitations.map(invitation => {
      const balade = baladesService.getBaladeById(invitation.baladeId);
      return {
        ...invitation,
        balade: balade ? {
          id: balade.id,
          theme: balade.theme,
          date: balade.date,
          heure: balade.heure,
          lieu: balade.lieu,
          placesDisponibles: balade.placesDisponibles
        } : null
      };
    });

    // Récupérer les balades d'invitation disponibles pour la création
    const baladesInvitation = baladesService.getBaladesInvitation();

    return json({
      success: true,
      invitations: invitationsWithBalades,
      balades: baladesInvitation
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des invitations:', error);
    return json(
      { success: false, error: 'Erreur lors de la récupération des invitations' },
      { status: 500 }
    );
  }
};

// POST - Créer de nouvelles invitations
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { baladeId, emails, nombrePersonnes, message } = await request.json();

    // Validation des données
    if (!baladeId || !emails || !Array.isArray(emails) || emails.length === 0) {
      return json(
        { success: false, error: 'Données manquantes ou invalides' },
        { status: 400 }
      );
    }

    if (!nombrePersonnes || nombrePersonnes < 1) {
      return json(
        { success: false, error: 'Le nombre de personnes doit être au moins 1' },
        { status: 400 }
      );
    }

    // Vérifier que la balade existe
    const balade = baladesService.getBaladeById(baladeId);
    if (!balade) {
      return json(
        { success: false, error: 'Balade non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que la balade est bien une balade sur invitation
    if (balade.type !== 'invitation') {
      return json(
        { success: false, error: 'Impossible de créer des invitations pour une balade payante. Seules les balades sur invitation sont autorisées.' },
        { status: 400 }
      );
    }

    // Vérifier qu'il y a assez de places
    const totalPlacesNeeded = emails.length * nombrePersonnes;
    if (balade.placesDisponibles < totalPlacesNeeded) {
      return json(
        { success: false, error: `Pas assez de places disponibles. ${balade.placesDisponibles} places disponibles pour ${totalPlacesNeeded} places nécessaires` },
        { status: 400 }
      );
    }

    // Créer les invitations
    const result = invitationService.createInvitations({
      baladeId,
      emails,
      nombrePersonnes,
      message
    });

    if (!result.success) {
      return json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Envoyer les emails d'invitation
    const emailService = new EmailService();
    const emailPromises = result.invitations!.map(invitation => 
      emailService.sendInvitationEmail(invitation, balade)
    );

    try {
      await Promise.all(emailPromises);
      console.log(`${result.invitations!.length} emails d'invitation envoyés avec succès`);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      // Les invitations sont créées même si l'envoi d'email échoue
    }

    return json({
      success: true,
      invitations: result.invitations,
      message: `${result.invitations!.length} invitation(s) créée(s) et email(s) envoyé(s)`
    });

  } catch (error) {
    console.error('Erreur lors de la création des invitations:', error);
    return json(
      { success: false, error: 'Erreur lors de la création des invitations' },
      { status: 500 }
    );
  }
};
