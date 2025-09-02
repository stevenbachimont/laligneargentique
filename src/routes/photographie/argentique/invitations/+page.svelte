<script lang="ts">
  import { onMount } from 'svelte';
  import type { Balade } from '$lib/server/baladesService';

  // Balades sur invitation depuis l'API
  let baladesInvitations: Balade[] = [];
  let baladesParAnnee: { [annee: string]: Balade[] } = {};

  let isVisible = false;

  // Fonction pour rediriger vers la page de réservation avec code d'invitation
  function reserverAvecCode(balade: any) {
    // Rediriger vers la page de réservation avec code d'invitation
    window.location.href = `/photographie/argentique/reservation/invitation?baladeId=${balade.id}`;
  }

  // Fonction pour rediriger vers la page de rétrospective
  function voirRetrospective(balade: any) {
    // Rediriger vers la page de rétrospective
    window.location.href = `/photographie/argentique/retrospective/${balade.id}`;
  }

  // Fonction pour classer les balades par années
  function trierEtSeparerBalades() {
    // Classer par années
    baladesParAnnee = {};
    
    // Balades futures par année
    baladesInvitations.forEach(balade => {
      const annee = new Date(balade.date).getFullYear().toString();
      if (!baladesParAnnee[annee]) {
        baladesParAnnee[annee] = [];
      }
      baladesParAnnee[annee].push(balade);
    });
  }

  function getAnneeLabel(annee: string): string {
    return annee;
  }

  onMount(async () => {
    try {
      // Charger les balades sur invitation depuis l'API
      const responseInvitations = await fetch('/api/balades?type=invitations');
      const dataInvitations = await responseInvitations.json();
      
      if (dataInvitations.success) {
        baladesInvitations = dataInvitations.balades;
      } else {
        console.error('Erreur lors du chargement des balades sur invitation:', dataInvitations.error);
      }

      // Classer les balades par années
      trierEtSeparerBalades();
    } catch (error) {
      console.error('Erreur lors du chargement des balades:', error);
    }

    setTimeout(() => { isVisible = true; }, 100);
  });
</script>

<div class="invitations-page">
  <div class="hero-section {isVisible ? 'fade-in' : ''}">
    <h1>🎁 Balades sur Invitation</h1>
    <p class="hero-subtitle">Balades gratuites accessibles uniquement avec un code d'invitation</p>
  </div>

  <div class="content">
    <!-- Section Présentation -->
    <section class="presentation-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
      <div class="container">
        <h2>Comment ça marche ?</h2>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-icon">📧</div>
            <h3>1. Recevez votre invitation</h3>
            <p>Vous recevez un email avec un code d'invitation unique pour une balade spécifique.</p>
          </div>
          <div class="step-card">
            <div class="step-icon">🔑</div>
            <h3>2. Utilisez votre code</h3>
            <p>Cliquez sur le lien dans l'email ou entrez votre code sur cette page pour réserver.</p>
          </div>
          <div class="step-card">
            <div class="step-icon">🎉</div>
            <h3>3. Profitez gratuitement</h3>
            <p>Participez à la balade photographique argentique sans frais !</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Balades sur Invitation -->
    <section class="balades-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.4s">
      <div class="container">
        <h2>Balades disponibles sur invitation</h2>
        <p class="section-subtitle">Ces balades sont gratuites et accessibles uniquement avec un code d'invitation</p>
        
        {#if baladesInvitations.length > 0}
          <div class="balades-annees">
            {#each Object.entries(baladesParAnnee).filter(([annee]) => parseInt(annee) >= new Date().getFullYear()).sort(([a], [b]) => parseInt(a) - parseInt(b)) as [annee, baladesAnnee]}
              <div class="annee-section">
                <h3 class="annee-title">{getAnneeLabel(annee)}</h3>
                <div class="balades-grid">
                  {#each baladesAnnee.filter(b => b.date >= new Date().toISOString().split('T')[0]) as balade}
                    <div class="balade-card">
                      <div class="balade-header">
                        <div class="balade-date">
                          <span class="date-day">{new Date(balade.date).getDate()}</span>
                          <span class="date-month">{new Date(balade.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                        </div>
                        <div class="balade-info">
                          <h3>{balade.theme}</h3>
                          <p class="balade-lieu">📍 {balade.lieu}</p>
                          <p class="balade-heure">🕐 {balade.heure}</p>
                        </div>
                        <div class="balade-status">
                          <span class="places {balade.placesDisponibles === 0 ? 'complete' : balade.placesDisponibles === 1 ? 'limite' : balade.placesDisponibles <= 3 ? 'orange' : 'disponible'}">
                            {balade.placesDisponibles === 0 ? 'Complet' : `${balade.placesDisponibles} place${balade.placesDisponibles > 1 ? 's' : ''} disponible${balade.placesDisponibles > 1 ? 's' : ''}`}
                          </span>
                          <span class="prix">Gratuit</span>
                        </div>
                      </div>
                      <p class="balade-description">{balade.description}</p>
                      <div class="balade-actions">
                        <button 
                          class="btn-invitation" 
                          on:click={() => reserverAvecCode(balade)}
                          disabled={balade.placesDisponibles === 0}
                          title="Réserver avec un code d'invitation"
                        >
                          {balade.placesDisponibles === 0 ? 'Complet' : '🎁 Réserver avec code'}
                        </button>
                        <span class="inscription-info">
                          {balade.placesDisponibles === 0 ? 'Places épuisées' : 'Code d\'invitation requis'}
                        </span>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="no-balades">
            <p>Aucune balade sur invitation programmée pour le moment.</p>
            <p>Revenez bientôt pour découvrir nos nouvelles balades gratuites !</p>
          </div>
        {/if}
      </div>
    </section>

    <!-- Section Informations -->
    <section class="infos-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.6s">
      <div class="container">
        <h2>Informations importantes</h2>
        <div class="infos-grid">
          <div class="info-card">
            <h3>🎫 Code d'invitation</h3>
            <p>Chaque code est unique et valable pour une balade spécifique. Il ne peut être utilisé qu'une seule fois.</p>
          </div>
          <div class="info-card">
            <h3>📅 Réservation</h3>
            <p>Vous devez réserver avec votre code d'invitation. Sans code, la réservation n'est pas possible.</p>
          </div>
          <div class="info-card">
            <h3>👥 Places limitées</h3>
            <p>Le nombre de places est limité pour chaque balade. Réservez rapidement après avoir reçu votre invitation.</p>
          </div>
          <div class="info-card">
            <h3>📧 Contact</h3>
            <p>Si vous avez des questions sur votre invitation, contactez-nous directement.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  .invitations-page {
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
    background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/photos/street/3.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    opacity: 0;
    transform: translateY(30px);
  }

  .hero-section h1 {
    font-size: 3.5rem;
    font-weight: 300;
    margin-bottom: 1rem;
    letter-spacing: 0.2em;
    background: linear-gradient(45deg, #9C27B0, #7B1FA2);
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

  .presentation-section {
    margin-bottom: 5rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .presentation-section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #9C27B0;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .step-card {
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    transition: transform 0.3s ease, background 0.3s ease;
    background: rgba(156, 39, 176, 0.05);
    border: 1px solid rgba(156, 39, 176, 0.2);
  }

  .step-card:hover {
    transform: translateY(-5px);
    background: rgba(156, 39, 176, 0.1);
  }

  .step-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .step-card h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #9C27B0;
  }

  .step-card p {
    color: rgba(255,255,255,0.8);
    line-height: 1.6;
  }

  .balades-section {
    margin-bottom: 5rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .balades-section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
    color: #9C27B0;
  }

  .section-subtitle {
    text-align: center;
    color: rgba(255,255,255,0.8);
    font-size: 1.1rem;
    margin-bottom: 3rem;
  }

  .balades-annees {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .annee-section {
    margin-bottom: 2rem;
  }

  .annee-section:last-child {
    margin-bottom: 0;
  }

  .annee-title {
    font-size: 1.8rem;
    color: #9C27B0;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
    font-weight: 600;
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05));
    border: 2px solid rgba(156, 39, 176, 0.2);
  }

  .balades-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .balade-card {
    background: rgba(156, 39, 176, 0.05);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(156, 39, 176, 0.2);
    border-left: 4px solid #9C27B0;
    transition: transform 0.3s ease;
  }

  .balade-card:hover {
    transform: translateY(-5px);
  }

  .balade-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .balade-date {
    background: #9C27B0;
    color: #fff;
    padding: 0.5rem;
    border-radius: 8px;
    text-align: center;
    min-width: 60px;
  }

  .date-day {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .date-month {
    display: block;
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  .balade-info {
    flex: 1;
  }

  .balade-info h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #9C27B0;
  }

  .balade-lieu, .balade-heure {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
    margin-bottom: 0.2rem;
  }

  .balade-status {
    text-align: right;
  }

  .places {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .places.disponible {
    color: #00ff00;
  }

  .places.orange {
    color: #ff8c00;
  }

  .places.limite {
    color: #ff6b6b;
  }

  .places.complete {
    color: #ff6b6b;
  }

  .prix {
    display: block;
    font-size: 1.1rem;
    font-weight: bold;
    color: #9C27B0;
  }

  .balade-description {
    color: rgba(255,255,255,0.8);
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .balade-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .btn-invitation {
    background: linear-gradient(45deg, #9C27B0, #7B1FA2);
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s ease;
    font-size: 1rem;
    width: 100%;
  }

  .btn-invitation:hover {
    transform: translateY(-2px);
  }

  .btn-invitation:disabled {
    background: rgba(156, 39, 176, 0.3);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    transform: none;
  }

  .inscription-info {
    font-size: 0.8rem;
    color: #9C27B0;
    text-align: center;
  }

  .no-balades {
    text-align: center;
    padding: 3rem;
    background: rgba(156, 39, 176, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(156, 39, 176, 0.2);
  }

  .no-balades p {
    color: rgba(255,255,255,0.7);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .no-balades p:last-child {
    margin-bottom: 0;
    font-size: 1rem;
    color: rgba(255,255,255,0.5);
  }

  .infos-section {
    opacity: 0;
    transform: translateY(40px);
  }

  .infos-section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: #9C27B0;
  }

  .infos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .info-card {
    background: rgba(156, 39, 176, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(156, 39, 176, 0.2);
    text-align: center;
  }

  .info-card h3 {
    color: #9C27B0;
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

    .presentation-section h2,
    .balades-section h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    .section-subtitle {
      font-size: 1rem;
      margin-bottom: 2rem;
      padding: 0 1rem;
    }

    .steps-grid,
    .infos-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .step-card {
      padding: 1.5rem;
    }

    .step-icon {
      font-size: 2.5rem;
    }

    .step-card h3 {
      font-size: 1.2rem;
    }

    .balades-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .balade-card {
      padding: 1.5rem;
    }

    .balade-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .balade-info h3 {
      font-size: 1.3rem;
    }

    .balade-description {
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .balade-status {
      text-align: center;
      margin-top: 1rem;
    }

    .btn-invitation {
      width: 100%;
      padding: 1rem 2rem;
      font-size: 1rem;
    }
  }

  /* Mobile très petit */
  @media (max-width: 480px) {
    .hero-section {
      padding: 2rem 0.8rem;
      min-height: 40vh;
    }

    .hero-section h1 {
      font-size: 1.8rem;
      padding: 0 0.5rem;
    }

    .hero-subtitle {
      font-size: 0.95rem;
      padding: 0 0.8rem;
    }

    .container {
      padding: 0 0.8rem;
    }

    .presentation-section h2,
    .balades-section h2 {
      font-size: 1.8rem;
      padding: 0 0.5rem;
    }

    .balade-card {
      margin: 0 0.5rem;
      padding: 1.2rem;
    }

    .step-card {
      padding: 1.2rem;
      margin: 0 0.5rem;
    }
  }
</style>
