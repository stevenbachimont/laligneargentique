/**
 * Service pour les appels API d'administration avec authentification
 */

export class AdminApiService {
  private static getSessionToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('admin_session_token');
  }

  private static async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const sessionToken = this.getSessionToken();
    
    if (!sessionToken) {
      throw new Error('Non authentifié');
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Admin-Session': sessionToken,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Si la session a expiré, rediriger vers la page de connexion
    if (response.status === 401) {
      sessionStorage.removeItem('admin_authenticated');
      sessionStorage.removeItem('admin_session_token');
      window.location.href = '/admin';
      throw new Error('Session expirée');
    }

    return response;
  }

  // Balades
  static async createBalade(baladeData: any) {
    const response = await this.makeRequest('/api/admin/balades', {
      method: 'POST',
      body: JSON.stringify(baladeData)
    });
    return response.json();
  }

  static async updateBalade(id: number, baladeData: any) {
    const response = await this.makeRequest(`/api/admin/balades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(baladeData)
    });
    return response.json();
  }

  static async deleteBalade(id: number) {
    const response = await this.makeRequest(`/api/admin/balades/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Réservations
  static async getReservations() {
    const response = await this.makeRequest('/api/admin/reservations');
    return response.json();
  }

  static async getReservationsEnAttente() {
    const response = await this.makeRequest('/api/admin/reservations-en-attente');
    return response.json();
  }

  static async deleteReservation(id: number) {
    const response = await this.makeRequest(`/api/admin/reservations/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  static async confirmerReservation(reservationId: number) {
    const response = await this.makeRequest('/api/admin/confirmer-reservation', {
      method: 'POST',
      body: JSON.stringify({ reservationId })
    });
    return response.json();
  }

  static async updatePresence(reservationId: number, present: boolean) {
    const response = await this.makeRequest('/api/admin/reservations/presence', {
      method: 'POST',
      body: JSON.stringify({ reservationId, present })
    });
    return response.json();
  }

  // Invitations
  static async getInvitations() {
    const response = await this.makeRequest('/api/admin/invitations');
    return response.json();
  }

  static async createInvitations(invitationData: any) {
    const response = await this.makeRequest('/api/admin/invitations', {
      method: 'POST',
      body: JSON.stringify(invitationData)
    });
    return response.json();
  }

  static async updateInvitationStatus(id: number, statut: string) {
    const response = await this.makeRequest(`/api/admin/invitations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ statut })
    });
    return response.json();
  }

  static async deleteInvitation(id: number) {
    const response = await this.makeRequest(`/api/admin/invitations/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Utilitaires
  static async corrigerPlaces() {
    const response = await this.makeRequest('/api/admin/corriger-places', {
      method: 'POST'
    });
    return response.json();
  }

  // Vérifier le statut de la session
  static async checkSessionStatus(): Promise<boolean> {
    try {
      const sessionToken = this.getSessionToken();
      if (!sessionToken) return false;

      const response = await fetch('/api/admin/auth', {
        method: 'GET',
        headers: {
          'X-Admin-Session': sessionToken
        }
      });

      const result = await response.json();
      return result.isAuthenticated === true;
    } catch (error) {
      console.error('Erreur lors de la vérification de session:', error);
      return false;
    }
  }
}
