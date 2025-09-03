<script lang="ts">
  import { onMount } from 'svelte';

  interface Reservation {
    id: number;
    type: 'payante' | 'invitation';
    prenom: string;
    nom: string;
    email: string;
    nombrePersonnes: number;
    message?: string;
    statut: string;
    createdAt: string;
    code?: string;
    balade?: {
      theme: string;
      date: string;
      heure: string;
      lieu: string;
      prix: string;
    };
  }

  interface Stats {
    total: number;
    payantes: number;
    invitations: number;
    confirmees: number;
    enAttente: number;
  }

  let reservations: Reservation[] = [];
  let stats: Stats = { total: 0, payantes: 0, invitations: 0, confirmees: 0, enAttente: 0 };
  let loading = true;
  let error = '';
  let filterType = 'all'; // 'all', 'payante', 'invitation'
  let filterStatut = 'all'; // 'all', 'confirmee', 'en_attente'

  onMount(async () => {
    await loadReservations();
  });

  async function loadReservations() {
    try {
      loading = true;
      const response = await fetch('/api/admin/reservations');
      const data = await response.json();
      
      if (data.success) {
        reservations = data.reservations;
        stats = data.stats;
      } else {
        error = data.error || 'Erreur lors du chargement des réservations';
      }
    } catch (err) {
      error = 'Erreur de connexion';
      console.error('Erreur:', err);
    } finally {
      loading = false;
    }
  }

  function getFilteredReservations() {
    return reservations.filter(reservation => {
      const typeMatch = filterType === 'all' || reservation.type === filterType;
      const statutMatch = filterStatut === 'all' || 
        (filterStatut === 'confirmee' && (reservation.statut === 'confirmee' || reservation.statut === 'utilisee')) ||
        (filterStatut === 'en_attente' && (reservation.statut === 'en_attente' || reservation.statut === 'envoyee'));
      
      return typeMatch && statutMatch;
    });
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

  function getStatutBadge(statut: string, type: string) {
    const badges = {
      'confirmee': { class: 'badge-success', text: 'Confirmée' },
      'utilisee': { class: 'badge-success', text: 'Utilisée' },
      'en_attente': { class: 'badge-warning', text: 'En attente' },
      'envoyee': { class: 'badge-info', text: 'Envoyée' },
      'annulee': { class: 'badge-danger', text: 'Annulée' }
    };
    
    return badges[statut] || { class: 'badge-secondary', text: statut };
  }

  function getTypeBadge(type: string) {
    return type === 'payante' 
      ? { class: 'badge-payante', text: '💰 Payante' }
      : { class: 'badge-invitation', text: '🎁 Invitation' };
  }
</script>

<div class="admin-reservations">
  <div class="header">
    <h1>📋 Suivi des réservations</h1>
    <p>Gérez et suivez toutes les réservations (payantes et invitations)</p>
  </div>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement des réservations...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>❌ {error}</p>
      <button on:click={loadReservations} class="btn-retry">Réessayer</button>
    </div>
  {:else}
    <!-- Statistiques -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{stats.total}</div>
        <div class="stat-label">Total</div>
      </div>
      <div class="stat-card stat-payante">
        <div class="stat-number">{stats.payantes}</div>
        <div class="stat-label">💰 Payantes</div>
      </div>
      <div class="stat-card stat-invitation">
        <div class="stat-number">{stats.invitations}</div>
        <div class="stat-label">🎁 Invitations</div>
      </div>
      <div class="stat-card stat-confirmee">
        <div class="stat-number">{stats.confirmees}</div>
        <div class="stat-label">✅ Confirmées</div>
      </div>
      <div class="stat-card stat-attente">
        <div class="stat-number">{stats.enAttente}</div>
        <div class="stat-label">⏳ En attente</div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="filters">
      <div class="filter-group">
        <label for="type-filter">Type :</label>
        <select id="type-filter" bind:value={filterType}>
          <option value="all">Tous</option>
          <option value="payante">💰 Payantes</option>
          <option value="invitation">🎁 Invitations</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="statut-filter">Statut :</label>
        <select id="statut-filter" bind:value={filterStatut}>
          <option value="all">Tous</option>
          <option value="confirmee">✅ Confirmées</option>
          <option value="en_attente">⏳ En attente</option>
        </select>
      </div>
    </div>

    <!-- Liste des réservations -->
    <div class="reservations-list">
      {#each getFilteredReservations() as reservation}
        <div class="reservation-card">
          <div class="reservation-header">
            <div class="reservation-info">
              <h3>{reservation.prenom} {reservation.nom}</h3>
              <p class="email">{reservation.email}</p>
              <div class="badges">
                <span class="badge {getTypeBadge(reservation.type).class}">
                  {getTypeBadge(reservation.type).text}
                </span>
                <span class="badge {getStatutBadge(reservation.statut, reservation.type).class}">
                  {getStatutBadge(reservation.statut, reservation.type).text}
                </span>
              </div>
            </div>
            <div class="reservation-meta">
              <p class="date">📅 {formatDate(reservation.createdAt)}</p>
              {#if reservation.code}
                <p class="code">🔑 Code: {reservation.code}</p>
              {/if}
            </div>
          </div>

          <div class="reservation-details">
            <div class="detail-section">
              <h4>👥 Participants</h4>
              <p>{reservation.nombrePersonnes} personne{reservation.nombrePersonnes > 1 ? 's' : ''}</p>
            </div>

            {#if reservation.balade}
              <div class="detail-section">
                <h4>🎯 Balade</h4>
                <p><strong>{reservation.balade.theme}</strong></p>
                <p>📅 {new Date(reservation.balade.date).toLocaleDateString('fr-FR')} à {reservation.balade.heure}</p>
                <p>📍 {reservation.balade.lieu}</p>
                <p>💰 {reservation.balade.prix}</p>
              </div>
            {/if}

            {#if reservation.message}
              <div class="detail-section">
                <h4>💬 Message</h4>
                <p class="message">{reservation.message}</p>
              </div>
            {/if}
          </div>

          <div class="reservation-actions">
            <button class="btn-contact" on:click={() => window.open(`mailto:${reservation.email}`)}>
              📧 Contacter
            </button>
            {#if reservation.type === 'invitation' && reservation.statut === 'envoyee'}
              <button class="btn-remind" on:click={() => {/* TODO: Renvoyer invitation */}}>
                🔄 Renvoyer
              </button>
            {/if}
          </div>
        </div>
      {/each}

      {#if getFilteredReservations().length === 0}
        <div class="no-reservations">
          <p>📭 Aucune réservation trouvée avec ces filtres</p>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .admin-reservations {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header h1 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .header p {
    color: #7f8c8d;
    font-size: 1.1rem;
  }

  .loading {
    text-align: center;
    padding: 3rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error {
    text-align: center;
    padding: 2rem;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .btn-retry {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-left: 4px solid #3498db;
  }

  .stat-payante { border-left-color: #f39c12; }
  .stat-invitation { border-left-color: #9b59b6; }
  .stat-confirmee { border-left-color: #27ae60; }
  .stat-attente { border-left-color: #e67e22; }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
  }

  .stat-label {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .filters {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .filter-group label {
    font-weight: 600;
    color: #2c3e50;
  }

  .filter-group select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
  }

  .reservations-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .reservation-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .reservation-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }

  .reservation-info h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }

  .email {
    color: #7f8c8d;
    margin: 0 0 1rem 0;
  }

  .badges {
    display: flex;
    gap: 0.5rem;
  }

  .badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .badge-payante { background: #fff3cd; color: #856404; }
  .badge-invitation { background: #e2e3f1; color: #383d41; }
  .badge-success { background: #d4edda; color: #155724; }
  .badge-warning { background: #fff3cd; color: #856404; }
  .badge-info { background: #d1ecf1; color: #0c5460; }
  .badge-danger { background: #f8d7da; color: #721c24; }
  .badge-secondary { background: #e2e3e5; color: #383d41; }

  .reservation-meta {
    text-align: right;
    color: #7f8c8d;
    font-size: 0.9rem;
  }

  .reservation-details {
    padding: 1.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .detail-section h4 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 0.9rem;
  }

  .detail-section p {
    margin: 0;
    color: #7f8c8d;
  }

  .message {
    background: #f8f9fa;
    padding: 0.75rem;
    border-radius: 4px;
    border-left: 3px solid #3498db;
  }

  .reservation-actions {
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    display: flex;
    gap: 1rem;
  }

  .btn-contact, .btn-remind {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .btn-contact {
    background: #3498db;
    color: white;
  }

  .btn-remind {
    background: #f39c12;
    color: white;
  }

  .no-reservations {
    text-align: center;
    padding: 3rem;
    color: #7f8c8d;
  }

  @media (max-width: 768px) {
    .admin-reservations {
      padding: 1rem;
    }

    .reservation-header {
      flex-direction: column;
      gap: 1rem;
    }

    .reservation-meta {
      text-align: left;
    }

    .filters {
      flex-direction: column;
      gap: 1rem;
    }

    .reservation-details {
      grid-template-columns: 1fr;
    }
  }
</style>