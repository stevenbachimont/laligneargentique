import { baladesStore } from './baladesService';

// Service client pour synchroniser les places disponibles
export class BaladesClientService {
  
  // Mettre à jour les places via l'API et synchroniser le store
  static async updatePlaces(baladeId: number, nombrePlaces: number, action: 'reserver' | 'annuler' | 'reinitialiser'): Promise<boolean> {
    try {
      // Construire l'URL complète
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/balades/update-places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baladeId,
          nombrePlaces,
          action
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour des places');
      }

      const data = await response.json();
      
      if (data.success && data.balades) {
        // Mettre à jour le store avec les nouvelles données
        baladesStore.set(data.balades);
        console.log('✅ Store synchronisé avec les données mises à jour');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation des places:', error);
      return false;
    }
  }

  // Synchroniser le store avec les données du serveur
  static async syncStore(): Promise<boolean> {
    try {
      // Construire l'URL complète
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/balades/update-places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baladeId: 1, // ID factice pour déclencher une synchronisation
          nombrePlaces: 0,
          action: 'sync'
        })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.balades) {
        baladesStore.set(data.balades);
        console.log('✅ Store synchronisé avec le serveur');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation du store:', error);
      return false;
    }
  }
}
