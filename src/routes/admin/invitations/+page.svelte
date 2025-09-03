<script lang="ts">
  import { onMount } from 'svelte';
  import type { Balade } from '$lib/server/baladesService';
  import AdminAuth from '$lib/components/AdminAuth.svelte';

  interface Invitation {
    id: number;
    baladeId: number;
    code: string;
    email: string;
    statut: 'envoyee' | 'utilisee' | 'expiree';
    dateCreation: string;
    dateUtilisation?: string;
    nombrePersonnes: number;
    message?: string;
    balade?: {
      id: number;
      theme: string;
      date: string;
      heure: string;
      lieu: string;
      placesDisponibles: number;
    };
  }

  let balades: Balade[] = [];
  let invitations: Invitation[] = [];
  let isLoading = true;
  let errorMessage = '';
  let successMessage = '';
  let isVisible = false;

  // Formulaire de création d'invitations
  let isCreatingInvitations = false;
  let invitationForm = {
    baladeId: '',
    emails: '',
    nombrePersonnes: 1,
    message: ''
  };

  onMount(async () => {
    await Promise.all([loadBalades(), loadInvitations()]);
    setTimeout(() => { isVisible = true; }, 100);
  });

  async function loadBalades() {
    try {
      // Charger uniquement les balades sur invitation (futures)
      const response = await fetch('/api/balades?type=invitations');
      const data = await response.json();
      
      console.log('🔍 Debug loadBalades:', { response: response.ok, data });
      
      if (data.success) {
        balades = data.balades;
        console.log('✅ Balades chargées:', balades.length, 'balade(s) sur invitation');
      } else {
        errorMessage = 'Erreur lors du chargement des balades sur invitation';
        console.error('❌ Erreur API:', data.error);
      }
    } catch (error) {
      errorMessage = 'Erreur lors du chargement des balades sur invitation';
      console.error('❌ Erreur fetch:', error);
    }
  }

  async function loadInvitations() {
    try {
      const response = await fetch('/api/admin/invitations');
      const data = await response.json();
      
      if (data.success) {
        invitations = data.invitations;
      } else {
        errorMessage = 'Erreur lors du chargement des invitations';
      }
    } catch (error) {
      errorMessage = 'Erreur lors du chargement des invitations';
    } finally {
      isLoading = false;
    }
  }

  function startCreatingInvitations() {
    isCreatingInvitations = true;
    invitationForm = {
      baladeId: '',
      emails: '',
      nombrePersonnes: 1,
      message: ''
    };
  }

  function cancelCreatingInvitations() {
    isCreatingInvitations = false;
    invitationForm = {
      baladeId: '',
      emails: '',
      nombrePersonnes: 1,
      message: ''
    };
  }

  async function createInvitations() {
    if (!invitationForm.baladeId || !invitationForm.emails.trim()) {
      errorMessage = 'Veuillez sélectionner une balade et saisir au moins un email';
      return;
    }

    // Vérifier que la balade sélectionnée est bien une balade sur invitation
    const selectedBalade = balades.find(b => b.id === parseInt(invitationForm.baladeId));
    if (!selectedBalade) {
      errorMessage = 'Balade non trouvée';
      return;
    }

    if (selectedBalade.type !== 'invitation') {
      errorMessage = 'Impossible de créer des invitations pour une balade payante. Sélectionnez une balade sur invitation.';
      return;
    }

    const emails = invitationForm.emails
      .split('\n')
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));

    if (emails.length === 0) {
      errorMessage = 'Veuillez saisir au moins un email valide';
      return;
    }

    try {
      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baladeId: parseInt(invitationForm.baladeId),
          emails,
          nombrePersonnes: invitationForm.nombrePersonnes,
          message: invitationForm.message || undefined
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        successMessage = data.message || 'Invitations créées avec succès !';
        await loadInvitations();
        cancelCreatingInvitations();
        
        setTimeout(() => {
          successMessage = '';
        }, 5000);
      } else {
        errorMessage = data.error || 'Erreur lors de la création des invitations';
      }
    } catch (error) {
      errorMessage = 'Erreur lors de la création des invitations';
    }
  }

  async function deleteInvitation(invitationId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette invitation ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        successMessage = 'Invitation supprimée avec succès !';
        await loadInvitations();
        
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        errorMessage = data.error || 'Erreur lors de la suppression';
      }
    } catch (error) {
      errorMessage = 'Erreur lors de la suppression';
    }
  }

  async function updateInvitationStatus(invitationId: number, newStatut: string) {
    try {
      const response = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newStatut })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        successMessage = 'Statut mis à jour avec succès !';
        await loadInvitations();
        
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } else {
        errorMessage = data.error || 'Erreur lors de la mise à jour';
      }
    } catch (error) {
      errorMessage = 'Erreur lors de la mise à jour';
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatutColor(statut: string) {
    switch (statut) {
      case 'envoyee': return '#ffc107';
      case 'utilisee': return '#28a745';
      case 'expiree': return '#dc3545';
      default: return '#6c757d';
    }
  }

  function getStatutLabel(statut: string) {
    switch (statut) {
      case 'envoyee': return '📧 Envoyée';
      case 'utilisee': return '✅ Utilisée';
      case 'expiree': return '❌ Expirée';
      default: return '❓ Inconnu';
    }
  }

  function retourAdmin() {
    window.location.href = '/admin';
  }
</script>

<AdminAuth>
  <div class="admin-invitations-page">
    <div class="admin-header">
      <button class="btn-retour" on:click={retourAdmin}>
        ← Retour à l'administration
      </button>
      <h1>🎁 Gestion des Invitations</h1>
    </div>

  <div class="admin-content {isVisible ? 'fade-in' : ''}">
    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Chargement des invitations...</p>
      </div>
    {:else}
      <!-- Messages d'erreur/succès -->
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}

      {#if successMessage}
        <div class="success-message">
          {successMessage}
        </div>
      {/if}

      <!-- Formulaire de création d'invitations -->
      {#if isCreatingInvitations}
        <div class="form-section">
          <h2>🎁 Créer des invitations</h2>
          
          <form on:submit|preventDefault={createInvitations} class="invitation-form">
            <div class="form-group">
              <label for="balade">Balade sur invitation *</label>
              <select 
                id="balade"
                bind:value={invitationForm.baladeId}
                required
              >
                <option value="">Sélectionnez une balade sur invitation</option>
                {#each balades as balade}
                  <option value={balade.id}>
                    🎁 {balade.theme} - {new Date(balade.date).toLocaleDateString('fr-FR')} à {balade.heure} - {balade.lieu}
                  </option>
                {/each}
              </select>
              <small class="form-help">
                Seules les balades sur invitation (gratuites) sont affichées ici.
                {#if balades.length === 0}
                  <br><strong style="color: #ff6b6b;">⚠️ Aucune balade sur invitation trouvée. Créez d'abord une balade sur invitation.</strong>
                {:else}
                  <br>✅ {balades.length} balade(s) sur invitation disponible(s).
                {/if}
              </small>
            </div>

            <div class="form-group">
              <label for="emails">Emails des invités * (un par ligne)</label>
              <textarea 
                id="emails"
                bind:value={invitationForm.emails}
                rows="6"
                placeholder="exemple1@email.com&#10;exemple2@email.com&#10;exemple3@email.com"
                required
              ></textarea>
              <small>Un email par ligne. Les invitations seront envoyées automatiquement.</small>
            </div>

            <div class="form-group">
              <label for="nombrePersonnes">Nombre de personnes par invitation *</label>
              <input 
                type="number" 
                id="nombrePersonnes"
                bind:value={invitationForm.nombrePersonnes}
                min="1"
                max="5"
                required
              />
            </div>

            <div class="form-group">
              <label for="message">Message personnel (optionnel)</label>
              <textarea 
                id="message"
                bind:value={invitationForm.message}
                rows="3"
                placeholder="Message personnalisé à inclure dans l'email d'invitation..."
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save">
                🎁 Créer les invitations
              </button>
              <button type="button" class="btn-cancel" on:click={cancelCreatingInvitations}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      {:else}
        <!-- Liste des invitations -->
        <div class="invitations-section">
          <div class="section-header">
            <h2>Invitations existantes ({invitations.length})</h2>
            <button class="btn-add" on:click={startCreatingInvitations}>
              ➕ Créer des invitations
            </button>
          </div>

          {#if invitations.length === 0}
            <div class="empty-state">
              <p>Aucune invitation créée.</p>
              <button class="btn-add" on:click={startCreatingInvitations}>
                Créer la première invitation
              </button>
            </div>
          {:else}
            <div class="invitations-grid">
              {#each invitations as invitation}
                <div class="invitation-card">
                  <div class="invitation-header">
                    <div class="invitation-code">
                      <span class="code-label">Code:</span>
                      <span class="code-value">{invitation.code}</span>
                    </div>
                    <span class="invitation-statut" style="background-color: {getStatutColor(invitation.statut)}">
                      {getStatutLabel(invitation.statut)}
                    </span>
                  </div>
                  
                  <div class="invitation-details">
                    <div class="detail-row">
                      <strong>Email:</strong> {invitation.email}
                    </div>
                    <div class="detail-row">
                      <strong>Personnes:</strong> {invitation.nombrePersonnes}
                    </div>
                    {#if invitation.balade}
                      <div class="detail-row">
                        <strong>Balade:</strong> {invitation.balade.theme}
                      </div>
                      <div class="detail-row">
                        <strong>Date:</strong> {new Date(invitation.balade.date).toLocaleDateString('fr-FR')} à {invitation.balade.heure}
                      </div>
                      <div class="detail-row">
                        <strong>Lieu:</strong> {invitation.balade.lieu}
                      </div>
                    {/if}
                    <div class="detail-row">
                      <strong>Créée le:</strong> {formatDate(invitation.dateCreation)}
                    </div>
                    {#if invitation.dateUtilisation}
                      <div class="detail-row">
                        <strong>Utilisée le:</strong> {formatDate(invitation.dateUtilisation)}
                      </div>
                    {/if}
                    {#if invitation.message}
                      <div class="detail-row">
                        <strong>Message:</strong> {invitation.message}
                      </div>
                    {/if}
                  </div>
                  
                  <div class="invitation-actions">
                    {#if invitation.statut === 'envoyee'}
                      <button 
                        class="btn-mark-used" 
                        on:click={() => updateInvitationStatus(invitation.id, 'utilisee')}
                        title="Marquer comme utilisée"
                      >
                        ✅ Utilisée
                      </button>
                      <button 
                        class="btn-mark-expired" 
                        on:click={() => updateInvitationStatus(invitation.id, 'expiree')}
                        title="Marquer comme expirée"
                      >
                        ❌ Expirée
                      </button>
                    {:else if invitation.statut === 'utilisee'}
                      <span class="status-used">✅ Déjà utilisée - Réservation existante</span>
                    {:else if invitation.statut === 'expiree'}
                      <span class="status-expired">❌ Expirée</span>
                    {/if}
                    <button 
                      class="btn-delete" 
                      on:click={() => deleteInvitation(invitation.id)}
                      title="Supprimer l'invitation"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
  </div>
</AdminAuth>

<style>
  .admin-invitations-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    color: #fff;
    padding: 2rem;
  }

  .admin-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
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
    white-space: nowrap;
  }

  .btn-retour:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .admin-header h1 {
    font-size: 2rem;
    color: #ffd700;
    margin: 0;
  }

  .admin-content {
    opacity: 0;
    transform: translateY(30px);
  }

  .loading {
    text-align: center;
    padding: 3rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255,255,255,0.1);
    border-left: 4px solid #ffd700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    background: rgba(255,0,0,0.1);
    border: 1px solid rgba(255,0,0,0.3);
    color: #ff6b6b;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .success-message {
    background: rgba(0,255,0,0.1);
    border: 1px solid rgba(0,255,0,0.3);
    color: #00ff00;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .form-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .form-section h2 {
    color: #ffd700;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .invitation-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
    transition: all 0.3s ease;
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

  .form-help {
    color: rgba(255,255,255,0.6);
    font-size: 0.8rem;
    margin-top: 0.25rem;
    font-style: italic;
  }

  .form-group small {
    color: rgba(255,255,255,0.7);
    font-size: 0.8rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .btn-save {
    background: linear-gradient(45deg, #00ff00, #00cc00);
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    white-space: nowrap;
  }

  .btn-save:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
  }

  .btn-cancel {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .btn-cancel:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }

  .invitations-section {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .section-header h2 {
    color: #ffd700;
    margin: 0;
    font-size: 1.5rem;
  }

  .btn-add {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    white-space: nowrap;
  }

  .btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: rgba(255,255,255,0.7);
  }

  .invitations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  .invitation-card {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.3s ease;
  }

  .invitation-card:hover {
    transform: translateY(-2px);
  }

  .invitation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .invitation-code {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .code-label {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.7);
  }

  .code-value {
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    font-weight: bold;
    color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(255, 215, 0, 0.3);
  }

  .invitation-statut {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #000;
  }

  .invitation-details {
    margin-bottom: 1.5rem;
  }

  .detail-row {
    margin-bottom: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }

  .detail-row strong {
    min-width: 100px;
    color: rgba(255,255,255,0.8);
  }

  .invitation-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .btn-mark-used, .btn-mark-expired, .btn-delete {
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .btn-mark-used {
    background: linear-gradient(45deg, #28a745, #20c997);
    color: #fff;
  }

  .btn-mark-used:hover {
    transform: translateY(-1px);
  }

  .btn-mark-expired {
    background: linear-gradient(45deg, #ffc107, #fd7e14);
    color: #000;
  }

  .btn-mark-expired:hover {
    transform: translateY(-1px);
  }

  .btn-delete {
    background: rgba(255,0,0,0.2);
    color: #ff6b6b;
    border: 1px solid rgba(255,0,0,0.3);
  }

  .btn-delete:hover {
    background: rgba(255,0,0,0.3);
    transform: translateY(-1px);
  }

  .status-used {
    color: #28a745;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.5rem;
    background: rgba(40, 167, 69, 0.1);
    border-radius: 6px;
    border: 1px solid rgba(40, 167, 69, 0.3);
  }

  .status-expired {
    color: #dc3545;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.5rem;
    background: rgba(220, 53, 69, 0.1);
    border-radius: 6px;
    border: 1px solid rgba(220, 53, 69, 0.3);
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
    .admin-invitations-page {
      padding: 1rem;
    }

    .admin-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .admin-header h1 {
      font-size: 1.5rem;
    }

    .form-actions {
      flex-direction: column;
    }

    .section-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .invitations-grid {
      grid-template-columns: 1fr;
    }

    .invitation-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .invitation-actions {
      justify-content: center;
      gap: 0.25rem;
    }

    .btn-mark-used, .btn-mark-expired, .btn-delete {
      flex: 1;
      max-width: 120px;
      font-size: 0.7rem;
      padding: 0.4rem 0.6rem;
    }
  }
</style>
