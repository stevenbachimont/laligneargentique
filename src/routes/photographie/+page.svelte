<script lang="ts">
  import { onMount } from 'svelte';
  import '../../lib/shared-blocks.css';

  // Balades programmées pour l'aperçu
  let baladesApercu = [
    {
      id: 1,
      date: '2024-02-15',
      heure: '14:00',
      lieu: 'Quartier du Bouffay',
      theme: 'Architecture médiévale',
      placesDisponibles: 3
    },
    {
      id: 2,
      date: '2024-02-22',
      heure: '10:00',
      lieu: 'Île de Nantes',
      theme: 'Street Art & Contemporain',
      placesDisponibles: 2
    }
  ];

  let isVisible = false;

  onMount(() => {
    setTimeout(() => { isVisible = true; }, 100);
  });

  function navigateToPortfolio() {
    window.location.href = '/photographie/portfolioPhoto';
  }

  function navigateToArgentique() {
    window.location.href = '/photographie/argentique';
  }
</script>

<div class="photography-page">
  <h1>Photographie</h1>
  <p class="page-intro">
    Découvrez mes séries photographiques et mes balades argentiques guidées 
    dans les rues de Nantes.
  </p>

  <div class="two-blocks-container {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
    <!-- Bloc gauche : Portfolio Photo -->
    <div class="block portfolio-block" on:click={navigateToPortfolio} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && navigateToPortfolio()}>
      <div class="block-content">
        <h2>Portfolio Photo</h2>
        <p class="block-description">
          Découvrez mes séries photographiques : Street, Portraits, Paysages et Quotidien. 
          Chaque série raconte une histoire à travers l'objectif.
        </p>
        <div class="block-preview">
          <div class="preview-item">
            <span class="preview-icon">📸</span>
            <span class="preview-text">Séries Street, Portraits, Paysages</span>
          </div>
          <div class="preview-item">
            <span class="preview-icon">🎨</span>
            <span class="preview-text">Histoires visuelles</span>
          </div>
        </div>
        <div class="block-cta">
          <span class="cta-text">Cliquez pour voir le portfolio</span>
          <span class="cta-arrow">→</span>
        </div>
      </div>
    </div>

    <!-- Bloc droit : La ligne Argentique -->
    <div class="block argentique-block" on:click={navigateToArgentique} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && navigateToArgentique()}>
      <div class="block-content">
        <h2>La ligne Argentique</h2>
        <p class="block-description">
          Découvrez Nantes à travers l'objectif d'un appareil photo argentique. 
          Balades photographiques guidées dans les rues de la ville.
        </p>
        
        <!-- Aperçu des balades programmées -->
        <div class="balades-preview">
          <h3>Prochaines balades</h3>
          <div class="balades-preview-grid">
            {#each baladesApercu as balade}
              <div class="balade-preview-card">
                <div class="balade-preview-date">
                  <span class="date-day">{new Date(balade.date).getDate()}</span>
                  <span class="date-month">{new Date(balade.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                </div>
                <div class="balade-preview-info">
                  <h4>{balade.theme}</h4>
                  <p>📍 {balade.lieu} • 🕐 {balade.heure}</p>
                  <span class="places-dispo">{balade.placesDisponibles} place{balade.placesDisponibles > 1 ? 's' : ''} disponible{balade.placesDisponibles > 1 ? 's' : ''}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div class="block-cta">
          <span class="cta-text">Cliquez pour voir les balades</span>
          <span class="cta-arrow">→</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .photography-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    background: linear-gradient(45deg, var(--color-text), var(--color-accent-1));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .page-intro {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 1.1rem;
    color: rgba(255,255,255,0.8);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Responsive pour les éléments spécifiques à la page */
  @media (max-width: 768px) {
    .photography-page {
      padding: 1.5rem;
    }

    h1 {
      font-size: 2.2rem;
      margin-bottom: 0.8rem;
    }
    
    .page-intro {
      font-size: 1rem;
      margin-bottom: 2.5rem;
      padding: 0 1rem;
    }
  }

  @media (max-width: 600px) {
    .photography-page {
      padding: 1rem;
    }

    h1 {
      font-size: 1.8rem;
      margin-bottom: 0.6rem;
    }
    
    .page-intro {
      font-size: 0.95rem;
      margin-bottom: 2rem;
      padding: 0 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .photography-page {
      padding: 0.8rem;
    }

    h1 {
      font-size: 1.6rem;
      padding: 0 0.6rem;
    }
    
    .page-intro {
      font-size: 0.9rem;
      margin-bottom: 1.8rem;
      padding: 0 0.6rem;
    }
  }
</style> 