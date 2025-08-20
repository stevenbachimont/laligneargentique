import baladesData from '../balades-argentique.json';
import { writable } from 'svelte/store';

// Type pour une balade
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
  consignes: string[];
  materiel: string[];
  coordonnees: Array<{lat: number, lng: number, name: string}>;
  parcours: Array<{
    titre: string;
    description: string;
    duree: string;
    distance: string;
  }>;
}

// Store Svelte pour les balades
export const baladesStore = writable<Balade[]>(baladesData.baladesProgrammees);

class BaladesService {
  private balades: Balade[] = [...baladesData.baladesProgrammees];

  constructor() {
    // Initialiser le store
    baladesStore.set(this.balades);
  }

  // Récupérer toutes les balades
  getBalades(): Balade[] {
    return this.balades;
  }

  // Récupérer une balade par ID
  getBaladeById(id: number): Balade | undefined {
    return this.balades.find(balade => balade.id === id);
  }

  // Réserver des places pour une balade
  async reserverPlaces(baladeId: number, nombrePlaces: number): Promise<boolean> {
    const balade = this.getBaladeById(baladeId);
    
    if (!balade) {
      throw new Error('Balade non trouvée');
    }

    if (balade.placesDisponibles < nombrePlaces) {
      throw new Error(`Pas assez de places disponibles. Il reste ${balade.placesDisponibles} place(s).`);
    }

    // Mettre à jour les places disponibles
    balade.placesDisponibles -= nombrePlaces;

    // Mettre à jour le store
    this.balades = [...this.balades];
    baladesStore.set(this.balades);

    // Sauvegarder dans le fichier JSON (en développement)
    await this.sauvegarderBalades();

    return true;
  }

  // Annuler une réservation (rembourser des places)
  async annulerReservation(baladeId: number, nombrePlaces: number): Promise<boolean> {
    const balade = this.getBaladeById(baladeId);
    
    if (!balade) {
      throw new Error('Balade non trouvée');
    }

    if (balade.placesDisponibles + nombrePlaces > balade.placesInitiales) {
      throw new Error('Impossible de rembourser plus de places que le nombre initial.');
    }

    // Remettre les places disponibles
    balade.placesDisponibles += nombrePlaces;

    // Mettre à jour le store
    this.balades = [...this.balades];
    baladesStore.set(this.balades);

    // Sauvegarder dans le fichier JSON
    await this.sauvegarderBalades();

    return true;
  }

  // Réinitialiser les places d'une balade
  async reinitialiserPlaces(baladeId: number): Promise<boolean> {
    const balade = this.getBaladeById(baladeId);
    
    if (!balade) {
      throw new Error('Balade non trouvée');
    }

    // Remettre le nombre initial de places
    balade.placesDisponibles = balade.placesInitiales;

    // Mettre à jour le store
    this.balades = [...this.balades];
    baladesStore.set(this.balades);

    // Sauvegarder dans le fichier JSON
    await this.sauvegarderBalades();

    return true;
  }

  // Réinitialiser toutes les balades
  async reinitialiserToutesLesBalades(): Promise<boolean> {
    this.balades.forEach(balade => {
      balade.placesDisponibles = balade.placesInitiales;
    });

    // Mettre à jour le store
    baladesStore.set(this.balades);

    // Sauvegarder dans le fichier JSON
    await this.sauvegarderBalades();

    return true;
  }

  // Sauvegarder les balades dans le fichier JSON
  private async sauvegarderBalades(): Promise<void> {
    try {
      // En développement, on peut sauvegarder dans un fichier temporaire
      // En production, cela devrait être géré par une API
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const filePath = path.join(process.cwd(), 'src/lib/balades-argentique.json');
      const dataToSave = {
        baladesProgrammees: this.balades
      };

      await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), 'utf8');
      console.log('✅ Balades sauvegardées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des balades:', error);
      // En cas d'erreur, on ne fait rien pour ne pas casser l'application
    }
  }

  // Vérifier si une balade est complète
  isBaladeComplete(baladeId: number): boolean {
    const balade = this.getBaladeById(baladeId);
    return balade ? balade.placesDisponibles === 0 : false;
  }

  // Obtenir le statut d'une balade
  getBaladeStatus(baladeId: number): 'disponible' | 'limite' | 'complete' {
    const balade = this.getBaladeById(baladeId);
    if (!balade) return 'complete';

    if (balade.placesDisponibles === 0) return 'complete';
    if (balade.placesDisponibles <= 2) return 'limite';
    return 'disponible';
  }
}

// Instance singleton du service
export const baladesService = new BaladesService();
