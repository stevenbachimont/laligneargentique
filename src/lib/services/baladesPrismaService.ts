import { PrismaClient } from '@prisma/client';
import { writable } from 'svelte/store';

const prisma = new PrismaClient();

// Types basés sur Prisma
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

// Store Svelte pour les balades
export const baladesStore = writable<Balade[]>([]);

class BaladesPrismaService {
  // Récupérer toutes les balades
  async getBalades(): Promise<Balade[]> {
    try {
      const balades = await prisma.balade.findMany({
        include: {
          consignes: true,
          materiel: true,
          coordonnees: true,
          parcours: true,
        },
        orderBy: {
          date: 'asc'
        }
      });
      
      // Mettre à jour le store
      baladesStore.set(balades);
      return balades;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des balades:', error);
      return [];
    }
  }

  // Récupérer une balade par ID
  async getBaladeById(id: number): Promise<Balade | null> {
    try {
      const balade = await prisma.balade.findUnique({
        where: { id },
        include: {
          consignes: true,
          materiel: true,
          coordonnees: true,
          parcours: true,
        }
      });
      return balade;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la balade:', error);
      return null;
    }
  }

  // Réserver des places pour une balade
  async reserverPlaces(baladeId: number, nombrePlaces: number): Promise<boolean> {
    try {
      const balade = await this.getBaladeById(baladeId);
      
      if (!balade) {
        throw new Error('Balade non trouvée');
      }

      if (balade.placesDisponibles < nombrePlaces) {
        throw new Error(`Pas assez de places disponibles. Il reste ${balade.placesDisponibles} place(s).`);
      }

      // Mettre à jour les places disponibles
      const baladeMiseAJour = await prisma.balade.update({
        where: { id: baladeId },
        data: {
          placesDisponibles: balade.placesDisponibles - nombrePlaces
        },
        include: {
          consignes: true,
          materiel: true,
          coordonnees: true,
          parcours: true,
        }
      });

      // Mettre à jour le store
      const balades = await this.getBalades();
      baladesStore.set(balades);

      console.log('✅ Places réservées avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la réservation:', error);
      return false;
    }
  }

  // Annuler une réservation (rembourser des places)
  async annulerReservation(baladeId: number, nombrePlaces: number): Promise<boolean> {
    try {
      const balade = await this.getBaladeById(baladeId);
      
      if (!balade) {
        throw new Error('Balade non trouvée');
      }

      if (balade.placesDisponibles + nombrePlaces > balade.placesInitiales) {
        throw new Error('Impossible de rembourser plus de places que le nombre initial.');
      }

      // Remettre les places disponibles
      const baladeMiseAJour = await prisma.balade.update({
        where: { id: baladeId },
        data: {
          placesDisponibles: balade.placesDisponibles + nombrePlaces
        },
        include: {
          consignes: true,
          materiel: true,
          coordonnees: true,
          parcours: true,
        }
      });

      // Mettre à jour le store
      const balades = await this.getBalades();
      baladesStore.set(balades);

      console.log('✅ Places remboursées avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation:', error);
      return false;
    }
  }

  // Réinitialiser les places d'une balade
  async reinitialiserPlaces(baladeId: number): Promise<boolean> {
    try {
      const balade = await this.getBaladeById(baladeId);
      
      if (!balade) {
        throw new Error('Balade non trouvée');
      }

      // Remettre le nombre initial de places
      const baladeMiseAJour = await prisma.balade.update({
        where: { id: baladeId },
        data: {
          placesDisponibles: balade.placesInitiales
        },
        include: {
          consignes: true,
          materiel: true,
          coordonnees: true,
          parcours: true,
        }
      });

      // Mettre à jour le store
      const balades = await this.getBalades();
      baladesStore.set(balades);

      console.log('✅ Places réinitialisées avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      return false;
    }
  }

  // Réinitialiser toutes les balades
  async reinitialiserToutesLesBalades(): Promise<boolean> {
    try {
      const balades = await this.getBalades();
      
      for (const balade of balades) {
        await prisma.balade.update({
          where: { id: balade.id },
          data: {
            placesDisponibles: balade.placesInitiales
          }
        });
      }

      // Mettre à jour le store
      const baladesMisesAJour = await this.getBalades();
      baladesStore.set(baladesMisesAJour);

      console.log('✅ Toutes les balades ont été réinitialisées');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      return false;
    }
  }

  // Vérifier si une balade est complète
  isBaladeComplete(baladeId: number): boolean {
    const balades = get(baladesStore);
    const balade = balades.find(b => b.id === baladeId);
    return balade ? balade.placesDisponibles === 0 : false;
  }

  // Obtenir le statut d'une balade
  getBaladeStatus(baladeId: number): 'disponible' | 'limite' | 'complete' {
    const balades = get(baladesStore);
    const balade = balades.find(b => b.id === baladeId);
    
    if (!balade) return 'complete';
    if (balade.placesDisponibles === 0) return 'complete';
    if (balade.placesDisponibles <= 2) return 'limite';
    return 'disponible';
  }

  // Créer une réservation
  async creerReservation(reservationData: {
    baladeId: number;
    prenom: string;
    nom: string;
    email: string;
    telephone?: string;
    dateSouhaitee: string;
    nombrePersonnes: number;
    message: string;
  }): Promise<boolean> {
    try {
      const reservation = await prisma.reservation.create({
        data: reservationData
      });

      console.log('✅ Réservation créée avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la réservation:', error);
      return false;
    }
  }
}

// Instance singleton du service
export const baladesPrismaService = new BaladesPrismaService();

// Fonction helper pour obtenir la valeur du store
function get<T>(store: any): T {
  let value: T;
  store.subscribe((val: T) => value = val)();
  return value!;
}
