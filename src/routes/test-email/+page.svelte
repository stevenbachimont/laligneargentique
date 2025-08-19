<script lang="ts">
  import { onMount } from 'svelte';

  let testResult: any = null;
  let loading = false;
  let error = '';

  async function testEmailConfig() {
    loading = true;
    error = '';
    testResult = null;

    try {
      const response = await fetch('/api/test-email');
      testResult = await response.json();
    } catch (err) {
      error = 'Erreur lors du test de configuration';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    testEmailConfig();
  });
</script>

<div class="test-page">
  <div class="container">
    <h1>🧪 Test de Configuration Email</h1>
    <p>Cette page permet de vérifier la configuration du service d'emails.</p>

    <div class="test-section">
      <button class="btn-test" on:click={testEmailConfig} disabled={loading}>
        {loading ? 'Test en cours...' : 'Tester la configuration'}
      </button>
    </div>

    {#if error}
      <div class="error-message">
        <h3>❌ Erreur</h3>
        <p>{error}</p>
      </div>
    {/if}

    {#if testResult}
      <div class="result-section">
        <h3>{testResult.success ? '✅ Configuration valide' : '❌ Configuration invalide'}</h3>
        
        {#if testResult.message}
          <p class="result-message">{testResult.message}</p>
        {/if}

        {#if testResult.error}
          <div class="error-details">
            <h4>Erreur :</h4>
            <p>{testResult.error}</p>
          </div>
        {/if}

        {#if testResult.config}
          <div class="config-details">
            <h4>Configuration détectée :</h4>
            <div class="config-grid">
              <div class="config-item">
                <span class="config-label">EMAIL_USER :</span>
                <span class="config-value {testResult.config.hasEmailUser ? 'valid' : 'invalid'}">
                  {testResult.config.hasEmailUser ? '✅ Configuré' : '❌ Manquant'}
                </span>
              </div>
              <div class="config-item">
                <span class="config-label">EMAIL_APP_PASSWORD :</span>
                <span class="config-value {testResult.config.hasEmailPassword ? 'valid' : 'invalid'}">
                  {testResult.config.hasEmailPassword ? '✅ Configuré' : '❌ Manquant'}
                </span>
              </div>
              <div class="config-item">
                <span class="config-label">SMTP_HOST :</span>
                <span class="config-value {testResult.config.hasSmtpHost ? 'valid' : 'invalid'}">
                  {testResult.config.hasSmtpHost ? '✅ Configuré' : '❌ Manquant'}
                </span>
              </div>
              <div class="config-item">
                <span class="config-label">SMTP_USER :</span>
                <span class="config-value {testResult.config.hasSmtpUser ? 'valid' : 'invalid'}">
                  {testResult.config.hasSmtpUser ? '✅ Configuré' : '❌ Manquant'}
                </span>
              </div>
              <div class="config-item">
                <span class="config-label">SMTP_PASS :</span>
                <span class="config-value {testResult.config.hasSmtpPass ? 'valid' : 'invalid'}">
                  {testResult.config.hasSmtpPass ? '✅ Configuré' : '❌ Manquant'}
                </span>
              </div>
              {#if testResult.config.adminEmail}
                <div class="config-item">
                  <span class="config-label">ADMIN_EMAIL :</span>
                  <span class="config-value valid">
                    ✅ {testResult.config.adminEmail}
                  </span>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <div class="help-section">
      <h3>📋 Instructions de configuration</h3>
      <div class="instructions">
        <h4>Pour Gmail (recommandé) :</h4>
        <ol>
          <li>Activez l'authentification à deux facteurs sur votre compte Google</li>
          <li>Créez un mot de passe d'application pour "Mail"</li>
          <li>Ajoutez dans votre fichier <code>.env</code> :</li>
        </ol>
        <pre><code>EMAIL_USER=votre-email@gmail.com
EMAIL_APP_PASSWORD=votre-mot-de-passe-d-application</code></pre>

        <h4>Pour un serveur SMTP personnalisé :</h4>
        <pre><code>SMTP_HOST=smtp.votre-fournisseur.com
SMTP_PORT=587
SMTP_USER=votre-email@votre-fournisseur.com
SMTP_PASS=votre-mot-de-passe</code></pre>
      </div>
    </div>
  </div>
</div>

<style>
  .test-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
    padding: 2rem 0;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  h1 {
    color: #ffd700;
    text-align: center;
    margin-bottom: 1rem;
  }

  p {
    text-align: center;
    color: rgba(255,255,255,0.8);
    margin-bottom: 2rem;
  }

  .test-section {
    text-align: center;
    margin-bottom: 2rem;
  }

  .btn-test {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }

  .btn-test:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .btn-test:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    background: rgba(255,0,0,0.1);
    border: 1px solid rgba(255,0,0,0.3);
    color: #ff6b6b;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .result-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 2rem;
  }

  .result-section h3 {
    color: #ffd700;
    margin-bottom: 1rem;
  }

  .result-message {
    color: rgba(255,255,255,0.9);
    margin-bottom: 1rem;
  }

  .error-details {
    background: rgba(255,0,0,0.1);
    border: 1px solid rgba(255,0,0,0.3);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .error-details h4 {
    color: #ff6b6b;
    margin-bottom: 0.5rem;
  }

  .config-details h4 {
    color: #ffd700;
    margin-bottom: 1rem;
  }

  .config-grid {
    display: grid;
    gap: 0.8rem;
  }

  .config-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .config-label {
    font-weight: 600;
    color: rgba(255,255,255,0.9);
  }

  .config-value {
    font-weight: 600;
  }

  .config-value.valid {
    color: #00ff00;
  }

  .config-value.invalid {
    color: #ff6b6b;
  }

  .help-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .help-section h3 {
    color: #ffd700;
    margin-bottom: 1rem;
  }

  .instructions h4 {
    color: #ffd700;
    margin: 1.5rem 0 0.5rem 0;
  }

  .instructions ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  .instructions li {
    margin-bottom: 0.5rem;
    color: rgba(255,255,255,0.9);
  }

  pre {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  code {
    color: #ffd700;
    font-family: 'Courier New', monospace;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    .config-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .config-label {
      font-size: 0.9rem;
    }

    .config-value {
      font-size: 0.9rem;
    }
  }
</style>
