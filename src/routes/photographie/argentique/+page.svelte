<script lang="ts">
  import { onMount } from 'svelte';
  import type { Balade } from '$lib/server/baladesService';

  // Balades programmées depuis l'API
  let baladesProgrammees: Balade[] = [];

  let isVisible = false;

  // Fonction pour rediriger vers la page de réservation
  function reserverBalade(balade: any) {
    // Encoder les données de la balade pour l'URL
    const baladeData = encodeURIComponent(JSON.stringify(balade));
    // Rediriger vers la page de réservation avec les données
    window.open(`/photographie/argentique/reservation?id=${balade.id}&data=${baladeData}`, '_blank');
  }



  onMount(async () => {
    try {
      // Charger les balades depuis l'API
      const response = await fetch('/api/balades');
      const data = await response.json();
      
      if (data.success) {
        baladesProgrammees = data.balades;
      } else {
        console.error('Erreur lors du chargement des balades:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des balades:', error);
    }

    setTimeout(() => { isVisible = true; }, 100);
  });
</script>

<div class="argentique-page">
  <div class="hero-section {isVisible ? 'fade-in' : ''}">
    <h1>La ligne Argentique</h1>
    <p class="hero-subtitle">Découvrez Nantes à travers l'objectif d'un appareil photo argentique ancien</p>
  </div>

  <div class="content">
    <!-- Section Présentation -->
    <section class="presentation-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
      <div class="container">
        <h2>Une expérience photographique unique</h2>
        <p class="presentation-text">
          Je vous propose des balades photographiques guidées dans les rues de Nantes, 
          où vous apprendrez les techniques de la photographie argentique tout en capturant 
          l'essence unique de la ville. Chaque balade est une invitation à redécouvrir 
          Nantes sous un angle différent, à travers le prisme de l'argentique.
        </p>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📷</div>
            <h3>Appareils fournis</h3>
            <p>Appareils photo argentiques restaurés et pellicules incluses. Chaque participant dispose de son propre appareil pendant la balade.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Techniques enseignées</h3>
            <p>Composition, exposition, développement au caffénol. Apprenez les bases et les subtilités de la photographie argentique.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🏛️</div>
            <h3>Lieux insolites</h3>
            <p>Découverte des quartiers historiques et contemporains de Nantes, des endroits méconnus et des perspectives uniques.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Groupe limité</h3>
            <p>Maximum 5 participants par balade pour un accompagnement personnalisé et une expérience conviviale.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Balades Programmées -->
    <section class="balades-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.4s">
      <div class="container">
        <h2>Balades programmées</h2>
        <p class="section-subtitle">Découvrez les prochaines balades et réservez votre place</p>
        
        <div class="balades-grid">
          {#each baladesProgrammees as balade}
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
                  <span class="places {balade.placesDisponibles === 0 ? 'complete' : balade.placesDisponibles <= 2 ? 'limite' : 'disponible'}">
                    {balade.placesDisponibles === 0 ? 'Complet' : `${balade.placesDisponibles} place${balade.placesDisponibles > 1 ? 's' : ''} disponible${balade.placesDisponibles > 1 ? 's' : ''}`}
                  </span>
                  <span class="prix">{balade.prix}</span>
                </div>
              </div>
              <p class="balade-description">{balade.description}</p>
              <div class="balade-actions">
                <button 
                  class="btn-reserver" 
                  on:click={() => reserverBalade(balade)}
                  disabled={balade.placesDisponibles === 0}
                >
                  {balade.placesDisponibles === 0 ? 'Complet' : 'Réserver'}
                </button>
                <span class="inscription-info">
                  {balade.placesDisponibles === 0 ? 'Places épuisées' : 'Inscriptions ouvertes'}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>



    <!-- Section Informations Pratiques -->
    <section class="infos-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.8s">
      <div class="container">
        <h2>Informations pratiques</h2>
        <div class="infos-grid">
          <div class="info-card">
            <h3>📅 Durée</h3>
            <p>Chaque balade dure environ 3 heures, incluant les explications techniques et les pauses.</p>
          </div>
          <div class="info-card">
            <h3>💰 Tarif</h3>
            <p>45€ par personne, incluant l'appareil photo, les pellicules et l'accompagnement personnalisé.</p>
          </div>
          <div class="info-card">
            <h3>👥 Groupe</h3>
            <p>Maximum 5 participants par balade pour garantir un accompagnement de qualité.</p>
          </div>
          <div class="info-card">
            <h3>🌤️ Météo</h3>
            <p>Les balades sont maintenues même par temps nuageux. En cas de pluie, report possible.</p>
          </div>
          <div class="info-card">
            <h3>📸 Résultats</h3>
            <p>Les photos développées vous seront envoyées par email dans les 2 semaines suivant la balade.</p>
          </div>
          <div class="info-card">
            <h3>📍 Rendez-vous</h3>
            <p>Le point de rendez-vous exact vous sera communiqué par email après réservation.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  .argentique-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
  }

  .hero-section {
    height: 60vh;
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
    font-size: 4rem;
    font-weight: 300;
    margin-bottom: 1rem;
    letter-spacing: 0.2em;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-subtitle {
    font-size: 1.3rem;
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
    color: #ffd700;
  }

  .presentation-text {
    font-size: 1.2rem;
    line-height: 1.8;
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem auto;
    color: rgba(255,255,255,0.9);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    background: rgba(255,255,255,0.05);
    padding: 2rem;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
    text-align: center;
    transition: transform 0.3s ease, background 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    background: rgba(255,255,255,0.1);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-card h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #ffd700;
  }

  .feature-card p {
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
    color: #ffd700;
  }

  .section-subtitle {
    text-align: center;
    color: rgba(255,255,255,0.8);
    font-size: 1.1rem;
    margin-bottom: 3rem;
  }

  .balades-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .balade-card {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.1);
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
    background: #ffd700;
    color: #000;
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
    color: #ffd700;
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
    color: #00ff00;
    margin-bottom: 0.5rem;
  }

  .places.limite {
    color: #ffd700;
  }

  .places.complete {
    color: #ff6b6b;
  }

  .prix {
    display: block;
    font-size: 1.1rem;
    font-weight: bold;
    color: #ffd700;
  }

  .balade-description {
    color: rgba(255,255,255,0.8);
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .balade-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn-reserver {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .btn-reserver:hover {
    transform: translateY(-2px);
  }

  .btn-reserver:disabled {
    background: rgba(255, 215, 0, 0.3);
    color: rgba(0, 0, 0, 0.5);
    cursor: not-allowed;
    transform: none;
  }

  .inscription-info {
    font-size: 0.8rem;
    color: #00ff00;
  }

  .reservation-section {
    margin-bottom: 5rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .reservation-section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
    color: #ffd700;
  }

  .success-container {
    text-align: center;
    padding: 3rem;
  }

  .success-message {
    background: rgba(0,255,0,0.1);
    border: 1px solid rgba(0,255,0,0.3);
    border-radius: 15px;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .success-message h3 {
    color: #00ff00;
    margin-bottom: 1rem;
  }

  .success-message p {
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .reservation-form {
    background: rgba(255,255,255,0.05);
    padding: 2rem;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
    max-width: 800px;
    margin: 0 auto;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-group label {
    color: rgba(255,255,255,0.9);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 0.75rem;
    color: #fff;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255,255,255,0.15);
  }

  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: rgba(255,255,255,0.5);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-actions {
    text-align: center;
    margin-top: 2rem;
  }

  .btn-submit {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .error-message {
    background: rgba(255,0,0,0.1);
    border: 1px solid rgba(255,0,0,0.3);
    color: #ff6b6b;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 1rem;
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
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
      min-height: 60vh;
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

    .presentation-text {
      font-size: 1.1rem;
      line-height: 1.6;
      padding: 0 1rem;
    }

    .section-subtitle {
      font-size: 1rem;
      margin-bottom: 2rem;
      padding: 0 1rem;
    }

    .features-grid,
    .infos-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .feature-card {
      padding: 1.5rem;
    }

    .feature-icon {
      font-size: 2.5rem;
    }

    .feature-card h3 {
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

    .balade-info h2 {
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

    .btn-reserver {
      width: 100%;
      padding: 1rem 2rem;
      font-size: 1rem;
    }
  }

  /* Mobile très petit */
  @media (max-width: 480px) {
    .hero-section {
      padding: 2rem 0.8rem;
      min-height: 50vh;
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

    .presentation-text {
      font-size: 1rem;
      padding: 0 0.8rem;
    }

    .balade-card {
      margin: 0 0.5rem;
      padding: 1.2rem;
    }

    .feature-card {
      padding: 1.2rem;
      margin: 0 0.5rem;
    }
  }
</style> 