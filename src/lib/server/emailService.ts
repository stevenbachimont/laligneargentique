import nodemailer from 'nodemailer';
import type { EmailData } from './types';

// Configuration du transporteur email
const createTransporter = () => {
  // Configuration pour Gmail (vous pouvez adapter pour d'autres fournisseurs)
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD // Mot de passe d'application Gmail
    }
  });
};

// Configuration pour un serveur SMTP personnalisé (alternative)
const createCustomTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Service d'envoi d'emails
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Utiliser le transporteur Gmail par défaut, sinon le SMTP personnalisé
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      this.transporter = createTransporter();
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = createCustomTransporter();
    } else {
      throw new Error('Configuration email manquante. Veuillez configurer les variables d\'environnement.');
    }
  }

  // Envoyer un email de réservation argentique
  async sendArgentiqueReservation(data: EmailData): Promise<boolean> {
    try {
      const { nom, prenom, email, telephone, dateSouhaitee, nombrePersonnes, message } = data;

      // Email pour le client (confirmation)
      const clientEmail = {
        from: `"La Ligne Argentique" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Confirmation de votre demande de réservation - La Ligne Argentique',
        html: this.generateClientEmailHTML(data),
        text: this.generateClientEmailText(data)
      };

      // Email pour vous (notification)
      const adminEmail = {
        from: `"La Ligne Argentique" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `Nouvelle demande de réservation argentique - ${prenom} ${nom}`,
        html: this.generateAdminEmailHTML(data),
        text: this.generateAdminEmailText(data)
      };

      // Envoyer les deux emails
      await Promise.all([
        this.transporter.sendMail(clientEmail),
        this.transporter.sendMail(adminEmail)
      ]);

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails:', error);
      throw new Error('Erreur lors de l\'envoi des emails');
    }
  }

  // Envoyer un email de contact
  async sendContactMessage(data: { nom: string; prenom: string; email: string; message: string }): Promise<boolean> {
    try {
      const { nom, prenom, email, message } = data;

      // Email pour vous (notification de contact)
      const adminEmail = {
        from: `"La Ligne Argentique" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `Nouveau message de contact - ${prenom} ${nom}`,
        html: this.generateContactEmailHTML(data),
        text: this.generateContactEmailText(data)
      };

      // Email de confirmation au client
      const clientEmail = {
        from: `"La Ligne Argentique" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Confirmation de votre message - La Ligne Argentique',
        html: this.generateContactConfirmationHTML(data),
        text: this.generateContactConfirmationText(data)
      };

      // Envoyer les deux emails
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

  // Générer le HTML pour l'email client
  private generateClientEmailHTML(data: EmailData): string {
    const { nom, prenom, dateSouhaitee, nombrePersonnes, message } = data;
    const formattedDate = new Date(dateSouhaitee).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de réservation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #000000, #1a1a1a); color: #ffd700; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .highlight { background: #ffd700; color: #000; padding: 10px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎞️ La Ligne Argentique</h1>
            <p>Confirmation de votre demande de réservation</p>
          </div>
          <div class="content">
            <p>Bonjour ${prenom} ${nom},</p>
            
            <p>Nous avons bien reçu votre demande de réservation pour une balade photographique argentique.</p>
            
            <div class="highlight">
              <strong>Détails de votre demande :</strong><br>
              📅 Date souhaitée : ${formattedDate}<br>
              👥 Nombre de personnes : ${nombrePersonnes}<br>
              💬 Message : ${message || 'Aucun message'}
            </div>
            
            <p>Je vais examiner votre demande et vous recontacter dans les plus brefs délais pour :</p>
            <ul>
              <li>Confirmer la disponibilité pour la date demandée</li>
              <li>Vous donner tous les détails pratiques</li>
              <li>Répondre à vos questions éventuelles</li>
            </ul>
            
            <p>En attendant, n'hésitez pas à me contacter si vous avez des questions urgentes.</p>
            
            <p>Cordialement,<br>
            <strong>La Ligne Argentique</strong></p>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Générer le texte pour l'email client
  private generateClientEmailText(data: EmailData): string {
    const { nom, prenom, dateSouhaitee, nombrePersonnes, message } = data;
    const formattedDate = new Date(dateSouhaitee).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
La Ligne Argentique - Confirmation de réservation

Bonjour ${prenom} ${nom},

Nous avons bien reçu votre demande de réservation pour une balade photographique argentique.

Détails de votre demande :
- Date souhaitée : ${formattedDate}
- Nombre de personnes : ${nombrePersonnes}
- Message : ${message || 'Aucun message'}

Je vais examiner votre demande et vous recontacter dans les plus brefs délais pour confirmer la disponibilité et vous donner tous les détails pratiques.

En attendant, n'hésitez pas à me contacter si vous avez des questions urgentes.

Cordialement,
La Ligne Argentique

---
Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
    `;
  }

  // Générer le HTML pour l'email admin
  private generateAdminEmailHTML(data: EmailData): string {
    const { nom, prenom, email, telephone, dateSouhaitee, nombrePersonnes, message } = data;
    const formattedDate = new Date(dateSouhaitee).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle réservation argentique</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #000000, #1a1a1a); color: #ffd700; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .info-box { background: #e8f4fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; }
          .contact-info { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎞️ Nouvelle demande de réservation</h1>
            <p>La Ligne Argentique</p>
          </div>
          <div class="content">
            <div class="info-box">
              <h3>Informations de réservation</h3>
              <p><strong>Client :</strong> ${prenom} ${nom}</p>
              <p><strong>Date souhaitée :</strong> ${formattedDate}</p>
              <p><strong>Nombre de personnes :</strong> ${nombrePersonnes}</p>
            </div>
            
            <div class="contact-info">
              <h3>Coordonnées du client</h3>
              <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Téléphone :</strong> ${telephone || 'Non renseigné'}</p>
            </div>
            
            <div class="info-box">
              <h3>Message du client</h3>
              <p>${message || 'Aucun message'}</p>
            </div>
            
            <p><strong>Action requise :</strong> Contacter le client pour confirmer la réservation et donner les détails pratiques.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Générer le texte pour l'email admin
  private generateAdminEmailText(data: EmailData): string {
    const { nom, prenom, email, telephone, dateSouhaitee, nombrePersonnes, message } = data;
    const formattedDate = new Date(dateSouhaitee).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
Nouvelle demande de réservation - La Ligne Argentique

Informations de réservation :
- Client : ${prenom} ${nom}
- Date souhaitée : ${formattedDate}
- Nombre de personnes : ${nombrePersonnes}

Coordonnées du client :
- Email : ${email}
- Téléphone : ${telephone || 'Non renseigné'}

Message du client :
${message || 'Aucun message'}

Action requise : Contacter le client pour confirmer la réservation et donner les détails pratiques.
    `;
  }

  // Générer le HTML pour l'email de contact (admin)
  private generateContactEmailHTML(data: { nom: string; prenom: string; email: string; message: string }): string {
    const { nom, prenom, email, message } = data;

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouveau message de contact</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #000000, #1a1a1a); color: #ffd700; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .info-box { background: #e8f4fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; }
          .contact-info { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Nouveau message de contact</h1>
            <p>La Ligne Argentique</p>
          </div>
          <div class="content">
            <div class="contact-info">
              <h3>Coordonnées de l'expéditeur</h3>
              <p><strong>Nom :</strong> ${prenom} ${nom}</p>
              <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
            </div>
            
            <div class="info-box">
              <h3>Message</h3>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p><strong>Action requise :</strong> Répondre au client dans les plus brefs délais.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Générer le texte pour l'email de contact (admin)
  private generateContactEmailText(data: { nom: string; prenom: string; email: string; message: string }): string {
    const { nom, prenom, email, message } = data;

    return `
Nouveau message de contact - La Ligne Argentique

Coordonnées de l'expéditeur :
- Nom : ${prenom} ${nom}
- Email : ${email}

Message :
${message}

Action requise : Répondre au client dans les plus brefs délais.
    `;
  }

  // Générer le HTML pour l'email de confirmation de contact (client)
  private generateContactConfirmationHTML(data: { nom: string; prenom: string; email: string; message: string }): string {
    const { nom, prenom, message } = data;

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #000000, #1a1a1a); color: #ffd700; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .highlight { background: #ffd700; color: #000; padding: 10px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 La Ligne Argentique</h1>
            <p>Confirmation de votre message</p>
          </div>
          <div class="content">
            <p>Bonjour ${prenom} ${nom},</p>
            
            <p>Nous avons bien reçu votre message et vous en remercions.</p>
            
            <div class="highlight">
              <strong>Votre message :</strong><br>
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <p>Je vais examiner votre message et vous répondre dans les plus brefs délais.</p>
            
            <p>Cordialement,<br>
            <strong>La Ligne Argentique</strong></p>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Générer le texte pour l'email de confirmation de contact (client)
  private generateContactConfirmationText(data: { nom: string; prenom: string; email: string; message: string }): string {
    const { nom, prenom, message } = data;

    return `
La Ligne Argentique - Confirmation de message

Bonjour ${prenom} ${nom},

Nous avons bien reçu votre message et vous en remercions.

Votre message :
${message}

Je vais examiner votre message et vous répondre dans les plus brefs délais.

Cordialement,
La Ligne Argentique

---
Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
    `;
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
