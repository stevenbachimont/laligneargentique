<script lang="ts">
  import { onMount } from 'svelte';
  import '../../lib/shared-blocks.css';

  let isVisible = false;

  onMount(() => {
    setTimeout(() => { isVisible = true; }, 100);
  });

  function navigateToPortfolio() {
    window.location.href = '/web/portfolioWeb';
  }

  function navigateToTools() {
    window.location.href = '/web/outils';
  }
</script>

<div class="development-page">
  <h1>Développement web</h1>
  <p class="page-intro">
    Découvrez mes projets de développement web organisés en deux sections : 
    mon portfolio de projets et mes outils web utiles.
  </p>

  <div class="two-blocks-container {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
    <!-- Bloc gauche : Portfolio Web -->
    <div class="block portfolio-block" on:click={navigateToPortfolio} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && navigateToPortfolio()}>
      <div class="block-content">
        <h2>Portfolio Web</h2>
        <p class="block-description">
          Mon parcours de développement web à travers une timeline chronologique 
          de mes projets et réalisations.
        </p>
        
        <div class="block-preview">
          <div class="preview-item">
            <span class="preview-icon">📊</span>
            <span class="preview-text">Projets chronologiques</span>
          </div>
          <div class="preview-item">
            <span class="preview-icon">⚡</span>
            <span class="preview-text">Technologies utilisées</span>
          </div>
        </div>
        
        <div class="block-cta">
          <span class="cta-text">Cliquez pour voir le portfolio</span>
          <span class="cta-arrow">→</span>
        </div>
      </div>
    </div>

    <!-- Bloc droit : Outils -->
    <div class="block tools-block" on:click={navigateToTools} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && navigateToTools()}>
      <div class="block-content">
        <h2>Outils Web</h2>
        <p class="block-description">
          Applications web utiles que j'ai développées, classées par thématique.
        </p>
        
        <div class="block-preview">
          <div class="preview-item">
            <span class="preview-icon">📷</span>
            <span class="preview-text">Photographie</span>
          </div>
          <div class="preview-item">
            <span class="preview-icon">🎵</span>
            <span class="preview-text">Musique</span>
          </div>
        </div>
        
        <div class="block-cta">
          <span class="cta-text">Cliquez pour voir les outils</span>
          <span class="cta-arrow">→</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .development-page {
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
    .development-page {
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
    .development-page {
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
    .development-page {
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