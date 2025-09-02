import emailTemplates from './emailTemplates.json';

export class EmailTemplateService {
  private templates: any;

  constructor() {
    this.templates = emailTemplates;
  }

  // Remplacer les variables dans un template
  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value || '');
    }
    return result;
  }

  // Récupérer un template avec remplacement de variables
  getTemplate(category: string, type: string, variables: Record<string, any> = {}): any {
    const template = this.templates[category]?.[type];
    if (!template) {
      throw new Error(`Template non trouvé: ${category}.${type}`);
    }

    // Cloner le template et remplacer les variables
    const processedTemplate = JSON.parse(JSON.stringify(template));
    for (const [key, value] of Object.entries(processedTemplate)) {
      if (typeof value === 'string') {
        processedTemplate[key] = this.replaceVariables(value, variables);
      } else if (Array.isArray(value)) {
        processedTemplate[key] = value.map(item => 
          typeof item === 'string' ? this.replaceVariables(item, variables) : item
        );
      }
    }

    return processedTemplate;
  }

  // Récupérer les styles CSS
  getStyles(): any {
    return this.templates.styles;
  }

  // Générer le HTML d'un email avec le template
  generateEmailHTML(template: any, styles: any): string {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.title || 'Email La Ligne Argentique'}</title>
        <style>
          body { ${styles.body} }
          .container { ${styles.container} }
          .header { ${styles.header} }
          .content { ${styles.content} }
          .highlight { ${styles.highlight} }
          .success { ${styles.success} }
          .details { ${styles.details} }
          .info-box { ${styles.infoBox} }
          .contact-info { ${styles.contactInfo} }
          .payment-info { ${styles.paymentInfo} }
          .footer { ${styles.footer} }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${template.title || ''}</h1>
            <p>${template.subtitle || ''}</p>
          </div>
          <div class="content">
            ${this.generateContentHTML(template)}
          </div>
          ${template.footer ? `<div class="footer"><p>${template.footer}</p></div>` : ''}
        </div>
      </body>
      </html>
    `;
  }

  // Générer le contenu HTML selon le type de template
  private generateContentHTML(template: any): string {
    let html = '';

    // Ajouter le message de succès si présent
    if (template.successTitle && template.successMessage) {
      html += `
        <div class="success">
          <h2>${template.successTitle}</h2>
          <p>${template.successMessage}</p>
        </div>
      `;
    }

    // Ajouter la salutation
    if (template.greeting) {
      html += `<p>${template.greeting},</p>`;
    }

    // Ajouter le message principal
    if (template.mainMessage) {
      html += `<p>${template.mainMessage}</p>`;
    }

    // Ajouter les détails
    if (template.detailsTitle && template.detailsFormat) {
      html += `
        <div class="details">
          <h3>${template.detailsTitle}</h3>
          <p>${template.detailsFormat.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }

    // Ajouter les informations de réservation
    if (template.reservationTitle && template.reservationFormat) {
      html += `
        <div class="info-box">
          <h3>${template.reservationTitle}</h3>
          <p>${template.reservationFormat.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }

    // Ajouter les coordonnées du client
    if (template.contactTitle && template.contactFormat) {
      html += `
        <div class="contact-info">
          <h3>${template.contactTitle}</h3>
          <p>${template.contactFormat.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }

    // Ajouter les informations de l'expéditeur
    if (template.senderTitle && template.senderFormat) {
      html += `
        <div class="contact-info">
          <h3>${template.senderTitle}</h3>
          <p>${template.senderFormat.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }

    // Ajouter les détails de la balade
    if (template.baladeTitle && template.baladeFormat) {
      html += `
        <div class="info-box">
          <h3>${template.baladeTitle}</h3>
          <p>${template.baladeFormat.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }

    // Ajouter les détails du paiement
    if (template.paymentTitle && template.paymentFormat) {
      html += `
        <div class="payment-info">
          <h3>${template.paymentTitle}</h3>
          <p>${template.paymentFormat.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }

    // Ajouter les informations pratiques
    if (template.practicalTitle && template.practicalList) {
      html += `
        <div class="highlight">
          <h3>${template.practicalTitle}</h3>
          <ul>
            ${template.practicalList.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Ajouter les informations générales
    if (template.infoTitle && template.infoList) {
      html += `
        <p>${template.infoTitle}</p>
        <ul>
          ${template.infoList.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
    }

    // Ajouter le message du client
    if (template.messageTitle) {
      html += `
        <div class="info-box">
          <h3>${template.messageTitle}</h3>
          <p>${template.message || 'Aucun message'}</p>
        </div>
      `;
    }

    // Ajouter la question
    if (template.questionTitle) {
      html += `
        <div class="info-box">
          <h3>${template.questionTitle}</h3>
          <p>${template.question || ''}</p>
        </div>
      `;
    }

    // Ajouter les informations de contact
    if (template.contactInfo) {
      html += `<p>${template.contactInfo}</p>`;
    }

    // Ajouter la fermeture
    if (template.closing) {
      html += `<p>${template.closing}</p>`;
    }

    // Ajouter la signature
    if (template.signature) {
      html += `<p>${template.signature.replace(/\n/g, '<br>')}</p>`;
    }

    // Ajouter l'action requise
    if (template.actionRequired) {
      html += `<p><strong>Action requise :</strong> ${template.actionRequired}</p>`;
    }

    return html;
  }

  // Générer le texte brut d'un email
  generateEmailText(template: any): string {
    let text = '';

    if (template.title) text += `${template.title}\n`;
    if (template.subtitle) text += `${template.subtitle}\n\n`;

    if (template.successTitle && template.successMessage) {
      text += `${template.successTitle}\n${template.successMessage}\n\n`;
    }

    if (template.greeting) text += `${template.greeting},\n\n`;

    if (template.mainMessage) text += `${template.mainMessage}\n\n`;

    if (template.detailsTitle && template.detailsFormat) {
      text += `${template.detailsTitle}\n${template.detailsFormat}\n\n`;
    }

    if (template.reservationTitle && template.reservationFormat) {
      text += `${template.reservationTitle}\n${template.reservationFormat}\n\n`;
    }

    if (template.contactTitle && template.contactFormat) {
      text += `${template.contactTitle}\n${template.contactFormat}\n\n`;
    }

    if (template.senderTitle && template.senderFormat) {
      text += `${template.senderTitle}\n${template.senderFormat}\n\n`;
    }

    if (template.baladeTitle && template.baladeFormat) {
      text += `${template.baladeTitle}\n${template.baladeFormat}\n\n`;
    }

    if (template.paymentTitle && template.paymentFormat) {
      text += `${template.paymentTitle}\n${template.paymentFormat}\n\n`;
    }

    if (template.practicalTitle && template.practicalList) {
      text += `${template.practicalTitle}\n`;
      template.practicalList.forEach((item: string) => {
        text += `- ${item}\n`;
      });
      text += '\n';
    }

    if (template.infoTitle && template.infoList) {
      text += `${template.infoTitle}\n`;
      template.infoList.forEach((item: string) => {
        text += `- ${item}\n`;
      });
      text += '\n';
    }

    if (template.messageTitle) {
      text += `${template.messageTitle}\n${template.message || 'Aucun message'}\n\n`;
    }

    if (template.questionTitle) {
      text += `${template.questionTitle}\n${template.question || ''}\n\n`;
    }

    if (template.contactInfo) text += `${template.contactInfo}\n\n`;

    if (template.closing) text += `${template.closing}\n\n`;

    if (template.signature) text += `${template.signature}\n\n`;

    if (template.actionRequired) text += `Action requise : ${template.actionRequired}\n\n`;

    if (template.footer) text += `---\n${template.footer}`;

    return text;
  }
}
