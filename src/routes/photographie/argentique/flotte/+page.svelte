<script lang="ts">
  import { onMount } from 'svelte';
  import { getAppareilsByCategorie, type AppareilPhoto } from '../../../../../data/appareilsData';

  let appareilsParCategorie: { [categorie: string]: AppareilPhoto[] } = {};
  let categorieActive = '';
  let appareilActuel = 0;
  let isVisible = false;
  let autoPlay = true;
  let intervalId: ReturnType<typeof setInterval>;

  const categories = ['TLR', 'SLR', 'Folding', 'Rangefinder', 'Point & Shoot'];

  onMount(() => {
    appareilsParCategorie = getAppareilsByCategorie();
    categorieActive = categories[0];
    
    setTimeout(() => { 
      isVisible = true; 
      if (autoPlay) {
        startAutoPlay();
      }
    }, 100);
  });

  function startAutoPlay() {
    intervalId = setInterval(() => {
      const appareilsCategorie = appareilsParCategorie[categorieActive];
      if (appareilsCategorie && appareilsCategorie.length > 0) {
        appareilActuel = (appareilActuel + 1) % appareilsCategorie.length;
      }
    }, 4000);
  }

  function stopAutoPlay() {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  function changerCategorie(categorie: string) {
    categorieActive = categorie;
    appareilActuel = 0;
    stopAutoPlay();
    if (autoPlay) {
      startAutoPlay();
    }
  }

  function appareilSuivant() {
    const appareilsCategorie = appareilsParCategorie[categorieActive];
    if (appareilsCategorie && appareilsCategorie.length > 0) {
      appareilActuel = (appareilActuel + 1) % appareilsCategorie.length;
    }
    stopAutoPlay();
    if (autoPlay) {
      startAutoPlay();
    }
  }

  function appareilPrecedent() {
    const appareilsCategorie = appareilsParCategorie[categorieActive];
    if (appareilsCategorie && appareilsCategorie.length > 0) {
      appareilActuel = appareilActuel === 0 ? appareilsCategorie.length - 1 : appareilActuel - 1;
    }
    stopAutoPlay();
    if (autoPlay) {
      startAutoPlay();
    }
  }

  function toggleAutoPlay() {
    autoPlay = !autoPlay;
    if (autoPlay) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }

  function getCategorieDescription(categorie: string): string {
    const descriptions: { [key: string]: string } = {
      'TLR': 'Twin Lens Reflex - Deux objectifs superposés pour la visée et la prise de vue',
      'SLR': 'Single Lens Reflex - Un seul objectif avec miroir pour la visée',
      'Folding': 'Appareils pliables - Design compact et élégant des années 30-50',
      'Rangefinder': 'Télémètre - Mise au point par coïncidence d\'images',
      'Point & Shoot': 'Compacts - Simplicité et discrétion pour la photographie de rue'
    };
    return descriptions[categorie] || '';
  }
</script>

<div class="flotte-page">
  <div class="hero-section {isVisible ? 'fade-in' : ''}">
    <h1>Notre flotte d'appareils</h1>
    <p class="hero-subtitle">Découvrez les appareils photo argentiques restaurés et disponibles pour nos balades</p>
  </div>

  <div class="content">
    <!-- Navigation par catégories -->
    <section class="categories-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
      <div class="container">
        <h2>Catégories d'appareils</h2>
        <div class="categories-nav">
          {#each categories as categorie}
            <button 
              class="categorie-btn {categorieActive === categorie ? 'active' : ''}"
              on:click={() => changerCategorie(categorie)}
            >
              {categorie}
            </button>
          {/each}
        </div>
        <p class="categorie-description">
          {getCategorieDescription(categorieActive)}
        </p>
      </div>
    </section>

    <!-- Carrousel d'appareils -->
    <section class="carrousel-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.4s">
      <div class="container">
        {#if appareilsParCategorie[categorieActive] && appareilsParCategorie[categorieActive].length > 0}
          <div class="carrousel-container">
            <button class="carrousel-btn prev" on:click={appareilPrecedent} aria-label="Appareil précédent">
              ‹
            </button>
            
            <div class="carrousel-content">
              {#each appareilsParCategorie[categorieActive] as appareil, index}
                <div class="appareil-slide {index === appareilActuel ? 'active' : ''}">
                  <div class="appareil-image">
                    <img 
                      src={appareil.image} 
                      alt={appareil.nom}
                      on:error={(e) => {
                        // Si l'image ne se charge pas, utiliser l'image par défaut
                        e.target.src = '/flotte/default-camera.png';
                      }}
                    />
                  </div>
                  <div class="appareil-info">
                    <h3>{appareil.nom}</h3>
                    <p class="appareil-marque">{appareil.marque} {appareil.modele} ({appareil.annee})</p>
                    <p class="appareil-description">{appareil.description}</p>
                    <div class="appareil-caracteristiques">
                      <h4>Caractéristiques :</h4>
                      <ul>
                        {#each appareil.caracteristiques as caracteristique}
                          <li>{caracteristique}</li>
                        {/each}
                      </ul>
                    </div>
                    <div class="appareil-footer">
                      <span class="prix-location">{appareil.prixLocation}€/balade</span>
                      <span class="statut {appareil.statut}">
                        {appareil.statut === 'disponible' ? 'Disponible' : 
                         appareil.statut === 'maintenance' ? 'En maintenance' : 'Réservé'}
                      </span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
            
            <button class="carrousel-btn next" on:click={appareilSuivant} aria-label="Appareil suivant">
              ›
            </button>
          </div>

          <!-- Indicateurs de position -->
          <div class="carrousel-indicators">
            {#each appareilsParCategorie[categorieActive] as _, index}
              <button 
                class="indicator {index === appareilActuel ? 'active' : ''}"
                on:click={() => { appareilActuel = index; stopAutoPlay(); if (autoPlay) startAutoPlay(); }}
                aria-label="Aller à l'appareil {index + 1}"
              ></button>
            {/each}
          </div>

          <!-- Contrôles -->
          <div class="carrousel-controls">
            <button class="control-btn" on:click={toggleAutoPlay}>
              {autoPlay ? '⏸️ Pause' : '▶️ Lecture'}
            </button>
            <span class="appareil-counter">
              {appareilActuel + 1} / {appareilsParCategorie[categorieActive].length}
            </span>
          </div>
        {:else}
          <div class="no-appareils">
            <p>Aucun appareil disponible dans cette catégorie pour le moment.</p>
          </div>
        {/if}
      </div>
    </section>

    <!-- Section informations pratiques -->
    <section class="infos-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.6s">
      <div class="container">
        <h2>Informations pratiques</h2>
        <div class="infos-grid">
          <div class="info-card">
            <h3>🔧 Maintenance</h3>
            <p>Tous nos appareils sont régulièrement entretenus et testés avant chaque balade pour garantir un fonctionnement optimal.</p>
          </div>
          <div class="info-card">
            <h3>📸 Pellicules</h3>
            <p>Les pellicules sont fournies avec l'appareil. Nous utilisons principalement du film noir et blanc 400 ISO.</p>
          </div>
          <div class="info-card">
            <h3>🎓 Formation</h3>
            <p>Chaque appareil est accompagné d'une formation personnalisée sur son utilisation et ses spécificités.</p>
          </div>
          <div class="info-card">
            <h3>🛡️ Assurance</h3>
            <p>Tous les appareils sont couverts par notre assurance. Aucun frais supplémentaire en cas de dommage accidentel.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  .flotte-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
  }

  .hero-section {
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/background/appareils.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0;
    transform: translateY(30px);
  }

  .hero-section h1 {
    font-size: 3.5rem;
    font-weight: 300;
    margin-bottom: 1rem;
    letter-spacing: 0.2em;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-subtitle {
    font-size: 1.2rem;
    color: rgba(255,255,255,0.9);
    max-width: 600px;
    line-height: 1.6;
  }

  .content {
    padding: 4rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .categories-section {
    margin-bottom: 4rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .categories-section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #ffd700;
  }

  .categories-nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .categorie-btn {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border: 2px solid rgba(255,255,255,0.2);
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .categorie-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }

  .categorie-btn.active {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border-color: #ffd700;
  }

  .categorie-description {
    text-align: center;
    color: rgba(255,255,255,0.8);
    font-size: 1.1rem;
    font-style: italic;
    max-width: 600px;
    margin: 0 auto;
  }

  .carrousel-section {
    margin-bottom: 4rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .carrousel-container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    background: rgba(255,255,255,0.05);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .carrousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.2);
    color: #fff;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
  }

  .carrousel-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-50%) scale(1.1);
  }

  .carrousel-btn.prev {
    left: -25px;
  }

  .carrousel-btn.next {
    right: -25px;
  }

  .carrousel-content {
    position: relative;
    overflow: hidden;
    border-radius: 15px;
  }

  .appareil-slide {
    display: none;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
    min-height: 400px;
  }

  .appareil-slide.active {
    display: grid;
  }

  .appareil-image {
    text-align: center;
  }

  /* Images au format carré uniforme */
  .appareil-image img {
    width: 350px;
    height: 350px;
    object-fit: cover; /* Recadre l'image pour remplir le carré */
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .appareil-info h3 {
    font-size: 1.8rem;
    color: #ffd700;
    margin-bottom: 0.5rem;
  }

  .appareil-marque {
    color: rgba(255,255,255,0.7);
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .appareil-description {
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .appareil-caracteristiques h4 {
    color: #ffd700;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .appareil-caracteristiques ul {
    list-style: none;
    padding: 0;
    margin-bottom: 1.5rem;
  }

  .appareil-caracteristiques li {
    color: rgba(255,255,255,0.8);
    margin-bottom: 0.3rem;
    padding-left: 1rem;
    position: relative;
  }

  .appareil-caracteristiques li::before {
    content: '•';
    color: #ffd700;
    position: absolute;
    left: 0;
  }

  .appareil-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.2);
  }

  .prix-location {
    font-size: 1.2rem;
    font-weight: bold;
    color: #ffd700;
  }

  .statut {
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .statut.disponible {
    background: rgba(0, 255, 0, 0.2);
    color: #00ff00;
    border: 1px solid rgba(0, 255, 0, 0.3);
  }

  .statut.maintenance {
    background: rgba(255, 165, 0, 0.2);
    color: #ffa500;
    border: 1px solid rgba(255, 165, 0, 0.3);
  }

  .statut.reserve {
    background: rgba(255, 0, 0, 0.2);
    color: #ff6b6b;
    border: 1px solid rgba(255, 0, 0, 0.3);
  }

  .carrousel-indicators {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 2rem 0;
  }

  .indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .indicator.active {
    background: #ffd700;
    transform: scale(1.2);
  }

  .carrousel-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }

  .control-btn {
    background: linear-gradient(45deg, #9C27B0, #7B1FA2);
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
  }

  .control-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
  }

  .appareil-counter {
    color: rgba(255,255,255,0.7);
    font-size: 1.1rem;
    font-weight: 600;
  }

  .no-appareils {
    text-align: center;
    padding: 3rem;
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .no-appareils p {
    color: rgba(255,255,255,0.7);
    font-size: 1.1rem;
  }

  .infos-section {
    opacity: 0;
    transform: translateY(40px);
  }

  .infos-section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: #ffd700;
  }

  .infos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .info-card {
    background: rgba(255,255,255,0.05);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    text-align: center;
  }

  .info-card h3 {
    color: #ffd700;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .info-card p {
    color: rgba(255,255,255,0.8);
    line-height: 1.6;
  }

  /* Animations */
  .fade-in {
    opacity: 1;
    transform: translateY(0);
    animation: fadeIn 1s ease-out;
  }

  .fade-in-up {
    opacity: 1;
    transform: translateY(0);
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
    .hero-section {
      padding: 3rem 1rem;
      min-height: 50vh;
    }

    .hero-section h1 {
      font-size: 2.2rem;
      line-height: 1.2;
      margin-bottom: 1.5rem;
    }

    .hero-subtitle {
      font-size: 1rem;
      line-height: 1.5;
      max-width: 100%;
      padding: 0 1rem;
    }

    .container {
      padding: 0 1rem;
    }

    .content {
      padding: 2rem 0;
    }

    .categories-nav {
      gap: 0.5rem;
    }

    .categorie-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .carrousel-container {
      padding: 1rem;
    }

    .carrousel-btn {
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
    }

    .carrousel-btn.prev {
      left: -20px;
    }

    .carrousel-btn.next {
      right: -20px;
    }

    .appareil-slide {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      text-align: center;
    }

    .appareil-image img {
      width: 250px;
      height: 250px;
    }

    .appareil-info h3 {
      font-size: 1.5rem;
    }

    .appareil-footer {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .carrousel-controls {
      flex-direction: column;
      gap: 1rem;
    }

    .infos-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .hero-section h1 {
      font-size: 1.8rem;
      padding: 0 0.5rem;
    }

    .hero-subtitle {
      font-size: 0.95rem;
      padding: 0 0.8rem;
    }

    .carrousel-container {
      padding: 0.8rem;
    }

    .appareil-slide {
      min-height: 300px;
    }

    .appareil-image img {
      width: 200px;
      height: 200px;
    }

    .appareil-info h3 {
      font-size: 1.3rem;
    }
  }
</style>
