import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initialisation de la base de données...');

  try {
    // Nettoyer la base de données existante
    console.log('🧹 Nettoyage de la base de données...');
    await prisma.reservation.deleteMany();
    await prisma.parcours.deleteMany();
    await prisma.coordonnees.deleteMany();
    await prisma.materiel.deleteMany();
    await prisma.consignes.deleteMany();
    await prisma.balade.deleteMany();

    // Créer des balades de test
    console.log('📅 Création des balades de test...');
    
    const balade1 = await prisma.balade.create({
      data: {
        date: '2024-02-15',
        heure: '14:00',
        lieu: 'Quartier du Bouffay',
        theme: 'Architecture médiévale',
        placesDisponibles: 3,
        placesInitiales: 5,
        prix: '45€',
        description: 'Découverte des façades historiques et des ruelles pittoresques',
        consignes: {
          create: [
            { texte: 'Apportez des vêtements confortables et adaptés à la météo' },
            { texte: 'Chaussures de marche recommandées' },
            { texte: 'Vêtements adaptés aux conditions météorologiques' }
          ]
        },
        materiel: {
          create: [
            { nom: 'Appareil photo argentique format 120' },
            { nom: 'Pellicule 400 ISO (incluses)' },
            { nom: 'Trépied léger (optionnel)' }
          ]
        },
        coordonnees: {
          create: [
            { lat: 47.2138, lng: -1.5564, name: 'Place du Bouffay' },
            { lat: 47.2140, lng: -1.5566, name: 'Rue Kervégan' },
            { lat: 47.2142, lng: -1.5568, name: 'Place Saint-Pierre' },
            { lat: 47.2144, lng: -1.5570, name: 'Rue de la Fosse' },
            { lat: 47.2146, lng: -1.5572, name: 'Quai de la Fosse' }
          ]
        },
        parcours: {
          create: [
            { titre: 'Départ - Place du Bouffay', description: 'Rendez-vous devant la fontaine', duree: '30 min', distance: '0 km' },
            { titre: 'Étape 1 - Rue Kervégan', description: 'Découverte des façades médiévales', duree: '45 min', distance: '200m' },
            { titre: 'Étape 2 - Place Saint-Pierre', description: 'Photographie de l\'église', duree: '30 min', distance: '400m' },
            { titre: 'Étape 3 - Rue de la Fosse', description: 'Portraits de rue', duree: '45 min', distance: '600m' },
            { titre: 'Arrivée - Quai de la Fosse', description: 'Vue sur la Loire', duree: '30 min', distance: '800m' }
          ]
        }
      }
    });

    const balade2 = await prisma.balade.create({
      data: {
        date: '2024-02-22',
        heure: '10:00',
        lieu: 'Île de Nantes',
        theme: 'Street Art & Contemporain',
        placesDisponibles: 5,
        placesInitiales: 5,
        prix: '45€',
        description: 'Capture des œuvres d\'art urbain et de l\'architecture moderne',
        consignes: {
          create: [
            { texte: 'Vêtements urbains et confortables' },
            { texte: 'Chaussures adaptées à la marche urbaine' }
          ]
        },
        materiel: {
          create: [
            { nom: 'Appareil photo argentique 35mm' },
            { nom: 'Pellicule 400 ISO (incluses)' }
          ]
        },
        coordonnees: {
          create: [
            { lat: 47.2038, lng: -1.5644, name: 'Hangar à Bananes' },
            { lat: 47.2040, lng: -1.5646, name: 'Quai des Antilles' },
            { lat: 47.2042, lng: -1.5648, name: 'Parc des Chantiers' }
          ]
        },
        parcours: {
          create: [
            { titre: 'Départ - Hangar à Bananes', description: 'Rendez-vous devant le Hangar', duree: '30 min', distance: '0 km' },
            { titre: 'Étape 1 - Quai des Antilles', description: 'Street art et graffitis', duree: '45 min', distance: '300m' },
            { titre: 'Étape 2 - Parc des Chantiers', description: 'Architecture contemporaine', duree: '30 min', distance: '600m' }
          ]
        }
      }
    });

    console.log('✅ Balades créées avec succès :');
    console.log(`   - ${balade1.theme} (ID: ${balade1.id})`);
    console.log(`   - ${balade2.theme} (ID: ${balade2.id})`);

    // Vérifier que les données sont bien créées
    const balades = await prisma.balade.findMany({
      include: {
        consignes: true,
        materiel: true,
        coordonnees: true,
        parcours: true,
      }
    });

    console.log(`📊 Total des balades en base : ${balades.length}`);
    console.log('🎯 Base de données initialisée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
