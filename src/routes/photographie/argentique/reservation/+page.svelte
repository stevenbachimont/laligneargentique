<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // Récupérer les paramètres de l'URL
  $: baladeId = $page.url.searchParams.get('id');
  $: baladeData = $page.url.searchParams.get('data');

  // Variables pour le formulaire
  let argentiqueForm = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateSouhaitee: '',
    nombrePersonnes: 1,
    message: ''
  };
  let argentiqueSent = false;
  let argentiqueError = '';
  let placesDisponibles = 5;
  let balade: any = null;
  let isVisible = false;

  // Balades programmées (même données que la page principale)
  const baladesProgrammees = [
    {
      id: 1,
      date: '2024-02-15',
      heure: '14:00',
      lieu: 'Quartier du Bouffay',
      theme: 'Architecture médiévale',
      placesDisponibles: 3,
      prix: '45€',
      description: 'Découverte des façades historiques et des ruelles pittoresques',
      consignes: [
        'Apportez des vêtements confortables et adaptés à la météo',
        'Chaussures de marche recommandées',
        'Appareil photo fourni, mais vous pouvez apporter le vôtre si vous le souhaitez',
        'Prévoir une bouteille d\'eau'
      ],
      materiel: [
        'Appareil photo argentique 35mm',
        'Pellicule 400 ISO (incluses)',
        'Guide technique de prise de vue',
        'Support pour développement'
      ]
    },
    {
      id: 2,
      date: '2024-02-22',
      heure: '10:00',
      lieu: 'Île de Nantes',
      theme: 'Street Art & Contemporain',
      placesDisponibles: 2,
      prix: '45€',
      description: 'Capture des œuvres d\'art urbain et de l\'architecture moderne',
      consignes: [
        'Vêtements urbains et confortables',
        'Attention aux zones de passage et aux piétons',
        'Respect des œuvres d\'art et de l\'espace public',
        'Prévoir de la crème solaire si beau temps'
      ],
      materiel: [
        'Appareil photo argentique 35mm',
        'Pellicule 200 ISO pour la lumière du jour',
        'Filtres polarisants (optionnel)',
        'Guide des techniques de street photography'
      ]
    },
    {
      id: 3,
      date: '2024-03-01',
      heure: '16:00',
      lieu: 'Jardin des Plantes',
      theme: 'Nature en ville',
      placesDisponibles: 4,
      prix: '45€',
      description: 'Photographie botanique et paysages urbains verdoyants',
      consignes: [
        'Vêtements adaptés à la météo et au jardinage',
        'Chaussures fermées recommandées',
        'Respect de la flore et de la faune',
        'Pas de cueillette de plantes'
      ],
      materiel: [
        'Appareil photo argentique 35mm',
        'Pellicule 100 ISO pour la netteté',
        'Objectif macro pour les détails botaniques',
        'Trépied léger (fourni)'
      ]
    }
  ];

  onMount(() => {
    // Récupérer la balade sélectionnée
    if (baladeId) {
      balade = baladesProgrammees.find(b => b.id === parseInt(baladeId));
    } else if (baladeData) {
      try {
        balade = JSON.parse(decodeURIComponent(baladeData));
      } catch (e) {
        console.error('Erreur lors du parsing des données de la balade:', e);
      }
    }

    if (balade) {
      // Pré-remplir le formulaire avec les données de la balade
      argentiqueForm.dateSouhaitee = balade.date;
      placesDisponibles = balade.placesDisponibles;
      argentiqueForm.nombrePersonnes = Math.min(balade.placesDisponibles, 5);
      argentiqueForm.message = `Je souhaite réserver pour la balade "${balade.theme}" le ${formatDate(balade.date)} à ${balade.heure} au ${balade.lieu}. ${balade.description}`;
    }

    setTimeout(() => { isVisible = true; }, 100);
  });

  async function handleArgentiqueSubmit(e: Event) {
    e.preventDefault();
    try {
      const response = await fetch('/api/argentique', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(argentiqueForm)
      });

      const data = await response.json();

      if (response.ok) {
        argentiqueSent = true;
        argentiqueError = '';
        argentiqueForm = {
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          dateSouhaitee: '',
          nombrePersonnes: 1,
          message: ''
        };
        placesDisponibles = 5;
      } else {
        argentiqueError = data.error || 'Erreur lors de l\'envoi de la demande.';
        argentiqueSent = false;
      }
    } catch (err) {
      argentiqueError = 'Erreur lors de l\'envoi de la demande.';
      argentiqueSent = false;
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
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
    const steps = getParcoursSteps(balade);
    if (steps.length === 0) return null;

    // Coordonnées des points d'intérêt pour chaque balade
    const coordinates: Record<number, Array<{lat: number, lng: number, name: string}>> = {
      1: [ // Architecture médiévale
        { lat: 47.2138, lng: -1.5564, name: 'Place du Bouffay' },
        { lat: 47.2142, lng: -1.5568, name: 'Rue Kervégan' },
        { lat: 47.2148, lng: -1.5572, name: 'Place Saint-Pierre' },
        { lat: 47.2152, lng: -1.5578, name: 'Rue de la Fosse' },
        { lat: 47.2156, lng: -1.5582, name: 'Quai de la Fosse' },
        { lat: 47.2150, lng: -1.5576, name: 'Rue des Trois-Croissants' },
        { lat: 47.2144, lng: -1.5570, name: 'Place Royale' },
        { lat: 47.2138, lng: -1.5566, name: 'Cours Cambronne' },
        { lat: 47.2138, lng: -1.5564, name: 'Place du Bouffay' }
      ],
      2: [ // Street Art & Contemporain
        { lat: 47.2038, lng: -1.5644, name: 'Hangar à Bananes' },
        { lat: 47.2042, lng: -1.5648, name: 'Quai des Antilles' },
        { lat: 47.2048, lng: -1.5652, name: 'Parc des Chantiers' },
        { lat: 47.2052, lng: -1.5658, name: 'Les Nefs' },
        { lat: 47.2056, lng: -1.5662, name: 'Machine de l\'Île' },
        { lat: 47.2050, lng: -1.5656, name: 'Rue des Chantiers' },
        { lat: 47.2044, lng: -1.5650, name: 'Place de la Petite Hollande' },
        { lat: 47.2038, lng: -1.5644, name: 'Hangar à Bananes' }
      ],
      3: [ // Nature en ville
        { lat: 47.2188, lng: -1.5484, name: 'Entrée Jardin des Plantes' },
        { lat: 47.2192, lng: -1.5488, name: 'Allée principale' },
        { lat: 47.2198, lng: -1.5492, name: 'Serres tropicales' },
        { lat: 47.2202, lng: -1.5498, name: 'Jardin japonais' },
        { lat: 47.2206, lng: -1.5502, name: 'Rocaille alpine' },
        { lat: 47.2200, lng: -1.5496, name: 'Grandes allées' },
        { lat: 47.2194, lng: -1.5490, name: 'Bassin central' },
        { lat: 47.2188, lng: -1.5486, name: 'Jardin de l\'École' },
        { lat: 47.2188, lng: -1.5484, name: 'Entrée Jardin des Plantes' }
      ]
    };

    const baladeCoords = coordinates[balade.id as keyof typeof coordinates];
    if (!baladeCoords) return null;

    // Créer l'URL Google Maps avec le parcours
    let url = 'https://www.google.com/maps/dir/';
    
    // Ajouter tous les points du parcours
    baladeCoords.forEach((coord, index) => {
      if (index > 0) url += '/';
      url += `${coord.lat},${coord.lng}`;
    });

    // Ajouter des paramètres pour optimiser l'affichage
    url += '/data=!3m1!4b1!4m2!4m1!3e2'; // Mode piéton, éviter autoroutes
    
    return url;
  }

  // Fonction pour obtenir les étapes du parcours
  function getParcoursSteps(balade: any) {
    const parcours = {
      1: [ // Architecture médiévale
        {
          titre: 'Départ - Place du Bouffay',
          description: 'Rendez-vous devant la fontaine, présentation de l\'appareil photo et consignes de sécurité. Premières photos de l\'architecture médiévale.',
          duree: '30 min',
          distance: '0 km'
        },
        {
          titre: 'Rue Kervégan',
          description: 'Remonter la rue en direction de la cathédrale. Photographier les façades à colombages, les enseignes historiques et les détails architecturaux.',
          duree: '45 min',
          distance: '0.2 km'
        },
        {
          titre: 'Place Saint-Pierre',
          description: 'Arrêt devant la cathédrale Saint-Pierre-et-Saint-Paul. Photos de l\'architecture gothique, des sculptures et de la perspective de la rue.',
          duree: '40 min',
          distance: '0.1 km'
        },
        {
          titre: 'Rue de la Fosse',
          description: 'Descendre vers la Loire en passant par cette rue historique. Capture des hôtels particuliers du XVIIIe siècle et des cours intérieures.',
          duree: '35 min',
          distance: '0.3 km'
        },
        {
          titre: 'Quai de la Fosse',
          description: 'Arrivée sur les quais de la Loire. Photos du fleuve, des bateaux traditionnels et de l\'architecture portuaire historique.',
          duree: '30 min',
          distance: '0.2 km'
        },
        {
          titre: 'Rue des Trois-Croissants',
          description: 'Remonter par cette rue pittoresque. Photographier les passages couverts, les escaliers et les détails de ferronnerie.',
          duree: '25 min',
          distance: '0.2 km'
        },
        {
          titre: 'Place Royale',
          description: 'Arrêt sur cette place emblématique. Photos de la statue de Louis XVI, de l\'architecture classique et de la perspective des rues.',
          duree: '30 min',
          distance: '0.1 km'
        },
        {
          titre: 'Cours Cambronne',
          description: 'Dernière étape dans ce jardin public. Capture des hôtels particuliers, des grilles en fer forgé et de l\'ambiance bourgeoise.',
          duree: '25 min',
          distance: '0.2 km'
        },
        {
          titre: 'Retour - Place du Bouffay',
          description: 'Retour au point de départ par la rue de la Juiverie. Dernières photos et conclusion de la balade.',
          duree: '20 min',
          distance: '0.3 km'
        }
      ],
      2: [ // Street Art & Contemporain
        {
          titre: 'Départ - Hangar à Bananes',
          description: 'Rendez-vous devant le Hangar à Bananes. Présentation du matériel et explication des techniques de street photography.',
          duree: '30 min',
          distance: '0 km'
        },
        {
          titre: 'Quai des Antilles',
          description: 'Début du parcours le long des quais. Photos des œuvres d\'art urbain, des graffitis et de l\'architecture contemporaine.',
          duree: '40 min',
          distance: '0.3 km'
        },
        {
          titre: 'Parc des Chantiers',
          description: 'Entrée dans le parc industriel. Photographier les grues, les vestiges des chantiers navals et les installations métalliques.',
          duree: '50 min',
          distance: '0.4 km'
        },
        {
          titre: 'Les Nefs',
          description: 'Passage devant les anciennes halles de construction navale. Capture de l\'architecture industrielle et des structures métalliques.',
          duree: '35 min',
          distance: '0.2 km'
        },
        {
          titre: 'Machine de l\'Île',
          description: 'Arrêt devant la Machine de l\'Île. Photos de l\'éléphant mécanique, des créatures fantastiques et de l\'ambiance steampunk.',
          duree: '45 min',
          distance: '0.3 km'
        },
        {
          titre: 'Rue des Chantiers',
          description: 'Remonter par cette rue bordée d\'ateliers. Photographier les façades industrielles et les détails architecturaux.',
          duree: '30 min',
          distance: '0.2 km'
        },
        {
          titre: 'Place de la Petite Hollande',
          description: 'Arrêt sur cette place moderne. Capture de l\'architecture contemporaine et des installations artistiques.',
          duree: '25 min',
          distance: '0.1 km'
        },
        {
          titre: 'Retour - Hangar à Bananes',
          description: 'Retour au point de départ. Dernières photos et conclusion de la balade street art.',
          duree: '15 min',
          distance: '0.1 km'
        }
      ],
      3: [ // Nature en ville
        {
          titre: 'Départ - Entrée principale',
          description: 'Rendez-vous à l\'entrée du Jardin des Plantes. Présentation du matériel et explication des techniques de photo botanique.',
          duree: '30 min',
          distance: '0 km'
        },
        {
          titre: 'Allée principale',
          description: 'Début de la promenade dans l\'allée centrale. Photos des arbres centenaires et de la perspective du jardin.',
          duree: '25 min',
          distance: '0.1 km'
        },
        {
          titre: 'Serres tropicales',
          description: 'Entrée dans les serres chaudes. Photographie des plantes exotiques, des fleurs tropicales et de l\'ambiance humide.',
          duree: '45 min',
          distance: '0.1 km'
        },
        {
          titre: 'Jardin japonais',
          description: 'Passage par le jardin zen. Capture des bonsaïs, des pierres, des lanternes et de l\'ambiance contemplative.',
          duree: '40 min',
          distance: '0.2 km'
        },
        {
          titre: 'Rocaille alpine',
          description: 'Montée vers la rocaille. Photos des plantes de montagne, des rochers et de la vue sur le jardin.',
          duree: '35 min',
          distance: '0.2 km'
        },
        {
          titre: 'Grandes allées',
          description: 'Promenade dans les allées ombragées. Capture des arbres majestueux, des perspectives et de la lumière filtrée.',
          duree: '50 min',
          distance: '0.3 km'
        },
        {
          titre: 'Bassin central',
          description: 'Arrêt au bassin principal. Photos des nénuphars, des reflets dans l\'eau et de la faune aquatique.',
          duree: '30 min',
          distance: '0.1 km'
        },
        {
          titre: 'Jardin de l\'École',
          description: 'Passage par le jardin botanique. Capture des plantes médicinales et des étiquettes scientifiques.',
          duree: '25 min',
          distance: '0.1 km'
        },
        {
          titre: 'Retour - Entrée principale',
          description: 'Retour à l\'entrée. Dernières photos et conclusion de la balade nature.',
          duree: '20 min',
          distance: '0.1 km'
        }
      ]
    };
    return parcours[balade.id as keyof typeof parcours] || [];
  }

  // Fonction pour calculer la distance totale
  function getTotalDistance(balade: any) {
    const steps = getParcoursSteps(balade);
    let total = 0;
    steps.forEach(step => {
      const distance = parseFloat(step.distance.replace(' km', ''));
      if (!isNaN(distance)) {
        total += distance;
      }
    });
    return total.toFixed(1);
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
    {#if balade}
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

      <!-- Section Formulaire de Réservation -->
      <section class="reservation-section {isVisible ? 'fade-in-up' : ''}" style="animation-delay: 0.6s">
        <div class="container">
          <h2>Réserver votre place</h2>
          <p class="section-subtitle">Remplissez le formulaire ci-dessous pour confirmer votre réservation</p>
          
          {#if argentiqueSent}
            <div class="success-container">
              <div class="success-message">
                <h3>✅ Réservation envoyée avec succès !</h3>
                <p>Je vous recontacterai dans les plus brefs délais pour confirmer votre réservation et vous donner tous les détails pratiques.</p>
                <p><strong>Merci de votre intérêt pour La ligne Argentique !</strong></p>
                <button class="btn-retour" on:click={retourArgentique}>
                  Retour aux balades
                </button>
              </div>
            </div>
          {:else}
            <form on:submit={handleArgentiqueSubmit} class="reservation-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="prenom">Prénom *</label>
                  <input 
                    type="text" 
                    id="prenom" 
                    bind:value={argentiqueForm.prenom} 
                    required 
                    placeholder="Votre prénom"
                  />
                </div>
                <div class="form-group">
                  <label for="nom">Nom *</label>
                  <input 
                    type="text" 
                    id="nom" 
                    bind:value={argentiqueForm.nom} 
                    required 
                    placeholder="Votre nom"
                  />
                </div>
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    bind:value={argentiqueForm.email} 
                    required 
                    placeholder="votre.email@exemple.com"
                  />
                </div>
                <div class="form-group">
                  <label for="telephone">Téléphone</label>
                  <input 
                    type="tel" 
                    id="telephone" 
                    bind:value={argentiqueForm.telephone} 
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div class="form-group">
                  <label for="dateSouhaitee">Date souhaitée *</label>
                  <input 
                    type="date" 
                    id="dateSouhaitee" 
                    bind:value={argentiqueForm.dateSouhaitee} 
                    required 
                  />
                </div>
                <div class="form-group">
                  <label for="nombrePersonnes">Nombre de personnes *</label>
                  <select id="nombrePersonnes" bind:value={argentiqueForm.nombrePersonnes} required>
                    {#each Array.from({length: placesDisponibles}, (_, i) => i + 1) as nombre}
                      <option value={nombre}>{nombre} personne{nombre > 1 ? 's' : ''}</option>
                    {/each}
                  </select>
                </div>
              </div>
              
              <div class="form-group full-width">
                <label for="message">Message (préférences, questions...)</label>
                <textarea 
                  id="message" 
                  bind:value={argentiqueForm.message} 
                  rows="4"
                  placeholder="Décrivez vos attentes, vos préférences de lieux, ou posez vos questions..."
                ></textarea>
              </div>
              
              {#if argentiqueError}
                <div class="error-message">
                  {argentiqueError}
                </div>
              {/if}
              
              <div class="form-actions">
                <button type="submit" class="btn-submit">
                  Confirmer ma réservation
                </button>
              </div>
            </form>
          {/if}
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
    width: 100%;
    box-sizing: border-box;
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
    width: 100%;
    box-sizing: border-box;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
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
    width: 100%;
    box-sizing: border-box;
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
    width: 100%;
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
    width: 100%;
    max-width: 300px;
    box-sizing: border-box;
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
    width: 100%;
    box-sizing: border-box;
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

  .success-message .btn-retour {
    margin-top: 1.5rem;
    background: linear-gradient(45deg, #00ff00, #00cc00);
    color: #000;
    font-weight: 600;
  }

  .success-message .btn-retour:hover {
    background: linear-gradient(45deg, #00cc00, #00ff00);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 255, 0, 0.4);
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

    .reservation-form {
      padding: 1.5rem;
      margin: 0;
      width: 100%;
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

    .reservation-form {
      padding: 1.2rem;
      margin: 0;
      width: 100%;
    }

    .form-group label {
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 0.8rem;
      font-size: 0.9rem;
    }

    .btn-submit {
      padding: 0.9rem 1.8rem;
      font-size: 0.95rem;
      width: 100%;
      max-width: 100%;
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

    .reservation-form {
      padding: 1rem;
      margin: 0;
      width: 100%;
    }

    .form-group label {
      font-size: 0.85rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 0.7rem;
      font-size: 0.85rem;
    }

    .btn-submit {
      padding: 0.8rem 1.5rem;
      font-size: 0.9rem;
      width: 100%;
      max-width: 100%;
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

    .reservation-form {
      padding: 0.8rem;
      margin: 0;
      width: 100%;
    }

    .form-group label {
      font-size: 0.8rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 0.6rem;
      font-size: 0.8rem;
    }

    .btn-submit {
      padding: 0.7rem 1.3rem;
      font-size: 0.85rem;
      width: 100%;
      max-width: 100%;
    }

    .btn-map {
      padding: 0.6rem 1rem;
      font-size: 0.8rem;
      width: 100%;
    }
  }
</style>
