#!/usr/bin/env node

/**
 * Script de test pour vérifier toutes les fonctionnalités admin
 * Teste l'authentification et les opérations CRUD sur toutes les entités
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_CODE = process.env.ADMIN_ACCESS_CODE || 'argentique2024';

let sessionToken = null;

async function makeRequest(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (sessionToken) {
    headers['X-Admin-Session'] = sessionToken;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  return response;
}

async function testAdminAuth() {
  console.log('🔐 Test de l\'authentification admin...');
  
  try {
    const response = await makeRequest('/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ accessCode: ADMIN_CODE })
    });

    const data = await response.json();
    
    if (data.success) {
      sessionToken = data.sessionToken;
      console.log('✅ Authentification réussie');
      return true;
    } else {
      console.log('❌ Échec de l\'authentification:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors de l\'authentification:', error.message);
    return false;
  }
}

async function testBaladesCRUD() {
  console.log('\n📋 Test des opérations CRUD sur les balades...');
  
  try {
    // 1. Créer une balade de test
    console.log('  📝 Création d\'une balade de test...');
    const createResponse = await makeRequest('/api/admin/balades', {
      method: 'POST',
      body: JSON.stringify({
        theme: 'Test Admin - Balade de test',
        date: '2024-12-31',
        heure: '14:00',
        lieu: 'Lieu de test',
        prix: '50€',
        placesDisponibles: 5,
        description: 'Balade créée par le script de test admin',
        statut: 'brouillon',
        type: 'payante'
      })
    });

    const createData = await createResponse.json();
    
    if (!createData.success) {
      console.log('  ❌ Échec de la création:', createData.error);
      return false;
    }

    const baladeId = createData.balade.id;
    console.log(`  ✅ Balade créée avec l'ID: ${baladeId}`);

    // 2. Modifier la balade
    console.log('  ✏️ Modification de la balade...');
    const updateResponse = await makeRequest(`/api/admin/balades/${baladeId}`, {
      method: 'PUT',
      body: JSON.stringify({
        theme: 'Test Admin - Balade modifiée',
        date: '2024-12-31',
        heure: '15:00',
        lieu: 'Lieu modifié',
        prix: '60€',
        placesDisponibles: 3,
        description: 'Balade modifiée par le script de test admin',
        statut: 'en_ligne',
        type: 'payante'
      })
    });

    const updateData = await updateResponse.json();
    
    if (!updateData.success) {
      console.log('  ❌ Échec de la modification:', updateData.error);
      return false;
    }

    console.log('  ✅ Balade modifiée avec succès');

    // 3. Supprimer la balade
    console.log('  🗑️ Suppression de la balade...');
    const deleteResponse = await makeRequest(`/api/admin/balades/${baladeId}`, {
      method: 'DELETE'
    });

    const deleteData = await deleteResponse.json();
    
    if (!deleteData.success) {
      console.log('  ❌ Échec de la suppression:', deleteData.error);
      return false;
    }

    console.log('  ✅ Balade supprimée avec succès');
    return true;

  } catch (error) {
    console.log('  ❌ Erreur lors des tests CRUD balades:', error.message);
    return false;
  }
}

async function testInvitationsCRUD() {
  console.log('\n🎁 Test des opérations CRUD sur les invitations...');
  
  try {
    // 1. Créer une balade d'invitation pour le test
    console.log('  📝 Création d\'une balade d\'invitation...');
    const createBaladeResponse = await makeRequest('/api/admin/balades', {
      method: 'POST',
      body: JSON.stringify({
        theme: 'Test Admin - Balade invitation',
        date: '2024-12-30',
        heure: '14:00',
        lieu: 'Lieu invitation',
        prix: 'Gratuit',
        placesDisponibles: 3,
        description: 'Balade d\'invitation créée par le script de test',
        statut: 'en_ligne',
        type: 'invitation'
      })
    });

    const createBaladeData = await createBaladeResponse.json();
    
    if (!createBaladeData.success) {
      console.log('  ❌ Échec de la création de la balade d\'invitation:', createBaladeData.error);
      return false;
    }

    const baladeId = createBaladeData.balade.id;
    console.log(`  ✅ Balade d'invitation créée avec l'ID: ${baladeId}`);

    // 2. Créer des invitations
    console.log('  📧 Création d\'invitations...');
    const createInvResponse = await makeRequest('/api/admin/invitations', {
      method: 'POST',
      body: JSON.stringify({
        baladeId: baladeId,
        emails: ['test1@example.com', 'test2@example.com'],
        nombrePersonnes: 1,
        message: 'Invitations créées par le script de test'
      })
    });

    const createInvData = await createInvResponse.json();
    
    if (!createInvData.success) {
      console.log('  ❌ Échec de la création des invitations:', createInvData.error);
      return false;
    }

    const invitationId = createInvData.invitations[0].id;
    console.log(`  ✅ Invitations créées, ID de test: ${invitationId}`);

    // 3. Modifier le statut d'une invitation
    console.log('  ✏️ Modification du statut d\'invitation...');
    const updateInvResponse = await makeRequest(`/api/admin/invitations/${invitationId}`, {
      method: 'PUT',
      body: JSON.stringify({ statut: 'utilisee' })
    });

    const updateInvData = await updateInvResponse.json();
    
    if (!updateInvData.success) {
      console.log('  ❌ Échec de la modification:', updateInvData.error);
      return false;
    }

    console.log('  ✅ Statut d\'invitation modifié avec succès');

    // 4. Supprimer une invitation
    console.log('  🗑️ Suppression d\'une invitation...');
    const deleteInvResponse = await makeRequest(`/api/admin/invitations/${invitationId}`, {
      method: 'DELETE'
    });

    const deleteInvData = await deleteInvResponse.json();
    
    if (!deleteInvData.success) {
      console.log('  ❌ Échec de la suppression:', deleteInvData.error);
      return false;
    }

    console.log('  ✅ Invitation supprimée avec succès');

    // 5. Nettoyer la balade d'invitation
    console.log('  🧹 Nettoyage de la balade d\'invitation...');
    const deleteBaladeResponse = await makeRequest(`/api/admin/balades/${baladeId}`, {
      method: 'DELETE'
    });

    const deleteBaladeData = await deleteBaladeResponse.json();
    
    if (!deleteBaladeData.success) {
      console.log('  ⚠️ Échec du nettoyage de la balade:', deleteBaladeData.error);
    } else {
      console.log('  ✅ Balade d\'invitation nettoyée');
    }

    return true;

  } catch (error) {
    console.log('  ❌ Erreur lors des tests CRUD invitations:', error.message);
    return false;
  }
}

async function testReservationsOperations() {
  console.log('\n📅 Test des opérations sur les réservations...');
  
  try {
    // 1. Récupérer les réservations
    console.log('  📋 Récupération des réservations...');
    const getReservationsResponse = await makeRequest('/api/admin/reservations');
    const getReservationsData = await getReservationsResponse.json();
    
    if (!getReservationsData.success) {
      console.log('  ❌ Échec de la récupération des réservations:', getReservationsData.error);
      return false;
    }

    console.log(`  ✅ ${getReservationsData.reservations.length} réservations récupérées`);

    // 2. Récupérer les réservations en attente
    console.log('  ⏳ Récupération des réservations en attente...');
    const getEnAttenteResponse = await makeRequest('/api/admin/reservations-en-attente');
    const getEnAttenteData = await getEnAttenteResponse.json();
    
    if (!getEnAttenteData.success) {
      console.log('  ❌ Échec de la récupération des réservations en attente:', getEnAttenteData.error);
      return false;
    }

    console.log(`  ✅ ${getEnAttenteData.reservations.length} réservations en attente récupérées`);

    // 3. Tester la correction des places (si disponible)
    console.log('  🔧 Test de la correction des places...');
    const correctPlacesResponse = await makeRequest('/api/admin/corriger-places', {
      method: 'POST'
    });
    const correctPlacesData = await correctPlacesResponse.json();
    
    if (!correctPlacesData.success) {
      console.log('  ⚠️ Correction des places non disponible:', correctPlacesData.error);
    } else {
      console.log('  ✅ Correction des places effectuée');
    }

    return true;

  } catch (error) {
    console.log('  ❌ Erreur lors des tests de réservations:', error.message);
    return false;
  }
}

async function testSessionValidation() {
  console.log('\n🔍 Test de la validation de session...');
  
  try {
    const response = await makeRequest('/api/admin/auth', {
      method: 'GET'
    });

    const data = await response.json();
    
    if (data.success && data.isAuthenticated) {
      console.log('✅ Session valide');
      return true;
    } else {
      console.log('❌ Session invalide:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors de la validation de session:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Démarrage des tests des fonctionnalités admin...\n');
  
  const results = {
    auth: false,
    balades: false,
    invitations: false,
    reservations: false,
    session: false
  };

  // Test d'authentification
  results.auth = await testAdminAuth();
  
  if (!results.auth) {
    console.log('\n❌ Les tests s\'arrêtent ici car l\'authentification a échoué.');
    return;
  }

  // Test de validation de session
  results.session = await testSessionValidation();

  // Tests CRUD
  results.balades = await testBaladesCRUD();
  results.invitations = await testInvitationsCRUD();
  results.reservations = await testReservationsOperations();

  // Résumé des résultats
  console.log('\n📊 Résumé des tests:');
  console.log(`  🔐 Authentification: ${results.auth ? '✅' : '❌'}`);
  console.log(`  🔍 Validation de session: ${results.session ? '✅' : '❌'}`);
  console.log(`  📋 Opérations balades: ${results.balades ? '✅' : '❌'}`);
  console.log(`  🎁 Opérations invitations: ${results.invitations ? '✅' : '❌'}`);
  console.log(`  📅 Opérations réservations: ${results.reservations ? '✅' : '❌'}`);

  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('✅ Toutes les fonctionnalités admin fonctionnent correctement.');
  } else {
    console.log('\n⚠️ Certains tests ont échoué.');
    console.log('❌ Vérifiez les erreurs ci-dessus.');
  }

  return allPassed;
}

// Exécuter les tests si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

export { runAllTests };
