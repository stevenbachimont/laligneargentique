<script lang="ts">
  import { onMount } from 'svelte';

  // Balades programmées pour l'aperçu
  let baladesApercu = [
    {
      id: 1,
      date: '2024-02-15',
      heure: '14:00',
      lieu: 'Quartier du Bouffay',
      theme: 'Architecture médiévale',
      placesDisponibles: 3
    },
    {
      id: 2,
      date: '2024-02-22',
      heure: '10:00',
      lieu: 'Île de Nantes',
      theme: 'Street Art & Contemporain',
      placesDisponibles: 2
    }
  ];

  let isVisible = false;

  onMount(() => {
    setTimeout(() => { isVisible = true; }, 100);
  });
</script>

<div class="photography-page">
  <div class="content">
    <h1 class="page-title {isVisible ? 'fade-in-up' : ''}">Photographie</h1>
    
    <div class="two-blocks-container {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
      <!-- Bloc gauche : Portfolio Photo -->
      <div class="block portfolio-block">
        <div class="block-content">
          <h2>Portfolio Photo</h2>
          <p class="block-description">
            Découvrez mes séries photographiques : Street, Portraits, Paysages et Quotidien. 
            Chaque série raconte une histoire à travers l'objectif.
          </p>
          <div class="portfolio-preview">
            <div class="preview-images">
              <div class="preview-image">
                <img src="/photos/street/1.jpg" alt="Street" />
                <span class="image-label">Street</span>
              </div>
              <div class="preview-image">
                <img src="/photos/portraits/IMG_7790.jpg" alt="Portraits" />
                <span class="image-label">Portraits</span>
              </div>
              <div class="preview-image">
                <img src="/photos/paysages/1.jpg" alt="Paysages" />
                <span class="image-label">Paysages</span>
              </div>
            </div>
          </div>
          <a href="/photographie/portfolioPhoto" class="btn-primary">
            Voir le portfolio complet
          </a>
        </div>
      </div>

      <!-- Bloc droit : La ligne Argentique -->
      <div class="block argentique-block">
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
              {#each baladesApercu as balade}
                <div class="balade-preview-card">
                  <div class="balade-preview-date">
                    <span class="date-day">{new Date(balade.date).getDate()}</span>
                    <span class="date-month">{new Date(balade.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                  </div>
                  <div class="balade-preview-info">
                    <h4>{balade.theme}</h4>
                    <p>📍 {balade.lieu} • 🕐 {balade.heure}</p>
                    <span class="places-dispo">{balade.placesDisponibles} place{balade.placesDisponibles > 1 ? 's' : ''} disponible{balade.placesDisponibles > 1 ? 's' : ''}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <div class="argentique-actions">
            <a href="/photographie/argentique" class="btn-secondary">
              Voir toutes les balades
            </a>
            <span class="inscription-note">📝 Inscriptions ouvertes • 45€ par personne</span>
          </div>
        </div>
      </div>
    </div>
  </div>
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

  .two-blocks-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    padding: 0 2rem;
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

  .argentique-block {
    border-left: 4px solid #ff6b6b;
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

  .preview-images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .preview-image {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .preview-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .preview-image:hover img {
    transform: scale(1.1);
  }

  .image-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 0.5rem;
    font-size: 0.8rem;
    text-align: center;
  }

  /* Styles pour le bloc Argentique */
  .balades-preview {
    margin-bottom: 2rem;
  }

  .balades-preview h3 {
    color: #ffd700;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }

  .balades-preview-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .balade-preview-card {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.3s ease;
  }

  .balade-preview-card:hover {
    transform: translateY(-3px);
    background: rgba(255,255,255,0.1);
  }

  .balade-preview-date {
    background: #ffd700;
    color: #000;
    padding: 0.5rem;
    border-radius: 8px;
    text-align: center;
    min-width: 50px;
    flex-shrink: 0;
  }

  .date-day {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .date-month {
    display: block;
    font-size: 0.7rem;
    text-transform: uppercase;
  }

  .balade-preview-info {
    flex: 1;
    text-align: left;
  }

  .balade-preview-info h4 {
    color: #fff;
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }

  .balade-preview-info p {
    color: rgba(255,255,255,0.7);
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
  }

  .places-dispo {
    color: #00ff00;
    font-size: 0.8rem;
    font-weight: 500;
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
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    color: #fff;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }

  .btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }

  .argentique-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: auto;
  }

  .inscription-note {
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
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
    
    .preview-images {
      grid-template-columns: 1fr;
    }
    
    .balades-preview-grid {
      gap: 0.8rem;
    }
    
    .balade-preview-card {
      flex-direction: column;
      text-align: center;
    }
    
    .balade-preview-info {
      text-align: center;
    }
  }
</style> 