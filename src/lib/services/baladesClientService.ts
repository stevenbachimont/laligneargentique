import { baladesStore } from './baladesPrismaService';

// Service client pour synchroniser les places disponibles
export class BaladesClientService {
  
  private static syncInterval: NodeJS.Timeout | null = null;
  private static isAutoSyncEnabled = false;
  
  // Récupérer toutes les balades depuis l'API
  static async getBalades(): Promise<any[]> {
    try {
      const response = await fetch('/api/balades');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des balades');
      }
      
      const data = await response.json();
      if (data.success && data.balades) {
        // Mettre à jour le store
        baladesStore.set(data.balades);
        return data.balades;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des balades:', error);
      return [];
    }
  }
  
  // Mettre à jour les places via l'API et synchroniser le store
  static async updatePlaces(baladeId: number, nombrePlaces: number, action: 'reserver' | 'annuler' | 'reinitialiser'): Promise<boolean> {
    try {
      const response = await fetch('/api/balades/update-places', {
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
      const balades = await this.getBalades();
      return balades.length > 0;
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation du store:', error);
      return false;
    }
  }

  // Démarrer la synchronisation automatique
  static startAutoSync(intervalMs: number = 10000): void {
    if (this.isAutoSyncEnabled) {
      console.log('⚠️ Synchronisation automatique déjà active');
      return;
    }

    console.log(`🔄 Démarrage de la synchronisation automatique (${intervalMs}ms)`);
    this.isAutoSyncEnabled = true;
    
    this.syncInterval = setInterval(async () => {
      try {
        await this.syncStore();
        console.log('✅ Synchronisation automatique effectuée');
      } catch (error) {
        console.error('❌ Erreur lors de la synchronisation automatique:', error);
      }
    }, intervalMs);
  }

  // Arrêter la synchronisation automatique
  static stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      this.isAutoSyncEnabled = false;
      console.log('⏹️ Synchronisation automatique arrêtée');
    }
  }

  // Vérifier si la synchronisation automatique est active
  static isAutoSyncActive(): boolean {
    return this.isAutoSyncEnabled;
  }
}
