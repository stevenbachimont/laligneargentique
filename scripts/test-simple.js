import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSimple() {
  try {
    console.log('🧪 Test simple de Prisma...');
    
    // Test 1: Compter les balades
    const count = await prisma.balade.count();
    console.log(`✅ Nombre de balades: ${count}`);
    
    // Test 2: Récupérer une balade
    const balade = await prisma.balade.findFirst({
      include: {
        consignes: true,
        materiel: true,
        coordonnees: true,
        parcours: true,
      }
    });
    
    if (balade) {
      console.log(`✅ Balade trouvée: ${balade.theme}`);
      console.log(`   - Consignes: ${balade.consignes.length}`);
      console.log(`   - Matériel: ${balade.materiel.length}`);
      console.log(`   - Coordonnées: ${balade.coordonnees.length}`);
      console.log(`   - Parcours: ${balade.parcours.length}`);
    } else {
      console.log('❌ Aucune balade trouvée');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimple();
