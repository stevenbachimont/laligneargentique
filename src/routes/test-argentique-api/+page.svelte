<script lang="ts">
  let testResult: any = null;
  let isLoading = false;
  let error = '';

  async function testAPI() {
    isLoading = true;
    error = '';
    testResult = null;

    const testData = {
      nom: 'Bachimont',
      prenom: 'steven',
      email: 'stevenbachimont@gmail.com',
      telephone: '0645027039',
      dateSouhaitee: '2024-03-01',
      nombrePersonnes: 4,
      message: 'Je souhaite réserver pour la balade "Nature en ville" le vendredi 1 mars 2024 à 16:00 au Jardin des Plantes. Photographie botanique et paysages urbains verdoyants'
    };

    try {
      const response = await fetch('/api/test-argentique', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      
      if (response.ok) {
        testResult = data;
      } else {
        error = `Erreur ${response.status}: ${data.error}`;
        if (data.details) {
          error += ` - Détails: ${data.details.join(', ')}`;
        }
      }
    } catch (err) {
      error = `Erreur de requête: ${err}`;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="test-page">
  <h1>🧪 Test API Argentique</h1>
  
  <div class="test-section">
    <h2>Test de validation avec les données du formulaire</h2>
    <button on:click={testAPI} disabled={isLoading} class="test-btn">
      {isLoading ? 'Test en cours...' : 'Tester l\'API'}
    </button>
  </div>

  {#if error}
    <div class="error-section">
      <h3>❌ Erreur</h3>
      <pre>{error}</pre>
    </div>
  {/if}

  {#if testResult}
    <div class="success-section">
      <h3>✅ Test réussi</h3>
      <div class="result-details">
        <h4>Message:</h4>
        <p>{testResult.message}</p>
        
        <h4>Données originales:</h4>
        <pre>{JSON.stringify(testResult.originalData, null, 2)}</pre>
        
        <h4>Données nettoyées:</h4>
        <pre>{JSON.stringify(testResult.sanitizedData, null, 2)}</pre>
        
        <h4>Validation:</h4>
        <pre>{JSON.stringify(testResult.validation, null, 2)}</pre>
      </div>
    </div>
  {/if}
</div>

<style>
  .test-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: Arial, sans-serif;
  }

  h1 {
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
  }

  .test-section {
    background: #f5f5f5;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    text-align: center;
  }

  .test-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 6px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.3s;
  }

  .test-btn:hover:not(:disabled) {
    background: #0056b3;
  }

  .test-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .error-section {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 2rem;
  }

  .success-section {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    padding: 1rem;
    border-radius: 6px;
  }

  .result-details {
    margin-top: 1rem;
  }

  .result-details h4 {
    margin: 1rem 0 0.5rem 0;
    color: #155724;
  }

  pre {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.9rem;
    line-height: 1.4;
  }
</style>
