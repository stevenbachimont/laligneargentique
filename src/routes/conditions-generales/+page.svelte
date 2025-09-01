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
  <title>Conditions Générales de Vente - Balades Argentiques</title>
  <meta name="description" content="Conditions générales de vente pour les balades photographiques argentiques" />
</svelte:head>

<div class="conditions-page">
  <div class="header {isVisible ? 'fade-in' : ''}">
    <button class="btn-retour" on:click={retourAccueil}>
      ← Retour à l'accueil
    </button>
    <h1>Conditions Générales de Vente</h1>
    <p class="header-subtitle">Balades Photographiques Argentiques</p>
  </div>

  <div class="content">
    <div class="container">
      <div class="conditions-content {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
        
        <!-- Informations générales -->
        <section class="section">
          <h2>📋 Informations générales</h2>
          <div class="info-grid">
            <div class="info-item">
              <h3>Éditeur du site</h3>
              <p>Steven Bachimont<br>
              Photographe professionnel<br>
              Email : contact@stevenbachimont.com</p>
            </div>
            <div class="info-item">
              <h3>Activité</h3>
              <p>Organisation de balades photographiques argentiques<br>
              Animation d'ateliers photo<br>
              Services de photographie</p>
            </div>
          </div>
        </section>

        <!-- Objet des conditions -->
        <section class="section">
          <h2>🎯 Objet des conditions</h2>
          <p>Les présentes conditions générales de vente s'appliquent à toutes les prestations de balades photographiques argentiques proposées par Steven Bachimont, sans restriction ni réserve.</p>
          <p>Toute réservation implique l'acceptation pleine et entière de ces conditions générales de vente.</p>
        </section>

        <!-- Services proposés -->
        <section class="section">
          <h2>📸 Services proposés</h2>
          <div class="services-list">
            <div class="service-item">
              <h3>Balades photographiques argentiques</h3>
              <ul>
                <li>Accompagnement personnalisé lors de balades urbaines</li>
                <li>Initiation à la photographie argentique</li>
                <li>Prêt de matériel photographique (appareil photo, pellicules)</li>
                <li>Conseils techniques et artistiques</li>
                <li>Développement et numérisation des photos</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Tarifs et modalités de paiement -->
        <section class="section">
          <h2>💰 Tarifs et modalités de paiement</h2>
          <div class="pricing-info">
            <h3>Tarification</h3>
            <ul>
              <li>Les prix sont exprimés en euros (€) et incluent la TVA</li>
              <li>Les tarifs sont susceptibles d'évoluer et sont valables à la date de la réservation</li>
              <li>Le prix inclut l'encadrement, le prêt de matériel et le développement des photos</li>
            </ul>
            
            <h3>Modalités de paiement</h3>
            <ul>
              <li>Paiement en ligne sécurisé via Stripe</li>
              <li>Cartes bancaires acceptées : Visa, Mastercard, American Express</li>
              <li>Paiement en une seule fois au moment de la réservation</li>
              <li>Aucun acompte n'est demandé</li>
            </ul>
          </div>
        </section>

        <!-- Réservation et annulation -->
        <section class="section">
          <h2>📅 Réservation et annulation</h2>
          <div class="reservation-rules">
            <h3>Réservation</h3>
            <ul>
              <li>La réservation se fait exclusivement en ligne</li>
              <li>Confirmation immédiate par email</li>
              <li>Nombre de participants limité par balade</li>
              <li>Réservation possible jusqu'à 24h avant la balade</li>
            </ul>

            <h3>Annulation</h3>
            <div class="cancellation-policy">
              <div class="cancellation-item">
                <span class="cancellation-period">Plus de 7 jours avant</span>
                <span class="cancellation-refund">Remboursement intégral</span>
              </div>
              <div class="cancellation-item">
                <span class="cancellation-period">Entre 7 et 3 jours avant</span>
                <span class="cancellation-refund">Remboursement 50%</span>
              </div>
              <div class="cancellation-item">
                <span class="cancellation-period">Moins de 3 jours avant</span>
                <span class="cancellation-refund">Aucun remboursement</span>
              </div>
            </div>
            
            <p class="cancellation-note">
              <strong>Exception :</strong> En cas de conditions météorologiques défavorables, la balade peut être reportée ou annulée avec remboursement intégral.
            </p>
          </div>
        </section>

        <!-- Déroulement des balades -->
        <section class="section">
          <h2>🚶‍♂️ Déroulement des balades</h2>
          <div class="walk-info">
            <h3>Informations pratiques</h3>
            <ul>
              <li>Rendez-vous au point de départ indiqué dans la confirmation</li>
              <li>Durée moyenne : 3 heures</li>
              <li>Distance parcourue : 2-4 km selon la balade</li>
              <li>Niveau : Accessible à tous, marche à pied</li>
            </ul>

            <h3>Matériel fourni</h3>
            <ul>
              <li>Appareil photo argentique 35mm</li>
              <li>Pellicules noir et blanc</li>
              <li>Explications techniques</li>
              <li>Conseils de composition</li>
            </ul>

            <h3>À prévoir</h3>
            <ul>
              <li>Chaussures confortables pour la marche</li>
              <li>Vêtements adaptés à la météo</li>
              <li>Bouteille d'eau</li>
              <li>En-cas si nécessaire</li>
            </ul>
          </div>
        </section>

        <!-- Responsabilités -->
        <section class="section">
          <h2>⚖️ Responsabilités</h2>
          <div class="responsibilities">
            <h3>Responsabilités du prestataire</h3>
            <ul>
              <li>Encadrement professionnel et sécurisé</li>
              <li>Matériel en bon état de fonctionnement</li>
              <li>Respect des horaires annoncés</li>
              <li>Assurance responsabilité civile professionnelle</li>
            </ul>

            <h3>Responsabilités du participant</h3>
            <ul>
              <li>Respect des consignes de sécurité</li>
              <li>Bon usage du matériel prêté</li>
              <li>Ponctualité au rendez-vous</li>
              <li>Respect des autres participants</li>
              <li>Respect de l'environnement et du patrimoine</li>
            </ul>
          </div>
        </section>

        <!-- Droit à l'image -->
        <section class="section">
          <h2>📷 Droit à l'image</h2>
          <div class="image-rights">
            <p>En participant aux balades, vous acceptez que des photos puissent être prises par l'organisateur ou d'autres participants.</p>
            
            <h3>Utilisation des images</h3>
            <ul>
              <li>Les photos prises par l'organisateur peuvent être utilisées à des fins promotionnelles</li>
              <li>Vous pouvez refuser l'utilisation de votre image en le signalant avant la balade</li>
              <li>Les photos des participants ne seront jamais vendues à des tiers</li>
            </ul>
          </div>
        </section>

        <!-- Protection des données -->
        <section class="section">
          <h2>🔒 Protection des données personnelles</h2>
          <p>Vos données personnelles sont collectées et traitées conformément à notre politique de confidentialité, accessible sur ce site.</p>
          <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.</p>
        </section>

        <!-- Droit applicable -->
        <section class="section">
          <h2>⚖️ Droit applicable</h2>
          <p>Les présentes conditions générales de vente sont soumises au droit français.</p>
          <p>En cas de litige, les tribunaux français sont seuls compétents.</p>
        </section>

        <!-- Contact -->
        <section class="section contact-section">
          <h2>📞 Contact</h2>
          <div class="contact-info">
            <p>Pour toute question concernant ces conditions générales de vente :</p>
            <div class="contact-details">
              <p><strong>Email :</strong> contact@stevenbachimont.com</p>
              <p><strong>Site web :</strong> stevenbachimont.com</p>
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
  .conditions-page {
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

  .conditions-content {
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

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 1.5rem;
  }

  .info-item {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .info-item h3 {
    color: #ffd700;
    margin-bottom: 1rem;
  }

  .services-list {
    margin-top: 1.5rem;
  }

  .service-item {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 1rem;
  }

  .pricing-info {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .reservation-rules {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .cancellation-policy {
    margin: 1.5rem 0;
  }

  .cancellation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    margin-bottom: 0.5rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .cancellation-period {
    font-weight: 600;
    color: rgba(255,255,255,0.9);
  }

  .cancellation-refund {
    color: #ffd700;
    font-weight: 600;
  }

  .cancellation-note {
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .walk-info {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .responsibilities {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .image-rights {
    background: rgba(255,255,255,0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .contact-section {
    background: rgba(255, 215, 0, 0.05);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 15px;
    padding: 2rem;
  }

  .contact-info {
    text-align: center;
  }

  .contact-details {
    background: rgba(255,255,255,0.05);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    margin-top: 1rem;
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

    .conditions-content {
      padding: 2rem;
    }

    .section h2 {
      font-size: 1.5rem;
    }

    .section h3 {
      font-size: 1.2rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .cancellation-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .header h1 {
      font-size: 1.8rem;
    }

    .conditions-content {
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
