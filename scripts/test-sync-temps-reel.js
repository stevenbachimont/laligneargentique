import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSyncTempsReel() {
  try {
    console.log('🧪 Test de synchronisation en temps réel...');
    
    // Test 1: Vérifier l'état initial
    console.log('\n1️⃣ État initial:');
    const baladeInitiale = await prisma.balade.findUnique({ where: { id: 1 } });
    console.log(`   Balade 1 - Places disponibles: ${baladeInitiale?.placesDisponibles}`);
    
    // Test 2: Réserver une place
    console.log('\n2️⃣ Réservation d\'une place...');
    await prisma.balade.update({
      where: { id: 1 },
      data: { placesDisponibles: baladeInitiale.placesDisponibles - 1 }
    });
    
    const baladeApresReservation = await prisma.balade.findUnique({ where: { id: 1 } });
    console.log(`   Balade 1 - Places après réservation: ${baladeApresReservation?.placesDisponibles}`);
    
    // Test 3: Attendre et vérifier la persistance
    console.log('\n3️⃣ Vérification de la persistance...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const baladeVerification = await prisma.balade.findUnique({ where: { id: 1 } });
    console.log(`   Balade 1 - Places après vérification: ${baladeVerification?.placesDisponibles}`);
    
    // Test 4: Remettre les places initiales
    console.log('\n4️⃣ Remise des places initiales...');
    await prisma.balade.update({
      where: { id: 1 },
      data: { placesDisponibles: baladeInitiale.placesDisponibles }
    });
    
    const baladeFinale = await prisma.balade.findUnique({ where: { id: 1 } });
    console.log(`   Balade 1 - Places finales: ${baladeFinale?.placesDisponibles}`);
    
    console.log('\n🎉 Test de synchronisation terminé !');
    console.log('💡 Maintenant, vérifiez dans le navigateur que les places se mettent à jour automatiquement.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSyncTempsReel();
