import db from './database';

export interface Balade {
  id: number;
  date: string;
  heure: string;
  lieu: string;
  theme: string;
  placesDisponibles: number;
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

export interface Reservation {
  id: number;
  baladeId: number;
  prenom: string;
  nom: string;
  email: string;
  nombrePersonnes: number;
  message?: string;
  createdAt: string;
}

class BaladesService {
  // Récupérer toutes les balades
  getAllBalades(): Balade[] {
    const stmt = db.prepare('SELECT * FROM balades ORDER BY date, heure');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      heure: row.heure,
      lieu: row.lieu,
      theme: row.theme,
      placesDisponibles: row.places_disponibles,
      prix: row.prix,
      description: row.description,
      consignes: JSON.parse(row.consignes),
      materiel: JSON.parse(row.materiel),
      coordonnees: JSON.parse(row.coordonnees),
      parcours: JSON.parse(row.parcours)
    }));
  }

  // Récupérer une balade par ID
  getBaladeById(id: number): Balade | null {
    const stmt = db.prepare('SELECT * FROM balades WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      id: row.id,
      date: row.date,
      heure: row.heure,
      lieu: row.lieu,
      theme: row.theme,
      placesDisponibles: row.places_disponibles,
      prix: row.prix,
      description: row.description,
      consignes: JSON.parse(row.consignes),
      materiel: JSON.parse(row.materiel),
      coordonnees: JSON.parse(row.coordonnees),
      parcours: JSON.parse(row.parcours)
    };
  }

  // Vérifier si une balade a des places disponibles
  hasPlacesAvailable(baladeId: number, nombrePersonnes: number = 1): boolean {
    const balade = this.getBaladeById(baladeId);
    return balade ? balade.placesDisponibles >= nombrePersonnes : false;
  }

  // Réserver des places pour une balade
  reserverPlaces(baladeId: number, nombrePersonnes: number = 1): boolean {
    const balade = this.getBaladeById(baladeId);
    if (!balade || balade.placesDisponibles < nombrePersonnes) {
      return false;
    }

    const stmt = db.prepare('UPDATE balades SET places_disponibles = places_disponibles - ? WHERE id = ?');
    const result = stmt.run(nombrePersonnes, baladeId);
    
    return result.changes > 0;
  }

  // Créer une réservation
  creerReservation(reservationData: {
    baladeId: number;
    prenom: string;
    nom: string;
    email: string;
    nombrePersonnes: number;
    message?: string;
  }): boolean {
    // Vérifier la disponibilité
    if (!this.hasPlacesAvailable(reservationData.baladeId, reservationData.nombrePersonnes)) {
      return false;
    }

    // Insérer la réservation
    const stmt = db.prepare(`
      INSERT INTO reservations (balade_id, prenom, nom, email, nombre_personnes, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      reservationData.baladeId,
      reservationData.prenom,
      reservationData.nom,
      reservationData.email,
      reservationData.nombrePersonnes,
      reservationData.message || null
    );

    if (result.changes > 0) {
      // Mettre à jour les places disponibles
      return this.reserverPlaces(reservationData.baladeId, reservationData.nombrePersonnes);
    }

    return false;
  }

  // Récupérer toutes les réservations
  getAllReservations(): Reservation[] {
    const stmt = db.prepare(`
      SELECT r.*, b.theme, b.date, b.heure 
      FROM reservations r 
      JOIN balades b ON r.balade_id = b.id 
      ORDER BY r.created_at DESC
    `);
    
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      baladeId: row.balade_id,
      prenom: row.prenom,
      nom: row.nom,
      email: row.email,
      nombrePersonnes: row.nombre_personnes,
      message: row.message,
      createdAt: row.created_at
    }));
  }

  // Obtenir le statut d'une balade
  getBaladeStatus(baladeId: number): string {
    const balade = this.getBaladeById(baladeId);
    if (!balade) return 'unknown';

    if (balade.placesDisponibles === 0) return 'complete';
    if (balade.placesDisponibles <= 2) return 'limite';
    return 'disponible';
  }

  // Vérifier si une balade est complète
  isBaladeComplete(baladeId: number): boolean {
    const balade = this.getBaladeById(baladeId);
    return balade ? balade.placesDisponibles === 0 : true;
  }

  // Réinitialiser les places d'une balade
  resetPlaces(baladeId: number, placesInitiales: number): boolean {
    const stmt = db.prepare('UPDATE balades SET places_disponibles = ? WHERE id = ?');
    const result = stmt.run(placesInitiales, baladeId);
    
    return result.changes > 0;
  }
}

export const baladesService = new BaladesService();
