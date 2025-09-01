<script lang="ts">
  import { onMount } from 'svelte';

  let isVisible = false;

  onMount(() => {
    setTimeout(() => { isVisible = true; }, 100);
  });

  function retourAccueil() {
    window.location.href = '/';
  }
</script>

<svelte:head>
  <title>Politique de Confidentialité - La Ligne Argentiques</title>
  <meta name="description" content="Politique de confidentialité et protection des données personnelles" />
</svelte:head>

<div class="privacy-page">
  <div class="header {isVisible ? 'fade-in' : ''}">
    <button class="btn-retour" on:click={retourAccueil}>
      ← Retour à l'accueil
    </button>
    <h1>Politique de Confidentialité</h1>
    <p class="header-subtitle">Protection de vos données personnelles</p>
  </div>

  <div class="content">
    <div class="container">
      <div class="privacy-content {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
        
        <!-- Introduction -->
        <section class="section">
          <h2>🔒 Introduction</h2>
          <p>La protection de vos données personnelles est une priorité pour Steven Bachimont. Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles lors de l'utilisation de notre site web et de nos services de balades photographiques argentiques.</p>
          <p>En utilisant nos services, vous acceptez les pratiques décrites dans cette politique de confidentialité.</p>
        </section>

        <!-- Responsable du traitement -->
        <section class="section">
          <h2>👤 Responsable du traitement</h2>
          <div class="controller-info">
            <div class="info-card">
              <h3>Identité du responsable</h3>
              <p><strong>Nom :</strong> Steven Bachimont<br>
              <strong>Email :</strong> contact@stevenbachimont.com<br>
              <strong>Site web :</strong> stevenbachimont.com</p>
            </div>
            <div class="info-card">
              <h3>Activité</h3>
              <p>Organisation de balades photographiques argentiques<br>
              Animation d'ateliers photo<br>
              Médiation artistique</p>
            </div>
          </div>
        </section>

        <!-- Données collectées -->
        <section class="section">
          <h2>📊 Données collectées</h2>
          <div class="data-collection">
            <h3>Données personnelles</h3>
            <div class="data-categories">
              <div class="data-category">
                <h4>Identité</h4>
                <ul>
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone (optionnel)</li>
                </ul>
              </div>
              <div class="data-category">
                <h4>Réservation</h4>
                <ul>
                  <li>Date et heure de la balade</li>
                  <li>Nombre de participants</li>
                  <li>Messages et préférences</li>
                </ul>
              </div>
              <div class="data-category">
                <h4>Paiement</h4>
                <ul>
                  <li>Informations de paiement (via Stripe)</li>
                  <li>Historique des transactions</li>
                  <li>Statut de paiement</li>
                </ul>
              </div>
            </div>

            <h3>Données techniques</h3>
            <ul>
              <li>Adresse IP</li>
              <li>Type de navigateur</li>
              <li>Système d'exploitation</li>
              <li>Pages visitées</li>
              <li>Durée de visite</li>
            </ul>
          </div>
        </section>

        <!-- Finalités du traitement -->
        <section class="section">
          <h2>🎯 Finalités du traitement</h2>
          <div class="purposes">
            <div class="purpose-item">
              <h3>Gestion des réservations</h3>
              <p>Traiter vos demandes de réservation, confirmer les créneaux et organiser les balades.</p>
            </div>
            <div class="purpose-item">
              <h3>Communication</h3>
              <p>Vous contacter pour confirmer les détails, envoyer des informations pratiques et répondre à vos questions.</p>
            </div>
            <div class="purpose-item">
              <h3>Paiement sécurisé</h3>
              <p>Traiter les paiements via Stripe et gérer les transactions financières.</p>
            </div>
            <div class="purpose-item">
              <h3>Amélioration des services</h3>
              <p>Analyser l'utilisation du site pour améliorer l'expérience utilisateur et nos services.</p>
            </div>
            <div class="purpose-item">
              <h3>Obligations légales</h3>
              <p>Respecter les obligations comptables et fiscales françaises.</p>
            </div>
          </div>
        </section>

        <!-- Base légale -->
        <section class="section">
          <h2>⚖️ Base légale</h2>
          <div class="legal-basis">
            <div class="basis-item">
              <h3>Exécution du contrat</h3>
              <p>Le traitement est nécessaire pour exécuter le contrat de réservation de balade photographique.</p>
            </div>
            <div class="basis-item">
              <h3>Intérêt légitime</h3>
              <p>Amélioration de nos services et communication commerciale légitime.</p>
            </div>
            <div class="basis-item">
              <h3>Obligation légale</h3>
              <p>Respect des obligations comptables et fiscales.</p>
            </div>
            <div class="basis-item">
              <h3>Consentement</h3>
              <p>Pour les communications marketing, avec possibilité de retrait à tout moment.</p>
            </div>
          </div>
        </section>

        <!-- Destinataires -->
        <section class="section">
          <h2>📤 Destinataires des données</h2>
          <div class="recipients">
            <h3>Destinataires internes</h3>
            <ul>
              <li>Steven Bachimont (responsable du traitement)</li>
              <li>Équipe d'organisation des balades</li>
            </ul>

            <h3>Prestataires externes</h3>
            <div class="providers">
              <div class="provider-item">
                <h4>Stripe</h4>
                <p>Processeur de paiement sécurisé pour les transactions en ligne</p>
              </div>
              <div class="provider-item">
                <h4>Hébergeur web</h4>
                <p>Stockage sécurisé des données du site web</p>
              </div>
              <div class="provider-item">
                <h4>Services d'email</h4>
                <p>Envoi des confirmations et communications</p>
              </div>
            </div>

            <h3>Autorités</h3>
            <ul>
              <li>Autorités fiscales (obligations comptables)</li>
              <li>Autorités judiciaires (sur réquisition)</li>
            </ul>
          </div>
        </section>

        <!-- Durée de conservation -->
        <section class="section">
          <h2>⏰ Durée de conservation</h2>
          <div class="retention">
            <div class="retention-item">
              <h3>Données de réservation</h3>
              <p><strong>Durée :</strong> 5 ans après la dernière activité</p>
              <p><strong>Raison :</strong> Obligations comptables et fiscales</p>
            </div>
            <div class="retention-item">
              <h3>Données de paiement</h3>
              <p><strong>Durée :</strong> 5 ans</p>
              <p><strong>Raison :</strong> Obligations légales de conservation</p>
            </div>
            <div class="retention-item">
              <h3>Données de contact</h3>
              <p><strong>Durée :</strong> 3 ans après le dernier contact</p>
              <p><strong>Raison :</strong> Relation commerciale</p>
            </div>
            <div class="retention-item">
              <h3>Données techniques</h3>
              <p><strong>Durée :</strong> 13 mois maximum</p>
              <p><strong>Raison :</strong> Cookies et analytics</p>
            </div>
          </div>
        </section>

        <!-- Vos droits -->
        <section class="section">
          <h2>🛡️ Vos droits</h2>
          <div class="rights">
            <div class="right-item">
              <h3>Droit d'accès</h3>
              <p>Vous pouvez demander à connaître les données que nous détenons sur vous.</p>
            </div>
            <div class="right-item">
              <h3>Droit de rectification</h3>
              <p>Vous pouvez demander la correction de données inexactes ou incomplètes.</p>
            </div>
            <div class="right-item">
              <h3>Droit d'effacement</h3>
              <p>Vous pouvez demander la suppression de vos données dans certains cas.</p>
            </div>
            <div class="right-item">
              <h3>Droit à la portabilité</h3>
              <p>Vous pouvez recevoir vos données dans un format structuré et réutilisable.</p>
            </div>
            <div class="right-item">
              <h3>Droit d'opposition</h3>
              <p>Vous pouvez vous opposer au traitement pour des raisons légitimes.</p>
            </div>
            <div class="right-item">
              <h3>Droit de limitation</h3>
              <p>Vous pouvez demander la limitation du traitement dans certains cas.</p>
            </div>
          </div>
        </section>

        <!-- Exercice des droits -->
        <section class="section">
          <h2>📝 Exercice de vos droits</h2>
          <div class="exercise-rights">
            <p>Pour exercer vos droits, vous pouvez nous contacter :</p>
            <div class="contact-methods">
              <div class="contact-method">
                <h3>Par email</h3>
                <p>contact@stevenbachimont.com</p>
              </div>
              <div class="contact-method">
                <h3>Par courrier</h3>
                <p>Steven Bachimont<br>
                [Adresse postale]<br>
                France</p>
              </div>
            </div>
            <p class="response-time">Nous nous engageons à répondre dans un délai maximum de 30 jours.</p>
          </div>
        </section>

        <!-- Sécurité -->
        <section class="section">
          <h2>🔐 Sécurité des données</h2>
          <div class="security">
            <h3>Mesures techniques</h3>
            <ul>
              <li>Chiffrement SSL/TLS pour les transmissions</li>
              <li>Stockage sécurisé des données</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Sauvegardes régulières et sécurisées</li>
              <li>Mise à jour régulière des systèmes</li>
            </ul>

            <h3>Mesures organisationnelles</h3>
            <ul>
              <li>Formation du personnel à la protection des données</li>
              <li>Procédures de gestion des incidents</li>
              <li>Audits de sécurité réguliers</li>
            </ul>
          </div>
        </section>

        <!-- Cookies -->
        <section class="section">
          <h2>🍪 Cookies</h2>
          <div class="cookies">
            <h3>Types de cookies utilisés</h3>
            <div class="cookie-types">
              <div class="cookie-type">
                <h4>Cookies techniques</h4>
                <p>Nécessaires au fonctionnement du site (session, sécurité)</p>
              </div>
              <div class="cookie-type">
                <h4>Cookies analytiques</h4>
                <p>Mesure de l'audience et analyse de l'utilisation</p>
              </div>
              <div class="cookie-type">
                <h4>Cookies de préférences</h4>
                <p>Mémorisation de vos choix et préférences</p>
              </div>
            </div>

            <h3>Gestion des cookies</h3>
            <p>Vous pouvez configurer votre navigateur pour refuser les cookies ou être informé de leur utilisation. Cependant, cela peut affecter le fonctionnement du site.</p>
          </div>
        </section>

        <!-- Transferts -->
        <section class="section">
          <h2>🌍 Transferts de données</h2>
          <div class="transfers">
            <p>Vos données sont principalement traitées en France et dans l'Union Européenne.</p>
            <p>En cas de transfert vers des pays tiers, nous nous assurons que des garanties appropriées sont en place pour protéger vos données.</p>
          </div>
        </section>

        <!-- Modifications -->
        <section class="section">
          <h2>📋 Modifications de la politique</h2>
          <div class="modifications">
            <p>Cette politique de confidentialité peut être mise à jour pour refléter les évolutions de nos pratiques ou les changements législatifs.</p>
            <p>Les modifications importantes vous seront notifiées par email ou via une notification sur le site.</p>
          </div>
        </section>

        <!-- Contact CNIL -->
        <section class="section">
          <h2>📞 Contact et réclamations</h2>
          <div class="complaints">
            <p>Si vous avez des questions ou des préoccupations concernant le traitement de vos données, contactez-nous en priorité.</p>
            <p>Vous avez également le droit de déposer une réclamation auprès de la CNIL :</p>
            <div class="cnil-info">
              <p><strong>Commission Nationale de l'Informatique et des Libertés</strong><br>
              <a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a><br>
              3 Place de Fontenoy, 75007 Paris</p>
            </div>
          </div>
        </section>

        <div class="last-updated">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  .privacy-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
  }

  .header {
    padding: 2rem 0;
    background: rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    opacity: 0;
    transform: translateY(30px);
  }

  .header .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }

  .btn-retour {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .btn-retour:hover {
    background: linear-gradient(45deg, #ffed4e, #ffd700);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  }

  .header h1 {
    font-size: 2.5rem;
    color: #ffd700;
    margin: 0 0 0.5rem 0;
  }

  .header-subtitle {
    font-size: 1.2rem;
    color: rgba(255,255,255,0.8);
    margin: 0;
  }

  .content {
    padding: 3rem 0;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .privacy-content {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 3rem;
    border: 1px solid rgba(255,255,255,0.1);
    opacity: 0;
    transform: translateY(40px);
  }

  .section {
    margin-bottom: 3rem;
  }

  .section:last-child {
    margin-bottom: 0;
  }

  .section h2 {
    color: #ffd700;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid rgba(255, 215, 0, 0.3);
    padding-bottom: 0.5rem;
  }

  .section h3 {
    color: #ffd700;
    font-size: 1.3rem;
    margin: 1.5rem 0 1rem 0;
  }

  .section h4 {
    color: #ffd700;
    font-size: 1.1rem;
    margin: 1rem 0 0.5rem 0;
  }

  .section p {
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .section ul {
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  .section li {
    margin-bottom: 0.5rem;
  }

  .controller-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 1.5rem;
  }

  .info-card {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .info-card h3 {
    color: #ffd700;
    margin-bottom: 1rem;
  }

  .data-collection {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .data-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .data-category {
    background: rgba(255,255,255,0.05);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .data-category h4 {
    color: #ffd700;
    margin-bottom: 0.8rem;
  }

  .purposes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .purpose-item {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .purpose-item h3 {
    color: #ffd700;
    margin-bottom: 1rem;
  }

  .legal-basis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .basis-item {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .basis-item h3 {
    color: #ffd700;
    margin-bottom: 1rem;
  }

  .recipients {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .providers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  .provider-item {
    background: rgba(255,255,255,0.05);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .provider-item h4 {
    color: #ffd700;
    margin-bottom: 0.5rem;
  }

  .retention {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .retention-item {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .retention-item h3 {
    color: #ffd700;
    margin-bottom: 1rem;
  }

  .rights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .right-item {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .right-item h3 {
    color: #ffd700;
    margin-bottom: 1rem;
  }

  .exercise-rights {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .contact-methods {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 1.5rem 0;
  }

  .contact-method {
    background: rgba(255,255,255,0.05);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .contact-method h3 {
    color: #ffd700;
    margin-bottom: 0.8rem;
  }

  .response-time {
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
    font-weight: 600;
  }

  .security {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .cookies {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .cookie-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  .cookie-type {
    background: rgba(255,255,255,0.05);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .cookie-type h4 {
    color: #ffd700;
    margin-bottom: 0.5rem;
  }

  .transfers {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .modifications {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .complaints {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .cnil-info {
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .cnil-info a {
    color: #ffd700;
    text-decoration: underline;
  }

  .cnil-info a:hover {
    color: #ffed4e;
  }

  .last-updated {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.6);
    font-size: 0.9rem;
  }

  /* Animations */
  .fade-in {
    opacity: 1;
    transform: translateY(0);
    animation: fadeIn 1s ease-out;
  }

  .fade-in-up {
    opacity: 1;
    transform: translateY(0);
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header h1 {
      font-size: 2rem;
    }

    .header-subtitle {
      font-size: 1rem;
    }

    .container {
      padding: 0 1rem;
    }

    .privacy-content {
      padding: 2rem;
    }

    .section h2 {
      font-size: 1.5rem;
    }

    .section h3 {
      font-size: 1.2rem;
    }

    .controller-info {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .data-categories {
      grid-template-columns: 1fr;
    }

    .purposes {
      grid-template-columns: 1fr;
    }

    .legal-basis {
      grid-template-columns: 1fr;
    }

    .retention {
      grid-template-columns: 1fr;
    }

    .rights {
      grid-template-columns: 1fr;
    }

    .contact-methods {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .cookie-types {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .header h1 {
      font-size: 1.8rem;
    }

    .privacy-content {
      padding: 1.5rem;
    }

    .section h2 {
      font-size: 1.3rem;
    }

    .section h3 {
      font-size: 1.1rem;
    }
  }
</style>
