<script lang="ts">
  import { onMount } from 'svelte';

  export let onValidated: (valid: boolean) => void;
  export let disabled = false;

  let imageElement: HTMLImageElement;
  let imageUrl = '';
  let captchaId = '';
  let currentSharpness = 50;
  let isValid = false;
  let borderColor = '#ccc';
  let targetPosition = { x: 50, y: 50 };
  let cursorPosition = { x: 50, y: 50 };

  // Générer un nouveau captcha
  async function generateCaptcha() {
    try {
      const response = await fetch('/api/captcha/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        captchaId = data.captchaId;
        imageUrl = data.imageUrl;
        currentSharpness = 50;
        isValid = false;
        borderColor = '#ccc';
        
        // Récupérer la position cible depuis le serveur
        if (data.targetPosition) {
          targetPosition = data.targetPosition;
        }
        
        // Appliquer la netteté initiale
        if (imageElement) {
          applySharpness();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la génération du captcha:', error);
    }
  }

  // Vérifier la validation automatique
  function checkAutoValidation() {
    if (currentSharpness >= 95) {
      isValid = true;
      borderColor = '#4CAF50';
      onValidated(true);
    } else if (currentSharpness >= 80) {
      borderColor = '#FF9800';
    } else if (currentSharpness >= 60) {
      borderColor = '#FF5722';
    } else {
      borderColor = '#ccc';
    }
  }

  // Calculer la netteté basée sur la distance au point cible
  function calculateSharpness(x: number, y: number) {
    // Calculer la distance euclidienne entre la position actuelle et la position cible
    const distance = Math.sqrt(
      Math.pow(x - targetPosition.x, 2) + Math.pow(y - targetPosition.y, 2)
    );
    
    // Plus proche du point cible = plus net (100%)
    // Plus loin = plus flou (0%)
    // Ajusté pour le format carré : distance maximale de 50% (diagonale du carré)
    const maxDistance = 50; // Distance maximale pour 100% dans un carré
    const sharpness = Math.max(0, Math.min(100, 100 - (distance / maxDistance) * 100));
    
    return Math.round(sharpness);
  }

  // Appliquer la netteté à l'image
  function applySharpness() {
    if (imageElement) {
      const blurAmount = Math.max(0, (100 - currentSharpness) / 10);
      imageElement.style.filter = `blur(${blurAmount}px)`;
    }
  }

  // Gérer le mouvement de la souris
  function handleMouseMove(event: MouseEvent) {
    if (disabled || isValid) return;
    
    const rect = imageElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    cursorPosition = { x, y };
    currentSharpness = calculateSharpness(x, y);
    
    applySharpness();
    checkAutoValidation();
  }

  // Gérer le toucher
  function handleTouchMove(event: TouchEvent) {
    if (disabled || isValid) return;
    
    const touch = event.touches[0];
    const rect = imageElement.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    cursorPosition = { x, y };
    currentSharpness = calculateSharpness(x, y);
    
    applySharpness();
    checkAutoValidation();
  }

  // Gérer le clic sur l'image
  function handleImageClick() {
    if (disabled || isValid) return;
    
    // Validation manuelle si la netteté est suffisante
    if (currentSharpness >= 80) {
      isValid = true;
      borderColor = '#4CAF50';
      onValidated(true);
    }
  }

  // Gérer le chargement de l'image
  function handleImageLoad() {
    if (imageElement) {
      applySharpness();
    }
  }

  // Générer le captcha au montage
  onMount(() => {
    generateCaptcha();
  });

  // Réactifs pour appliquer les changements
  $: if (currentSharpness !== undefined && imageElement) {
    applySharpness();
  }
</script>

<div class="captcha-container">
  <div class="captcha-header">
    <h5>📷 Ajustez la Netteté de l'Image</h5>
    <p>Déplacez le curseur sur l'image pour ajuster la netteté</p>
  </div>

  <div class="image-container" 
       style="border-color: {borderColor};"
       on:mousemove={handleMouseMove}
       on:click={handleImageClick}
       on:touchmove={handleTouchMove}
       on:touchstart={handleTouchMove}>
    
    <img 
      bind:this={imageElement}
      src={imageUrl} 
      alt="Image du captcha" 
      on:load={handleImageLoad}
      class="captcha-image"
    />
    
    <div class="camera-cursor" 
         style="left: {cursorPosition.x}%; top: {cursorPosition.y}%; transform: translate(-50%, -50%);">
      <div class="cursor-inner"></div>
    </div>
  </div>

  <div class="sharpness-info">
    <div class="sharpness-bar">
      <div class="bar-fill" style="width: {currentSharpness}%"></div>
    </div>
    <div class="sharpness-text">
      Netteté: {Math.round(currentSharpness)}%
    </div>
  </div>

  {#if isValid}
    <div class="success-message">
      ✅ Captcha validé ! Vous pouvez maintenant valider le formulaire.
    </div>
  {/if}
</div>

<style>
  .captcha-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .captcha-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .captcha-header h5 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 1.2em;
  }

  .captcha-header p {
    margin: 0;
    color: #666;
    font-size: 0.9em;
  }

  .image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border: 3px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    cursor: crosshair;
    transition: border-color 0.3s ease;
  }

  .captcha-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .camera-cursor {
    position: absolute;
    width: 60px;
    height: 60px;
    pointer-events: none;
    z-index: 10;
    transition: left 0.1s ease, top 0.1s ease;
  }

  .cursor-inner {
    width: 100%;
    height: 100%;
    border: 3px solid #000;
    border-radius: 50%;
    background: transparent;
    position: relative;
  }

  .cursor-inner::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    border: 2px solid #000;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .cursor-inner::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border: 1px solid #000;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .sharpness-info {
    margin-top: 20px;
    text-align: center;
  }

  .sharpness-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff5722, #ff9800, #4caf50);
    transition: width 0.3s ease;
  }

  .sharpness-text {
    font-size: 0.9em;
    color: #666;
    font-weight: 500;
  }

  .success-message {
    margin-top: 20px;
    padding: 12px;
    background: #4caf50;
    color: white;
    border-radius: 6px;
    text-align: center;
    font-weight: 500;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 600px) {
    .captcha-container {
      padding: 15px;
    }
    
    .camera-cursor {
      width: 50px;
      height: 50px;
    }
    
    .cursor-inner::before {
      width: 35px;
      height: 35px;
    }
    
    .cursor-inner::after {
      width: 18px;
      height: 18px;
    }
  }
</style>
