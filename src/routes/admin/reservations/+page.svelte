<script lang="ts">
  import { onMount } from 'svelte';
  import AdminAuth from '$lib/components/AdminAuth.svelte';

  interface Reservation {
    id: number;
    type: 'payante' | 'invitation';
    prenom: string;
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    nombrePersonnes: number;
    message?: string;
    statut: string;
    createdAt: string;
    code?: string;
    present?: boolean; // Nouveau champ pour la présence
    balade?: {
      id: number;
      theme: string;
      date: string;
      heure: string;
      lieu: string;
      prix: string;
    };
  }

  interface BaladeWithReservations {
    id: number;
    theme: string;
    date: string;
    heure: string;
    lieu: string;
    prix: string;
    type: 'payante' | 'invitation';
    reservations: Reservation[];
  }

  let reservations: Reservation[] = [];
  let loading = true;
  let error = '';
  let isVisible = false;
  
  // États pour la réduction des sections
  let sectionsCollapsed = {
    enLignePayantes: false,
    enLigneInvitations: false,
    passees: false
  };

  // États pour les balades déroulées
  let expandedBalades = new Set<number>();

  onMount(async () => {
    await loadReservations();
    setTimeout(() => { isVisible = true; }, 100);
  });

  async function loadReservations() {
    try {
      loading = true;
      const response = await fetch('/api/admin/reservations');
      const data = await response.json();
      
      console.log('🔍 Réponse API réservations:', data);
      
      if (data.success) {
        reservations = data.reservations;
        console.log('🔍 Réservations chargées:', reservations.length);
        console.log('🔍 Détail des réservations:', reservations);
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

  function getBaladesEnLignePayantes(): BaladeWithReservations[] {
    console.log('🔍 getBaladesEnLignePayantes - Réservations totales:', reservations.length);
    
    const baladesMap = new Map<number, BaladeWithReservations>();
    
    const reservationsFiltrees = reservations.filter(reservation => 
      reservation.type === 'payante' && 
      (reservation.statut === 'confirmee' || reservation.statut === 'en_attente') &&
      reservation.balade && new Date(reservation.balade.date) >= new Date()
    );
    
    console.log('🔍 Réservations payantes filtrées:', reservationsFiltrees.length);
    
    reservationsFiltrees.forEach(reservation => {
      if (reservation.balade) {
        const baladeId = reservation.balade.id;
        if (!baladesMap.has(baladeId)) {
          baladesMap.set(baladeId, {
            id: baladeId,
            theme: reservation.balade.theme,
            date: reservation.balade.date,
            heure: reservation.balade.heure,
            lieu: reservation.balade.lieu,
            prix: reservation.balade.prix,
            type: 'payante',
            reservations: []
          });
        }
        baladesMap.get(baladeId)!.reservations.push(reservation);
      }
    });
    
    const result = Array.from(baladesMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log('🔍 Balades payantes trouvées:', result.length);
    return result;
  }

  function getBaladesEnLigneInvitations(): BaladeWithReservations[] {
    console.log('🔍 getBaladesEnLigneInvitations - Réservations totales:', reservations.length);
    
    const baladesMap = new Map<number, BaladeWithReservations>();
    
    const reservationsFiltrees = reservations.filter(reservation => 
      reservation.type === 'invitation' && 
      (reservation.statut === 'confirmee' || reservation.statut === 'utilisee' || reservation.statut === 'envoyee' || reservation.statut === 'en_attente') &&
      reservation.balade && new Date(reservation.balade.date) >= new Date()
    );
    
    console.log('🔍 Réservations d\'invitation filtrées:', reservationsFiltrees.length);
    
    reservationsFiltrees.forEach(reservation => {
      if (reservation.balade) {
        const baladeId = reservation.balade.id;
        if (!baladesMap.has(baladeId)) {
          baladesMap.set(baladeId, {
            id: baladeId,
            theme: reservation.balade.theme,
            date: reservation.balade.date,
            heure: reservation.balade.heure,
            lieu: reservation.balade.lieu,
            prix: reservation.balade.prix,
            type: 'invitation',
            reservations: []
          });
        }
        baladesMap.get(baladeId)!.reservations.push(reservation);
      }
    });
    
    const result = Array.from(baladesMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log('🔍 Balades d\'invitation trouvées:', result.length);
    return result;
  }

  function getBaladesPassees(): BaladeWithReservations[] {
    console.log('🔍 getBaladesPassees - Réservations totales:', reservations.length);
    
    const baladesMap = new Map<number, BaladeWithReservations>();
    
    // Traiter toutes les réservations passées (y compris les balades sans réservations)
    const reservationsPassees = reservations.filter(reservation => 
      reservation.balade && new Date(reservation.balade.date) < new Date()
    );
    
    console.log('🔍 Réservations passées trouvées:', reservationsPassees.length);
    
    reservationsPassees.forEach(reservation => {
      if (reservation.balade) {
        const baladeId = reservation.balade.id;
        if (!baladesMap.has(baladeId)) {
          baladesMap.set(baladeId, {
            id: baladeId,
            theme: reservation.balade.theme,
            date: reservation.balade.date,
            heure: reservation.balade.heure,
            lieu: reservation.balade.lieu,
            prix: reservation.balade.prix,
            type: reservation.type,
            reservations: []
          });
        }
        
        // Ajouter la réservation seulement si elle a des données réelles (pas une balade sans réservation)
        if (reservation.statut !== 'pas_de_reservation') {
          baladesMap.get(baladeId)!.reservations.push(reservation);
        }
      }
    });
    
    const result = Array.from(baladesMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log('🔍 Balades passées trouvées (avec et sans réservations):', result.length);
    return result;
  }



  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function getStatutBadge(statut: string, type: string) {
    const badges: { [key: string]: { class: string; text: string } } = {
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

  function toggleSection(section: keyof typeof sectionsCollapsed) {
    sectionsCollapsed[section] = !sectionsCollapsed[section];
  }

  function toggleBalade(baladeId: number) {
    if (expandedBalades.has(baladeId)) {
      expandedBalades.delete(baladeId);
    } else {
      expandedBalades.add(baladeId);
    }
    expandedBalades = expandedBalades; // Trigger reactivity
  }

  function getTotalParticipants(balade: BaladeWithReservations): number {
    return balade.reservations.reduce((total, reservation) => total + reservation.nombrePersonnes, 0);
  }

  function getParticipantsPresents(balade: BaladeWithReservations): number {
    return balade.reservations.reduce((total, reservation) => {
      return total + (reservation.present ? reservation.nombrePersonnes : 0);
    }, 0);
  }

  async function togglePresence(reservationId: number, present: boolean) {
    try {
      const response = await fetch('/api/admin/reservations/presence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reservationId,
          present
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour l'état local
        reservations = reservations.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, present }
            : reservation
        );
        // Forcer la réactivité de Svelte
        reservations = [...reservations];
        console.log(`✅ Présence mise à jour pour la réservation ${reservationId}: ${present ? 'présent' : 'absent'}`);
      } else {
        console.error('❌ Erreur lors de la mise à jour de la présence:', data.error);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la présence:', error);
    }
  }
</script>

<AdminAuth>
  <div class="admin-reservations-page">
    <div class="admin-header">
      <button class="btn-retour" on:click={() => window.location.href = '/admin'}>
        ← Retour à l'administration
      </button>
      <h1>📅 Réservations</h1>
    </div>

    <div class="admin-content {isVisible ? 'fade-in' : ''}">
      {#if loading}
        <div class="loading">
          <div class="spinner"></div>
          <p>Chargement des réservations...</p>
        </div>
      {:else if error}
        <div class="error-message">
          {error}
        </div>
      {:else}
        <div class="reservations-container">
          <!-- En ligne - Payantes -->
          <div class="reservation-section">
            <div class="section-header" 
                 on:click={() => toggleSection('enLignePayantes')}
                 on:keydown={(e) => e.key === 'Enter' && toggleSection('enLignePayantes')}
                 role="button"
                 tabindex="0"
                 aria-expanded={!sectionsCollapsed.enLignePayantes}>
              <div class="section-title">
                <span class="section-icon">💰</span>
                <h2>En ligne - Payantes</h2>
                <span class="count">{getBaladesEnLignePayantes().length}</span>
              </div>
              <span class="toggle-icon {sectionsCollapsed.enLignePayantes ? 'collapsed' : ''}">▼</span>
            </div>
            {#if !sectionsCollapsed.enLignePayantes}
              <div class="balades-list">
                {#if getBaladesEnLignePayantes().length > 0}
                  {#each getBaladesEnLignePayantes() as balade}
                    <div class="balade-item">
                      <div class="balade-header" 
                           on:click={() => toggleBalade(balade.id)}
                           on:keydown={(e) => e.key === 'Enter' && toggleBalade(balade.id)}
                           role="button"
                           tabindex="0"
                           aria-expanded={expandedBalades.has(balade.id)}>
                        <div class="balade-info">
                          <div class="balade-main">
                            <h3 class="balade-theme">{balade.theme}</h3>
                            <div class="balade-details">
                              <span class="balade-date">📅 {formatDate(balade.date)}</span>
                              <span class="balade-heure">🕐 {balade.heure}</span>
                              <span class="balade-lieu">📍 {balade.lieu}</span>
                              <span class="balade-prix">💰 {balade.prix}</span>
                            </div>
                          </div>
                          <div class="balade-stats">
                            <span class="participants-count">{getTotalParticipants(balade)} participant{getTotalParticipants(balade) > 1 ? 's' : ''}</span>
                            <span class="participants-presents">{getParticipantsPresents(balade)} présent{getParticipantsPresents(balade) > 1 ? 's' : ''}</span>
                            <span class="reservations-count">{balade.reservations.length} réservation{balade.reservations.length > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <span class="balade-toggle {expandedBalades.has(balade.id) ? 'expanded' : ''}">▼</span>
                      </div>
                      
                      {#if expandedBalades.has(balade.id)}
                        <div class="participants-list">
                          {#each balade.reservations as reservation}
                            <div class="participant-item">
                              <div class="participant-header">
                                <div class="participant-name">
                                  <strong>{reservation.prenom} {reservation.nom}</strong>
                                  <span class="reservation-id">Réservation #{reservation.id}</span>
                                </div>
                                <div class="participant-meta">
                                  <span class="personnes">{reservation.nombrePersonnes} personne{reservation.nombrePersonnes > 1 ? 's' : ''}</span>
                                  <span class="badge {getStatutBadge(reservation.statut, reservation.type).class}">
                                    {getStatutBadge(reservation.statut, reservation.type).text}
                                  </span>
                                  <label class="presence-checkbox">
                                    <input 
                                      type="checkbox" 
                                      checked={reservation.present || false}
                                      on:change={(e) => togglePresence(reservation.id, (e.target as HTMLInputElement).checked)}
                                    />
                                    <span class="checkmark"></span>
                                    <span class="presence-label">Présent</span>
                                  </label>
                                </div>
                              </div>
                              <div class="participant-details">
                                <div class="contact-info">
                                  <div class="contact-item">
                                    <span class="label">📧 Email:</span>
                                    <span class="value">{reservation.email}</span>
                                  </div>
                                  {#if reservation.telephone}
                                    <div class="contact-item">
                                      <span class="label">📞 Téléphone:</span>
                                      <span class="value">{reservation.telephone}</span>
                                    </div>
                                  {/if}
                                  {#if reservation.adresse}
                                    <div class="contact-item">
                                      <span class="label">🏠 Adresse:</span>
                                      <span class="value">{reservation.adresse}</span>
                                    </div>
                                  {/if}
                                  {#if reservation.message}
                                    <div class="contact-item">
                                      <span class="label">💬 Message:</span>
                                      <span class="value">{reservation.message}</span>
                                    </div>
                                  {/if}
                                </div>
                              </div>
                            </div>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  {/each}
                {:else}
                  <div class="empty-state">
                    <p>📭 Aucune balade payante en ligne</p>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <!-- En ligne - Invitations -->
          <div class="reservation-section">
            <div class="section-header" 
                 on:click={() => toggleSection('enLigneInvitations')}
                 on:keydown={(e) => e.key === 'Enter' && toggleSection('enLigneInvitations')}
                 role="button"
                 tabindex="0"
                 aria-expanded={!sectionsCollapsed.enLigneInvitations}>
              <div class="section-title">
                <span class="section-icon">🎁</span>
                <h2>En ligne - Invitations</h2>
                <span class="count">{getBaladesEnLigneInvitations().length}</span>
              </div>
              <span class="toggle-icon {sectionsCollapsed.enLigneInvitations ? 'collapsed' : ''}">▼</span>
            </div>
            {#if !sectionsCollapsed.enLigneInvitations}
              <div class="balades-list">
                {#if getBaladesEnLigneInvitations().length > 0}
                  {#each getBaladesEnLigneInvitations() as balade}
                    <div class="balade-item">
                      <div class="balade-header" 
                           on:click={() => toggleBalade(balade.id)}
                           on:keydown={(e) => e.key === 'Enter' && toggleBalade(balade.id)}
                           role="button"
                           tabindex="0"
                           aria-expanded={expandedBalades.has(balade.id)}>
                        <div class="balade-info">
                          <div class="balade-main">
                            <h3 class="balade-theme">{balade.theme}</h3>
                            <div class="balade-details">
                              <span class="balade-date">📅 {formatDate(balade.date)}</span>
                              <span class="balade-heure">🕐 {balade.heure}</span>
                              <span class="balade-lieu">📍 {balade.lieu}</span>
                              <span class="balade-prix">🎁 Gratuit</span>
                            </div>
                          </div>
                          <div class="balade-stats">
                            <span class="participants-count">{getTotalParticipants(balade)} participant{getTotalParticipants(balade) > 1 ? 's' : ''}</span>
                            <span class="participants-presents">{getParticipantsPresents(balade)} présent{getParticipantsPresents(balade) > 1 ? 's' : ''}</span>
                            <span class="reservations-count">{balade.reservations.length} réservation{balade.reservations.length > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <span class="balade-toggle {expandedBalades.has(balade.id) ? 'expanded' : ''}">▼</span>
                      </div>
                      
                      {#if expandedBalades.has(balade.id)}
                        <div class="participants-list">
                          {#each balade.reservations as reservation}
                            <div class="participant-item">
                              <div class="participant-header">
                                <div class="participant-name">
                                  <strong>{reservation.prenom} {reservation.nom}</strong>
                                  <span class="reservation-id">Réservation #{reservation.id}</span>
                                </div>
                                <div class="participant-meta">
                                  <span class="code">Code: {reservation.code || 'N/A'}</span>
                                  <span class="personnes">{reservation.nombrePersonnes} personne{reservation.nombrePersonnes > 1 ? 's' : ''}</span>
                                  <span class="badge {getStatutBadge(reservation.statut, reservation.type).class}">
                                    {getStatutBadge(reservation.statut, reservation.type).text}
                                  </span>
                                  <label class="presence-checkbox">
                                    <input 
                                      type="checkbox" 
                                      checked={reservation.present || false}
                                      on:change={(e) => togglePresence(reservation.id, (e.target as HTMLInputElement).checked)}
                                    />
                                    <span class="checkmark"></span>
                                    <span class="presence-label">Présent</span>
                                  </label>
                                </div>
                              </div>
                              <div class="participant-details">
                                <div class="contact-info">
                                  <div class="contact-item">
                                    <span class="label">📧 Email:</span>
                                    <span class="value">{reservation.email}</span>
                                  </div>
                                  {#if reservation.telephone}
                                    <div class="contact-item">
                                      <span class="label">📞 Téléphone:</span>
                                      <span class="value">{reservation.telephone}</span>
                                    </div>
                                  {/if}
                                  {#if reservation.adresse}
                                    <div class="contact-item">
                                      <span class="label">🏠 Adresse:</span>
                                      <span class="value">{reservation.adresse}</span>
                                    </div>
                                  {/if}
                                  {#if reservation.message}
                                    <div class="contact-item">
                                      <span class="label">💬 Message:</span>
                                      <span class="value">{reservation.message}</span>
                                    </div>
                                  {/if}
                                </div>
                              </div>
                            </div>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  {/each}
                {:else}
                  <div class="empty-state">
                    <p>📭 Aucune balade d'invitation en ligne</p>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Passées -->
          <div class="reservation-section">
            <div class="section-header" 
                 on:click={() => toggleSection('passees')}
                 on:keydown={(e) => e.key === 'Enter' && toggleSection('passees')}
                 role="button"
                 tabindex="0"
                 aria-expanded={!sectionsCollapsed.passees}>
              <div class="section-title">
                <span class="section-icon">📅</span>
                <h2>Passées</h2>
                <span class="count">{getBaladesPassees().length}</span>
              </div>
              <span class="toggle-icon {sectionsCollapsed.passees ? 'collapsed' : ''}">▼</span>
            </div>
            {#if !sectionsCollapsed.passees}
              <div class="balades-list">
                {#if getBaladesPassees().length > 0}
                  {#each getBaladesPassees() as balade}
                    <div class="balade-item">
                      <div class="balade-header" 
                           on:click={() => toggleBalade(balade.id)}
                           on:keydown={(e) => e.key === 'Enter' && toggleBalade(balade.id)}
                           role="button"
                           tabindex="0"
                           aria-expanded={expandedBalades.has(balade.id)}>
                        <div class="balade-info">
                          <div class="balade-main">
                            <h3 class="balade-theme">{balade.theme}</h3>
                            <div class="balade-details">
                              <span class="balade-date">📅 {formatDate(balade.date)}</span>
                              <span class="balade-heure">🕐 {balade.heure}</span>
                              <span class="balade-lieu">📍 {balade.lieu}</span>
                              <span class="balade-prix">{balade.type === 'invitation' ? '🎁 Gratuit' : `💰 ${balade.prix}`}</span>
                            </div>
                          </div>
                          <div class="balade-stats">
                            <span class="participants-count">{getTotalParticipants(balade)} participant{getTotalParticipants(balade) > 1 ? 's' : ''}</span>
                            <span class="participants-presents">{getParticipantsPresents(balade)} présent{getParticipantsPresents(balade) > 1 ? 's' : ''}</span>
                            <span class="reservations-count">{balade.reservations.length} réservation{balade.reservations.length > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <span class="balade-toggle {expandedBalades.has(balade.id) ? 'expanded' : ''}">▼</span>
                      </div>
                      
                      {#if expandedBalades.has(balade.id)}
                        <div class="participants-list">
                          {#each balade.reservations as reservation}
                            <div class="participant-item">
                              <div class="participant-header">
                                <div class="participant-name">
                                  <strong>{reservation.prenom} {reservation.nom}</strong>
                                  <span class="reservation-id">Réservation #{reservation.id}</span>
                                </div>
                                <div class="participant-meta">
                                  {#if reservation.code}
                                    <span class="code">Code: {reservation.code}</span>
                                  {/if}
                                  <span class="personnes">{reservation.nombrePersonnes} personne{reservation.nombrePersonnes > 1 ? 's' : ''}</span>
                                  <span class="badge {getStatutBadge(reservation.statut, reservation.type).class}">
                                    {getStatutBadge(reservation.statut, reservation.type).text}
                                  </span>
                                  <label class="presence-checkbox">
                                    <input 
                                      type="checkbox" 
                                      checked={reservation.present || false}
                                      on:change={(e) => togglePresence(reservation.id, (e.target as HTMLInputElement).checked)}
                                    />
                                    <span class="checkmark"></span>
                                    <span class="presence-label">Présent</span>
                                  </label>
                                </div>
                              </div>
                              <div class="participant-details">
                                <div class="contact-info">
                                  <div class="contact-item">
                                    <span class="label">📧 Email:</span>
                                    <span class="value">{reservation.email}</span>
                                  </div>
                                  {#if reservation.telephone}
                                    <div class="contact-item">
                                      <span class="label">📞 Téléphone:</span>
                                      <span class="value">{reservation.telephone}</span>
                                    </div>
                                  {/if}
                                  {#if reservation.adresse}
                                    <div class="contact-item">
                                      <span class="label">🏠 Adresse:</span>
                                      <span class="value">{reservation.adresse}</span>
                                    </div>
                                  {/if}
                                  {#if reservation.message}
                                    <div class="contact-item">
                                      <span class="label">💬 Message:</span>
                                      <span class="value">{reservation.message}</span>
                                    </div>
                                  {/if}
                                </div>
                              </div>
                            </div>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  {/each}
                {:else}
                  <div class="empty-state">
                    <p>📭 Aucune balade passée</p>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
</AdminAuth>

<style>
  .admin-reservations-page {
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

  .reservations-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .reservation-section {
    background: rgba(255,255,255,0.03);
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid rgba(255,255,255,0.08);
    overflow: hidden;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: rgba(255,255,255,0.05);
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .section-header:hover {
    background: rgba(255,255,255,0.08);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section-icon {
    font-size: 1.2rem;
  }

  .section-header h2 {
    margin: 0;
    color: #ffd700;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .count {
    background: rgba(255, 215, 0, 0.2);
    color: #ffd700;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid rgba(255, 215, 0, 0.3);
  }

  .toggle-icon {
    color: #ffd700;
    font-size: 0.8rem;
    transition: transform 0.3s ease;
  }

  .toggle-icon.collapsed {
    transform: rotate(-90deg);
  }

  .balades-list {
    background: rgba(255,255,255,0.02);
  }

  .balade-item {
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .balade-item:last-child {
    border-bottom: none;
  }

  .balade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .balade-header:hover {
    background: rgba(255,255,255,0.03);
  }

  .balade-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    gap: 1rem;
  }

  .balade-main {
    flex: 1;
  }

  .balade-theme {
    color: #4CAF50;
    font-weight: 600;
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
  }

  .balade-details {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .balade-details span {
    color: rgba(255,255,255,0.7);
    font-size: 0.8rem;
  }

  .balade-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .participants-count {
    color: #ffd700;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .participants-presents {
    color: #4CAF50;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .reservations-count {
    color: rgba(255,255,255,0.6);
    font-size: 0.8rem;
  }

  .balade-toggle {
    color: #ffd700;
    font-size: 0.8rem;
    transition: transform 0.3s ease;
    margin-left: 1rem;
  }

  .balade-toggle.expanded {
    transform: rotate(180deg);
  }

  .participants-list {
    background: rgba(255,255,255,0.02);
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .participant-item {
    border-bottom: 1px solid rgba(255,255,255,0.03);
    padding: 1rem 1.5rem;
  }

  .participant-item:last-child {
    border-bottom: none;
  }

  .participant-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .participant-name {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .participant-name strong {
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .reservation-id {
    color: rgba(255,255,255,0.5);
    font-size: 0.75rem;
    font-family: 'Courier New', monospace;
  }

  .participant-meta {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .personnes {
    color: rgba(255,255,255,0.7);
    font-size: 0.8rem;
  }

  .participant-details {
    margin-top: 0.75rem;
  }

  .contact-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.75rem;
  }

  .contact-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .contact-item .label {
    color: rgba(255,255,255,0.6);
    font-size: 0.75rem;
    font-weight: 500;
  }

  .contact-item .value {
    color: rgba(255,255,255,0.9);
    font-size: 0.85rem;
    word-break: break-word;
  }

  .presence-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }

  .presence-checkbox input[type="checkbox"] {
    display: none;
  }

  .checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid #ffd700;
    border-radius: 3px;
    background: transparent;
    position: relative;
    transition: all 0.2s ease;
  }

  .presence-checkbox input[type="checkbox"]:checked + .checkmark {
    background: #4CAF50;
    border-color: #4CAF50;
  }

  .presence-checkbox input[type="checkbox"]:checked + .checkmark::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .presence-label {
    color: rgba(255,255,255,0.8);
    font-size: 0.8rem;
    font-weight: 500;
  }

  .presence-checkbox:hover .checkmark {
    border-color: #4CAF50;
  }

  .code {
    color: #ffd700;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    background: rgba(255, 215, 0, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(255, 215, 0, 0.3);
  }

  .badge {
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-block;
  }

  .badge-payante { 
    background: rgba(255, 193, 7, 0.2); 
    color: #ffc107; 
    border: 1px solid rgba(255, 193, 7, 0.3);
  }
  
  .badge-invitation { 
    background: rgba(156, 39, 176, 0.2); 
    color: #9C27B0; 
    border: 1px solid rgba(156, 39, 176, 0.3);
  }
  
  .badge-success { 
    background: rgba(76, 175, 80, 0.2); 
    color: #4CAF50; 
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  
  .badge-warning { 
    background: rgba(255, 152, 0, 0.2); 
    color: #ff9800; 
    border: 1px solid rgba(255, 152, 0, 0.3);
  }
  
  .badge-info { 
    background: rgba(33, 150, 243, 0.2); 
    color: #2196F3; 
    border: 1px solid rgba(33, 150, 243, 0.3);
  }
  
  .badge-danger { 
    background: rgba(244, 67, 54, 0.2); 
    color: #f44336; 
    border: 1px solid rgba(244, 67, 54, 0.3);
  }
  
  .badge-secondary { 
    background: rgba(158, 158, 158, 0.2); 
    color: #9e9e9e; 
    border: 1px solid rgba(158, 158, 158, 0.3);
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: rgba(255,255,255,0.7);
    font-style: italic;
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
    .admin-reservations-page {
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

    .balade-header {
      padding: 0.75rem 1rem;
    }

    .balade-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .balade-stats {
      align-items: flex-start;
      flex-direction: row;
      gap: 1rem;
    }

    .balade-details {
      flex-direction: column;
      gap: 0.25rem;
    }

    .participant-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .participant-meta {
      align-items: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .contact-info {
      grid-template-columns: 1fr;
    }

    .section-header {
      padding: 0.75rem 1rem;
    }

    .section-title {
      gap: 0.5rem;
    }

    .section-header h2 {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .admin-reservations-page {
      padding: 0.5rem;
    }

    .balade-header {
      padding: 0.5rem 0.75rem;
    }

    .participant-item {
      padding: 0.75rem;
    }

    .section-header {
      padding: 0.5rem 0.75rem;
    }

    .section-header h2 {
      font-size: 0.9rem;
    }

    .badge {
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
    }

    .count {
      font-size: 0.7rem;
      padding: 0.15rem 0.4rem;
    }

    .balade-theme {
      font-size: 0.9rem;
    }

    .participant-name strong {
      font-size: 0.9rem;
    }

    .balade-details span {
      font-size: 0.75rem;
    }
  }
</style>