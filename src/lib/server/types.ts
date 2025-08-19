// Types pour le service d'emails
export interface EmailData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateSouhaitee: string;
  nombrePersonnes: number;
  message?: string;
}

// Types pour les réponses API
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Types pour la validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
