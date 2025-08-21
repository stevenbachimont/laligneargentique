// Test de la logique de tri des balades
const testData = {
  success: true,
  balades: [
    {
      id: 1,
      theme: "Architecture médiévale",
      placesDisponibles: 6,
      date: "2026-06-28"
    },
    {
      id: 2,
      theme: "Street Art & Contemporain",
      placesDisponibles: 2,
      date: "2024-03-22"
    },
    {
      id: 3,
      theme: "Nature en ville",
      placesDisponibles: 2,
      date: "2024-04-05"
    },
    {
      id: 4,
      theme: "Balade complète",
      placesDisponibles: 0,
      date: "2024-05-01"
    }
  ]
};

// Logique de tri (copiée de la page Svelte)
function chargerBalades(data) {
  if (data.success && Array.isArray(data.balades)) {
    const baladesDisponibles = data.balades
      .filter(balade => balade.placesDisponibles > 0)
      .sort((a, b) => b.placesDisponibles - a.placesDisponibles)
      .slice(0, 2);
    
    return baladesDisponibles;
  }
  return [];
}

// Test
const result = chargerBalades(testData);
console.log('✅ Test de la logique de tri :');
console.log('Données d\'entrée :', testData.balades.length, 'balades');
console.log('Résultat filtré et trié :');
result.forEach((balade, index) => {
  console.log(`  ${index + 1}. ${balade.theme} - ${balade.placesDisponibles} places`);
});

console.log('\n🎯 Vérifications :');
console.log('- Filtrage des balades avec 0 place :', result.every(b => b.placesDisponibles > 0) ? '✅' : '❌');
console.log('- Tri par nombre de places décroissant :', result[0]?.placesDisponibles >= result[1]?.placesDisponibles ? '✅' : '❌');
console.log('- Limitation à 2 balades :', result.length <= 2 ? '✅' : '❌');
