<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // Récupérer les paramètres de l'URL
  $: baladeId = $page.url.searchParams.get('baladeId') || $page.url.searchParams.get('id');
  $: baladeData = $page.url.searchParams.get('data');

  let balade: any = null;
  let isVisible = false;
  let isLoading = true;



  onMount(async () => {
    console.log('🔍 Chargement de la page de réservation');
    console.log('📋 baladeId:', baladeId);
    console.log('📋 baladeData:', baladeData);
    
    // Récupérer la balade sélectionnée
    if (baladeId) {
      try {
        // Charger les données depuis l'API
        const response = await fetch(`/api/balades`);
        const data = await response.json();
        
        console.log('📊 Données API reçues:', data);
        
        if (data.success) {
          const baladeIdInt = parseInt(baladeId);
          console.log('🔍 Recherche de la balade avec ID:', baladeIdInt);
          console.log('📋 Balades disponibles:', data.balades.map((b: any) => ({ id: b.id, theme: b.theme })));
          
          balade = data.balades.find((b: any) => b.id === baladeIdInt);
          
          if (!balade) {
            console.error('❌ Balade non trouvée avec ID:', baladeIdInt);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des balades:', error);
      }
    } else if (baladeData) {
      try {
        balade = JSON.parse(decodeURIComponent(baladeData));
      } catch (e) {
        console.error('Erreur lors du parsing des données de la balade:', e);
      }
    }



    isLoading = false;
    setTimeout(() => { isVisible = true; }, 100);
  });

  function allerAuPaiement() {
    if (balade && balade.id) {
      window.location.href = `/photographie/argentique/reservation/paiement?baladeId=${balade.id}`;
    }
  }

  function formatDate(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function retourArgentique() {
    // Rediriger vers la page argentique principale
    window.location.href = '/photographie/argentique';
  }

  // Fonction pour ouvrir la carte
  function openMap(balade: any) {
    // Créer un parcours Google Maps avec toutes les étapes
    const mapUrl = createGoogleMapsRoute(balade);
    if (mapUrl) {
      window.open(mapUrl, '_blank');
    } else {
      alert('Carte non disponible pour cette balade');
    }
  }

  // Fonction pour créer l'URL Google Maps avec le parcours complet
  function createGoogleMapsRoute(balade: any) {
    if (!balade.coordonnees || balade.coordonnees.length === 0) return null;

    // Créer l'URL Google Maps avec le parcours
    let url = 'https://www.google.com/maps/dir/';
    
    // Ajouter tous les points du parcours
    balade.coordonnees.forEach((coord: any, index: number) => {
      if (index > 0) url += '/';
      url += `${coord.lat},${coord.lng}`;
    });

    // Ajouter des paramètres pour optimiser l'affichage
    url += '/data=!3m1!4b1!4m2!4m1!3e2'; // Mode piéton, éviter autoroutes
    
    return url;
  }

  // Fonction pour obtenir les étapes du parcours
  function getParcoursSteps(balade: any) {
    return balade?.parcours || [];
  }

  // Fonction pour calculer la distance totale
  function getTotalDistance(balade: any) {
    const steps = getParcoursSteps(balade);
    if (steps.length === 0) return '0.0';
    
    // Si les étapes ont une propriété distance, l'utiliser
    if (steps[0].distance) {
      let total = 0;
      steps.forEach((step: any) => {
        if (step.distance && typeof step.distance === 'string') {
          const distance = parseFloat(step.distance.replace(' km', ''));
          if (!isNaN(distance)) {
            total += distance;
          }
        }
      });
      return total.toFixed(1);
    }
    
    // Sinon, calculer approximativement à partir des coordonnées GPS
    let total = 0;
    for (let i = 1; i < steps.length; i++) {
      const prevStep = steps[i - 1];
      const currentStep = steps[i];
      
      if (prevStep.latitude && prevStep.longitude && currentStep.latitude && currentStep.longitude) {
        // Calcul approximatif de la distance entre deux points GPS
        const distance = calculateDistance(
          prevStep.latitude, prevStep.longitude,
          currentStep.latitude, currentStep.longitude
        );
        total += distance;
      }
    }
    
    return total.toFixed(1);
  }

  // Fonction pour calculer la distance entre deux points GPS (formule de Haversine)
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Fonction pour compter les points photo
  function getPhotoPoints(balade: any) {
    const steps = getParcoursSteps(balade);
    return steps.length;
  }
</script>

<div class="reservation-page">
  <div class="header {isVisible ? 'fade-in' : ''}">
    <button class="btn-retour" on:click={retourArgentique}>
      ← Retour aux balades
    </button>
    <h1>Réservation - {balade?.theme || 'Balade Argentique'}</h1>
  </div>

  <div class="content">
    {#if isLoading}
      <div class="loading-container">
        <h2>Chargement de la balade...</h2>
        <p>Veuillez patienter pendant que nous récupérons les informations.</p>
      </div>
    {:else if balade}
      <!-- Section Détails de la Balade -->
      <section class="balade-details {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
        <div class="container">
          <div class="balade-card">
            <div class="balade-header">
              <div class="balade-date">
                <span class="date-day">{new Date(balade.date).getDate()}</span>
                <span class="date-month">{new Date(balade.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
              </div>
              <div class="balade-info">
                <h2>{balade.theme}</h2>
                <p class="balade-lieu">📍 {balade.lieu}</p>
                <p class="balade-heure">🕐 {balade.heure}</p>
                <p class="balade-prix">💰 {balade.prix}</p>
              </div>
              <div class="balade-status">
                <span class="places">{balade.placesDisponibles} place{balade.placesDisponibles > 1 ? 's' : ''} disponible{balade.placesDisponibles > 1 ? 's' : ''}</span>
              </div>
            </div>
            <p class="balade-description">{balade.description}</p>
          </div>
        </div>
      </section>

      <!-- Section Consignes et Matériel -->
      <section class="consignes-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
        <div class="container">
          <h2>📋 Consignes et Matériel</h2>
          <div class="consignes-grid">
            <div class="consignes-card">
              <h3>📸 Consignes de sécurité</h3>
              <div class="consignes-content">
                {#if balade?.consignes}
                  {#each balade.consignes as consigne}
                    <div class="consigne-item">
                      <span class="consigne-icon">⚠️</span>
                      <span class="consigne-text">{consigne}</span>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>
            <div class="materiel-card">
              <h3>🎒 Matériel fourni</h3>
              <div class="materiel-content">
                {#if balade?.materiel}
                  {#each balade.materiel as item}
                    <div class="materiel-item">
                      <span class="materiel-icon">📱</span>
                      <span class="materiel-text">{item}</span>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Plan et Parcours -->
      {#if balade?.parcours && balade.parcours.length > 0}
        <section class="plan-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.3s">
        <div class="container">
          <h2>🗺️ Plan et Parcours</h2>
          <div class="plan-content">
            <div class="map-container">
              <div class="parcours-map">
                <h3>🗺️ Parcours de la balade</h3>
                <div class="map-content">
                  <div class="map-route">
                    {#each getParcoursSteps(balade) as step, index}
                      <div class="route-step" style="animation-delay: {index * 0.1}s">
                        <div class="step-info">
                          <h4>Étape {index + 1} : {step.titre}</h4>
                          <p>{step.description}</p>
                          <div class="step-meta">
                            <span class="step-duration">⏱️ {step.duree}</span>
                            <span class="step-distance">📏 {step.distance}</span>
                          </div>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
                <button class="btn-map" on:click={() => openMap(balade)}>
                  🗺️ Ouvrir le parcours sur Google Maps
                </button>
              </div>
            </div>
            <div class="parcours-details">
              <h3>📊 Résumé du parcours</h3>
              <div class="parcours-summary">
                <div class="summary-item">
                  <span class="summary-icon">⏱️</span>
                  <span class="summary-label">Durée totale :</span>
                  <span class="summary-value">3h00</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">📏</span>
                  <span class="summary-label">Distance :</span>
                  <span class="summary-value">{getTotalDistance(balade)} km</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">📸</span>
                  <span class="summary-label">Points photo :</span>
                  <span class="summary-value">{getPhotoPoints(balade)}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">🚶‍♂️</span>
                  <span class="summary-label">Type :</span>
                  <span class="summary-value">Parcours pédestre</span>
                </div>
              </div>
              <div class="parcours-tips">
                <h4>💡 Conseils pour la balade</h4>
                <ul>
                  <li>Prévoir des chaussures confortables pour la marche</li>
                  <li>Apporter une bouteille d'eau et un en-cas léger</li>
                  <li>Respecter les consignes de sécurité à chaque étape</li>
                  <li>Prendre le temps de composer vos photos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/if}

      <!-- Section Réservation -->
      <section class="reservation-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.6s">
        <div class="container">
          <h2>Réserver votre place</h2>
          <p class="section-subtitle">Cliquez sur le bouton ci-dessous pour procéder à la réservation et au paiement</p>
          
          <div class="reservation-summary">
            <div class="summary-card">
              <h3>📋 Récapitulatif de votre réservation</h3>
              <div class="summary-details">
                <div class="summary-item">
                  <span class="summary-label">Balade :</span>
                  <span class="summary-value">{balade.theme}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Date :</span>
                  <span class="summary-value">{formatDate(balade.date)}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Heure :</span>
                  <span class="summary-value">{balade.heure}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Lieu :</span>
                  <span class="summary-value">{balade.lieu}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Prix :</span>
                  <span class="summary-value">{balade.prix}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Places disponibles :</span>
                  <span class="summary-value">{balade.placesDisponibles}</span>
                </div>
              </div>
            </div>
            
            <div class="reservation-actions">
              <button class="btn-reserver" on:click={allerAuPaiement}>
                🎯 Réserver et Payer
              </button>
              <p class="reservation-note">
                Vous serez redirigé vers une page sécurisée pour saisir vos informations et effectuer le paiement.
              </p>
            </div>
          </div>
        </div>
      </section>
    {:else}
      <div class="error-container">
        <h2>Balade non trouvée</h2>
        <p>La balade demandée n'existe pas ou n'est plus disponible.</p>
        <button class="btn-retour" on:click={retourArgentique}>
          Retour aux balades
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .reservation-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
  }

  .header {
    padding: 2rem 0;
    background: rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    opacity: 0;
    transform: translateY(30px);
  }

  .header .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .btn-retour {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-retour:hover {
    background: linear-gradient(45deg, #ffed4e, #ffd700);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  }

  .btn-retour:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  }

  .header h1 {
    font-size: 2rem;
    color: #ffd700;
    margin: 0;
  }

  .content {
    padding: 3rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
    box-sizing: border-box;
  }

  .balade-details {
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .balade-card {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
    width: 100%;
    box-sizing: border-box;
  }

  .balade-header {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .balade-date {
    background: #ffd700;
    color: #000;
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
    min-width: 80px;
  }

  .date-day {
    display: block;
    font-size: 2rem;
    font-weight: bold;
  }

  .date-month {
    display: block;
    font-size: 1rem;
    text-transform: uppercase;
  }

  .balade-info {
    flex: 1;
  }

  .balade-info h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: #ffd700;
  }

  .balade-lieu, .balade-heure, .balade-prix {
    font-size: 1rem;
    color: rgba(255,255,255,0.8);
    margin-bottom: 0.3rem;
  }

  .balade-status {
    text-align: right;
  }

  .places {
    display: block;
    font-size: 1rem;
    color: #00ff00;
    font-weight: bold;
  }

  .balade-description {
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    font-size: 1.1rem;
  }

  .consignes-section {
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .consignes-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }

  .consignes-card, .materiel-card {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
    width: 100%;
    box-sizing: border-box;
  }

  .consignes-card h3, .materiel-card h3 {
    color: #ffd700;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }

  .consignes-content, .materiel-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .consigne-item, .materiel-item {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 1rem;
    background: rgba(255,255,255,0.03);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .consigne-icon, .materiel-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .consigne-text, .materiel-text {
    color: rgba(255,255,255,0.9);
    line-height: 1.5;
    font-size: 0.95rem;
  }

  .plan-section {
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(40px);
  }

  .plan-content {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .map-container {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
    min-height: 500px;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .parcours-map h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #ffd700;
    text-align: center;
  }

  .map-content {
    margin-bottom: 2rem;
  }

  .map-route {
    position: relative;
    padding-left: 0;
    max-width: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  .route-step {
    position: relative;
    margin-bottom: 1.2rem;
    opacity: 0;
    animation: fadeInStep 0.5s ease-out forwards;
    max-width: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  .step-info {
    background: rgba(255,255,255,0.05);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    margin-left: 0;
    max-width: 100%;
    width: 100%;
    word-wrap: break-word;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .step-info h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #ffd700;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }

  .step-info p {
    color: rgba(255,255,255,0.9);
    line-height: 1.5;
    margin-bottom: 0.8rem;
    font-size: 0.85rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }

  .step-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.7);
    flex-wrap: wrap;
    max-width: 100%;
  }



  .map-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255,255,255,0.8);
    font-size: 0.9rem;
  }

  .legend-marker {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 2px solid #fff;
  }

  .legend-marker.start {
    background: linear-gradient(45deg, #00ff00, #00cc00);
  }

  .legend-marker.step {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
  }

  .legend-marker.end {
    background: linear-gradient(45deg, #ff6b6b, #ff4757);
  }

  @keyframes fadeInStep {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .btn-map {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    width: 100%;
    box-sizing: border-box;
  }

  .btn-map:hover {
    background: linear-gradient(45deg, #ffed4e, #ffd700);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  }

  .btn-map:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  }

  .parcours-details {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
    width: 100%;
    box-sizing: border-box;
  }

  .parcours-details h3 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #ffd700;
  }

  .parcours-summary {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 1.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    width: 100%;
    box-sizing: border-box;
  }

  .parcours-tips {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }

  .parcours-tips h4 {
    color: #ffd700;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .parcours-tips ul {
    list-style: none;
    padding: 0;
  }

  .parcours-tips li {
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    margin-bottom: 0.8rem;
    padding-left: 1.5rem;
    position: relative;
  }

  .parcours-tips li:before {
    content: "💡";
    position: absolute;
    left: 0;
    font-size: 0.9rem;
  }

  .summary-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .summary-icon {
    font-size: 1.2rem;
  }

  .summary-label {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.8);
  }

  .summary-value {
    font-size: 1.1rem;
    font-weight: bold;
    color: #ffd700;
  }

  .reservation-section {
    opacity: 0;
    transform: translateY(40px);
  }

  .reservation-section h2 {
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

  .reservation-summary {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .summary-card {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
    width: 100%;
    box-sizing: border-box;
  }

  .summary-card h3 {
    color: #ffd700;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    text-align: center;
  }

  .summary-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1rem;
    background: rgba(255,255,255,0.03);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .summary-label {
    color: rgba(255,255,255,0.8);
    font-weight: 500;
  }

  .summary-value {
    color: #ffd700;
    font-weight: 600;
  }

  .reservation-actions {
    text-align: center;
    padding: 2rem;
    background: rgba(255,255,255,0.03);
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .btn-reserver {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 1.2rem 3rem;
    font-size: 1.2rem;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    margin-bottom: 1.5rem;
  }

  .btn-reserver:hover {
    background: linear-gradient(45deg, #ffed4e, #ffd700);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  }

  .btn-reserver:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .reservation-note {
    color: rgba(255,255,255,0.7);
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
  }



  .error-container {
    text-align: center;
    padding: 3rem;
    width: 100%;
    box-sizing: border-box;
  }



  .error-container h2 {
    color: #ff6b6b;
    margin-bottom: 1rem;
  }

  .error-container p {
    color: rgba(255,255,255,0.8);
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
    .header .container {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .header h1 {
      font-size: 1.6rem;
      margin-bottom: 1rem;
      line-height: 1.3;
      padding: 0 1rem;
    }

    .btn-retour {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .container {
      padding: 0 1rem;
      width: 100%;
      max-width: 100%;
    }

    .balade-header {
      flex-direction: column;
      gap: 1.2rem;
      text-align: center;
      padding: 1.5rem 1rem;
    }

    .balade-date {
      order: -1;
      margin-bottom: 0.5rem;
    }

    .balade-info h2 {
      font-size: 1.3rem;
      margin-bottom: 0.8rem;
    }

    .balade-info p {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .balade-description {
      font-size: 0.95rem;
      line-height: 1.5;
      padding: 0 1rem 1.5rem 1rem;
    }

    .balade-status {
      text-align: center;
      margin-top: 1rem;
    }

    .consignes-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .consignes-card,
    .materiel-card {
      padding: 1.5rem;
      width: 100%;
      margin: 0;
    }

    .consigne-item,
    .materiel-item {
      padding: 0.8rem;
      gap: 0.6rem;
    }

    .consigne-text,
    .materiel-text {
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .form-grid {
      grid-template-columns: 1fr;
      gap: 1.2rem;
    }

    .form-group label {
      font-size: 0.95rem;
      margin-bottom: 0.5rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 0.9rem;
      font-size: 0.95rem;
      border-radius: 8px;
    }

    .btn-submit {
      padding: 1rem 2rem;
      font-size: 1rem;
      width: 100%;
      max-width: 100%;
      margin-top: 1rem;
    }

    .success-message,
    .error-container {
      padding: 1.5rem;
      margin: 0;
      border-radius: 12px;
      width: 100%;
    }

    .plan-content {
      flex-direction: column;
      gap: 1.5rem;
    }

    .map-container {
      width: 100%;
      min-height: 300px;
      padding: 1.5rem;
      max-width: 100%;
      margin: 0;
      overflow-x: hidden;
    }

    .parcours-details {
      width: 100%;
      padding: 1.5rem;
      margin: 0;
    }

    .parcours-summary {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1.2rem;
      width: 100%;
    }

    .summary-item {
      justify-content: space-between;
      padding: 0.8rem 0;
    }

    .route-step {
      margin-bottom: 1.2rem;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .map-route {
      padding-left: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .step-info {
      padding: 0.8rem;
      margin-left: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .step-info h4 {
      font-size: 1rem;
      max-width: 100%;
    }

    .step-info p {
      font-size: 0.85rem;
      line-height: 1.4;
      max-width: 100%;
    }

    .btn-map {
      padding: 0.8rem 1.5rem;
      font-size: 0.9rem;
      width: 100%;
    }

    .reservation-section h2 {
      font-size: 2rem;
      margin-bottom: 0.8rem;
    }

    .section-subtitle {
      font-size: 1rem;
      margin-bottom: 2rem;
      padding: 0 1rem;
    }

    .reservation-summary {
      gap: 1.5rem;
    }

    .summary-card {
      padding: 1.5rem;
    }

    .summary-card h3 {
      font-size: 1.3rem;
      margin-bottom: 1.2rem;
    }

    .summary-details {
      grid-template-columns: 1fr;
      gap: 0.8rem;
    }

    .summary-item {
      padding: 0.7rem 0.8rem;
    }

    .reservation-actions {
      padding: 1.5rem;
    }

    .btn-reserver {
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }

    .reservation-note {
      font-size: 0.9rem;
    }
  }

  /* Mobile petit */
  @media (max-width: 600px) {
    .header {
      padding: 1.5rem 0;
    }

    .header h1 {
      font-size: 1.4rem;
      padding: 0 0.8rem;
    }

    .content {
      padding: 2rem 0;
    }

    .container {
      padding: 0 0.8rem;
      width: 100%;
      max-width: 100%;
    }

    .balade-card {
      padding: 1.5rem;
      margin: 0;
      width: 100%;
    }

    .balade-header {
      padding: 1.2rem 0.8rem;
    }

    .balade-date {
      min-width: 70px;
      padding: 0.8rem;
    }

    .date-day {
      font-size: 1.6rem;
    }

    .date-month {
      font-size: 0.9rem;
    }

    .balade-info h2 {
      font-size: 1.2rem;
    }

    .balade-info p {
      font-size: 0.85rem;
    }

    .balade-description {
      font-size: 0.9rem;
      padding: 0 0.8rem 1.2rem 0.8rem;
    }

    .consignes-card,
    .materiel-card {
      padding: 1.2rem;
      margin: 0;
      width: 100%;
    }

    .consignes-card h3,
    .materiel-card h3 {
      font-size: 1.1rem;
      margin-bottom: 1.2rem;
    }

    .consigne-item,
    .materiel-item {
      padding: 0.7rem;
      gap: 0.5rem;
    }

    .consigne-text,
    .materiel-text {
      font-size: 0.85rem;
    }

    .map-container,
    .parcours-details {
      padding: 1.2rem;
      margin: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .parcours-map h3 {
      font-size: 1.3rem;
      margin-bottom: 1.2rem;
    }

    .parcours-details h3 {
      font-size: 1.5rem;
      margin-bottom: 1.2rem;
    }

    .route-step {
      margin-bottom: 1rem;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .map-route {
      padding-left: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .step-info {
      padding: 0.7rem;
      margin-left: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .step-info h4 {
      font-size: 0.95rem;
      max-width: 100%;
    }

    .step-info p {
      font-size: 0.8rem;
      line-height: 1.3;
      max-width: 100%;
    }

    .step-meta {
      gap: 0.8rem;
      font-size: 0.75rem;
      max-width: 100%;
    }

    .parcours-summary {
      padding: 1rem;
      gap: 0.8rem;
      width: 100%;
    }

    .summary-item {
      padding: 0.6rem 0;
    }

    .summary-icon {
      font-size: 1rem;
    }

    .summary-label {
      font-size: 0.8rem;
    }

    .summary-value {
      font-size: 1rem;
    }

    .parcours-tips {
      padding: 1rem;
      width: 100%;
    }

    .parcours-tips h4 {
      font-size: 1.1rem;
      margin-bottom: 0.8rem;
    }

    .parcours-tips li {
      font-size: 0.85rem;
      line-height: 1.5;
      margin-bottom: 0.6rem;
      padding-left: 1.2rem;
    }

    .reservation-section h2 {
      font-size: 1.8rem;
      padding: 0 0.8rem;
    }

    .section-subtitle {
      font-size: 0.95rem;
      padding: 0 0.8rem;
    }

    .reservation-summary {
      gap: 1.2rem;
    }

    .summary-card {
      padding: 1.2rem;
    }

    .summary-card h3 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .summary-details {
      gap: 0.6rem;
    }

    .summary-item {
      padding: 0.6rem 0.7rem;
    }

    .summary-label {
      font-size: 0.9rem;
    }

    .summary-value {
      font-size: 0.9rem;
    }

    .reservation-actions {
      padding: 1.2rem;
    }

    .btn-reserver {
      padding: 0.9rem 1.8rem;
      font-size: 1rem;
    }

    .reservation-note {
      font-size: 0.85rem;
    }
  }

  /* Mobile très petit */
  @media (max-width: 480px) {
    .container {
      padding: 0 0.6rem;
      width: 100%;
      max-width: 100%;
    }

    .header h1 {
      font-size: 1.3rem;
      padding: 0 0.5rem;
    }

    .balade-card {
      padding: 1.2rem;
      margin: 0;
      width: 100%;
    }

    .balade-header {
      padding: 1rem 0.6rem;
    }

    .balade-date {
      min-width: 60px;
      padding: 0.6rem;
    }

    .date-day {
      font-size: 1.4rem;
    }

    .date-month {
      font-size: 0.8rem;
    }

    .balade-info h2 {
      font-size: 1.1rem;
    }

    .balade-info p {
      font-size: 0.8rem;
    }

    .balade-description {
      font-size: 0.85rem;
      padding: 0 0.6rem 1rem 0.6rem;
    }

    .consignes-card,
    .materiel-card {
      padding: 1rem;
      margin: 0;
      width: 100%;
    }

    .consignes-card h3,
    .materiel-card h3 {
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .consigne-item,
    .materiel-item {
      padding: 0.6rem;
      gap: 0.4rem;
    }

    .consigne-text,
    .materiel-text {
      font-size: 0.8rem;
    }

    .map-container,
    .parcours-details {
      padding: 1rem;
      margin: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .parcours-map h3 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .parcours-details h3 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    .route-step {
      margin-bottom: 0.8rem;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .map-route {
      padding-left: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .step-info {
      padding: 0.6rem;
      margin-left: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .step-info h4 {
      font-size: 0.9rem;
      max-width: 100%;
    }

    .step-info p {
      font-size: 0.75rem;
      line-height: 1.3;
      max-width: 100%;
    }

    .step-meta {
      gap: 0.6rem;
      font-size: 0.7rem;
      max-width: 100%;
    }

    .parcours-summary {
      padding: 0.8rem;
      gap: 0.6rem;
      width: 100%;
    }

    .summary-item {
      padding: 0.5rem 0;
    }

    .summary-icon {
      font-size: 0.9rem;
    }

    .summary-label {
      font-size: 0.75rem;
    }

    .summary-value {
      font-size: 0.9rem;
    }

    .parcours-tips {
      padding: 0.8rem;
      width: 100%;
    }

    .parcours-tips h4 {
      font-size: 1rem;
      margin-bottom: 0.6rem;
    }

    .parcours-tips li {
      font-size: 0.8rem;
      line-height: 1.4;
      margin-bottom: 0.5rem;
      padding-left: 1rem;
    }

    .reservation-section h2 {
      font-size: 1.6rem;
      padding: 0 0.4rem;
    }

    .section-subtitle {
      font-size: 0.9rem;
      padding: 0 0.4rem;
    }

    .reservation-summary {
      gap: 1rem;
    }

    .summary-card {
      padding: 1rem;
    }

    .summary-card h3 {
      font-size: 1.1rem;
      margin-bottom: 0.8rem;
    }

    .summary-details {
      gap: 0.5rem;
    }

    .summary-item {
      padding: 0.5rem 0.6rem;
    }

    .summary-label {
      font-size: 0.85rem;
    }

    .summary-value {
      font-size: 0.85rem;
    }

    .reservation-actions {
      padding: 1rem;
    }

    .btn-reserver {
      padding: 0.8rem 1.5rem;
      font-size: 0.95rem;
    }

    .reservation-note {
      font-size: 0.8rem;
    }

    .btn-map {
      padding: 0.6rem 1rem;
      font-size: 0.8rem;
      width: 100%;
    }
  }

  /* Mobile ultra petit */
  @media (max-width: 360px) {
    .container {
      padding: 0 0.5rem;
      width: 100%;
      max-width: 100%;
    }

    .header h1 {
      font-size: 1.2rem;
      padding: 0 0.4rem;
    }

    .balade-card {
      padding: 1rem;
      margin: 0;
      width: 100%;
    }

    .balade-header {
      padding: 0.8rem 0.4rem;
    }

    .balade-date {
      min-width: 55px;
      padding: 0.5rem;
    }

    .date-day {
      font-size: 1.3rem;
    }

    .date-month {
      font-size: 0.75rem;
    }

    .balade-info h2 {
      font-size: 1rem;
    }

    .balade-info p {
      font-size: 0.75rem;
    }

    .balade-description {
      font-size: 0.8rem;
      padding: 0 0.4rem 0.8rem 0.4rem;
    }

    .consignes-card,
    .materiel-card {
      padding: 0.8rem;
      margin: 0;
      width: 100%;
    }

    .consignes-card h3,
    .materiel-card h3 {
      font-size: 0.95rem;
      margin-bottom: 0.8rem;
    }

    .consigne-item,
    .materiel-item {
      padding: 0.5rem;
      gap: 0.3rem;
    }

    .consigne-text,
    .materiel-text {
      font-size: 0.75rem;
    }

    .map-container,
    .parcours-details {
      padding: 0.8rem;
      margin: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .parcours-map h3 {
      font-size: 1.1rem;
      margin-bottom: 0.8rem;
    }

    .parcours-details h3 {
      font-size: 1.2rem;
      margin-bottom: 0.8rem;
    }

    .route-step {
      margin-bottom: 0.6rem;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .map-route {
      padding-left: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .step-info {
      padding: 0.5rem;
      margin-left: 0;
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
    }

    .step-info h4 {
      font-size: 0.85rem;
      max-width: 100%;
    }

    .step-info p {
      font-size: 0.7rem;
      line-height: 1.2;
      max-width: 100%;
    }

    .step-meta {
      gap: 0.5rem;
      font-size: 0.65rem;
      max-width: 100%;
    }

    .parcours-summary {
      padding: 0.6rem;
      gap: 0.5rem;
      width: 100%;
    }

    .summary-item {
      padding: 0.4rem 0;
    }

    .summary-icon {
      font-size: 0.8rem;
    }

    .summary-label {
      font-size: 0.7rem;
    }

    .summary-value {
      font-size: 0.8rem;
    }

    .parcours-tips {
      padding: 0.6rem;
      width: 100%;
    }

    .parcours-tips h4 {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .parcours-tips li {
      font-size: 0.75rem;
      line-height: 1.3;
      margin-bottom: 0.4rem;
      padding-left: 0.8rem;
    }

    .reservation-section h2 {
      font-size: 1.4rem;
      padding: 0 0.4rem;
    }

    .section-subtitle {
      font-size: 0.85rem;
      padding: 0 0.4rem;
    }

    .reservation-summary {
      gap: 0.8rem;
    }

    .summary-card {
      padding: 0.8rem;
    }

    .summary-card h3 {
      font-size: 1rem;
      margin-bottom: 0.6rem;
    }

    .summary-details {
      gap: 0.4rem;
    }

    .summary-item {
      padding: 0.4rem 0.5rem;
    }

    .summary-label {
      font-size: 0.8rem;
    }

    .summary-value {
      font-size: 0.8rem;
    }

    .reservation-actions {
      padding: 0.8rem;
    }

    .btn-reserver {
      padding: 0.7rem 1.3rem;
      font-size: 0.9rem;
    }

    .reservation-note {
      font-size: 0.75rem;
    }

    .btn-map {
      padding: 0.6rem 1rem;
      font-size: 0.8rem;
      width: 100%;
    }

    .balade-datetime-display {
      background: rgba(255, 215, 0, 0.1);
      border: 1px solid rgba(255, 215, 0, 0.3);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
    }

    .datetime-info {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffd700;
    }
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
</style>
