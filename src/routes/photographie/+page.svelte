<script lang="ts">
  import { onMount } from 'svelte';

  interface PhotoSeries {
    id: number;
    title: string;
    description: string;
    photos: string[];
    thumbnail?: string; // Photo d'aperçu
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
  let isVisible = false;

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
    setTimeout(() => { isVisible = true; }, 100);
  });
</script>

<div class="photography-page">
  <div class="content">
    <h1 class="page-title {isVisible ? 'fade-in-up' : ''}">Photographie</h1>
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
      <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation>
        <div class="modal-header">
          <h2>{selectedSeries.title}</h2>
          <button class="close-button" on:click={closeModal}>×</button>
        </div>
        <p>{selectedSeries?.description}</p>
        <div class="photo-grid">
          {#each selectedSeries.photos as photo}
            <button class="photo-item" on:click={() => openFullscreen(photo)} on:keydown={(e) => e.key === 'Enter' && openFullscreen(photo)}>
              <img src={photo} alt="{selectedSeries.title}" />
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if fullscreenPhoto}
    <div class="fullscreen-modal" on:click={closeFullscreen} on:keydown={(e) => e.key === 'Escape' && closeFullscreen()} tabindex="0" aria-modal="true" role="dialog" aria-label="Photo en plein écran">
      <img src={fullscreenPhoto} alt="" class="fullscreen-img" />
      <button class="close-fullscreen" on:click={closeFullscreen} aria-label="Fermer">×</button>
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

  .photography-page {
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