import { baladesService } from './baladesService';
import db from './database';

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
   * Vérifie si un code existe déjà en base
   */
  private isCodeUnique(code: string): boolean {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM invitations WHERE code = ?');
    const result = stmt.get(code) as { count: number };
    return result.count === 0;
  }

  /**
   * Vérifie si un code d'invitation existe et est valide
   */
  isValidCode(code: string): { valid: boolean; invitation?: Invitation; error?: string } {
    try {
      const stmt = db.prepare('SELECT * FROM invitations WHERE code = ?');
      const row = stmt.get(code) as any;
      
      if (!row) {
        return { valid: false, error: 'Code d\'invitation invalide' };
      }

      const invitation: Invitation = {
        id: row.id,
        baladeId: row.balade_id,
        code: row.code,
        email: row.email,
        nom: row.nom,
        prenom: row.prenom,
        statut: row.statut,
        dateCreation: row.date_creation,
        dateUtilisation: row.date_utilisation,
        nombrePersonnes: row.nombre_personnes,
        message: row.message
      };

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
    } catch (error) {
      console.error('Erreur lors de la validation du code:', error);
      return { valid: false, error: 'Erreur lors de la validation du code' };
    }
  }

  /**
   * Vérifie si un code d'invitation est valide avec l'email correspondant
   */
  isValidCodeWithEmail(code: string, email: string): { valid: boolean; invitation?: Invitation; error?: string } {
    try {
      // D'abord vérifier si le code existe
      const stmt = db.prepare('SELECT * FROM invitations WHERE code = ?');
      const row = stmt.get(code) as any;
      
      if (!row) {
        return { valid: false, error: 'Code d\'invitation invalide' };
      }

      // Ensuite vérifier que l'email correspond
      if (row.email.toLowerCase() !== email.toLowerCase()) {
        return { valid: false, error: 'Ce code d\'invitation n\'est pas valide pour cette adresse email' };
      }

      const invitation: Invitation = {
        id: row.id,
        baladeId: row.balade_id,
        code: row.code,
        email: row.email,
        nom: row.nom,
        prenom: row.prenom,
        statut: row.statut,
        dateCreation: row.date_creation,
        dateUtilisation: row.date_utilisation,
        nombrePersonnes: row.nombre_personnes,
        message: row.message
      };

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
    } catch (error) {
      console.error('Erreur lors de la validation du code avec email:', error);
      return { valid: false, error: 'Erreur lors de la validation du code' };
    }
  }

  /**
   * Vérifie si un email a déjà une réservation pour une balade donnée
   */
  hasExistingReservation(email: string, baladeId: number): { hasReservation: boolean; invitation?: Invitation } {
    try {
      const stmt = db.prepare('SELECT * FROM invitations WHERE email = ? AND balade_id = ? AND statut = ?');
      const row = stmt.get(email.toLowerCase(), baladeId, 'utilisee') as any;
      
      if (!row) {
        return { hasReservation: false };
      }

      const invitation: Invitation = {
        id: row.id,
        baladeId: row.balade_id,
        code: row.code,
        email: row.email,
        nom: row.nom,
        prenom: row.prenom,
        statut: row.statut,
        dateCreation: row.date_creation,
        dateUtilisation: row.date_utilisation,
        nombrePersonnes: row.nombre_personnes,
        message: row.message
      };

      return { hasReservation: true, invitation };
    } catch (error) {
      console.error('Erreur lors de la vérification des réservations existantes:', error);
      return { hasReservation: false };
    }
  }

  /**
   * Crée des invitations pour une balade
   */
  createInvitations(data: InvitationData): { success: boolean; invitations?: Invitation[]; error?: string } {
    try {
      console.log('🔍 Création d\'invitations pour balade ID:', data.baladeId);
      console.log('📧 Emails:', data.emails);
      console.log('👥 Nombre de personnes:', data.nombrePersonnes);
      
      const balade = baladesService.getBaladeById(data.baladeId);
      if (!balade) {
        console.log('❌ Balade non trouvée');
        return { success: false, error: 'Balade non trouvée' };
      }
      
      console.log('✅ Balade trouvée:', balade.theme, 'Places disponibles:', balade.placesDisponibles);

      // Vérifier qu'il y a assez de places disponibles
      const totalPlacesNeeded = data.emails.length * data.nombrePersonnes;
      console.log('📊 Places nécessaires:', totalPlacesNeeded);
      
      if (balade.placesDisponibles < totalPlacesNeeded) {
        console.log('❌ Pas assez de places');
        return { 
          success: false, 
          error: `Pas assez de places disponibles. ${balade.placesDisponibles} places disponibles pour ${totalPlacesNeeded} places nécessaires` 
        };
      }

      const invitations: Invitation[] = [];
      const now = new Date().toISOString();

      // Préparer la requête d'insertion
      const insertStmt = db.prepare(`
        INSERT INTO invitations (
          balade_id, code, email, nom, prenom, statut, 
          date_creation, nombre_personnes, message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const email of data.emails) {
        console.log('📧 Traitement de l\'email:', email);
        
        // Générer un code unique
        let code: string;
        let attempts = 0;
        do {
          code = this.generateInvitationCode();
          attempts++;
          if (attempts > 10) {
            console.log('❌ Trop de tentatives pour générer un code unique');
            return { success: false, error: 'Impossible de générer un code unique' };
          }
        } while (!this.isCodeUnique(code));
        
        console.log('🔑 Code généré:', code);

        try {
          const result = insertStmt.run(
            data.baladeId,
            code,
            email.trim().toLowerCase(),
            null, // nom
            null, // prenom
            'envoyee',
            now,
            data.nombrePersonnes,
            data.message || null
          );
          
          console.log('✅ Invitation insérée, ID:', result.lastInsertRowid);

          const invitation: Invitation = {
            id: result.lastInsertRowid as number,
            baladeId: data.baladeId,
            code,
            email: email.trim(),
            statut: 'envoyee',
            dateCreation: now,
            nombrePersonnes: data.nombrePersonnes,
            message: data.message
          };

          invitations.push(invitation);
        } catch (insertError) {
          console.error('❌ Erreur lors de l\'insertion:', insertError);
          return { success: false, error: `Erreur lors de l'insertion: ${insertError}` };
        }
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
    try {
      // Vérifier que l'invitation existe
      const checkStmt = db.prepare('SELECT * FROM invitations WHERE code = ?');
      const row = checkStmt.get(code) as any;
      
      if (!row) {
        return { success: false, error: 'Invitation non trouvée' };
      }

      if (row.statut === 'utilisee') {
        return { success: false, error: 'Invitation déjà utilisée' };
      }

      // Mettre à jour le statut
      const updateStmt = db.prepare('UPDATE invitations SET statut = ?, date_utilisation = ? WHERE code = ?');
      const now = new Date().toISOString();
      updateStmt.run('utilisee', now, code);

      const invitation: Invitation = {
        id: row.id,
        baladeId: row.balade_id,
        code: row.code,
        email: row.email,
        nom: row.nom,
        prenom: row.prenom,
        statut: 'utilisee',
        dateCreation: row.date_creation,
        dateUtilisation: now,
        nombrePersonnes: row.nombre_personnes,
        message: row.message
      };

      return { success: true, invitation };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'invitation:', error);
      return { success: false, error: 'Erreur lors de la mise à jour de l\'invitation' };
    }
  }

  /**
   * Récupère toutes les invitations pour une balade
   */
  getInvitationsByBalade(baladeId: number): Invitation[] {
    try {
      const stmt = db.prepare('SELECT * FROM invitations WHERE balade_id = ? ORDER BY date_creation DESC');
      const rows = stmt.all(baladeId) as any[];
      
      return rows.map(row => ({
        id: row.id,
        baladeId: row.balade_id,
        code: row.code,
        email: row.email,
        nom: row.nom,
        prenom: row.prenom,
        statut: row.statut,
        dateCreation: row.date_creation,
        dateUtilisation: row.date_utilisation,
        nombrePersonnes: row.nombre_personnes,
        message: row.message
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des invitations par balade:', error);
      return [];
    }
  }

  /**
   * Récupère toutes les invitations
   */
  getAllInvitations(): Invitation[] {
    try {
      const stmt = db.prepare('SELECT * FROM invitations ORDER BY date_creation DESC');
      const rows = stmt.all() as any[];
      
      return rows.map(row => ({
        id: row.id,
        baladeId: row.balade_id,
        code: row.code,
        email: row.email,
        nom: row.nom,
        prenom: row.prenom,
        statut: row.statut,
        dateCreation: row.date_creation,
        dateUtilisation: row.date_utilisation,
        nombrePersonnes: row.nombre_personnes,
        message: row.message
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les invitations:', error);
      return [];
    }
  }

  /**
   * Récupère une invitation par code
   */
  getInvitationByCode(code: string): Invitation | undefined {
    try {
      const stmt = db.prepare('SELECT * FROM invitations WHERE code = ?');
      const row = stmt.get(code) as any;
      
      if (!row) {
        return undefined;
      }

      return {
        id: row.id,
        baladeId: row.balade_id,
        code: row.code,
        email: row.email,
        nom: row.nom,
        prenom: row.prenom,
        statut: row.statut,
        dateCreation: row.date_creation,
        dateUtilisation: row.date_utilisation,
        nombrePersonnes: row.nombre_personnes,
        message: row.message
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'invitation par code:', error);
      return undefined;
    }
  }

  /**
   * Supprime une invitation
   */
  deleteInvitation(invitationId: number): { success: boolean; error?: string } {
    try {
      const stmt = db.prepare('DELETE FROM invitations WHERE id = ?');
      const result = stmt.run(invitationId);
      
      if (result.changes === 0) {
        return { success: false, error: 'Invitation non trouvée' };
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'invitation:', error);
      return { success: false, error: 'Erreur lors de la suppression de l\'invitation' };
    }
  }

  /**
   * Met à jour le statut d'une invitation
   */
  updateInvitationStatus(invitationId: number, statut: Invitation['statut']): { success: boolean; error?: string } {
    try {
      // Vérifier que l'invitation existe
      const checkStmt = db.prepare('SELECT * FROM invitations WHERE id = ?');
      const row = checkStmt.get(invitationId) as any;
      
      if (!row) {
        return { success: false, error: 'Invitation non trouvée' };
      }

      // Mettre à jour le statut
      const updateStmt = db.prepare('UPDATE invitations SET statut = ?, date_utilisation = ? WHERE id = ?');
      const now = new Date().toISOString();
      
      if (statut === 'utilisee' && !row.date_utilisation) {
        updateStmt.run(statut, now, invitationId);
      } else {
        updateStmt.run(statut, row.date_utilisation, invitationId);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'invitation:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du statut' };
    }
  }

  /**
   * Marque une invitation comme utilisée par ID (pour les tests)
   */
  markInvitationAsUsed(invitationId: number): boolean {
    try {
      // Vérifier que l'invitation existe
      const checkStmt = db.prepare('SELECT * FROM invitations WHERE id = ?');
      const row = checkStmt.get(invitationId) as any;
      
      if (!row) {
        console.log('❌ Invitation non trouvée pour ID:', invitationId);
        return false;
      }

      if (row.statut === 'utilisee') {
        console.log('❌ Invitation déjà utilisée pour ID:', invitationId);
        return false;
      }

      // Mettre à jour le statut
      const updateStmt = db.prepare('UPDATE invitations SET statut = ?, date_utilisation = ? WHERE id = ?');
      const now = new Date().toISOString();
      const result = updateStmt.run('utilisee', now, invitationId);
      
      return result.changes > 0;
    } catch (error) {
      console.error('❌ Erreur lors de la marque d\'utilisation de l\'invitation:', error);
      return false;
    }
  }

  /**
   * Récupère une invitation par ID
   */
  getInvitationById(invitationId: number): Invitation | null {
    try {
      const stmt = db.prepare('SELECT * FROM invitations WHERE id = ?');
      const row = stmt.get(invitationId) as any;
      
      if (!row) {
        return null;
      }

      return {
        id: row.id,
        baladeId: row.balade_id,
        code: row.code,
        email: row.email,
        nom: row.nom,
        prenom: row.prenom,
        statut: row.statut,
        dateCreation: row.date_creation,
        dateUtilisation: row.date_utilisation,
        nombrePersonnes: row.nombre_personnes,
        message: row.message
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'invitation par ID:', error);
      return null;
    }
  }

  /**
   * Vide toutes les invitations (pour les tests)
   */
  clearAllInvitations(): void {
    try {
      db.prepare('DELETE FROM invitations').run();
    } catch (error) {
      console.error('Erreur lors du nettoyage des invitations:', error);
    }
  }
}

export const invitationService = new InvitationService();
