import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

console.log('Configuration email détectée:', {
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_APP_PASSWORD ? 'Configuré' : 'Non configuré',
  adminEmail: process.env.ADMIN_EMAIL
});

// Configuration du transporteur Gmail
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Test de connexion
async function testConnection() {
  try {
    console.log('Test de connexion au serveur email...');
    await transporter.verify();
    console.log('✅ Connexion réussie !');
    
    // Test d'envoi d'email
    console.log('Test d\'envoi d\'email...');
    const result = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test de configuration email',
      text: 'Ceci est un test de configuration email.',
      html: '<p>Ceci est un test de configuration email.</p>'
    });
    
    console.log('✅ Email envoyé avec succès !');
    console.log('Message ID:', result.messageId);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Code d\'erreur:', error.code);
    console.error('Réponse:', error.response);
  }
}

testConnection();
