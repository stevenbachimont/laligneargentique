<script lang="ts">
  import { onMount } from 'svelte';

  export let onValidated: (valid: boolean) => void = () => {};
  export let disabled: boolean = false;

  let captchaId: string = '';
  let imageUrl: string = '';
  let currentSharpness: number = 50;
  let isLoading: boolean = false;
  let error: string = '';
  let isValid: boolean = false;
  let imageElement: HTMLImageElement;
  let cursorPosition: { x: number; y: number } = { x: 50, y: 50 };
  let targetPosition: { x: number; y: number } = { x: 50, y: 50 };
  let isMouseOver: boolean = false;

  // Générer un nouveau captcha
  async function generateCaptcha() {
    isLoading = true;
    error = '';
    
    try {
      const response = await fetch('/api/captcha/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        captchaId = data.captchaId;
        imageUrl = data.imageUrl;
        currentSharpness = 50;
        isValid = false;
        
        // Générer une position cible aléatoire pour le 100% de netteté
        targetPosition = {
          x: Math.random() * 80 + 10, // Entre 10% et 90%
          y: Math.random() * 80 + 10
        };
        
        // Position initiale du curseur
        cursorPosition = { x: 50, y: 50 };
      } else {
        error = data.error || 'Erreur lors de la génération du captcha';
      }
    } catch (err) {
      error = 'Erreur de connexion';
      console.error('Erreur captcha:', err);
    } finally {
      isLoading = false;
    }
  }

  // Valider automatiquement si la netteté est suffisante
  function checkAutoValidation() {
    if (currentSharpness >= 95 && !isValid) {
      isValid = true;
      onValidated(true);
    } else if (currentSharpness < 95 && isValid) {
      isValid = false;
      onValidated(false);
    }
  }

  // Appliquer l'effet de netteté à l'image
  function applySharpness() {
    if (imageElement) {
      const blurValue = Math.abs(100 - currentSharpness) / 10;
      imageElement.style.filter = `blur(${blurValue}px)`;
    }
  }

  // Calculer la netteté basée sur une position
  function calculateSharpness(x: number, y: number) {
    const distance = Math.sqrt(
      Math.pow(x - targetPosition.x, 2) + Math.pow(y - targetPosition.y, 2)
    );
    
    // Plus proche du point cible = plus net (100%)
    // Plus loin = plus flou (0%)
    const maxDistance = 70; // Distance maximale pour 100%
    const sharpness = Math.max(0, Math.min(100, 100 - (distance / maxDistance) * 100));
    
    return Math.round(sharpness);
  }

  // Gérer le mouvement de la souris
  function handleMouseMove(event: MouseEvent) {
    if (disabled || !isMouseOver || isValid) return; // Bloqué si validé
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    cursorPosition = { x, y };
    currentSharpness = calculateSharpness(x, y);
    applySharpness();
    checkAutoValidation();
  }

  // Gérer le mouvement tactile
  function handleTouchMove(event: TouchEvent) {
    if (disabled || isValid) return; // Bloqué si validé
    event.preventDefault();
    
    const touch = event.touches[0];
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    cursorPosition = { x, y };
    currentSharpness = calculateSharpness(x, y);
    applySharpness();
    checkAutoValidation();
  }

  // Gérer le début du toucher
  function handleTouchStart(event: TouchEvent) {
    if (disabled || isValid) return; // Bloqué si validé
    
    const touch = event.touches[0];
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    cursorPosition = { x, y };
    currentSharpness = calculateSharpness(x, y);
    applySharpness();
    checkAutoValidation();
  }

  // Gérer l'entrée de la souris
  function handleMouseEnter() {
    if (isValid) return; // Pas d'activation si validé
    isMouseOver = true;
  }

  // Gérer la sortie de la souris
  function handleMouseLeave() {
    isMouseOver = false;
  }

  // Gérer le clic sur l'image (pour validation finale)
  function handleImageClick(event: MouseEvent) {
    if (disabled || isValid) return; // Bloqué si validé
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    cursorPosition = { x, y };
    currentSharpness = calculateSharpness(x, y);
    applySharpness();
    checkAutoValidation();
  }

  // Générer un captcha au montage du composant
  onMount(() => {
    generateCaptcha();
  });

  // Appliquer la netteté quand l'image est chargée
  function handleImageLoad() {
    applySharpness();
  }

  // Réinitialiser quand disabled change
  $: if (disabled) {
    isValid = false;
    onValidated(false);
  }

  // Déterminer la couleur de la bordure basée sur la netteté
  $: borderColor = currentSharpness >= 95 ? '#00ff00' : 
                   currentSharpness >= 80 ? '#ffff00' : 
                   currentSharpness >= 60 ? '#ffa500' : '#ff6b6b';
</script>

<div class="captcha-container">
  <div class="captcha-header">
    <h4>📸 Viseur Photo</h4>
    <p>Survolez l'image pour ajuster la netteté. Vert = validé !</p>
  </div>

  {#if isLoading}
    <div class="captcha-loading">
      <div class="spinner"></div>
      <p>Chargement de l'image...</p>
    </div>
  {:else if imageUrl}
    <div class="captcha-content">
      <div 
        class="image-container" 
        class:locked={isValid}
        on:mousemove={handleMouseMove}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
        on:click={handleImageClick}
        on:touchmove={handleTouchMove}
        on:touchstart={handleTouchStart}
        style="border-color: {borderColor};"
      >
        <img
          bind:this={imageElement}
          src={imageUrl}
          alt="Image à ajuster"
          on:load={handleImageLoad}
          class="captcha-image"
        />
        
        <!-- Curseur viseur superposé -->
        <div 
          class="camera-cursor"
          class:locked={isValid}
          style="left: {cursorPosition.x}%; top: {cursorPosition.y}%;"
        >
          <div class="cursor-inner">
            <div class="crosshair-h"></div>
            <div class="crosshair-v"></div>
            <div class="cursor-circle"></div>
          </div>
        </div>
      </div>
      
      <div class="controls">
        <button 
          class="refresh-btn" 
          on:click={generateCaptcha}
          title="Nouvelle image"
        >
          🔄 Nouvelle image
        </button>
      </div>
    </div>
  {/if}

  {#if error}
    <div class="captcha-error">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{error}</span>
    </div>
  {/if}

  {#if isValid}
    <div class="captcha-success">
      <span class="success-icon">✅</span>
      <span class="success-text">Netteté parfaite ! Captcha validé automatiquement.</span>
    </div>
  {/if}
</div>

<style>
  .captcha-container {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 2rem;
    margin: 1.5rem 0;
    backdrop-filter: blur(10px);
  }

  .captcha-header h4 {
    margin: 0 0 0.5rem 0;
    color: #00ff00;
    font-size: 1.3rem;
    text-align: center;
  }

  .captcha-header p {
    margin: 0 0 1.5rem 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    text-align: center;
  }

  .captcha-loading {
    text-align: center;
    padding: 2rem;
  }

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #00ff00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .captcha-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .image-container {
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    cursor: crosshair;
    border: 4px solid transparent;
    transition: border-color 0.3s ease;
  }

  .image-container.locked {
    cursor: default; /* Curseur normal quand bloqué */
  }

  .captcha-image {
    width: 100%;
    height: auto;
    display: block;
    transition: filter 0.3s ease;
    pointer-events: none; /* Permet au clic de passer au container */
  }

  /* Curseur viseur photo */
  .camera-cursor {
    position: absolute;
    width: 80px;
    height: 80px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 10;
    transition: left 0.1s ease, top 0.1s ease; /* Animation fluide */
  }

  .camera-cursor.locked {
    opacity: 0.7; /* Plus transparent quand bloqué */
    filter: grayscale(0.3); /* Légèrement grisé */
  }

  .cursor-inner {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .crosshair-h {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 3px;
    background: #000;
    transform: translateY(-50%);
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.9);
  }

  .crosshair-v {
    position: absolute;
    left: 50%;
    top: 0;
    width: 3px;
    height: 100%;
    background: #000;
    transform: translateX(-50%);
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.9);
  }

  .cursor-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border: 3px solid #000;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
  }

  .controls {
    display: flex;
    justify-content: center;
  }

  .refresh-btn {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }

  .refresh-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  .refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .captcha-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    border-radius: 8px;
    color: #ff6b6b;
  }

  .error-icon {
    font-size: 1.2rem;
  }

  .error-text {
    font-size: 0.9rem;
  }

  .captcha-success {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid rgba(0, 255, 0, 0.3);
    border-radius: 8px;
    color: #00ff00;
  }

  .success-icon {
    font-size: 1.2rem;
  }

  .success-text {
    font-size: 0.9rem;
    font-weight: bold;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .captcha-container {
      padding: 1.5rem;
    }

    .image-container {
      max-width: 100%;
    }
  }

  /* Support tactile pour mobile */
  @media (hover: none) and (pointer: coarse) {
    .image-container {
      cursor: default;
    }
  }
</style>
