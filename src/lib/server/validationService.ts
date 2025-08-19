import type { EmailData, ValidationResult } from './types';

export class ValidationService {
  // Valider les données de réservation argentique
  static validateArgentiqueReservation(data: EmailData): ValidationResult {
    const errors: string[] = [];

    // Validation du nom
    if (!data.nom || data.nom.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }

    // Validation du prénom
    if (!data.prenom || data.prenom.trim().length < 2) {
      errors.push('Le prénom doit contenir au moins 2 caractères');
    }

    // Validation de l'email
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('L\'adresse email n\'est pas valide');
    }

    // Validation de la date
    if (!data.dateSouhaitee) {
      errors.push('La date souhaitée est requise');
    } else {
      const selectedDate = new Date(data.dateSouhaitee);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.push('La date souhaitée ne peut pas être dans le passé');
      }
    }

    // Validation du nombre de personnes
    if (!data.nombrePersonnes || data.nombrePersonnes < 1 || data.nombrePersonnes > 5) {
      errors.push('Le nombre de personnes doit être entre 1 et 5');
    }

    // Validation du téléphone (optionnel mais si fourni, doit être valide)
    if (data.telephone && !this.isValidPhone(data.telephone)) {
      errors.push('Le numéro de téléphone n\'est pas valide');
    }

    // Validation du message (optionnel mais si fourni, ne pas être trop long)
    if (data.message && data.message.length > 1000) {
      errors.push('Le message ne peut pas dépasser 1000 caractères');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Valider une adresse email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Valider un numéro de téléphone français
  private static isValidPhone(phone: string): boolean {
    // Supprimer tous les caractères non numériques
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Vérifier si c'est un numéro français valide (10 chiffres commençant par 0)
    if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
      return true;
    }
    
    // Vérifier si c'est un numéro international français (+33)
    if (cleanPhone.length === 11 && cleanPhone.startsWith('33')) {
      return true;
    }
    
    return false;
  }

  // Nettoyer les données avant envoi
  static sanitizeData(data: EmailData): EmailData {
    return {
      nom: data.nom.trim(),
      prenom: data.prenom.trim(),
      email: data.email.trim().toLowerCase(),
      telephone: data.telephone?.trim() || '',
      dateSouhaitee: data.dateSouhaitee,
      nombrePersonnes: parseInt(data.nombrePersonnes.toString()),
      message: data.message?.trim() || ''
    };
  }
}
