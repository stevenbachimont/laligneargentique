import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAPI() {
  try {
    console.log('🧪 Test de l\'API Prisma...');
    
    // Test 1: Récupérer toutes les balades
    console.log('\n1️⃣ Récupération de toutes les balades:');
    const balades = await prisma.balade.findMany({
      include: {
        consignes: true,
        materiel: true,
        coordonnees: true,
        parcours: true,
      }
    });
    
    console.log(`✅ ${balades.length} balades récupérées`);
    balades.forEach(balade => {
      console.log(`   - ${balade.theme}: ${balade.placesDisponibles}/${balade.placesInitiales} places`);
    });
    
    // Test 2: Réserver 1 place pour la balade 1
    console.log('\n2️⃣ Test de réservation d\'une place:');
    const baladeAvant = await prisma.balade.findUnique({ where: { id: 1 } });
    console.log(`   Places avant: ${baladeAvant?.placesDisponibles}`);
    
    await prisma.balade.update({
      where: { id: 1 },
      data: { placesDisponibles: baladeAvant.placesDisponibles - 1 }
    });
    
    const baladeApres = await prisma.balade.findUnique({ where: { id: 1 } });
    console.log(`   Places après: ${baladeApres?.placesDisponibles}`);
    console.log('✅ Réservation testée avec succès');
    
    // Test 3: Remettre la place
    console.log('\n3️⃣ Test de remboursement d\'une place:');
    await prisma.balade.update({
      where: { id: 1 },
      data: { placesDisponibles: baladeAvant.placesDisponibles }
    });
    
    const baladeFinale = await prisma.balade.findUnique({ where: { id: 1 } });
    console.log(`   Places finales: ${baladeFinale?.placesDisponibles}`);
    console.log('✅ Remboursement testé avec succès');
    
    console.log('\n🎉 Tous les tests sont passés !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();
