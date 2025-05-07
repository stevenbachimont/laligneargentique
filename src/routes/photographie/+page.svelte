<script lang="ts">
  import { onMount } from 'svelte';

  interface PhotoSeries {
    id: number;
    title: string;
    description: string;
    photos: string[];
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
      ]
    },
    {
      id: 2,
      title: "Portraits",
      description: "Portraits en noir et blanc",
      photos: [
        "/photos/portraits/1.jpg",
        "/photos/portraits/2.jpg",
        "/photos/portraits/3.jpg"
      ]
    },
    {
      id: 3,
      title: "Paysages",
      description: "Vues panoramiques",
      photos: [
        "/photos/paysages/1.jpg",
        "/photos/paysages/2.jpg",
        "/photos/paysages/3.jpg"
      ]
    },
    {
      id: 4,
      title: "Quotidien",
      description: "Vues quotidiennes",
      photos: [
        "/photos/quotidien/1.jpg",
        "/photos/quotidien/2.jpg",
        "/photos/quotidien/3.jpg"
      ]
    }
  ];

  let selectedSeries: PhotoSeries | null = null;
  let isModalOpen = false;
  let fullscreenPhoto: string | null = null;
  let wordPositions: { [key: string]: { top: string; left: string } } = {};
  let titlePosition = { top: '50%', left: '50%' };
  let titleVisible = false;

  function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * ((max + 1) - min)) + min;
  }

  function updateWordPositions() {
    series.forEach(s => {
      const newX = randInt(30, 70);
      const newY = randInt(20, 80);
      wordPositions[s.title] = {
        top: `calc(${newY}% - 1ex)`,
        left: `${newX}%`
      };
    });
    wordPositions = { ...wordPositions };
  }

  function openModal(series: PhotoSeries) {
    selectedSeries = series;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    selectedSeries = null;
  }

  function openFullscreen(photo: string) {
    fullscreenPhoto = photo;
  }

  function closeFullscreen() {
    fullscreenPhoto = null;
  }

  onMount(() => {
    // Animation initiale des mots
    updateWordPositions();
    
    // Animation supplémentaire après 1 seconde
    setTimeout(() => {
      series.forEach(s => {
        if (randInt(0, 25) < 7) return;
        updateWordPositions();
      });
      
      // Animation du titre
      titlePosition = { top: '10%', left: '50%' };
      titleVisible = true;
    }, 1000);
  });
</script>

<div class="photography-page">
  
  
  <div class="thoughts">
    <p 
      class="title" 
      class:visible={titleVisible}
      style="top: {titlePosition.top}; left: {titlePosition.left}"
    >
      Photographie
    </p>
    {#each series as s}
      <p 
        style="top: {wordPositions[s.title]?.top || '50%'}; left: {wordPositions[s.title]?.left || '50%'}"
        on:click={() => openModal(s)}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === 'Enter' && openModal(s)}
      >
        {s.title}
      </p>
    {/each}
  </div>

  {#if isModalOpen && selectedSeries}
    <div class="modal" on:click={closeModal}>
      <div class="modal-content" on:click|stopPropagation>
        <div class="modal-header">
          <h2>{selectedSeries.title}</h2>
          <button class="close-button" on:click={closeModal}>×</button>
        </div>
        <p>{selectedSeries.description}</p>
        <div class="photo-grid">
          {#each selectedSeries.photos as photo}
            <button class="photo-item" on:click={() => openFullscreen(photo)}>
              <img src={photo} alt="{selectedSeries.title}" />
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if fullscreenPhoto}
    <div class="fullscreen-modal" on:click={closeFullscreen} tabindex="0" aria-modal="true" role="dialog" aria-label="Photo en plein écran">
      <img src={fullscreenPhoto} alt="Photo en plein écran" class="fullscreen-img" />
      <button class="close-fullscreen" on:click={closeFullscreen} aria-label="Fermer">×</button>
    </div>
  {/if}
</div>

<style>
  .photography-page {
    min-height: 100vh;
    padding: 2rem;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .thoughts {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background: radial-gradient(#656565, #323232);
    text-align: center;
    z-index: 0;
    pointer-events: none;
  }

  .thoughts p {
    pointer-events: auto;
  }

  p {
    position: absolute;
    margin: 0;
    font-size: 3rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgba(45,45,45,0.8);
    filter: blur(4px);
    transition: filter 1.5s ease, color 1.5s ease, top 5s ease, left 5s ease;
    transform: translateX(-50%);
    cursor: pointer;
    font-weight: 300;
  }

  p.title {
    font-size: 4rem;
    color: rgba(220, 220, 220, 0.8);
    filter: blur(4px);
    cursor: default;
    z-index: 1;
    transition: filter 1.5s ease, color 1.5s ease, top 5s ease, left 5s ease;
    font-weight: 700;
  }

  p.title.visible {
    filter: none;
    color: rgba(220, 220, 220, 1);
  }

  p:hover {
    filter: blur(0px);
    color: rgba(220, 220, 220, 0.6);
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

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .photo-item {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 8px;
    border: none;
    background-color: var(--color-bg);
  }

  .photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .photo-item:hover img {
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

  .fullscreen-img {
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 10px;
    box-shadow: 0 0 40px 10px #000a;
    background: var(--color-bg);
    cursor: auto;
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

  @media (max-width: 768px) {
    .photo-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
</style> 