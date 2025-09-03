<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let isAuthenticated = false;
  let isLoading = true;
  let accessCode = '';
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
    isLoading = false;
    setTimeout(() => { isVisible = true; }, 100);
  });

  async function handleLogin() {
    if (!accessCode.trim()) {
      errorMessage = 'Veuillez saisir le code d\'accès.';
      return;
    }

    isLoading = true;
    errorMessage = '';

    // Simuler un délai pour l'authentification
    await new Promise(resolve => setTimeout(resolve, 500));

    if (accessCode === ADMIN_CODE) {
      isAuthenticated = true;
      sessionStorage.setItem('admin_authenticated', 'true');
      errorMessage = '';
    } else {
      errorMessage = 'Code d\'accès incorrect.';
      accessCode = '';
    }

    isLoading = false;
  }

  function handleLogout() {
    isAuthenticated = false;
    sessionStorage.removeItem('admin_authenticated');
    accessCode = '';
    errorMessage = '';
    goto('/admin');
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

{#if isLoading}
  <div class="admin-auth-loading">
    <div class="spinner"></div>
    <p>Vérification de l'authentification...</p>
  </div>
{:else if !isAuthenticated}
  <!-- Page de connexion -->
  <div class="admin-auth-page">
    <div class="admin-auth-container {isVisible ? 'fade-in' : ''}">
      <div class="login-section">
        <div class="admin-icon">
          <div class="lock-icon">🔒</div>
        </div>

        <div class="login-header">
          <h1>Accès Administrateur</h1>
          <p class="subtitle">Code d'accès requis</p>
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
            {isLoading ? 'Vérification...' : 'Accéder'}
          </button>
        </form>

        <div class="security-note">
          <p>🔐 Accès réservé aux administrateurs</p>
        </div>
      </div>
    </div>
  </div>
{:else}
  <!-- Contenu protégé -->
  <slot />
{/if}

<style>
  .admin-auth-loading {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ffd700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .admin-auth-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .admin-auth-container {
    max-width: 500px;
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
    font-size: 2.2rem;
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
    .admin-auth-page {
      padding: 1rem;
    }

    .admin-auth-container {
      max-width: 100%;
    }

    .login-section {
      padding: 2rem 1.5rem;
    }

    .login-header h1 {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 480px) {
    .admin-auth-page {
      padding: 0.5rem;
    }

    .login-section {
      padding: 1.5rem 1rem;
    }
  }
</style>
