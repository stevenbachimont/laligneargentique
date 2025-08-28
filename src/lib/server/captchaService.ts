import { randomBytes } from 'crypto';
import { readdirSync } from 'fs';
import { join } from 'path';

export interface SharpnessChallenge {
  id: string;
  imageUrl: string;
  targetPosition: { x: number; y: number };
  tolerance: number;
  expiresAt: Date;
}

class CaptchaService {
  private challenges: Map<string, SharpnessChallenge> = new Map();
  private photoImages: { imageUrl: string; description: string }[] = [];
  
  constructor() {
    this.loadCaptchaImages();
  }

  // Charger automatiquement les images disponibles
  private loadCaptchaImages() {
    try {
      const captchaDir = join(process.cwd(), 'static', 'images', 'captcha');
      const files = readdirSync(captchaDir);
      
      // Filtrer les fichiers d'images supportés
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && 
        !file.startsWith('.') && 
        !file.toLowerCase().includes('readme')
      );
      
      this.photoImages = imageFiles.map(file => ({
        imageUrl: `/images/captcha/${file}`,
        description: `Image captcha: ${file}`
      }));
      
      console.log(`📸 Captcha: ${this.photoImages.length} images chargées:`, 
        this.photoImages.map(img => img.imageUrl));
    } catch (error) {
      console.error('❌ Erreur lors du chargement des images captcha:', error);
      // Fallback avec une image par défaut
      this.photoImages = [
        { imageUrl: "/images/captcha/IMG_8176.jpg", description: "Image par défaut" }
      ];
    }
  }

  // Recharger les images (utile pour le développement)
  reloadImages() {
    this.loadCaptchaImages();
  }

  generateCaptcha(): SharpnessChallenge {
    this.cleanupExpiredChallenges();
    
    if (this.photoImages.length === 0) {
      throw new Error('Aucune image captcha disponible');
    }
    
    const id = randomBytes(16).toString('hex');
    const imageData = this.photoImages[Math.floor(Math.random() * this.photoImages.length)];
    
    // Position cible aléatoire pour la netteté (évite le centre systématique)
    const targetPosition = {
      x: Math.random() * 80 + 10, // Entre 10% et 90% de la largeur
      y: Math.random() * 80 + 10  // Entre 10% et 90% de la hauteur
    };
    
    const tolerance = 20; // Tolérance pour la validation

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

  validateCaptcha(captchaId: string, userPosition: string): boolean {
    const challenge = this.challenges.get(captchaId);
    
    if (!challenge || new Date() > challenge.expiresAt) {
      return false;
    }

    try {
      const position = JSON.parse(userPosition);
      
      if (!position.x || !position.y) {
        return false;
      }

      // Calculer la distance euclidienne entre la position utilisateur et la cible
      const distance = Math.sqrt(
        Math.pow(position.x - challenge.targetPosition.x, 2) + 
        Math.pow(position.y - challenge.targetPosition.y, 2)
      );

      const isValid = distance <= challenge.tolerance;
      
      // Si valide, supprimer le challenge pour éviter la réutilisation
      if (isValid) {
        this.challenges.delete(captchaId);
      }

      return isValid;
    } catch (error) {
      return false;
    }
  }

  getChallenge(captchaId: string): SharpnessChallenge | undefined {
    return this.challenges.get(captchaId);
  }

  // Obtenir la liste des images disponibles
  getAvailableImages() {
    return this.photoImages;
  }

  private cleanupExpiredChallenges(): void {
    const now = new Date();
    for (const [id, challenge] of this.challenges.entries()) {
      if (now > challenge.expiresAt) {
        this.challenges.delete(id);
      }
    }
  }
}

export const captchaService = new CaptchaService();
