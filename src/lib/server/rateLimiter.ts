/**
 * Rate Limiter simple pour protéger contre les attaques par force brute
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private static readonly DEFAULT_WINDOW = 15 * 60 * 1000; // 15 minutes
  private static readonly DEFAULT_MAX_ATTEMPTS = 5;
  
  // Stockage en mémoire des tentatives (en production, utilisez Redis)
  private static attempts = new Map<string, RateLimitEntry>();

  /**
   * Vérifier si une IP a dépassé la limite de tentatives
   */
  static isRateLimited(identifier: string, maxAttempts: number = this.DEFAULT_MAX_ATTEMPTS, windowMs: number = this.DEFAULT_WINDOW): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      return false;
    }

    // Si la fenêtre de temps est expirée, réinitialiser
    if (now > entry.resetTime) {
      this.attempts.delete(identifier);
      return false;
    }

    return entry.count >= maxAttempts;
  }

  /**
   * Enregistrer une tentative
   */
  static recordAttempt(identifier: string, windowMs: number = this.DEFAULT_WINDOW): void {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Nouvelle entrée ou fenêtre expirée
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
    } else {
      // Incrémenter le compteur
      entry.count++;
    }

    // Nettoyer les entrées expirées
    this.cleanup();
  }

  /**
   * Obtenir le temps restant avant réinitialisation
   */
  static getTimeRemaining(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return 0;

    const now = Date.now();
    if (now > entry.resetTime) {
      this.attempts.delete(identifier);
      return 0;
    }

    return Math.ceil((entry.resetTime - now) / 1000);
  }

  /**
   * Obtenir le nombre de tentatives restantes
   */
  static getRemainingAttempts(identifier: string, maxAttempts: number = this.DEFAULT_MAX_ATTEMPTS): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return maxAttempts;

    const now = Date.now();
    if (now > entry.resetTime) {
      this.attempts.delete(identifier);
      return maxAttempts;
    }

    return Math.max(0, maxAttempts - entry.count);
  }

  /**
   * Réinitialiser les tentatives pour un identifiant
   */
  static resetAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }

  /**
   * Nettoyer les entrées expirées
   */
  private static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(key);
      }
    }
  }

  /**
   * Obtenir les statistiques du rate limiter
   */
  static getStats(): { totalEntries: number; activeEntries: number } {
    this.cleanup();
    return {
      totalEntries: this.attempts.size,
      activeEntries: this.attempts.size
    };
  }
}

/**
 * Middleware pour ajouter le rate limiting aux routes
 */
export function withRateLimit(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
  return function(handler: any) {
    return async (event: any) => {
      const clientIP = event.request.headers.get('x-forwarded-for') || 
                      event.request.headers.get('x-real-ip') || 
                      'unknown';

      if (RateLimiter.isRateLimited(clientIP, maxAttempts, windowMs)) {
        const timeRemaining = RateLimiter.getTimeRemaining(clientIP);
        return new Response(JSON.stringify({
          success: false,
          error: `Trop de tentatives. Réessayez dans ${Math.ceil(timeRemaining / 60)} minutes.`,
          code: 'RATE_LIMITED'
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': timeRemaining.toString()
          }
        });
      }

      // Enregistrer la tentative
      RateLimiter.recordAttempt(clientIP, windowMs);

      return handler(event);
    };
  };
}
