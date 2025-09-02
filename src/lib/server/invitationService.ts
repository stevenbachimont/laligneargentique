import { baladesService } from './baladesService';

export interface Invitation {
  id: number;
  baladeId: number;
  code: string;
  email: string;
  nom?: string;
  prenom?: string;
  statut: 'envoyee' | 'utilisee' | 'expiree';
  dateCreation: string;
  dateUtilisation?: string;
  nombrePersonnes: number;
  message?: string;
}

export interface InvitationData {
  baladeId: number;
  emails: string[];
  nombrePersonnes: number;
  message?: string;
}

class InvitationService {
  private invitations: Invitation[] = [];
  private nextId = 1;

  /**
   * Génère un code d'invitation unique
   */
  private generateInvitationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Vérifie si un code d'invitation existe et est valide
   */
  isValidCode(code: string): { valid: boolean; invitation?: Invitation; error?: string } {
    const invitation = this.invitations.find(inv => inv.code === code);
    
    if (!invitation) {
      return { valid: false, error: 'Code d\'invitation invalide' };
    }

    if (invitation.statut === 'utilisee') {
      return { valid: false, error: 'Ce code d\'invitation a déjà été utilisé' };
    }

    if (invitation.statut === 'expiree') {
      return { valid: false, error: 'Ce code d\'invitation a expiré' };
    }

    // Vérifier si la balade existe encore et a des places disponibles
    const balade = baladesService.getBaladeById(invitation.baladeId);
    if (!balade) {
      return { valid: false, error: 'La balade associée à ce code n\'existe plus' };
    }

    if (balade.placesDisponibles < invitation.nombrePersonnes) {
      return { valid: false, error: 'Plus assez de places disponibles pour cette balade' };
    }

    return { valid: true, invitation };
  }

  /**
   * Vérifie si un code d'invitation est valide avec l'email correspondant
   */
  isValidCodeWithEmail(code: string, email: string): { valid: boolean; invitation?: Invitation; error?: string } {
    const invitation = this.invitations.find(inv => inv.code === code);
    
    if (!invitation) {
      return { valid: false, error: 'Code d\'invitation invalide' };
    }

    // Vérifier que l'email correspond à celui de l'invitation
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      return { valid: false, error: 'Ce code d\'invitation n\'est pas valide pour cette adresse email' };
    }

    if (invitation.statut === 'utilisee') {
      return { valid: false, error: 'Ce code d\'invitation a déjà été utilisé' };
    }

    if (invitation.statut === 'expiree') {
      return { valid: false, error: 'Ce code d\'invitation a expiré' };
    }

    // Vérifier si la balade existe encore et a des places disponibles
    const balade = baladesService.getBaladeById(invitation.baladeId);
    if (!balade) {
      return { valid: false, error: 'La balade associée à ce code n\'existe plus' };
    }

    if (balade.placesDisponibles < invitation.nombrePersonnes) {
      return { valid: false, error: 'Plus assez de places disponibles pour cette balade' };
    }

    return { valid: true, invitation };
  }

  /**
   * Vérifie si un email a déjà une réservation pour une balade donnée
   */
  hasExistingReservation(email: string, baladeId: number): { hasReservation: boolean; invitation?: Invitation } {
    const existingInvitation = this.invitations.find(inv => 
      inv.email.toLowerCase() === email.toLowerCase() && 
      inv.baladeId === baladeId && 
      inv.statut === 'utilisee'
    );
    
    return { 
      hasReservation: !!existingInvitation, 
      invitation: existingInvitation 
    };
  }

  /**
   * Crée des invitations pour une balade
   */
  createInvitations(data: InvitationData): { success: boolean; invitations?: Invitation[]; error?: string } {
    try {
      const balade = baladesService.getBaladeById(data.baladeId);
      if (!balade) {
        return { success: false, error: 'Balade non trouvée' };
      }

      const invitations: Invitation[] = [];
      const now = new Date().toISOString();

      for (const email of data.emails) {
        const code = this.generateInvitationCode();
        const invitation: Invitation = {
          id: this.nextId++,
          baladeId: data.baladeId,
          code,
          email: email.trim(),
          statut: 'envoyee',
          dateCreation: now,
          nombrePersonnes: data.nombrePersonnes,
          message: data.message
        };

        this.invitations.push(invitation);
        invitations.push(invitation);
      }

      return { success: true, invitations };
    } catch (error) {
      console.error('Erreur lors de la création des invitations:', error);
      return { success: false, error: 'Erreur lors de la création des invitations' };
    }
  }

  /**
   * Marque une invitation comme utilisée
   */
  markAsUsed(code: string): { success: boolean; invitation?: Invitation; error?: string } {
    const invitation = this.invitations.find(inv => inv.code === code);
    
    if (!invitation) {
      return { success: false, error: 'Invitation non trouvée' };
    }

    if (invitation.statut === 'utilisee') {
      return { success: false, error: 'Invitation déjà utilisée' };
    }

    invitation.statut = 'utilisee';
    invitation.dateUtilisation = new Date().toISOString();

    return { success: true, invitation };
  }

  /**
   * Récupère toutes les invitations pour une balade
   */
  getInvitationsByBalade(baladeId: number): Invitation[] {
    return this.invitations.filter(inv => inv.baladeId === baladeId);
  }

  /**
   * Récupère toutes les invitations
   */
  getAllInvitations(): Invitation[] {
    return [...this.invitations];
  }

  /**
   * Récupère une invitation par code
   */
  getInvitationByCode(code: string): Invitation | undefined {
    return this.invitations.find(inv => inv.code === code);
  }

  /**
   * Supprime une invitation
   */
  deleteInvitation(invitationId: number): { success: boolean; error?: string } {
    const index = this.invitations.findIndex(inv => inv.id === invitationId);
    
    if (index === -1) {
      return { success: false, error: 'Invitation non trouvée' };
    }

    this.invitations.splice(index, 1);
    return { success: true };
  }

  /**
   * Met à jour le statut d'une invitation
   */
  updateInvitationStatus(invitationId: number, statut: Invitation['statut']): { success: boolean; error?: string } {
    const invitation = this.invitations.find(inv => inv.id === invitationId);
    
    if (!invitation) {
      return { success: false, error: 'Invitation non trouvée' };
    }

    invitation.statut = statut;
    
    if (statut === 'utilisee' && !invitation.dateUtilisation) {
      invitation.dateUtilisation = new Date().toISOString();
    }

    return { success: true };
  }
}

export const invitationService = new InvitationService();
