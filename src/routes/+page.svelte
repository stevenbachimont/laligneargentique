<script lang="ts">
  import { onMount } from 'svelte';
  import AnimatedTitle from '$lib/components/AnimatedTitle.svelte';
  
  let isVisible = false;

  onMount(() => {
    isVisible = true;
  });
</script>

<div class="hero" class:fade-in={isVisible}>
  <!-- Titre SVG décomposé -->
  <div class="title-container">
    <AnimatedTitle size="large" />
  </div>
  
  <!-- Image SVG en arrière-plan -->
  <div class="svg-container">
    <img src="/background/onelinetlr.svg" alt="Dessin en une ligne" class="background-svg" />
  </div>
</div>


<style>
  :global(html) { scroll-behavior: smooth; }
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #2c2c2c;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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

  .title-container {
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .title-svg {
    max-width: 600px;
    max-height: 120px;
    width: auto;
    height: auto;
    object-fit: contain;
    transition: all 0.3s ease;
  }

  .title-svg:hover {
    transform: scale(1.02);
  }

  /* Animation lettre par lettre */
  .letter {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
    animation: letterAppear 0.6s ease-out forwards;
  }

  @keyframes letterAppear {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.8);
    }
    50% {
      opacity: 0.8;
      transform: translateY(-5px) scale(1.1);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Style pour les espaces */
  .space {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
    animation: letterAppear 0.6s ease-out forwards;
    font-size: 1.2em;
  }

  @media (max-width: 768px) {
    .title-container {
      width: 100%;
      padding: 0 1rem;
    }
    
    h1 {
      font-size: 2.5rem !important;
    }
  }

  @media (max-width: 480px) {
    .title-container {
      padding: 0 0.5rem;
    }
    
    h1 {
      font-size: 2rem !important;
    }
  }

  
  .fade-in { animation: fadeIn 1s ease-in; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
 

  .svg-container {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    position: relative;
  }

  .background-svg {
    max-width: 400px;
    max-height: 300px;
    width: auto;
    height: auto;
    object-fit: contain;
    opacity: 0.8;
    transition: all 0.3s ease;
  }

  .background-svg:hover {
    opacity: 1;
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    .background-svg {
      max-width: 300px;
      max-height: 200px;
    }
  }





</style>
