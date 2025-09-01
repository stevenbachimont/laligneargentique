<script>
  import { onMount } from 'svelte';
  
  let isVisible = false;
  
  onMount(() => {
    isVisible = true;
  });
  
  function retourAccueil() {
    window.location.href = '/';
  }
</script>

<svelte:head>
  <title>Mentions Légales - stevenbachimont.com</title>
  <meta name="description" content="Mentions légales du site stevenbachimont.com - Balades photographiques argentiques" />
</svelte:head>

<div class="mentions-page">
  <div class="header">
    <button class="btn-retour" on:click={retourAccueil}>
      ← Retour à l'accueil
    </button>
    
    <h1>Mentions Légales</h1>
    <p class="header-subtitle">Informations légales du site</p>
  </div>
  
  <div class="content">
    <div class="container">
      <div class="mentions-content {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
        
        <section class="section">
          <h2>📋 Éditeur du site</h2>
          <div class="info-grid">
            <div class="info-item">
              <h3>Identité</h3>
              <p>
                <strong>Nom :</strong> Steven Bachimont<br>
                <strong>Profession :</strong> Photographe & Développeur Web<br>
                <strong>Email :</strong> contact@stevenbachimont.com<br>
                <strong>Site web :</strong> stevenbachimont.com
              </p>
            </div>
            
            <div class="info-item">
              <h3>Activité</h3>
              <p>
                Organisation de balades photographiques argentiques<br>
                Animation d'ateliers photo<br>
                Médiation artistique
              </p>
            </div>
          </div>
        </section>
        
        <section class="section">
          <h2>🌐 Hébergement</h2>
          <div class="hosting-info">
            <h3>Hébergeur du site</h3>
            <p>
              Ce site est hébergé par Vercel Inc.<br>
              <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br>
              <strong>Site web :</strong> ionos.com
            </p>
          </div>
        </section>
        
        <section class="section">
          <h2>📱 Conception et développement</h2>
          <div class="development-info">
            <h3>Technologies utilisées</h3>
            <ul>
              <li><strong>Framework :</strong> SvelteKit</li>
              <li><strong>Langage :</strong> TypeScript</li>
              <li><strong>Styling :</strong> CSS3</li>
              <li><strong>Base de données :</strong> SQLite</li>
              <li><strong>Paiements :</strong> Stripe</li>
            </ul>
          </div>
        </section>
        
        <section class="section">
          <h2>📷 Propriété intellectuelle</h2>
          <div class="intellectual-property">
            <h3>Droits d'auteur</h3>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            
            <h3>Photographies</h3>
            <p>
              Toutes les photographies présentes sur ce site sont la propriété exclusive de Steven Bachimont, sauf mention contraire. Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation écrite préalable de Steven Bachimont.
            </p>
          </div>
        </section>
        
        <section class="section">
          <h2>🔗 Liens hypertextes</h2>
          <div class="links-info">
            <h3>Liens externes</h3>
            <p>
              Le site peut contenir des liens vers d'autres sites. Steven Bachimont n'est pas responsable du contenu de ces sites et ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ces sites.
            </p>
            
            <h3>Liens vers ce site</h3>
            <p>
              L'établissement de liens hypertextes vers ce site est autorisé sous réserve de l'accord préalable de Steven Bachimont. Les liens doivent être établis vers la page d'accueil du site.
            </p>
          </div>
        </section>
        
        <section class="section">
          <h2>🍪 Cookies</h2>
          <div class="cookies-info">
            <h3>Utilisation des cookies</h3>
            <p>
              Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. Les cookies techniques sont nécessaires au fonctionnement du site. Les cookies analytiques nous permettent de comprendre comment le site est utilisé.
            </p>
            
            <h3>Gestion des cookies</h3>
            <p>
              Vous pouvez configurer votre navigateur pour refuser les cookies ou être informé quand un cookie est envoyé. La désactivation de certains cookies peut affecter le fonctionnement du site.
            </p>
          </div>
        </section>
        
        <section class="section">
          <h2>🔒 Sécurité</h2>
          <div class="security-info">
            <h3>Protection des données</h3>
            <p>
              Ce site met en œuvre des mesures de sécurité pour protéger les données personnelles collectées. Les transmissions de données sont chiffrées en SSL/TLS. Les données sont stockées de manière sécurisée et l'accès est restreint.
            </p>
            
            <h3>Paiements sécurisés</h3>
            <p>
              Les paiements sont traités par Stripe, leader mondial du paiement en ligne. Toutes les informations de paiement sont chiffrées et ne transitent jamais sur nos serveurs.
            </p>
          </div>
        </section>
        
        <section class="section">
          <h2>⚖️ Droit applicable</h2>
          <div class="law-info">
            <h3>Législation applicable</h3>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français sont seuls compétents.
            </p>
            
            <h3>Modifications</h3>
            <p>
              Steven Bachimont se réserve le droit de modifier ces mentions légales à tout moment. Les utilisateurs sont invités à les consulter régulièrement.
            </p>
          </div>
        </section>
        
        <section class="section">
          <h2>📞 Contact</h2>
          <div class="contact-info">
            <h3>Pour toute question</h3>
            <p>
              Pour toute question concernant ces mentions légales ou le site, vous pouvez nous contacter :<br><br>
              
              <strong>Email :</strong> contact@stevenbachimont.com<br>
              <strong>Site web :</strong> stevenbachimont.com
            </p>
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
  .mentions-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: var(--color-text);
    font-family: 'Inter', sans-serif;
  }
  
  .header {
    text-align: center;
    padding: 3rem 2rem 2rem;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
  }
  
  .btn-retour {
    background: linear-gradient(135deg, var(--color-accent-2), var(--color-accent-3));
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    margin-bottom: 2rem;
  }
  
  .btn-retour:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
  }
  
  .header h1 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 1rem;
    background: linear-gradient(135deg, var(--color-accent-2), var(--color-accent-3));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .header-subtitle {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
    margin: 0;
  }
  
  .content {
    padding: 2rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .mentions-content {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }
  
  .mentions-content.fade-in-up {
    opacity: 1;
    transform: translateY(0);
  }
  
  .section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  .section h2 {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0 0 1.5rem;
    color: var(--color-accent-2);
  }
  
  .section h3 {
    font-size: 1.3rem;
    font-weight: 500;
    margin: 1.5rem 0 1rem;
    color: var(--color-accent-3);
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 1rem;
  }
  
  .info-item {
    background: rgba(255, 255, 255, 0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .info-item h3 {
    margin-top: 0;
    color: var(--color-accent-2);
  }
  
  .info-item p {
    line-height: 1.6;
    margin: 0;
  }
  
  .hosting-info,
  .development-info,
  .intellectual-property,
  .links-info,
  .cookies-info,
  .security-info,
  .law-info,
  .contact-info {
    background: rgba(255, 255, 255, 0.03);
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 1rem;
  }
  
  .hosting-info h3,
  .development-info h3,
  .intellectual-property h3,
  .links-info h3,
  .cookies-info h3,
  .security-info h3,
  .law-info h3,
  .contact-info h3 {
    margin-top: 0;
    color: var(--color-accent-2);
  }
  
  .development-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .development-info li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .development-info li:last-child {
    border-bottom: none;
  }
  
  .intellectual-property p,
  .links-info p,
  .cookies-info p,
  .security-info p,
  .law-info p,
  .contact-info p {
    line-height: 1.6;
    margin: 0 0 1rem;
  }
  
  .intellectual-property p:last-child,
  .links-info p:last-child,
  .cookies-info p:last-child,
  .security-info p:last-child,
  .law-info p:last-child,
  .contact-info p:last-child {
    margin-bottom: 0;
  }
  
  .last-updated {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-top: 2rem;
  }
  
  .last-updated p {
    margin: 0;
    color: var(--color-text-secondary);
    font-style: italic;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .header {
      padding: 2rem 1rem 1.5rem;
    }
    
    .header h1 {
      font-size: 2.2rem;
    }
    
    .content {
      padding: 1rem;
    }
    
    .section {
      padding: 1.5rem;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .info-item,
    .hosting-info,
    .development-info,
    .intellectual-property,
    .links-info,
    .cookies-info,
    .security-info,
    .law-info,
    .contact-info {
      padding: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .header h1 {
      font-size: 1.8rem;
    }
    
    .section h2 {
      font-size: 1.5rem;
    }
    
    .section h3 {
      font-size: 1.1rem;
    }
  }
</style>
