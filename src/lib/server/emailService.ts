import type { EmailData } from './types';
import { createTransport } from 'nodemailer';
import { env } from '$env/dynamic/private';
import { EmailTemplateService } from './emailTemplateService';

// Configuration du transporteur email
const createTransporter = () => {
  // Configuration pour Gmail (vous pouvez adapter pour d'autres fournisseurs)
  return createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_APP_PASSWORD // Mot de passe d'application Gmail
    }
  });
};

// Configuration pour un serveur SMTP personnalisé (alternative)
const createCustomTransporter = () => {
  return createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(env.SMTP_PORT || '587'),
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
};

// Service d'envoi d'emails
export class EmailService {
  private transporter: any;
  private templateService: EmailTemplateService;

  constructor() {
    this.templateService = new EmailTemplateService();
    
    // Utiliser le transporteur Gmail par défaut, sinon le SMTP personnalisé
    if (env.EMAIL_USER && env.EMAIL_APP_PASSWORD) {
      console.log('Configuration email détectée:', {
        user: env.EMAIL_USER,
        password: env.EMAIL_APP_PASSWORD ? 'Configuré' : 'Manquant'
      });
      this.transporter = createTransporter();
    } else if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      console.log('Configuration SMTP personnalisée détectée');
      this.transporter = createCustomTransporter();
    } else {
      console.error('Configuration email manquante:', {
        emailUser: env.EMAIL_USER || 'Non configuré',
        emailPassword: env.EMAIL_APP_PASSWORD ? 'Configuré' : 'Non configuré',
        smtpHost: env.SMTP_HOST || 'Non configuré',
        smtpUser: env.SMTP_USER || 'Non configuré',
        smtpPass: env.SMTP_PASS ? 'Configuré' : 'Non configuré'
      });
      throw new Error('Configuration email manquante. Veuillez configurer les variables d\'environnement.');
    }
  }

  // Envoyer un email de réservation argentique
  async sendArgentiqueReservation(data: EmailData): Promise<boolean> {
    try {
      const { nom, prenom, email, telephone, dateSouhaitee, nombrePersonnes, message } = data;
      const formattedDate = new Date(dateSouhaitee).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Variables pour les templates
      const variables = {
        nom, prenom, email, telephone, dateSouhaitee: formattedDate, nombrePersonnes, message: message || 'Aucun message'
      };

      // Récupérer les templates
      const clientTemplate = this.templateService.getTemplate('argentique', 'client', variables);
      const adminTemplate = this.templateService.getTemplate('argentique', 'admin', variables);
      const styles = this.templateService.getStyles();

      // Email pour le client (confirmation)
      const clientEmail = {
        from: `"La Ligne Argentique" <${env.EMAIL_USER}>`,
        to: email,
        subject: clientTemplate.subject,
        html: this.templateService.generateEmailHTML(clientTemplate, styles),
        text: this.templateService.generateEmailText(clientTemplate)
      };

      // Email pour vous (notification)
      const adminEmail = {
        from: `"La Ligne Argentique" <${env.EMAIL_USER}>`,
        to: env.ADMIN_EMAIL || env.EMAIL_USER,
        subject: adminTemplate.subject,
        html: this.templateService.generateEmailHTML(adminTemplate, styles),
        text: this.templateService.generateEmailText(adminTemplate)
      };

      // Envoyer les deux emails
      await Promise.all([
        this.transporter.sendMail(clientEmail),
        this.transporter.sendMail(adminEmail)
      ]);

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails argentique:', error);
      console.error('Détails de l\'erreur:', {
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as any)?.code,
        response: (error as any)?.response
      });
      throw new Error(`Erreur lors de l'envoi des emails: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  // Envoyer un email de confirmation de réservation Stripe
  async sendStripeReservationConfirmation(reservation: any, balade: any): Promise<boolean> {
    try {
      const { nom, prenom, email, nombrePersonnes, montant, paymentIntentId, message } = reservation;
      const montantFormatted = montant ? `${(montant / 100).toFixed(2)}€` : '0.00€';
      const formattedDate = new Date(balade.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Variables pour les templates
      const clientVariables = {
        nom, prenom, nombrePersonnes, montant: montantFormatted,
        theme: balade.theme, date: formattedDate, heure: balade.heure, lieu: balade.lieu
      };

      const adminVariables = {
        nom, prenom, email, nombrePersonnes, montant: montantFormatted, paymentIntentId,
        theme: balade.theme, date: formattedDate, heure: balade.heure, lieu: balade.lieu,
        message: message || 'Aucun message'
      };

      // Récupérer les templates
      const clientTemplate = this.templateService.getTemplate('stripe', 'client', clientVariables);
      const adminTemplate = this.templateService.getTemplate('stripe', 'admin', adminVariables);
      const styles = this.templateService.getStyles();

      // Email pour le client (confirmation de paiement)
      const clientEmail = {
        from: `"La Ligne Argentique" <${env.EMAIL_USER}>`,
        to: email,
        subject: clientTemplate.subject,
        html: this.templateService.generateEmailHTML(clientTemplate, styles),
        text: this.templateService.generateEmailText(clientTemplate)
      };

      // Email pour vous (notification de réservation confirmée)
      const adminEmail = {
        from: `"La Ligne Argentique" <${env.EMAIL_USER}>`,
        to: env.ADMIN_EMAIL || env.EMAIL_USER,
        subject: adminTemplate.subject,
        html: this.templateService.generateEmailHTML(adminTemplate, styles),
        text: this.templateService.generateEmailText(adminTemplate)
      };

      // Envoyer les deux emails
      await Promise.all([
        this.transporter.sendMail(clientEmail),
        this.transporter.sendMail(adminEmail)
      ]);

      console.log(`Emails de confirmation envoyés pour la réservation ${reservation.id}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails de confirmation Stripe:', error);
      console.error('Détails de l\'erreur:', {
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as any)?.code,
        response: (error as any)?.response
      });
      throw new Error(`Erreur lors de l'envoi des emails: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  // Envoyer un email d'invitation
  async sendInvitationEmail(invitation: any, balade: any): Promise<boolean> {
    try {
      const formattedDate = new Date(balade.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Construire l'URL de réservation avec le code pré-rempli
      const baseUrl = env.PUBLIC_BASE_URL || 'http://localhost:3000';
      const reservationUrl = `${baseUrl}/photographie/argentique/reservation/invitation?baladeId=${balade.id}&code=${invitation.code}`;

      // Variables pour le template
      const variables = {
        theme: balade.theme,
        date: formattedDate,
        heure: balade.heure,
        lieu: balade.lieu,
        nombrePersonnes: invitation.nombrePersonnes,
        code: invitation.code,
        reservationUrl: reservationUrl,
        message: invitation.message || ''
      };

      // Récupérer le template
      const template = this.templateService.getTemplate('invitation', 'client', variables);
      const styles = this.templateService.getStyles();

      const email = {
        from: `"La Ligne Argentique" <${env.EMAIL_USER}>`,
        to: invitation.email,
        subject: template.subject,
        html: this.templateService.generateEmailHTML(template, styles),
        text: this.templateService.generateEmailText(template)
      };

      await this.transporter.sendMail(email);
      console.log(`Email d'invitation envoyé à ${invitation.email} pour la balade ${balade.theme} avec le code ${invitation.code}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email d\'invitation:', error);
      throw new Error(`Erreur lors de l'envoi de l'email d'invitation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  // Envoyer un email de contact
  async sendContactMessage(data: { nom: string; prenom: string; email: string; message: string }): Promise<boolean> {
    try {
      const { nom, prenom, email, message } = data;

      // Variables pour les templates
      const variables = { nom, prenom, email, message };

      // Récupérer les templates
      const adminTemplate = this.templateService.getTemplate('contact', 'admin', variables);
      const clientTemplate = this.templateService.getTemplate('contact', 'client', variables);
      const styles = this.templateService.getStyles();

      const adminEmail = {
        from: `"La Ligne Argentique" <${env.EMAIL_USER}>`,
        to: env.ADMIN_EMAIL || env.EMAIL_USER,
        subject: adminTemplate.subject,
        html: this.templateService.generateEmailHTML(adminTemplate, styles),
        text: this.templateService.generateEmailText(adminTemplate)
      };
      const clientEmail = {
        from: `"La Ligne Argentique" <${env.EMAIL_USER}>`,
        to: email,
        subject: clientTemplate.subject,
        html: this.templateService.generateEmailHTML(clientTemplate, styles),
        text: this.templateService.generateEmailText(clientTemplate)
      };
      await Promise.all([
        this.transporter.sendMail(adminEmail),
        this.transporter.sendMail(clientEmail)
      ]);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails de contact:', error);
      throw new Error('Erreur lors de l\'envoi des emails');
    }
  }

  async sendReservationQuestion(data: { reservationData: any; question: string; clientEmail: string; clientName: string }): Promise<boolean> {
    try {
      const { reservationData, question, clientEmail, clientName } = data;
      
      const formattedDate = new Date(reservationData.dateSouhaitee).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Variables pour les templates
      const adminVariables = {
        clientName, clientEmail, question,
        dateSouhaitee: formattedDate, nombrePersonnes: reservationData.nombrePersonnes
      };

      const clientVariables = {
        clientName, question
      };

      // Récupérer les templates
      const adminTemplate = this.templateService.getTemplate('question', 'admin', adminVariables);
      const clientTemplate = this.templateService.getTemplate('question', 'client', clientVariables);
      const styles = this.templateService.getStyles();
      
      // Email pour l'admin avec tous les détails
      const adminEmail = {
        from: `"La Ligne Argentique" <${env.EMAIL_USER}>`,
        to: env.ADMIN_EMAIL || env.EMAIL_USER,
        subject: adminTemplate.subject,
        html: this.templateService.generateEmailHTML(adminTemplate, styles),
        text: this.templateService.generateEmailText(adminTemplate)
      };

      // Email de confirmation pour le client
      const clientConfirmationEmail = {
        from: `"La Ligne Argentique" <${env.EMAIL_USER}>`,
        to: clientEmail,
        subject: clientTemplate.subject,
        html: this.templateService.generateEmailHTML(clientTemplate, styles),
        text: this.templateService.generateEmailText(clientTemplate)
      };

      await Promise.all([
        this.transporter.sendMail(adminEmail),
        this.transporter.sendMail(clientConfirmationEmail)
      ]);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails de question:', error);
      throw new Error('Erreur lors de l\'envoi des emails');
    }
  }

  // Vérifier la configuration
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Erreur de vérification de la connexion email:', error);
      return false;
    }
  }
}
