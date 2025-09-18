<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // Récupérer l'ID de la balade depuis l'URL
  $: baladeId = $page.params.id;

  // Variables pour la balade et les données de rétrospective
  let balade: any = null;
  let isLoading = true;
  let isVisible = false;

  // Données de rétrospective (à remplacer par de vraies données plus tard)
  let photos: Array<{
    id: number;
    url: string;
    description: string;
    participant: string;
    date: string;
  }> = [];

  let commentaires: Array<{
    id: number;
    participant: string;
    commentaire: string;
    note: number;
    date: string;
  }> = [];

  let statistiques = {
    participants: 0,
    photos: 0,
    noteMoyenne: 0
  };

  onMount(async () => {
    try {
      // Charger la balade depuis l'API
      const response = await fetch(`/api/balades?type=archivees`);
      const data = await response.json();
      
      if (data.success) {
        balade = data.balades.find((b: any) => b.id === parseInt(baladeId));
        
        if (balade) {
          // Charger les données de rétrospective (simulées pour l'instant)
          await chargerRetrospective();
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la balade:', error);
    } finally {
      isLoading = false;
      setTimeout(() => { isVisible = true; }, 100);
    }
  });

  async function chargerRetrospective() {
    // Simulation de données de rétrospective
    // À remplacer par de vraies données depuis la base de données
    photos = [
      {
        id: 1,
        url: '/photos/retrospective/1.jpg',
        description: 'Vue sur la cathédrale depuis la rue Kervégan',
        participant: 'Marie L.',
        date: '2024-06-15'
      },
      {
        id: 2,
        url: '/photos/retrospective/2.jpg',
        description: 'Détails architecturaux de l\'église Sainte-Croix',
        participant: 'Pierre D.',
        date: '2024-06-15'
      },
      {
        id: 3,
        url: '/photos/retrospective/3.jpg',
        description: 'Ruelle médiévale du quartier du Bouffay',
        participant: 'Sophie M.',
        date: '2024-06-15'
      }
    ];

    commentaires = [
      {
        id: 1,
        participant: 'Marie L.',
        commentaire: 'Une expérience incroyable ! J\'ai découvert des techniques photographiques que je ne connaissais pas. Les explications étaient claires et le parcours très intéressant.',
        note: 5,
        date: '2024-06-16'
      },
      {
        id: 2,
        participant: 'Pierre D.',
        commentaire: 'Balade très enrichissante, j\'ai appris énormément sur la photographie argentique. Le guide était passionné et pédagogue.',
        note: 5,
        date: '2024-06-16'
      },
      {
        id: 3,
        participant: 'Sophie M.',
        commentaire: 'Super moment ! Les lieux choisis sont magnifiques et l\'ambiance était conviviale. Je recommande vivement !',
        note: 4,
        date: '2024-06-16'
      }
    ];

    // Calculer les statistiques
    statistiques = {
      participants: commentaires.length,
      photos: photos.length,
      noteMoyenne: commentaires.reduce((acc, c) => acc + c.note, 0) / commentaires.length
    };
  }

  function formaterDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function formaterHeure(heure: string): string {
    return heure;
  }
</script>

<div class="retrospective-page">
  {#if isLoading}
    <div class="loading-container">
      <h2>Chargement de la rétrospective...</h2>
      <p>Veuillez patienter pendant que nous récupérons les informations.</p>
    </div>
  {:else if balade}
    <div class="hero-section {isVisible ? 'fade-in' : ''}">
      <div class="hero-content">
        <h1>📸 Rétrospective : {balade.theme}</h1>
        <p class="hero-subtitle">Revivez cette balade photographique à travers les yeux des participants</p>
        <div class="balade-meta">
          <span class="meta-item">📅 {formaterDate(balade.date)}</span>
          <span class="meta-item">🕐 {formaterHeure(balade.heure)}</span>
          <span class="meta-item">📍 {balade.lieu}</span>
        </div>
      </div>
    </div>

    <div class="content">
      <!-- Section Statistiques -->
      <section class="stats-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
        <div class="container">
          <h2>📊 Statistiques de la Balade</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{statistiques.participants}</div>
              <div class="stat-label">Participants</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{statistiques.photos}</div>
              <div class="stat-label">Photos Partagées</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{statistiques.noteMoyenne.toFixed(1)}</div>
              <div class="stat-label">Note Moyenne</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Photos -->
      <section class="photos-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.4s">
        <div class="container">
          <h2>📷 Photos des Participants</h2>
          <p class="section-subtitle">Découvrez les clichés réalisés pendant cette balade</p>
          
          <div class="photos-grid">
            {#each photos as photo}
              <div class="photo-card">
                <div class="photo-image">
                  <img src={photo.url} alt={photo.description} />
                </div>
                <div class="photo-info">
                  <p class="photo-description">{photo.description}</p>
                  <div class="photo-meta">
                    <span class="photo-author">👤 {photo.participant}</span>
                    <span class="photo-date">📅 {formaterDate(photo.date)}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <!-- Section Commentaires -->
      <section class="commentaires-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.6s">
        <div class="container">
          <h2>💬 Témoignages des Participants</h2>
          <p class="section-subtitle">Ce qu'ils ont pensé de cette balade</p>
          
          <div class="commentaires-grid">
            {#each commentaires as commentaire}
              <div class="commentaire-card">
                <div class="commentaire-header">
                  <div class="commentaire-author">
                    <span class="author-name">{commentaire.participant}</span>
                    <span class="commentaire-date">{formaterDate(commentaire.date)}</span>
                  </div>
                  <div class="commentaire-note">
                    {#each Array(5) as _, i}
                      <span class="star {i < commentaire.note ? 'filled' : ''}">⭐</span>
                    {/each}
                  </div>
                </div>
                <p class="commentaire-text">{commentaire.commentaire}</p>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <!-- Section Parcours -->
      <section class="parcours-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.8s">
        <div class="container">
          <h2>🗺️ Parcours Suivi</h2>
          <p class="section-subtitle">Le trajet et les étapes de cette balade</p>
          
          <div class="parcours-timeline">
            {#each balade.parcours as step, index}
              <div class="timeline-step">
                <div class="step-number">{index + 1}</div>
                <div class="step-content">
                  <h4>{step.titre}</h4>
                  <p>{step.description}</p>
                  <div class="step-meta">
                    <span>⏱️ {step.duree}</span>
                    <span>📏 {step.distance}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <!-- Section Retour -->
      <section class="retour-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 1s">
        <div class="container">
          <div class="retour-content">
            <h2>🔙 Retour à la Page Principale</h2>
            <p>Découvrez nos prochaines balades et réservez votre place</p>
            <a href="/photographie/argentique" class="btn-retour">
              Voir les Balades Programmées
            </a>
          </div>
        </div>
      </section>
    </div>
  {:else}
    <div class="error-container">
      <h2>Balade non trouvée</h2>
      <p>La balade demandée n'existe pas ou n'est pas accessible.</p>
      <a href="/photographie/argentique" class="btn-retour">
        Retour à la Page Principale
      </a>
    </div>
  {/if}
</div>

<style>
  .retrospective-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
  }

  .loading-container {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .loading-container h2 {
    color: #ffd700;
    margin-bottom: 1rem;
    font-size: 1.8rem;
  }

  .loading-container p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .hero-section {
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/photos/street/3.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    opacity: 0;
    transform: translateY(30px);
  }

  .hero-content h1 {
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 1rem;
    letter-spacing: 0.1em;
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
    margin-bottom: 2rem;
  }

  .balade-meta {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .meta-item {
    background: rgba(255, 215, 0, 0.2);
    color: #ffd700;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid rgba(255, 215, 0, 0.3);
    font-size: 0.9rem;
  }

  .content {
    padding: 4rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .stats-section,
  .photos-section,
  .commentaires-section,
  .parcours-section,
  .retour-section {
    margin-bottom: 5rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .stats-section h2,
  .photos-section h2,
  .commentaires-section h2,
  .parcours-section h2,
  .retour-section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
    color: #ffd700;
  }

  .section-subtitle {
    text-align: center;
    color: rgba(255,255,255,0.8);
    font-size: 1.1rem;
    margin-bottom: 3rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .stat-card {
    background: rgba(255,255,255,0.05);
    padding: 2rem;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
    text-align: center;
    transition: transform 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
  }

  .stat-number {
    font-size: 3rem;
    font-weight: bold;
    color: #ffd700;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: rgba(255,255,255,0.8);
    font-size: 1.1rem;
  }

  .photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .photo-card {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.3s ease;
  }

  .photo-card:hover {
    transform: translateY(-5px);
  }

  .photo-image img {
    width: 100%;
    height: 250px;
    object-fit: cover;
  }

  .photo-info {
    padding: 1.5rem;
  }

  .photo-description {
    color: rgba(255,255,255,0.9);
    line-height: 1.5;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .photo-meta {
    display: flex;
    justify-content: space-between;
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
  }

  .commentaires-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .commentaire-card {
    background: rgba(255,255,255,0.05);
    padding: 1.5rem;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .commentaire-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .commentaire-author {
    display: flex;
    flex-direction: column;
  }

  .author-name {
    color: #ffd700;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .commentaire-date {
    color: rgba(255,255,255,0.6);
    font-size: 0.8rem;
    margin-top: 0.2rem;
  }

  .commentaire-note {
    display: flex;
    gap: 0.2rem;
  }

  .star {
    color: rgba(255,255,255,0.3);
    font-size: 1.2rem;
  }

  .star.filled {
    color: #ffd700;
  }

  .commentaire-text {
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    font-size: 1rem;
  }

  .parcours-timeline {
    max-width: 800px;
    margin: 0 auto;
  }

  .timeline-step {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
  }

  .timeline-step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 25px;
    top: 50px;
    bottom: -2rem;
    width: 2px;
    background: rgba(255, 215, 0, 0.3);
  }

  .step-number {
    background: #ffd700;
    color: #000;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
  }

  .step-content h4 {
    color: #ffd700;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .step-content p {
    color: rgba(255,255,255,0.8);
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }

  .step-meta {
    display: flex;
    gap: 1rem;
    color: rgba(255,255,255,0.6);
    font-size: 0.9rem;
  }

  .retour-content {
    text-align: center;
    background: rgba(255,255,255,0.05);
    padding: 3rem;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .retour-content p {
    color: rgba(255,255,255,0.8);
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .btn-retour {
    display: inline-block;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }

  .btn-retour:hover {
    transform: translateY(-2px);
  }

  .error-container {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .error-container h2 {
    color: #ff6b6b;
    margin-bottom: 1rem;
    font-size: 1.8rem;
  }

  .error-container p {
    color: rgba(255,255,255,0.8);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
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
      padding: 2rem 1rem;
      min-height: 50vh;
    }

    .hero-content h1 {
      font-size: 2rem;
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1rem;
      line-height: 1.5;
      max-width: 100%;
      padding: 0 1rem;
    }

    .balade-meta {
      flex-direction: column;
      gap: 1rem;
    }

    .container {
      padding: 0 1rem;
    }

    .content {
      padding: 2rem 0;
    }

    .stats-section h2,
    .photos-section h2,
    .commentaires-section h2,
    .parcours-section h2,
    .retour-section h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      font-size: 1rem;
      margin-bottom: 2rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .photos-grid,
    .commentaires-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .timeline-step {
      flex-direction: column;
      text-align: center;
    }

    .timeline-step::after {
      display: none;
    }

    .step-number {
      margin: 0 auto 1rem auto;
    }
  }
</style>
