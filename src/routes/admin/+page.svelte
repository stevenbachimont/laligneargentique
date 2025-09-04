<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let accessCode = '';
  let isAuthenticated = false;
  let isLoading = false;
  let errorMessage = '';
  let isVisible = false;

  // Code d'accès administrateur depuis les variables d'environnement
  const ADMIN_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE || 'argentique2024';

  onMount(() => {
    // Vérifier si déjà authentifié
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      isAuthenticated = true;
    }
    setTimeout(() => { isVisible = true; }, 100);
  });

  async function handleLogin() {
    if (!accessCode.trim()) {
      errorMessage = 'Veuillez saisir le code d\'accès.';
      return;
    }

    isLoading = true;
    errorMessage = '';

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessCode })
      });

      const result = await response.json();

      if (result.success) {
        isAuthenticated = true;
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_session_token', result.sessionToken);
        errorMessage = '';
        // Rediriger vers le dashboard admin
        goto('/admin/balades');
      } else {
        errorMessage = result.error || 'Code d\'accès incorrect.';
        accessCode = '';
      }
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error);
      errorMessage = 'Erreur de connexion. Veuillez réessayer.';
      accessCode = '';
    }

    isLoading = false;
  }

  async function handleLogout() {
    const sessionToken = sessionStorage.getItem('admin_session_token');
    
    if (sessionToken) {
      try {
        await fetch('/api/admin/auth', {
          method: 'DELETE',
          headers: {
            'X-Admin-Session': sessionToken
          }
        });
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    }

    isAuthenticated = false;
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_session_token');
    accessCode = '';
    errorMessage = '';
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<div class="admin-page">
  <div class="admin-container {isVisible ? 'fade-in' : ''}">
    {#if !isAuthenticated}
      <!-- Page de connexion -->
      <div class="login-section">
        <div class="admin-icon">
          <div class="lock-icon">🔒</div>
        </div>

        <div class="login-header">
          <h1>Administration</h1>
          <p class="subtitle">Accès sécurisé à la gestion des balades</p>
        </div>

        <form on:submit|preventDefault={handleLogin} class="login-form">
          <div class="form-group">
            <label for="accessCode">Code d'accès</label>
            <input 
              type="password" 
              id="accessCode"
              bind:value={accessCode}
              on:keypress={handleKeyPress}
              placeholder="Saisissez le code d'accès"
              disabled={isLoading}
              autocomplete="off"
            />
          </div>

          {#if errorMessage}
            <div class="error-message">
              {errorMessage}
            </div>
          {/if}

          <button type="submit" class="btn-login" disabled={isLoading}>
            {isLoading ? 'Vérification...' : 'Accéder à l\'administration'}
          </button>
        </form>

        <div class="security-note">
          <p>🔐 Accès réservé aux administrateurs</p>
          <p>Contactez l'administrateur pour obtenir le code d'accès</p>
        </div>
      </div>
    {:else}
      <!-- Interface d'administration -->
      <div class="admin-interface">
        <div class="admin-header">
          <h1>🎞️ Administration des Balades</h1>
          <button class="btn-logout" on:click={handleLogout}>
            🚪 Déconnexion
          </button>
        </div>

        <div class="admin-content">
          <div class="admin-grid">
            <div class="admin-card" on:click={() => window.location.href = '/admin/balades'}>
              <div class="card-icon">📋</div>
              <h3>Balades</h3>
              <p>Gérer les balades</p>
            </div>

            <div class="admin-card" on:click={() => window.location.href = '/admin/invitations'}>
              <div class="card-icon">🎁</div>
              <h3>Invitations</h3>
              <p>Codes d'accès gratuits</p>
            </div>

            <div class="admin-card" on:click={() => window.location.href = '/admin/reservations'}>
              <div class="card-icon">📅</div>
              <h3>Réservations</h3>
              <p>Suivre les inscriptions</p>
            </div>

            <div class="admin-card" on:click={() => window.open('/photographie/argentique', '_blank')}>
              <div class="card-icon">👁️</div>
              <h3>Site public</h3>
              <p>Voir le site</p>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .admin-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .admin-container {
    max-width: 600px;
    width: 100%;
    background: rgba(255,255,255,0.05);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px);
  }

  .admin-icon {
    text-align: center;
    margin-bottom: 2rem;
  }

  .lock-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    margin: 0 auto;
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
  }

  .login-section {
    padding: 3rem 2rem;
    text-align: center;
  }

  .login-header h1 {
    font-size: 2.5rem;
    color: #ffd700;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 1.1rem;
    color: rgba(255,255,255,0.8);
    margin-bottom: 2rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
  }

  .form-group label {
    color: rgba(255,255,255,0.9);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .form-group input {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 1rem;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .form-group input:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255,255,255,0.15);
  }

  .form-group input::placeholder {
    color: rgba(255,255,255,0.5);
  }

  .btn-login {
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

  .btn-login:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .btn-login:disabled {
    background: rgba(255, 215, 0, 0.5);
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.7);
    box-shadow: none;
  }

  .error-message {
    background: rgba(255,0,0,0.1);
    border: 1px solid rgba(255,0,0,0.3);
    color: #ff6b6b;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }

  .security-note {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .security-note p {
    color: rgba(255,255,255,0.7);
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  /* Interface d'administration */
  .admin-interface {
    padding: 2rem;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .admin-header h1 {
    font-size: 2rem;
    color: #ffd700;
    margin: 0;
  }

  .btn-logout {
    background: rgba(255,0,0,0.2);
    color: #ff6b6b;
    border: 1px solid rgba(255,0,0,0.3);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-logout:hover {
    background: rgba(255,0,0,0.3);
    transform: translateY(-1px);
  }

  .admin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .admin-card {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
  }

  .admin-card:hover {
    transform: translateY(-3px);
    background: rgba(255,255,255,0.08);
    border-color: rgba(255, 215, 0, 0.3);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }

  .card-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    display: block;
  }

  .admin-card h3 {
    color: #ffd700;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .admin-card p {
    color: rgba(255,255,255,0.8);
    font-size: 0.85rem;
    margin: 0;
  }

  /* Animations */
  .fade-in {
    opacity: 1;
    transform: translateY(0);
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .admin-page {
      padding: 1rem;
    }

    .admin-container {
      max-width: 100%;
    }

    .login-section {
      padding: 2rem 1.5rem;
    }

    .login-header h1 {
      font-size: 2rem;
    }

    .admin-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .admin-header h1 {
      font-size: 1.5rem;
    }

    .admin-interface {
      padding: 1rem;
    }

    .admin-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .admin-card {
      padding: 1rem;
    }

    .card-icon {
      font-size: 2rem;
    }
  }

  @media (max-width: 480px) {
    .admin-page {
      padding: 0.5rem;
    }

    .login-section {
      padding: 1.5rem 1rem;
    }

    .admin-interface {
      padding: 0.5rem;
    }

    .admin-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .admin-card {
      padding: 1rem;
    }

    .admin-card h3 {
      font-size: 1rem;
    }

    .admin-card p {
      font-size: 0.8rem;
    }
  }
</style>
