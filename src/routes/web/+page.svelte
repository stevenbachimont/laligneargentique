<script lang="ts">
  import { onMount } from 'svelte';

  let isVisible = false;

  onMount(() => {
    setTimeout(() => { isVisible = true; }, 100);
  });
</script>

<div class="development-page">
  <h1>Développement web</h1>
  <p class="page-intro">
    Découvrez mes projets de développement web organisés en deux sections : 
    mon portfolio de projets et mes outils web utiles.
  </p>

  <div class="two-blocks-container {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
    <!-- Bloc gauche : Portfolio Web -->
    <div class="block portfolio-block">
      <div class="block-content">
        <h2>Portfolio Web</h2>
        <p class="block-description">
          Mon parcours de développement web à travers une timeline chronologique 
          de mes projets et réalisations. Découvrez l'évolution de mes compétences 
          à travers mes projets web, de mes débuts à aujourd'hui.
        </p>
        
        <div class="portfolio-preview">
          <div class="preview-features">
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <span class="feature-text">Projets chronologiques</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span class="feature-text">Technologies utilisées</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📈</span>
              <span class="feature-text">Statuts de progression</span>
            </div>
          </div>
        </div>
        
        <a href="/web/portfolioWeb" class="btn-primary">
          Voir le portfolio complet
        </a>
      </div>
    </div>

    <!-- Bloc droit : Outils -->
    <div class="block tools-block">
      <div class="block-content">
        <h2>Outils Web</h2>
        <p class="block-description">
          Applications web utiles que j'ai développées, classées par thématique. 
          Des outils spécialisés pour la photographie, la musique et la productivité.
        </p>
        
        <div class="tools-preview">
          <div class="tools-categories">
            <div class="category-preview">
              <span class="category-icon">📷</span>
              <div class="category-info">
                <h4>Photographie</h4>
                <p>Outils pour l'argentique</p>
              </div>
            </div>
            <div class="category-preview">
              <span class="category-icon">🎵</span>
              <div class="category-info">
                <h4>Musique</h4>
                <p>Création et édition</p>
              </div>
            </div>
            <div class="category-preview">
              <span class="category-icon">🛠️</span>
              <div class="category-info">
                <h4>Autres</h4>
                <p>Productivité et utilitaires</p>
              </div>
            </div>
          </div>
        </div>
        
        <a href="/web/outils" class="btn-secondary">
          Voir tous les outils
        </a>
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
    margin-bottom: 4rem;
    font-size: 1.1rem;
    color: rgba(255,255,255,0.8);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .two-blocks-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(40px);
  }

  .block {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    min-height: 500px;
    display: flex;
    flex-direction: column;
  }

  .block:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }

  .portfolio-block {
    border-left: 4px solid #ffd700;
  }

  .tools-block {
    border-left: 4px solid #4ecdc4;
  }

  .block-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .block-content h2 {
    color: #fff;
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .block-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  /* Styles pour le bloc Portfolio */
  .portfolio-preview {
    margin-bottom: 2rem;
  }

  .preview-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .feature-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .feature-text {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }

  /* Styles pour le bloc Outils */
  .tools-preview {
    margin-bottom: 2rem;
  }

  .tools-categories {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .category-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease;
  }

  .category-preview:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.1);
  }

  .category-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .category-info {
    flex: 1;
  }

  .category-info h4 {
    color: #fff;
    font-size: 1.1rem;
    margin: 0 0 0.25rem 0;
  }

  .category-info p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin: 0;
  }

  /* Boutons */
  .btn-primary, .btn-secondary {
    display: inline-block;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 50px;
    transition: all 0.3s ease;
    text-align: center;
    margin-top: auto;
  }

  .btn-primary {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  }

  .btn-secondary {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    color: #fff;
    box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
  }

  .btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
  }

  /* Animations */
  .fade-in-up {
    opacity: 1;
    transform: translateY(0);
    animation: fadeInUp 0.6s cubic-bezier(.4,0,.2,1) both;
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
    .page-title {
      font-size: 2rem;
      margin: 1.2rem 0 1.2rem 0;
    }
    
    .two-blocks-container {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 0 1rem;
    }
    
    .block {
      padding: 1.5rem;
      min-height: auto;
    }
    
    .block-content h2 {
      font-size: 1.5rem;
    }
    
    .block-description {
      font-size: 1rem;
    }
    
    .feature-item,
    .category-preview {
      padding: 0.8rem;
    }
    
    .feature-icon,
    .category-icon {
      font-size: 1.2rem;
    }
  }
</style> 