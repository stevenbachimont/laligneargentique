<script lang="ts">
  import { onMount } from 'svelte';
  import '../../lib/shared-blocks.css';

  // Interface pour les balades
  interface Balade {
    id: number;
    date: string;
    heure: string;
    lieu: string;
    theme: string;
    placesDisponibles: number;
    prix: string;
    description: string;
  }

  // Balades programmées pour l'aperçu (chargées depuis la BDD)
  let baladesApercu: Balade[] = [];
  let isLoading = true;
  let isVisible = false;

  onMount(async () => {
    setTimeout(() => { isVisible = true; }, 100);
    await chargerBalades();
  });

  async function chargerBalades() {
    try {
      const response = await fetch('/api/balades');
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && Array.isArray(data.balades)) {
          // Filtrer les balades avec des places disponibles et les trier par nombre de places
          const baladesDisponibles = data.balades
            .filter((balade: Balade) => balade.placesDisponibles > 0)
            .sort((a: Balade, b: Balade) => b.placesDisponibles - a.placesDisponibles)
            .slice(0, 2); // Prendre les 2 premières avec le plus de places
          
          baladesApercu = baladesDisponibles;
        } else {
          console.error('Format de données invalide:', data);
        }
      } else {
        console.error('Erreur lors du chargement des balades');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    } finally {
      isLoading = false;
    }
  }

  function navigateToPortfolio() {
    window.location.href = '/photographie/portfolioPhoto';
  }

  function navigateToArgentique() {
    window.location.href = '/photographie/argentique';
  }

  function reserverBalade(baladeId: number) {
    // Empêcher la propagation de l'événement pour éviter la navigation vers la page argentique
    event?.stopPropagation();
    window.location.href = `/photographie/argentique/reservation?baladeId=${baladeId}`;
  }
</script>

<div class="photography-page">
  <h1>Photographie</h1>
  <p class="page-intro">
    Découvrez mes séries photographiques et mes balades argentiques guidées 
    dans les rues de Nantes.
  </p>

  <div class="two-blocks-container {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
    <!-- Bloc gauche : Portfolio Photo -->
    <div class="block portfolio-block" on:click={navigateToPortfolio} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && navigateToPortfolio()}>
      <div class="block-content">
        <h2>Portfolio Photo</h2>
        <p class="block-description">
          Découvrez mes séries photographiques : Street, Portraits, Paysages et Quotidien. 
          Chaque série raconte une histoire à travers l'objectif.
        </p>
        <div class="block-preview">
          <div class="preview-item">
            <span class="preview-icon">📸</span>
            <span class="preview-text">Séries Street, Portraits, Paysages</span>
          </div>
          <div class="preview-item">
            <span class="preview-icon">🎨</span>
            <span class="preview-text">Histoires visuelles</span>
          </div>
        </div>
        <div class="block-cta">
          <span class="cta-text">Voir le portfolio</span>
          <span class="cta-arrow">→</span>
        </div>
      </div>
    </div>

    <!-- Bloc droit : La ligne Argentique -->
    <div class="block argentique-block" on:click={navigateToArgentique} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && navigateToArgentique()}>
      <div class="block-content">
        <h2>La ligne Argentique</h2>
        <p class="block-description">
          Découvrez Nantes à travers l'objectif d'un appareil photo argentique. 
          Balades photographiques guidées dans les rues de la ville.
        </p>
        
        <!-- Aperçu des balades programmées -->
        <div class="balades-preview">
          <h3>Prochaines balades</h3>
          <div class="balades-preview-grid">
            {#if isLoading}
              <div class="loading-message">Chargement des balades...</div>
            {:else if baladesApercu.length === 0}
              <div class="no-balades-message">Aucune balade disponible pour le moment</div>
            {:else}
              {#each baladesApercu as balade}
                <div class="balade-preview-card" on:click={() => reserverBalade(balade.id)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && reserverBalade(balade.id)}>
                  <div class="balade-preview-date">
                    <span class="date-day">{new Date(balade.date).getDate()}</span>
                    <span class="date-month">{new Date(balade.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                  </div>
                  <div class="balade-preview-info">
                    <h4>{balade.theme}</h4>
                    <p>📍 {balade.lieu} • 🕐 {balade.heure}</p>
                    <span class="places-dispo {balade.placesDisponibles === 0 ? 'complete' : balade.placesDisponibles === 1 ? 'limite' : balade.placesDisponibles <= 3 ? 'orange' : 'disponible'}">{balade.placesDisponibles} place{balade.placesDisponibles > 1 ? 's' : ''} disponible{balade.placesDisponibles > 1 ? 's' : ''}</span>
                  </div>
                  <div class="reservation-hint">Cliquez pour réserver</div>
                </div>
              {/each}
            {/if}
          </div>
        </div>

        <div class="block-cta">
          <span class="cta-text">Renseignements et réservations ici</span>
          <span class="cta-arrow">→</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .photography-page {
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
    .photography-page {
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
    .photography-page {
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
    .photography-page {
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

  /* Styles pour les cartes de balades cliquables */
  .balade-preview-card {
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .balade-preview-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  .balade-preview-card:focus {
    outline: 2px solid var(--color-accent-1);
    outline-offset: 2px;
  }

  .reservation-hint {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(45deg, var(--color-accent-1), var(--color-accent-2));
    color: white;
    text-align: center;
    padding: 0.5rem;
    font-size: 0.8rem;
    font-weight: 500;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .balade-preview-card:hover .reservation-hint {
    transform: translateY(0);
  }

  .loading-message,
  .no-balades-message {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
    font-style: italic;
  }

  .loading-message {
    color: var(--color-accent-1);
  }
</style> 