import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPlaces() {
  try {
    console.log('🔍 Vérification des places disponibles...\n');
    
    const balades = await prisma.balade.findMany({
      select: {
        id: true,
        theme: true,
        placesDisponibles: true,
        placesInitiales: true,
        date: true,
        heure: true
      },
      orderBy: { id: 'asc' }
    });
    
    balades.forEach(balade => {
      const status = balade.placesDisponibles === 0 ? '🔴 COMPLET' : 
                    balade.placesDisponibles <= 2 ? '🟡 LIMITE' : '🟢 DISPONIBLE';
      
      console.log(`${status} Balade ${balade.id}: ${balade.theme}`);
      console.log(`   📅 ${balade.date} à ${balade.heure}`);
      console.log(`   👥 Places: ${balade.placesDisponibles}/${balade.placesInitiales}`);
      console.log('');
    });
    
    console.log('✅ Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPlaces();
