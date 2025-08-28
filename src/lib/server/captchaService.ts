import { randomBytes } from 'crypto';

export interface SharpnessChallenge {
  id: string;
  imageUrl: string;
  targetPosition: { x: number; y: number }; // Position cible pour 100% de netteté
  tolerance: number; // Tolérance acceptée pour la distance
  expiresAt: Date;
}

class CaptchaService {
  private challenges: Map<string, SharpnessChallenge> = new Map();

  // Base de données d'images pour le captcha
  private photoImages = [
    {
      imageUrl: "/images/captcha/IMG_8176.png",
      description: "Photo de test"
    }
  ];

  /**
   * Génère un nouveau défi captcha de netteté
   */
  generateCaptcha(): SharpnessChallenge {
    // Nettoyer les anciens défis expirés
    this.cleanupExpiredChallenges();

    // Générer un ID unique
    const id = randomBytes(16).toString('hex');
    
    // Sélectionner une image aléatoire
    const imageData = this.photoImages[Math.floor(Math.random() * this.photoImages.length)];
    
    // Générer une position cible aléatoire pour le 100% de netteté
    const targetPosition = {
      x: Math.random() * 80 + 10, // Entre 10% et 90%
      y: Math.random() * 80 + 10
    };
    
    const tolerance = 25; // Tolérance plus large pour faciliter la validation

    const challenge: SharpnessChallenge = {
      id,
      imageUrl: imageData.imageUrl,
      targetPosition,
      tolerance,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // Expire dans 10 minutes
    };

    this.challenges.set(id, challenge);
    
    return challenge;
  }

  /**
   * Valide une réponse de captcha de netteté
   */
  validateCaptcha(captchaId: string, userPosition: string): boolean {
    const challenge = this.challenges.get(captchaId);
    
    if (!challenge) {
      return false; // Défi non trouvé
    }

    if (new Date() > challenge.expiresAt) {
      this.challenges.delete(captchaId);
      return false; // Défi expiré
    }

    try {
      const position = JSON.parse(userPosition);
      if (!position.x || !position.y) {
        return false;
      }

      // Calculer la distance entre la position utilisateur et la cible
      const distance = Math.sqrt(
        Math.pow(position.x - challenge.targetPosition.x, 2) + 
        Math.pow(position.y - challenge.targetPosition.y, 2)
      );
      
      // Vérifier si la position est dans la tolérance
      const isValid = distance <= challenge.tolerance;
      
      if (isValid) {
        // Supprimer le défi après validation réussie
        this.challenges.delete(captchaId);
      }
      
      return isValid;
    } catch (error) {
      return false; // Erreur de parsing JSON
    }
  }

  /**
   * Nettoie les défis expirés
   */
  private cleanupExpiredChallenges(): void {
    const now = new Date();
    for (const [id, challenge] of this.challenges.entries()) {
      if (now > challenge.expiresAt) {
        this.challenges.delete(id);
      }
    }
  }

  /**
   * Obtient un défi par ID (pour vérification)
   */
  getChallenge(captchaId: string): SharpnessChallenge | null {
    const challenge = this.challenges.get(captchaId);
    if (challenge && new Date() <= challenge.expiresAt) {
      return challenge;
    }
    return null;
  }
}

// Instance singleton
export const captchaService = new CaptchaService();
