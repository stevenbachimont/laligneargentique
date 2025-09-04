import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invitationService } from '$lib/server/invitationService';
import { withAdminSecurity } from '$lib/server/adminMiddleware';

// DELETE - Supprimer une invitation
async function deleteHandler({ params }: { params: { id: string } }) {
  try {
    const invitationId = parseInt(params.id);
    
    if (isNaN(invitationId)) {
      return json(
        { success: false, error: 'ID d\'invitation invalide' },
        { status: 400 }
      );
    }

    const result = invitationService.deleteInvitation(invitationId);
    
    if (!result.success) {
      return json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return json({
      success: true,
      message: 'Invitation supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'invitation:', error);
    return json(
      { success: false, error: 'Erreur lors de la suppression de l\'invitation' },
      { status: 500 }
    );
  }
}

export const DELETE = withAdminSecurity(deleteHandler);

// PUT - Mettre à jour le statut d'une invitation
async function putHandler({ params, request }: { params: { id: string }; request: Request }) {
  try {
    const invitationId = parseInt(params.id);
    
    if (isNaN(invitationId)) {
      return json(
        { success: false, error: 'ID d\'invitation invalide' },
        { status: 400 }
      );
    }

    const { statut } = await request.json();
    
    if (!statut || !['envoyee', 'utilisee', 'expiree'].includes(statut)) {
      return json(
        { success: false, error: 'Statut invalide' },
        { status: 400 }
      );
    }

    const result = invitationService.updateInvitationStatus(invitationId, statut);
    
    if (!result.success) {
      return json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return json({
      success: true,
      message: 'Statut de l\'invitation mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'invitation:', error);
    return json(
      { success: false, error: 'Erreur lors de la mise à jour de l\'invitation' },
      { status: 500 }
    );
  }
}

export const PUT = withAdminSecurity(putHandler);
