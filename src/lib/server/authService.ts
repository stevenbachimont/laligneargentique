import { env } from '$env/dynamic/private';
import crypto from 'crypto';

export interface AdminSession {
  isAuthenticated: boolean;
  sessionId: string;
  expiresAt: number;
  ipAddress?: string;
  userAgent?: string;
}

export class AuthService {
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  
  // Stockage en mémoire des sessions (en production, utilisez Redis ou une DB)
  private static sessions = new Map<string, AdminSession>();
  private static loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

  /**
   * Vérifier si un token de session est valide
   */
  static validateSession(sessionToken: string, ipAddress?: string): boolean {
    if (!sessionToken) return false;

    const session = this.sessions.get(sessionToken);
    if (!session) return false;

    // Vérifier l'expiration
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionToken);
      return false;
    }

    // Vérifier l'IP si fournie (optionnel, peut être désactivé pour la flexibilité)
    if (ipAddress && session.ipAddress && session.ipAddress !== ipAddress) {
      console.warn('Tentative d\'accès avec une IP différente:', { sessionToken, expectedIP: session.ipAddress, actualIP: ipAddress });
      // Ne pas bloquer automatiquement, juste logger
    }

    return true;
  }

  /**
   * Créer une nouvelle session d'administration
   */
  static createSession(ipAddress?: string, userAgent?: string): string {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + this.SESSION_DURATION;

    const session: AdminSession = {
      isAuthenticated: true,
      sessionId,
      expiresAt,
      ipAddress,
      userAgent
    };

    this.sessions.set(sessionId, session);
    
    // Nettoyer les sessions expirées
    this.cleanupExpiredSessions();

    return sessionId;
  }

  /**
   * Authentifier un administrateur avec le code d'accès
   */
  static authenticateAdmin(accessCode: string, ipAddress?: string): { success: boolean; sessionToken?: string; error?: string } {
    // Vérifier les tentatives de connexion
    if (ipAddress) {
      const attempts = this.loginAttempts.get(ipAddress);
      if (attempts) {
        const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
        if (attempts.count >= this.MAX_LOGIN_ATTEMPTS && timeSinceLastAttempt < this.LOCKOUT_DURATION) {
          const remainingTime = Math.ceil((this.LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
          return {
            success: false,
            error: `Trop de tentatives de connexion. Réessayez dans ${remainingTime} minutes.`
          };
        }
      }
    }

    // Vérifier le code d'accès
    const adminCode = env.ADMIN_ACCESS_CODE || 'argentique2024';
    if (accessCode !== adminCode) {
      // Enregistrer la tentative échouée
      if (ipAddress) {
        const attempts = this.loginAttempts.get(ipAddress) || { count: 0, lastAttempt: 0 };
        attempts.count++;
        attempts.lastAttempt = Date.now();
        this.loginAttempts.set(ipAddress, attempts);
      }
      
      return {
        success: false,
        error: 'Code d\'accès incorrect'
      };
    }

    // Réinitialiser les tentatives en cas de succès
    if (ipAddress) {
      this.loginAttempts.delete(ipAddress);
    }

    // Créer la session
    const sessionToken = this.createSession(ipAddress);
    
    return {
      success: true,
      sessionToken
    };
  }

  /**
   * Invalider une session
   */
  static invalidateSession(sessionToken: string): boolean {
    return this.sessions.delete(sessionToken);
  }

  /**
   * Nettoyer les sessions expirées
   */
  private static cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [token, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(token);
      }
    }
  }

  /**
   * Obtenir les statistiques des sessions
   */
  static getSessionStats(): { activeSessions: number; totalAttempts: number } {
    this.cleanupExpiredSessions();
    return {
      activeSessions: this.sessions.size,
      totalAttempts: this.loginAttempts.size
    };
  }

  /**
   * Middleware pour vérifier l'authentification admin
   */
  static requireAdminAuth(request: Request): { isAuthenticated: boolean; error?: string } {
    const sessionToken = request.headers.get('x-admin-session') || 
                        request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionToken) {
      return {
        isAuthenticated: false,
        error: 'Token de session manquant'
      };
    }

    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    if (!this.validateSession(sessionToken, clientIP)) {
      return {
        isAuthenticated: false,
        error: 'Session invalide ou expirée'
      };
    }

    return { isAuthenticated: true };
  }
}
