<script lang="ts">
  import { onMount } from 'svelte';

  interface PhotoSeries {
    id: number;
    title: string;
    description: string;
    photos: string[];
    thumbnail?: string;
  }

  let series: PhotoSeries[] = [
    {
      id: 1,
      title: "Street",
      description: "Captures de moments urbains",
      photos: [
        "/photos/street/1.jpg",
        "/photos/street/2.jpg",
        "/photos/street/3.jpg",
        "/photos/street/4.jpg",
      ],
      thumbnail: "/photos/street/1.jpg"
    },
    {
      id: 2,
      title: "Portraits",
      description: "Portraits en noir et blanc",
      photos: [
        "/photos/portraits/Charlie.jpg",
        "/photos/portraits/IMG_7790.jpg",
        "/photos/portraits/IMG_7795.jpg",
        "/photos/portraits/IMG_7802.jpg",
        "/photos/portraits/IMG_7803.jpg",
        "/photos/portraits/IMG_7826.jpg",
        "/photos/portraits/IMG_8022-1.jpg",
        "/photos/portraits/IMG_8025-1.jpg",
        "/photos/portraits/IMG_8043.jpg",
        "/photos/portraits/IMG_8055.jpg",
        "/photos/portraits/IMG_8057.jpg",
        
      ],
      thumbnail: "/photos/portraits/IMG_7790.jpg"
    },
    {
      id: 3,
      title: "Paysages",
      description: "Vues panoramiques",
      photos: [
        "/photos/paysages/1.jpg",
        "/photos/paysages/2.jpg",
        "/photos/paysages/3.jpg"
      ],
      thumbnail: "/photos/paysages/1.jpg"
    },
    {
      id: 4,
      title: "Quotidien",
      description: "Vues quotidiennes",
      photos: [
        "/photos/quotidien/1.jpg",
        "/photos/quotidien/2.jpg",
        "/photos/quotidien/3.jpg"
      ],
      thumbnail: "/photos/quotidien/1.jpg"
    }
  ];

  let selectedSeries: PhotoSeries | null = null;
  let isModalOpen = false;
  let fullscreenPhoto: string | null = null;
  let currentPhotoIndex = 0;
  let isVisible = false;
  let fullscreenModalElement: HTMLElement;

  function openModal(series: PhotoSeries) {
    selectedSeries = series;
    isModalOpen = true;
    currentPhotoIndex = 0;
  }

  function closeModal() {
    isModalOpen = false;
    selectedSeries = null;
    currentPhotoIndex = 0;
  }

  function openFullscreen(photo: string, index: number) {
    fullscreenPhoto = photo;
    currentPhotoIndex = index;
    // Focus automatique sur le modal plein écran pour capturer les événements clavier
    setTimeout(() => {
      if (fullscreenModalElement) {
        fullscreenModalElement.focus();
      }
    }, 100);
  }

  function closeFullscreen() {
    fullscreenPhoto = null;
    currentPhotoIndex = 0;
  }

  function nextPhoto() {
    if (selectedSeries && currentPhotoIndex < selectedSeries.photos.length - 1) {
      currentPhotoIndex++;
      // Mettre à jour l'image plein écran si on est en mode plein écran
      if (fullscreenPhoto && selectedSeries) {
        fullscreenPhoto = selectedSeries.photos[currentPhotoIndex];
      }
    }
  }

  function previousPhoto() {
    if (currentPhotoIndex > 0) {
      currentPhotoIndex--;
      // Mettre à jour l'image plein écran si on est en mode plein écran
      if (fullscreenPhoto && selectedSeries) {
        fullscreenPhoto = selectedSeries.photos[currentPhotoIndex];
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (isModalOpen && selectedSeries) {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          nextPhoto();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          previousPhoto();
          break;
        case 'Escape':
          event.preventDefault();
          closeModal();
          break;
      }
    }
    if (fullscreenPhoto && selectedSeries) {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          nextPhoto();
          fullscreenPhoto = selectedSeries.photos[currentPhotoIndex];
          break;
        case 'ArrowLeft':
          event.preventDefault();
          previousPhoto();
          fullscreenPhoto = selectedSeries.photos[currentPhotoIndex];
          break;
        case 'Escape':
          event.preventDefault();
          closeFullscreen();
          break;
      }
    }
  }

  onMount(() => {
    setTimeout(() => { isVisible = true; }, 100);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="portfolio-photo-page">
  <div class="content">
    <h1 class="page-title {isVisible ? 'fade-in-up' : ''}">Portfolio Photo</h1>
    <div class="series-grid">
      {#each series as s, i}
        <div class="series-card {isVisible ? 'fade-in-up' : ''}"
             style="animation-delay: {0.2 + i * 0.08}s"
             on:click={() => openModal(s)}
             role="button"
             tabindex="0"
             on:keydown={(e) => e.key === 'Enter' && openModal(s)}>
          <div class="series-content">
            <h2>{s.title}</h2>
            <p>{s.description}</p>
          </div>
          {#if s.thumbnail}
            <div class="series-thumbnail">
              <img src={s.thumbnail} alt="Aperçu {s.title}" />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  {#if isModalOpen && selectedSeries}
    <div class="modal" on:click={closeModal} role="dialog" aria-modal="true" aria-label="Modal de photos">
      <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation role="document">
        <div class="modal-header">
          <h2>{selectedSeries.title}</h2>
          <button class="close-button" on:click={closeModal}>×</button>
        </div>
        <p>{selectedSeries?.description}</p>
        
        <!-- Carrousel principal -->
        <div class="carousel-container">
          <button class="carousel-nav prev" on:click={previousPhoto} disabled={currentPhotoIndex === 0}>
            ‹
          </button>
          
          <div class="carousel-main">
            <img 
              src={selectedSeries.photos[currentPhotoIndex]} 
              alt="{selectedSeries.title} - Image {currentPhotoIndex + 1}"
              class="carousel-image"
              on:click={() => selectedSeries && openFullscreen(selectedSeries.photos[currentPhotoIndex], currentPhotoIndex)}
              role="button"
              tabindex="0"
              on:keydown={(e) => e.key === 'Enter' && selectedSeries && openFullscreen(selectedSeries.photos[currentPhotoIndex], currentPhotoIndex)}
            />
            <div class="carousel-counter">
              {currentPhotoIndex + 1} / {selectedSeries.photos.length}
            </div>
          </div>
          
          <button class="carousel-nav next" on:click={nextPhoto} disabled={currentPhotoIndex === selectedSeries.photos.length - 1}>
            ›
          </button>
        </div>



        <!-- Vignettes -->
        <div class="thumbnails-container">
          <div class="thumbnails-grid">
            {#each selectedSeries.photos as photo, index}
              <button 
                class="thumbnail-item {index === currentPhotoIndex ? 'active' : ''}"
                on:click={() => currentPhotoIndex = index}
                on:keydown={(e) => e.key === 'Enter' && (currentPhotoIndex = index)}
              >
                <img src={photo} alt="Vignette {index + 1}" />
              </button>
            {/each}
          </div>
        </div>


      </div>
    </div>
  {/if}

  {#if fullscreenPhoto}
    <div class="fullscreen-modal" on:click={closeFullscreen} tabindex="0" aria-modal="true" role="dialog" aria-label="Photo en plein écran" bind:this={fullscreenModalElement}>
      <div class="fullscreen-carousel" on:click|stopPropagation>
        <button class="carousel-nav prev fullscreen-nav" on:click|stopPropagation={() => previousPhoto()} disabled={currentPhotoIndex === 0}>
          ‹
        </button>
        
        <div class="fullscreen-main">
          <img 
            src={fullscreenPhoto} 
            alt="{selectedSeries?.title} - Image {currentPhotoIndex + 1}" 
            class="fullscreen-img"
          />
          <div class="fullscreen-counter">
            {currentPhotoIndex + 1} / {selectedSeries?.photos.length}
          </div>
        </div>
        
        <button class="carousel-nav next fullscreen-nav" on:click|stopPropagation={() => nextPhoto()} disabled={currentPhotoIndex === (selectedSeries?.photos.length || 0) - 1}>
          ›
        </button>
      </div>
      
              <button class="close-fullscreen" on:click|stopPropagation={closeFullscreen} aria-label="Fermer">×</button>
    </div>
  {/if}
</div>

<style>
  :global(html), :global(body) {
    overflow-x: hidden;
    width: 100vw;
    margin: 0;
    padding: 0;
  }

  .portfolio-photo-page {
    height: 100%;
    position: relative;
    background: #000;
    overflow-x: hidden;
    width: 100vw;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0;
    box-sizing: border-box;
  }

  .page-title {
    font-size: 3rem;
    color: #fff;
    margin: 2rem 0 2rem 0;
    text-align: center;
    font-weight: 300;
    letter-spacing: 0.2em;
    width: 100%;
    opacity: 0;
    transform: translateY(40px);
  }

  .series-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100vw;
    max-width: 500px;
    margin: 0 auto 2rem auto;
    padding: 0 1vw;
    box-sizing: border-box;
  }

  .series-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 1.2rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    width: 100%;
    box-sizing: border-box;
    opacity: 0;
    transform: translateY(40px);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .series-card:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .series-content {
    flex: 1;
  }

  .series-content h2 {
    color: #fff;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .series-content p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    line-height: 1.5;
  }

  .series-thumbnail {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .series-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .series-card:hover .series-thumbnail img {
    transform: scale(1.1);
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--color-bg);
    padding: 2rem;
    border-radius: 10px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .modal-header h2 {
    color: rgba(220, 220, 220, 0.6);
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0;
  }

  /* Carrousel styles */
  .carousel-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
  }

  .carousel-main {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .carousel-image {
    max-width: 100%;
    max-height: 60vh;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .carousel-image:hover {
    transform: scale(1.02);
  }

  .carousel-nav {
    background: none;
    border: none;
    color: #fff;
    font-size: 2rem;
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .carousel-nav:hover:not(:disabled) {
    color: #ff69b4;
    transform: scale(1.1);
  }

  .carousel-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .carousel-counter {
    position: absolute;
    bottom: -2rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
  }



  /* Vignettes */
  .thumbnails-container {
    margin: 2rem 0;
  }

  .thumbnails-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .thumbnail-item {
    aspect-ratio: 1;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background: none;
    padding: 0;
  }

  .thumbnail-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumbnail-item:hover {
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }

  .thumbnail-item.active {
    border-color: #ffd700;
    transform: scale(1.1);
  }



  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: rgba(220, 220, 220, 0.6);
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
  }

  /* Plein écran */
  .fullscreen-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.97);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    animation: fadeIn 0.2s;
  }

  .fullscreen-carousel {
    position: relative;
    display: flex;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 95vw;
  }

  .fullscreen-main {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fullscreen-img {
    max-width: 100%;
    max-height: 90vh;
    border-radius: 10px;
    box-shadow: 0 0 40px 10px #000a;
    background: var(--color-bg);
    cursor: auto;
  }

  .fullscreen-nav {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2100;
    background: none;
    border: none;
    color: #fff;
    font-size: 3rem;
    width: 80px;
    height: 80px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fullscreen-nav:hover:not(:disabled) {
    color: #ff69b4;
    transform: translateY(-50%) scale(1.1);
  }

  .fullscreen-nav.prev {
    left: 2rem;
  }

  .fullscreen-nav.next {
    right: 2rem;
  }

  .close-fullscreen {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: none;
    border: none;
    color: rgba(220, 220, 220, 0.6);
    font-size: 3rem;
    cursor: pointer;
    z-index: 2100;
    padding: 0;
    line-height: 1;
  }

  .fullscreen-counter {
    position: absolute;
    bottom: -2rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    .page-title {
      font-size: 2rem;
      margin: 1.2rem 0 1.2rem 0;
    }
    .series-grid {
      padding: 0;
      gap: 0.7rem;
      justify-items: center;
      width: 100%;
      max-width: none;
    }
    .series-card {
      padding: 0.8rem 0.5rem;
      width: 80%;
      margin: 0 auto;
    }
    .series-content h2 {
      font-size: 1.1rem;
    }
    .series-content p {
      font-size: 0.95rem;
    }
    .series-thumbnail {
      width: 60px;
      height: 60px;
    }
    
    .carousel-nav {
      width: 40px;
      height: 40px;
      font-size: 1.5rem;
    }
    
    .thumbnails-grid {
      grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    }
    
    .fullscreen-carousel {
      gap: 1rem;
    }
    
    .fullscreen-nav {
      font-size: 2rem;
      width: 60px;
      height: 60px;
    }
    
    .fullscreen-nav.prev {
      left: 1rem;
    }
    
    .fullscreen-nav.next {
      right: 1rem;
    }
  }

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
</style> 