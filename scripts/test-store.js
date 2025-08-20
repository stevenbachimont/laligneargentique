import { baladesStore } from '../src/lib/services/baladesPrismaService.js';

console.log('🧪 Test du store Svelte...');

// S'abonner au store
const unsubscribe = baladesStore.subscribe(balades => {
  console.log(`📊 Store mis à jour: ${balades.length} balades`);
  balades.forEach(balade => {
    console.log(`   - ${balade.theme}: ${balade.placesDisponibles}/${balade.placesInitiales} places`);
  });
});

// Simuler une mise à jour
setTimeout(() => {
  console.log('🔄 Simulation de mise à jour du store...');
  baladesStore.set([
    {
      id: 1,
      theme: 'Test Balade',
      placesDisponibles: 3,
      placesInitiales: 5
    }
  ]);
}, 1000);

// Nettoyer après 3 secondes
setTimeout(() => {
  unsubscribe();
  console.log('✅ Test terminé');
}, 3000);
