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
  statut: 'brouillon' | 'en_ligne';
  type: 'payante' | 'invitation';
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
  theme?: string;
  date?: string;
  heure?: string;
  statut?: 'en_attente' | 'confirmee' | 'annulee';
  paymentIntentId?: string;
  montant?: number;
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
      consignes: row.consignes ? JSON.parse(row.consignes) : [],
      materiel: row.materiel ? JSON.parse(row.materiel) : [],
      coordonnees: row.coordonnees ? JSON.parse(row.coordonnees) : [],
      parcours: row.parcours ? JSON.parse(row.parcours) : [],
      statut: row.statut || 'en_ligne',
      type: row.type || 'payante'
    }));
  }

  // Récupérer toutes les balades en ligne (pour l'affichage public)
  getBaladesEnLigne(): Balade[] {
    const stmt = db.prepare('SELECT * FROM balades WHERE statut = ? ORDER BY date, heure');
    const rows = stmt.all('en_ligne') as any[];
    
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      heure: row.heure,
      lieu: row.lieu,
      theme: row.theme,
      placesDisponibles: row.places_disponibles,
      prix: row.prix,
      description: row.description,
      consignes: row.consignes ? JSON.parse(row.consignes) : [],
      materiel: row.materiel ? JSON.parse(row.materiel) : [],
      coordonnees: row.coordonnees ? JSON.parse(row.coordonnees) : [],
      parcours: row.parcours ? JSON.parse(row.parcours) : [],
      statut: row.statut || 'en_ligne',
      type: row.type || 'payante'
    }));
  }

  // Récupérer les balades passées (archivées) - date < aujourd'hui
  getBaladesArchivees(): Balade[] {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const stmt = db.prepare('SELECT * FROM balades WHERE date < ? ORDER BY date DESC, heure DESC');
    const rows = stmt.all(today) as any[];
    
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      heure: row.heure,
      lieu: row.lieu,
      theme: row.theme,
      placesDisponibles: row.places_disponibles,
      prix: row.prix,
      description: row.description,
      consignes: row.consignes ? JSON.parse(row.consignes) : [],
      materiel: row.materiel ? JSON.parse(row.materiel) : [],
      coordonnees: row.coordonnees ? JSON.parse(row.coordonnees) : [],
      parcours: row.parcours ? JSON.parse(row.parcours) : [],
      statut: row.statut || 'en_ligne',
      type: row.type || 'payante'
    }));
  }

  // Récupérer les balades futures (non archivées) - date >= aujourd'hui
  getBaladesFutures(): Balade[] {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const stmt = db.prepare('SELECT * FROM balades WHERE date >= ? AND statut = ? ORDER BY date, heure');
    const rows = stmt.all(today, 'en_ligne') as any[];
    
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      heure: row.heure,
      lieu: row.lieu,
      theme: row.theme,
      placesDisponibles: row.places_disponibles,
      prix: row.prix,
      description: row.description,
      consignes: row.consignes ? JSON.parse(row.consignes) : [],
      materiel: row.materiel ? JSON.parse(row.materiel) : [],
      coordonnees: row.coordonnees ? JSON.parse(row.coordonnees) : [],
      parcours: row.parcours ? JSON.parse(row.parcours) : [],
      statut: row.statut || 'en_ligne',
      type: row.type || 'payante'
    }));
  }

  // Récupérer les balades payantes (pour l'affichage public)
  getBaladesPayantes(): Balade[] {
    const today = new Date().toISOString().split('T')[0];
    const stmt = db.prepare('SELECT * FROM balades WHERE date >= ? AND statut = ? AND type = ? ORDER BY date, heure');
    const rows = stmt.all(today, 'en_ligne', 'payante') as any[];
    
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      heure: row.heure,
      lieu: row.lieu,
      theme: row.theme,
      placesDisponibles: row.places_disponibles,
      prix: row.prix,
      description: row.description,
      consignes: row.consignes ? JSON.parse(row.consignes) : [],
      materiel: row.materiel ? JSON.parse(row.materiel) : [],
      coordonnees: row.coordonnees ? JSON.parse(row.coordonnees) : [],
      parcours: row.parcours ? JSON.parse(row.parcours) : [],
      statut: row.statut || 'en_ligne',
      type: row.type || 'payante'
    }));
  }

  // Récupérer les balades sur invitation (pour l'affichage public)
  getBaladesInvitation(): Balade[] {
    const today = new Date().toISOString().split('T')[0];
    const stmt = db.prepare('SELECT * FROM balades WHERE date >= ? AND statut = ? AND type = ? ORDER BY date, heure');
    const rows = stmt.all(today, 'en_ligne', 'invitation') as any[];
    
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      heure: row.heure,
      lieu: row.lieu,
      theme: row.theme,
      placesDisponibles: row.places_disponibles,
      prix: row.prix,
      description: row.description,
      consignes: row.consignes ? JSON.parse(row.consignes) : [],
      materiel: row.materiel ? JSON.parse(row.materiel) : [],
      coordonnees: row.coordonnees ? JSON.parse(row.coordonnees) : [],
      parcours: row.parcours ? JSON.parse(row.parcours) : [],
      statut: row.statut || 'en_ligne',
      type: row.type || 'payante'
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
      parcours: JSON.parse(row.parcours),
      statut: row.statut || 'en_ligne',
      type: row.type || 'payante'
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
    nom: string;
    email: string;
    statut?: 'en_attente' | 'confirmee' | 'annulee';
    paymentIntentId?: string;
    montant?: number;
    prenom?: string;
    nombrePersonnes?: number;
    message?: string;
  }): Reservation | null {
    try {
      const stmt = db.prepare(`
        INSERT INTO reservations (
          balade_id, prenom, nom, email, nombre_personnes, message, 
          statut, payment_intent_id, montant, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        reservationData.baladeId,
        reservationData.prenom || '',
        reservationData.nom,
        reservationData.email,
        reservationData.nombrePersonnes || 1,
        reservationData.message || '',
        reservationData.statut || 'en_attente',
        reservationData.paymentIntentId || null,
        reservationData.montant || null,
        new Date().toISOString()
      );

      if (result.changes > 0) {
        return this.getReservationById(result.lastInsertRowid as number);
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      return null;
    }
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
      statut: row.statut || 'en_attente', // Ajouter le statut
      present: row.present === 1, // Convertir en boolean
      createdAt: row.created_at
    }));
  }

  // Mettre à jour la présence d'une réservation
  updatePresence(reservationId: number, present: boolean): boolean {
    try {
      const stmt = db.prepare('UPDATE reservations SET present = ? WHERE id = ?');
      const result = stmt.run(present ? 1 : 0, reservationId);
      
      return result.changes > 0;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
      return false;
    }
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

  // Créer une nouvelle balade
  creerBalade(baladeData: {
    theme: string;
    date: string;
    heure: string;
    lieu: string;
    prix: string;
    placesDisponibles: number;
    description: string;
    statut?: 'brouillon' | 'en_ligne';
    type?: 'payante' | 'invitation';
    consignes: string[];
    materiel: string[];
    coordonnees: Array<{lat: number, lng: number, name: string}>;
    parcours: Array<{
      titre: string;
      description: string;
      duree: string;
      distance: string;
    }>;
  }): Balade | null {
    try {
      const stmt = db.prepare(`
        INSERT INTO balades (
          theme, date, heure, lieu, prix, places_disponibles, description, statut, type,
          consignes, materiel, coordonnees, parcours
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        baladeData.theme,
        baladeData.date,
        baladeData.heure,
        baladeData.lieu,
        baladeData.prix,
        baladeData.placesDisponibles,
        baladeData.description,
        baladeData.statut || 'en_ligne',
        baladeData.type || 'payante',
        JSON.stringify(baladeData.consignes),
        JSON.stringify(baladeData.materiel),
        JSON.stringify(baladeData.coordonnees),
        JSON.stringify(baladeData.parcours)
      );

      if (result.changes > 0) {
        return this.getBaladeById(result.lastInsertRowid as number);
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la création de la balade:', error);
      return null;
    }
  }

  // Modifier une balade existante
  modifierBalade(baladeId: number, baladeData: {
    theme: string;
    date: string;
    heure: string;
    lieu: string;
    prix: string;
    placesDisponibles: number;
    description: string;
    statut?: 'brouillon' | 'en_ligne';
    type?: 'payante' | 'invitation';
    parcours?: Array<{
      titre: string;
      description: string;
      latitude: number;
      longitude: number;
    }>;
    coordonnees?: Array<{
      latitude: number;
      longitude: number;
    }>;
  }): Balade | null {
    try {
      // Récupérer la balade existante pour les valeurs par défaut
      const existingBalade = this.getBaladeById(baladeId);
      if (!existingBalade) return null;

      const stmt = db.prepare(`
        UPDATE balades 
        SET theme = ?, date = ?, heure = ?, lieu = ?, prix = ?, places_disponibles = ?, description = ?, statut = ?, type = ?,
            parcours = ?, coordonnees = ?
        WHERE id = ?
      `);
      
      const result = stmt.run(
        baladeData.theme,
        baladeData.date,
        baladeData.heure,
        baladeData.lieu,
        baladeData.prix,
        baladeData.placesDisponibles,
        baladeData.description,
        baladeData.statut || existingBalade.statut,
        baladeData.type || existingBalade.type,
        JSON.stringify(baladeData.parcours || existingBalade.parcours),
        JSON.stringify(baladeData.coordonnees || existingBalade.coordonnees),
        baladeId
      );

      if (result.changes > 0) {
        return this.getBaladeById(baladeId);
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la modification de la balade:', error);
      return null;
    }
  }

  // Supprimer une balade
  supprimerBalade(baladeId: number): boolean {
    try {
      // Supprimer d'abord les réservations associées
      const deleteReservations = db.prepare('DELETE FROM reservations WHERE balade_id = ?');
      deleteReservations.run(baladeId);
      
      // Puis supprimer la balade
      const deleteBalade = db.prepare('DELETE FROM balades WHERE id = ?');
      const result = deleteBalade.run(baladeId);
      
      return result.changes > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression de la balade:', error);
      return false;
    }
  }

  // Supprimer une réservation
  supprimerReservation(reservationId: number): boolean {
    try {
      const deleteReservation = db.prepare('DELETE FROM reservations WHERE id = ?');
      const result = deleteReservation.run(reservationId);
      
      return result.changes > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      return false;
    }
  }

  // Récupérer une réservation par ID
  getReservationById(reservationId: number): Reservation | null {
    try {
      const stmt = db.prepare(`
        SELECT r.*, b.theme, b.date, b.heure 
        FROM reservations r 
        JOIN balades b ON r.balade_id = b.id 
        WHERE r.id = ?
      `);
      
      const row = stmt.get(reservationId) as any;
      
      if (!row) return null;

      return {
        id: row.id,
        baladeId: row.balade_id,
        prenom: row.prenom,
        nom: row.nom,
        email: row.email,
        nombrePersonnes: row.nombre_personnes,
        message: row.message,
        createdAt: row.created_at,
        theme: row.theme,
        date: row.date,
        heure: row.heure,
        statut: row.statut,
        paymentIntentId: row.payment_intent_id,
        montant: row.montant,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la réservation:', error);
      return null;
    }
  }

  // Décrémenter le nombre de places disponibles
  decrementerPlacesDisponibles(baladeId: number): boolean {
    try {
      const stmt = db.prepare(`
        UPDATE balades 
        SET places_disponibles = places_disponibles - 1 
        WHERE id = ? AND places_disponibles > 0
      `);
      
      const result = stmt.run(baladeId);
      
      if (result.changes > 0) {
        console.log(`✅ Place décrémentée pour la balade ${baladeId}`);
        return true;
      } else {
        console.log(`❌ Impossible de décrémenter les places pour la balade ${baladeId} (places insuffisantes ou balade inexistante)`);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la décrémentation des places:', error);
      return false;
    }
  }

  // Décrémenter plusieurs places d'un coup
  decrementerPlacesDisponiblesMultiple(baladeId: number, nombrePlaces: number): boolean {
    try {
      const stmt = db.prepare(`
        UPDATE balades 
        SET places_disponibles = places_disponibles - ? 
        WHERE id = ? AND places_disponibles >= ?
      `);
      
      const result = stmt.run(nombrePlaces, baladeId, nombrePlaces);
      
      if (result.changes > 0) {
        console.log(`✅ ${nombrePlaces} place(s) décrémentée(s) pour la balade ${baladeId}`);
        return true;
      } else {
        console.log(`❌ Impossible de décrémenter ${nombrePlaces} place(s) pour la balade ${baladeId} (places insuffisantes)`);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la décrémentation multiple des places:', error);
      return false;
    }
  }

  // Corriger les places disponibles basées sur les réservations confirmées
  corrigerPlacesDisponibles(): { baladesCorrigees: number; placesCorrigees: number } {
    try {
      console.log('🔧 Début de la correction des places disponibles...');
      
      // Récupérer toutes les balades
      const balades = db.prepare('SELECT id, places_disponibles FROM balades').all() as any[];
      let baladesCorrigees = 0;
      let placesCorrigees = 0;
      
      balades.forEach(balade => {
        // Compter les places réservées confirmées pour cette balade
        const stmt = db.prepare(`
          SELECT SUM(nombre_personnes) as total_reservees
          FROM reservations 
          WHERE balade_id = ? AND statut = 'confirmee'
        `);
        
        const result = stmt.get(balade.id) as any;
        const placesReservees = result?.total_reservees || 0;
        
        // Calculer les places qui devraient être disponibles
        // On suppose que chaque balade avait initialement 5 places (à ajuster selon vos besoins)
        const placesInitiales = 5; // Vous pouvez ajuster cette valeur
        const placesDevraientEtre = Math.max(0, placesInitiales - placesReservees);
        
        if (balade.places_disponibles !== placesDevraientEtre) {
          console.log(`   Balade ${balade.id}: ${balade.places_disponibles} → ${placesDevraientEtre} places (${placesReservees} réservées)`);
          
          const updateStmt = db.prepare('UPDATE balades SET places_disponibles = ? WHERE id = ?');
          const updateResult = updateStmt.run(placesDevraientEtre, balade.id);
          
          if (updateResult.changes > 0) {
            baladesCorrigees++;
            placesCorrigees += Math.abs(balade.places_disponibles - placesDevraientEtre);
          }
        }
      });
      
      console.log(`✅ Correction terminée: ${baladesCorrigees} balade(s) corrigée(s), ${placesCorrigees} place(s) ajustée(s)`);
      
      return { baladesCorrigees, placesCorrigees };
    } catch (error) {
      console.error('Erreur lors de la correction des places:', error);
      return { baladesCorrigees: 0, placesCorrigees: 0 };
    }
  }

  // Récupérer les réservations d'une balade
  getReservationsByBalade(baladeId: number): Reservation[] {
    try {
      const stmt = db.prepare(`
        SELECT r.*, b.theme, b.date, b.heure 
        FROM reservations r 
        JOIN balades b ON r.balade_id = b.id 
        WHERE r.balade_id = ? 
        ORDER BY r.created_at DESC
      `);
      
      const rows = stmt.all(baladeId) as any[];
      
      return rows.map(row => ({
        id: row.id,
        baladeId: row.balade_id,
        prenom: row.prenom,
        nom: row.nom,
        email: row.email,
        nombrePersonnes: row.nombre_personnes,
        message: row.message,
        createdAt: row.created_at,
        theme: row.theme,
        date: row.date,
        heure: row.heure,
        statut: row.statut,
        paymentIntentId: row.payment_intent_id,
        montant: row.montant,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      return [];
    }
  }

  // Modifier une réservation
  modifierReservation(reservationId: number, updates: {
    statut?: 'en_attente' | 'confirmee' | 'annulee';
    paymentIntentId?: string;
    montant?: number;
  }): boolean {
    try {
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (updates.statut !== undefined) {
        updateFields.push('statut = ?');
        updateValues.push(updates.statut);
      }

      if (updates.paymentIntentId !== undefined) {
        updateFields.push('payment_intent_id = ?');
        updateValues.push(updates.paymentIntentId);
      }

      if (updates.montant !== undefined) {
        updateFields.push('montant = ?');
        updateValues.push(updates.montant);
      }

      if (updateFields.length === 0) {
        return false;
      }

      updateValues.push(reservationId);

      const stmt = db.prepare(`
        UPDATE reservations 
        SET ${updateFields.join(', ')} 
        WHERE id = ?
      `);
      
      const result = stmt.run(...updateValues);
      
      return result.changes > 0;
    } catch (error) {
      console.error('Erreur lors de la modification de la réservation:', error);
      return false;
    }
  }
}

export const baladesService = new BaladesService();
