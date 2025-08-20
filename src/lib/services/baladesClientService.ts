import { writable } from 'svelte/store';

// Types basés sur Prisma (copiés ici pour éviter l'import)
export interface Balade {
  id: number;
  date: string;
  heure: string;
  lieu: string;
  theme: string;
  placesDisponibles: number;
  placesInitiales: number;
  prix: string;
  description: string;
  consignes: { id: number; texte: string }[];
  materiel: { id: number; nom: string }[];
  coordonnees: { id: number; lat: number; lng: number; name: string }[];
  parcours: { id: number; titre: string; description: string; duree: string; distance: string }[];
  createdAt: Date;
  updatedAt: Date;
}

// Store Svelte pour les balades (côté client uniquement)
export const baladesStore = writable<Balade[]>([]);

class BaladesClientService {
  // Récupérer toutes les balades depuis l'API
  async getBalades(): Promise<Balade[]> {
    try {
      const response = await fetch('/api/balades');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des balades');
      }
      const balades = await response.json();
      
      // Mettre à jour le store
      baladesStore.set(balades);
      return balades;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des balades:', error);
      return [];
    }
  }

  // Réserver des places via l'API
  async reserverPlaces(baladeId: number, nombrePlaces: number): Promise<boolean> {
    try {
      const response = await fetch('/api/balades/update-places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baladeId,
          nombrePlaces,
          action: 'reserver'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réservation');
      }

      const result = await response.json();
      
      if (result.success) {
        // Mettre à jour le store
        await this.getBalades();
        console.log('✅ Places réservées avec succès');
        return true;
      } else {
        console.error('❌ Échec de la réservation:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la réservation:', error);
      return false;
    }
  }

  // Vérifier si une balade est complète
  isBaladeComplete(baladeId: number): boolean {
    let balades: Balade[] = [];
    baladesStore.subscribe(val => balades = val)();
    const balade = balades.find(b => b.id === baladeId);
    return balade ? balade.placesDisponibles === 0 : false;
  }

  // Obtenir le statut d'une balade
  getBaladeStatus(baladeId: number): 'disponible' | 'limite' | 'complete' {
    let balades: Balade[] = [];
    baladesStore.subscribe(val => balades = val)();
    const balade = balades.find(b => b.id === baladeId);
    
    if (!balade) return 'complete';
    if (balade.placesDisponibles === 0) return 'complete';
    if (balade.placesDisponibles <= 2) return 'limite';
    return 'disponible';
  }
}

// Instance singleton du service client
export const baladesClientService = new BaladesClientService();
