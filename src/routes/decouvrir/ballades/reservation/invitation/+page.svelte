<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  // Récupérer les paramètres de l'URL
  $: baladeId = $page.url.searchParams.get('baladeId') || $page.url.searchParams.get('id');
  $: codeFromUrl = $page.url.searchParams.get('code');

  // Variables pour le formulaire
  let invitationForm = {
    code: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    message: ''
  };

  let balade: any = null;
  let invitation: any = null;
  let isLoading = true;
  let isValidatingCode = false;
  let isSubmitting = false;
  let errorMessage = '';
  let successMessage = '';
  
  // Validation côté client
  let errors: Record<string, string> = {};

  onMount(async () => {
    if (baladeId) {
      await loadBalade();
    }
    
    // Pré-remplir le code depuis l'URL si présent
    if (codeFromUrl) {
      invitationForm.code = codeFromUrl;
      // Valider automatiquement le code
      await validateCode();
    }
  });

  async function loadBalade() {
    try {
      const response = await fetch(`/api/balades/${baladeId}`);
      if (response.ok) {
        const data = await response.json();
        balade = data.balade;
      } else {
        errorMessage = 'Balade non trouvée';
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la balade:', error);
      errorMessage = 'Erreur lors du chargement de la balade';
    } finally {
      isLoading = false;
    }
  }

  async function validateCode() {
    if (!invitationForm.code.trim()) {
      errorMessage = 'Veuillez saisir un code d\'invitation';
      return;
    }

    if (!invitationForm.email.trim()) {
      errorMessage = 'Veuillez saisir votre adresse email pour valider le code';
      return;
    }

    isValidatingCode = true;
    errorMessage = '';

    try {
      const response = await fetch('/api/invitations/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: invitationForm.code.trim(),
          email: invitationForm.email.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        invitation = data.invitation;
        balade = data.balade;
        
        // Vérifier que l'email saisi correspond à celui de l'invitation
        if (invitation.email.toLowerCase() !== invitationForm.email.toLowerCase()) {
          errorMessage = 'Ce code d\'invitation n\'est pas valide pour cette adresse email. Vérifiez votre email.';
          invitation = null;
          return;
        }
        
        // Code validé avec succès, afficher le formulaire des informations personnelles
      } else {
        // Gérer les cas d'erreur spécifiques
        if (data.error && data.error.includes('déjà une réservation')) {
          errorMessage = '❌ Vous avez déjà une réservation pour cette balade avec cette adresse email.';
        } else {
          errorMessage = data.error || 'Code d\'invitation invalide';
        }
        invitation = null;
      }
    } catch (error) {
      console.error('Erreur lors de la validation du code:', error);
      errorMessage = 'Erreur lors de la validation du code';
      invitation = null;
    } finally {
      isValidatingCode = false;
    }
  }

  function validateField(field: string, value: string): boolean {
    errors[field] = '';
    
    switch (field) {
      case 'prenom':
        if (value.length < 2) {
          errors[field] = 'Le prénom doit contenir au moins 2 caractères';
          return false;
        }
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          errors[field] = 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes';
          return false;
        }
        break;
        
      case 'nom':
        if (value.length < 2) {
          errors[field] = 'Le nom doit contenir au moins 2 caractères';
          return false;
        }
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          errors[field] = 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes';
          return false;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = 'Veuillez entrer une adresse email valide';
          return false;
        }
        break;
        
      case 'telephone':
        if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          errors[field] = 'Le numéro de téléphone ne peut contenir que des chiffres, espaces, tirets, plus et parenthèses';
          return false;
        }
        break;
        
      case 'message':
        if (value && value.length < 10) {
          errors[field] = 'Le message doit contenir au moins 10 caractères';
          return false;
        }
        if (value && value.length > 1000) {
          errors[field] = 'Le message ne peut pas dépasser 1000 caractères';
          return false;
        }
        break;
    }
    
    return true;
  }

  function validateForm(): boolean {
    const fields = ['prenom', 'nom', 'email'];
    let isValid = true;
    
    fields.forEach(field => {
      if (!validateField(field, invitationForm[field as keyof typeof invitationForm])) {
        isValid = false;
      }
    });
    
    if (!invitation) {
      errorMessage = 'Veuillez d\'abord valider votre code d\'invitation';
      isValid = false;
    }
    
    return isValid;
  }

  async function submitReservation() {
    if (!validateForm()) {
      return;
    }

    isSubmitting = true;
    errorMessage = '';

    try {
      const response = await fetch('/api/reservations/invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationCode: invitation.code,
          nom: invitationForm.nom,
          prenom: invitationForm.prenom,
          email: invitationForm.email,
          telephone: invitationForm.telephone,
          message: invitationForm.message
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        successMessage = 'Réservation confirmée ! Vous recevrez un email de confirmation.';
        
        // Afficher la confirmation directement sur la page
        // Pas de redirection pour éviter les problèmes
      } else {
        // Gérer les cas d'erreur spécifiques
        if (data.error && data.error.includes('déjà une réservation')) {
          errorMessage = '❌ Vous avez déjà une réservation pour cette balade avec cette adresse email.';
        } else {
          errorMessage = data.error || 'Erreur lors de la réservation';
        }
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      errorMessage = 'Erreur lors de la réservation';
    } finally {
      isSubmitting = false;
    }
  }

  function goBack() {
    goto('/photographie/argentique');
  }
</script>

<svelte:head>
  <title>Réservation avec code d'invitation - {balade?.theme || 'Balade'}</title>
</svelte:head>

<div class="reservation-container">
  {#if isLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement de la balade...</p>
    </div>
  {:else if errorMessage && !balade}
    <div class="error-container">
      <h2>Erreur</h2>
      <p>{errorMessage}</p>
      <button on:click={goBack} class="btn-secondary">Retour aux balades</button>
    </div>
  {:else if balade}
    <div class="reservation-content">
      <!-- En-tête de la balade -->
      <div class="balade-header">
        <button on:click={goBack} class="back-button">← Retour</button>
        <h1>🎁 Réservation avec code d'invitation</h1>
        <div class="balade-details">
          <div class="balade-info-grid">
            <div class="info-item">
              <span class="info-icon">📅</span>
              <div class="info-content">
                <strong>Date</strong>
                <span>{new Date(balade.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            
            <div class="info-item">
              <span class="info-icon">🕐</span>
              <div class="info-content">
                <strong>Heure</strong>
                <span>{balade.heure}</span>
              </div>
            </div>
            
            <div class="info-item">
              <span class="info-icon">📍</span>
              <div class="info-content">
                <strong>Lieu</strong>
                <span>{balade.lieu}</span>
              </div>
            </div>
            
            <div class="info-item">
              <span class="info-icon">💰</span>
              <div class="info-content">
                <strong>Prix</strong>
                <span class="price-free">Gratuit (sur invitation)</span>
              </div>
            </div>
            
            <div class="info-item">
              <span class="info-icon">👥</span>
              <div class="info-content">
                <strong>Places</strong>
                <span class="places-available">{balade.placesDisponibles} place{balade.placesDisponibles > 1 ? 's' : ''} disponible{balade.placesDisponibles > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          {#if balade.description}
            <div class="balade-description">
              <h3>À propos de cette balade</h3>
              <p>{balade.description}</p>
            </div>
          {/if}
          
          {#if balade.theme}
            <div class="balade-theme">
              <h3>🎯 Thème</h3>
              <p>{balade.theme}</p>
            </div>
          {/if}
        </div>
      </div>

      {#if successMessage}
        <div class="success-message">
          <div class="success-icon">
            <div class="checkmark">✓</div>
          </div>
          <h2>🎉 Réservation confirmée !</h2>
          <p>{successMessage}</p>
          
          <div class="confirmation-details">
            <div class="detail-section">
              <h3>Récapitulatif de votre réservation</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Balade :</span>
                  <span class="value">{balade.theme}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Date :</span>
                  <span class="value">{new Date(balade.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Heure :</span>
                  <span class="value">{balade.heure}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Lieu :</span>
                  <span class="value">{balade.lieu}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Participant :</span>
                  <span class="value">{invitationForm.prenom} {invitationForm.nom}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Email :</span>
                  <span class="value">{invitationForm.email}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="success-actions">
            <button on:click={goBack} class="btn-secondary">← Retour aux balades</button>
            <button on:click={() => window.location.href = '/'} class="btn-primary">🏠 Accueil</button>
          </div>
        </div>
      {:else}
        <!-- Formulaire de réservation -->
        <div class="reservation-form-container">
          {#if !invitation}
            <h2>Votre code d'invitation</h2>
          {:else}
            <h2>Complétez vos informations</h2>
          {/if}
          
          {#if errorMessage}
            <div class="error-message">{errorMessage}</div>
          {/if}

          <form on:submit|preventDefault={validateCode} class="reservation-form">
            <!-- Section validation du code -->
            {#if !invitation}
              <div class="code-section">
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    bind:value={invitationForm.email}
                    placeholder="Entrez votre adresse email"
                    class="email-input"
                    required
                  />
                  <small class="form-help">
                    Cet email doit correspondre à celui de votre invitation.
                  </small>
                </div>
                
                <div class="form-group">
                  <label for="code">Code d'invitation *</label>
                  <div class="code-input-group">
                    <input
                      type="text"
                      id="code"
                      bind:value={invitationForm.code}
                      placeholder="Entrez votre code d'invitation"
                      class="code-input"
                      required
                    />
                    <button 
                      type="submit" 
                      class="btn-validate-code"
                      disabled={isValidatingCode || !invitationForm.code.trim() || !invitationForm.email.trim()}
                    >
                      {#if isValidatingCode}
                        <span class="spinner"></span>
                        Validation...
                      {:else}
                        ✅ Valider
                      {/if}
                    </button>
                  </div>
                </div>
              </div>
            {:else}
              <!-- Section informations personnelles -->
              <div class="success-code">
                <h3>✅ Code validé !</h3>
                <p>Code : <strong>{invitation.code}</strong></p>
                <p>Nombre de personnes : <strong>{invitation.nombrePersonnes}</strong></p>
                {#if invitation.message}
                  <p>Message : <em>{invitation.message}</em></p>
                {/if}
              </div>

              <div class="form-group">
                <label for="prenom">Prénom *</label>
                <input
                  type="text"
                  id="prenom"
                  bind:value={invitationForm.prenom}
                  class:error={errors.prenom}
                  required
                />
                {#if errors.prenom}
                  <span class="error-text">{errors.prenom}</span>
                {/if}
              </div>

              <div class="form-group">
                <label for="nom">Nom *</label>
                <input
                  type="text"
                  id="nom"
                  bind:value={invitationForm.nom}
                  class:error={errors.nom}
                  required
                />
                {#if errors.nom}
                  <span class="error-text">{errors.nom}</span>
                {/if}
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  bind:value={invitationForm.email}
                  class:error={errors.email}
                  required
                  readonly
                />
                <small class="form-help">
                  ✅ Email validé : {invitationForm.email}
                </small>
                {#if errors.email}
                  <span class="error-text">{errors.email}</span>
                {/if}
              </div>

              <div class="form-group">
                <label for="telephone">Téléphone</label>
                <input
                  type="tel"
                  id="telephone"
                  bind:value={invitationForm.telephone}
                  class:error={errors.telephone}
                />
                {#if errors.telephone}
                  <span class="error-text">{errors.telephone}</span>
                {/if}
              </div>

              <div class="form-group">
                <label for="message">Message (optionnel)</label>
                <textarea
                  id="message"
                  bind:value={invitationForm.message}
                  class:error={errors.message}
                  rows="4"
                  placeholder="Informations supplémentaires, questions, etc."
                ></textarea>
                {#if errors.message}
                  <span class="error-text">{errors.message}</span>
                {/if}
              </div>

              <div class="form-summary">
                <h3>Récapitulatif</h3>
                <p><strong>Balade :</strong> {balade.theme}</p>
                <p><strong>Prix :</strong> Gratuit (sur invitation)</p>
                <p><strong>Nombre de personnes :</strong> {invitation.nombrePersonnes}</p>
              </div>

              <button 
                type="button" 
                on:click={submitReservation}
                disabled={isSubmitting}
                class="btn-primary"
              >
                {#if isSubmitting}
                  <span class="spinner"></span>
                  Confirmation en cours...
                {:else}
                  🎁 Confirmer la réservation gratuite
                {/if}
              </button>
            {/if}
          </form>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .reservation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
    background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    color: white;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-container {
    text-align: center;
    color: white;
    padding: 2rem;
  }

  .reservation-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .balade-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
  }

  .back-button {
    background: none;
    border: none;
    color: #9C27B0;
    font-size: 1rem;
    cursor: pointer;
    margin-bottom: 1rem;
    padding: 0;
  }

  .back-button:hover {
    text-decoration: underline;
  }

  .balade-header h1 {
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    font-size: 2rem;
  }

  .balade-details {
    margin-top: 1.5rem;
  }

  .balade-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .info-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .info-icon {
    font-size: 1.5rem;
    width: 40px;
    text-align: center;
  }

  .info-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-content strong {
    color: #6c757d;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-content span {
    color: #1a1a1a;
    font-size: 1rem;
    font-weight: 500;
  }

  .price-free {
    color: #28a745 !important;
    font-weight: 600;
  }

  .places-available {
    color: #007bff !important;
    font-weight: 600;
  }

  .balade-description,
  .balade-theme {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    margin-bottom: 1.5rem;
  }

  .balade-description h3,
  .balade-theme h3 {
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .balade-description p,
  .balade-theme p {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }

  .reservation-form-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .reservation-form-container h2 {
    color: #1a1a1a;
    margin-bottom: 2rem;
    text-align: center;
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid #fcc;
  }

  .success-message {
    text-align: center;
    padding: 2rem;
    background: #f0f9ff;
    border-radius: 8px;
    border: 1px solid #bae6fd;
    margin-bottom: 2rem;
  }

  .success-message h2 {
    color: #059669;
    margin-bottom: 1rem;
  }

  .success-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .checkmark {
    width: 60px;
    height: 60px;
    background: #059669;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    animation: checkmarkAppear 0.5s ease-out;
  }

  @keyframes checkmarkAppear {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .confirmation-details {
    margin: 2rem 0;
    text-align: left;
  }

  .detail-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    margin-bottom: 1.5rem;
  }

  .detail-section h3 {
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    text-align: center;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .detail-item:last-child {
    border-bottom: none;
  }

  .detail-item .label {
    font-weight: 600;
    color: #6c757d;
  }

  .detail-item .value {
    color: #1a1a1a;
    font-weight: 500;
  }

  .success-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .success-actions .btn-secondary,
  .success-actions .btn-primary {
    min-width: 150px;
  }

  .reservation-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .code-section {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .email-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .email-input:focus {
    outline: none;
    border-color: #9C27B0;
  }

  .code-input-group {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
  }

  .code-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Courier New', monospace;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .code-input:focus {
    outline: none;
    border-color: #9C27B0;
  }

  .btn-validate-code {
    background: linear-gradient(45deg, #9C27B0, #7B1FA2);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-validate-code:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4);
  }

  .btn-validate-code:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .success-code {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .success-code h3 {
    margin: 0 0 0.5rem 0;
    color: #155724;
  }

  .success-code p {
    margin: 0.25rem 0;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: #1a1a1a;
  }

  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #9C27B0;
  }

  .form-group input.error,
  .form-group textarea.error {
    border-color: #dc3545;
  }

  .error-text {
    color: #dc3545;
    font-size: 0.85rem;
  }

  .form-help {
    color: #6c757d;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    font-style: italic;
  }

  .form-summary {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .form-summary h3 {
    margin: 0 0 1rem 0;
    color: #1a1a1a;
  }

  .form-summary p {
    margin: 0.5rem 0;
    color: #666;
  }

  .btn-primary {
    background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .btn-secondary:hover {
    background: #5a6268;
  }

  @media (max-width: 768px) {
    .reservation-container {
      padding: 1rem;
    }

    .reservation-content {
      padding: 1.5rem;
    }

    .balade-header h1 {
      font-size: 1.5rem;
    }

    .balade-details {
      grid-template-columns: 1fr;
    }

    .balade-info-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .info-item {
      padding: 0.875rem;
    }

    .info-icon {
      font-size: 1.25rem;
      width: 35px;
    }

    .balade-description,
    .balade-theme {
      padding: 1.25rem;
    }

    .code-input-group {
      flex-direction: column;
      gap: 0.5rem;
    }

    .btn-validate-code {
      width: 100%;
      justify-content: center;
    }

    .btn-primary {
      padding: 0.875rem 1.5rem;
      font-size: 0.9rem;
    }
  }
</style>
