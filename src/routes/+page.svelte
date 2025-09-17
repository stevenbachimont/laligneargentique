<script lang="ts">
  import { onMount } from 'svelte';
  let isVisible = false;

  onMount(() => {
    isVisible = true;
  });
</script>

<div class="hero" class:fade-in={isVisible}>
  <h1>Photographie</h1>
  <div class="cta-buttons">
    <a
      href="/photographie"
      class="button"
    >Découvrir</a>
    <a
      href="#about-section"
      class="button"
    >À propos</a>
    <a
      href="/photographie/argentique"
      class="button"
    >La Ligne Argentique</a>
  </div>
</div>

<section id="about-section" class="about-section">
  <div class="about-content">
    <div class="about-background"></div>
    <div class="about-text">
      <h2>À propos</h2>
      <p>
        Diplômé des arts du cirque, j'ai longtemps cherché ma voie après une blessure qui a bouleversé mon parcours. 
        Cette quête m'a mené vers la musique pour le spectacle, les arts numériques, et l'enseignement des arts du cirque 
        dans des milieux variés - psychiatrique, carcéral, scolaire et de loisir.
      </p>
      <p>
        Aujourd'hui, je me passionne pour le développement web, trouvant mon équilibre dans l'élaboration de projets 
        et leur architecture. En parallèle, je redécouvre la photographie argentique, m'occupant de tout moi-même : 
        restauration d'appareils anciens de tous formats, prises de vues et développements.
      </p>
      <p>
        Ce grand écart entre le web et la photographie m'aide à me développer personnellement, 
        créant un équilibre unique entre technologie moderne et artisanat traditionnel.
      </p>
    </div>
  </div>
</section>

<style>
  :global(html) { scroll-behavior: smooth; }
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    padding: 0;
    position: relative;
    overflow: hidden;
  }

  @media (max-width: 600px) {
    .hero {
      width: 100% !important;
      overflow-x: hidden !important;
    }
    :global(body) {
      width: 100% !important;
      overflow-x: hidden !important;
      margin: 0 !important;
    }
    h1 {
      font-size: 2rem !important;
      word-break: break-word;
    }
  }

  h1 { font-size: 3.5rem; margin-bottom: 1rem; position: relative; z-index: 1; }
  .cta-buttons { display: flex; gap: 1rem; margin-top: 2rem; background: none; border: none; color: none; font-size: 1.5rem; position: relative; z-index: 1; }
  a.button { transition: transform 0.3s, color 0.3s; background: none; color: var(--color-accent-1); will-change: transform; }
  a.button:hover { transform: scale(1.2); color: var(--color-accent-2); }
  .about-section {
     padding: 4rem 2rem; 
     text-align: center; 
     background: none; 
    }
  .about-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start; /* Alignement en haut */
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow: visible;
    border-radius: 20px;
    gap: 2rem;
  }
  .about-background {
    flex: 0 0 300px;
    height: auto; /* Hauteur auto */
    aspect-ratio: 3/4; /* Pour garder la proportion portrait */
    background-image: url('/background/moi.jpg');
    background-size: contain;
    background-position: left center;
    background-repeat: no-repeat;
    background-color: #000;
    border-radius: 20px;
    opacity: 1;
    filter: none;
    z-index: 0;
    min-height: 320px; /* Pour éviter qu'elle soit trop petite */
    max-height: 100%;
    margin-top: 3rem; /* Ajuste cette valeur selon le rendu souhaité */
  }
  .about-text {
    flex: 1 1 0;
    position: relative;
    z-index: 1;
    background: none;
    padding: 2rem;
    border-radius: 15px;
    max-width: 800px;
    margin: 0 auto;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .about-text h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--color-accent-1);
  }
  .about-text p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  @media (max-width: 768px) {
    .about-text {
      margin: 1rem;
      padding: 1.5rem;
    }
  }
  .fade-in { animation: fadeIn 1s ease-in; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
  h1, .cta-buttons {
    position: relative;
    z-index: 1;
  }





  /* Responsive : photo en dessous du texte */
  @media (max-width: 900px) {
    .about-content {
      flex-direction: column-reverse;
      align-items: center;
      gap: 1rem;
    }
    .about-background {
      width: 100%;
      max-width: 400px;
      height: 300px;
      margin: 0 auto;
      background-position: center;
      aspect-ratio: 3/4;
      min-height: 200px;
    }
    .about-text {
      padding: 1.5rem;
      max-width: 100%;
    }
  }
  @media (max-width: 768px) {
    .about-section {
      padding: 1rem 0.5rem; /* Moins de padding latéral */
    }
    .about-text {
      width: 90vw;
      max-width: none;
      margin: 0;
      padding: 1rem 1.2rem;
    }
  }
</style>
