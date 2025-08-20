import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock global de fetch
global.fetch = vi.fn();

// Mock des stores Svelte avec des données de test
const mockBaladesStore = {
  subscribe: vi.fn((callback) => {
    // Simuler des données de test
    const mockBalades = [
      {
        id: 1,
        date: '2024-01-15',
        heure: '14:00',
        lieu: 'Quartier du Bouffay',
        theme: 'Architecture médiévale',
        placesDisponibles: 3,
        placesInitiales: 5,
        prix: '45€',
        description: 'Découverte des façades historiques et des ruelles pittoresques',
        consignes: [
          { id: 1, texte: 'Apportez des vêtements confortables et adaptés à la météo' },
          { id: 2, texte: 'Chaussures de marche recommandées' }
        ],
        materiel: [
          { id: 1, nom: 'Appareil photo argentique format 120' },
          { id: 2, nom: 'Pellicule 400 ISO (incluses)' }
        ],
        coordonnees: [
          { id: 1, lat: 47.2138, lng: -1.5564, name: 'Place du Bouffay' },
          { id: 2, lat: 47.2140, lng: -1.5566, name: 'Rue Kervégan' },
          { id: 3, lat: 47.2142, lng: -1.5568, name: 'Place Saint-Pierre' },
          { id: 4, lat: 47.2144, lng: -1.5570, name: 'Rue de la Fosse' },
          { id: 5, lat: 47.2146, lng: -1.5572, name: 'Quai de la Fosse' }
        ],
        parcours: [
          { id: 1, titre: 'Départ - Place du Bouffay', description: 'Rendez-vous devant la fontaine', duree: '30 min', distance: '0 km' },
          { id: 2, titre: 'Étape 1 - Rue Kervégan', description: 'Découverte des façades médiévales', duree: '45 min', distance: '200m' },
          { id: 3, titre: 'Étape 2 - Place Saint-Pierre', description: 'Photographie de l\'église', duree: '30 min', distance: '400m' },
          { id: 4, titre: 'Étape 3 - Rue de la Fosse', description: 'Portraits de rue', duree: '45 min', distance: '600m' },
          { id: 5, titre: 'Arrivée - Quai de la Fosse', description: 'Vue sur la Loire', duree: '30 min', distance: '800m' }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    callback(mockBalades);
    return { unsubscribe: vi.fn() };
  }),
  set: vi.fn(),
  update: vi.fn()
};

// Mock des stores Svelte
vi.mock('svelte/store', () => ({
  writable: vi.fn(() => mockBaladesStore),
  readable: vi.fn(() => ({
    subscribe: vi.fn()
  })),
  derived: vi.fn(() => ({
    subscribe: vi.fn()
  }))
}));

// Mock des modules SvelteKit
vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn((callback) => {
      callback({ url: { searchParams: { get: () => '1' } } });
      return { unsubscribe: vi.fn() };
    })
  },
  navigating: {
    subscribe: vi.fn()
  },
  updated: {
    subscribe: vi.fn()
  }
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn(),
  preloadData: vi.fn()
}));

// Mock des services Prisma côté client
vi.mock('$lib/services/baladesPrismaService', () => ({
  baladesPrismaService: {
    getBalades: vi.fn(),
    getBaladeById: vi.fn(),
    reserverPlaces: vi.fn(),
    creerReservation: vi.fn()
  }
}));

// Mock des services client avec des données de test
vi.mock('$lib/services/baladesClientService', () => ({
  baladesClientService: {
    getBalades: vi.fn().mockResolvedValue([
      {
        id: 1,
        date: '2024-01-15',
        heure: '14:00',
        lieu: 'Quartier du Bouffay',
        theme: 'Architecture médiévale',
        placesDisponibles: 3,
        placesInitiales: 5,
        prix: '45€',
        description: 'Découverte des façades historiques et des ruelles pittoresques',
        consignes: [
          { id: 1, texte: 'Apportez des vêtements confortables et adaptés à la météo' },
          { id: 2, texte: 'Chaussures de marche recommandées' }
        ],
        materiel: [
          { id: 1, nom: 'Appareil photo argentique format 120' },
          { id: 2, nom: 'Pellicule 400 ISO (incluses)' }
        ],
        coordonnees: [
          { id: 1, lat: 47.2138, lng: -1.5564, name: 'Place du Bouffay' },
          { id: 2, lat: 47.2140, lng: -1.5566, name: 'Rue Kervégan' },
          { id: 3, lat: 47.2142, lng: -1.5568, name: 'Place Saint-Pierre' },
          { id: 4, lat: 47.2144, lng: -1.5570, name: 'Rue de la Fosse' },
          { id: 5, lat: 47.2146, lng: -1.5572, name: 'Quai de la Fosse' }
        ],
        parcours: [
          { id: 1, titre: 'Départ - Place du Bouffay', description: 'Rendez-vous devant la fontaine', duree: '30 min', distance: '0 km' },
          { id: 2, titre: 'Étape 1 - Rue Kervégan', description: 'Découverte des façades médiévales', duree: '45 min', distance: '200m' },
          { id: 3, titre: 'Étape 2 - Place Saint-Pierre', description: 'Photographie de l\'église', duree: '30 min', distance: '400m' },
          { id: 4, titre: 'Étape 3 - Rue de la Fosse', description: 'Portraits de rue', duree: '45 min', distance: '600m' },
          { id: 5, titre: 'Arrivée - Quai de la Fosse', description: 'Vue sur la Loire', duree: '30 min', distance: '800m' }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),
    reserverPlaces: vi.fn().mockResolvedValue(true),
    isBaladeComplete: vi.fn().mockReturnValue(false),
    getBaladeStatus: vi.fn().mockReturnValue('disponible')
  },
  baladesStore: mockBaladesStore
}));

// Mock des données de test
export const mockBalades = [
  {
    id: 1,
    date: '2024-01-15',
    heure: '14:00',
    lieu: 'Quartier du Bouffay',
    theme: 'Architecture médiévale',
    placesDisponibles: 3,
    placesInitiales: 5,
    prix: '45€',
    description: 'Découverte des façades historiques et des ruelles pittoresques',
    consignes: [
      { id: 1, texte: 'Apportez des vêtements confortables et adaptés à la météo' },
      { id: 2, texte: 'Chaussures de marche recommandées' }
    ],
    materiel: [
      { id: 1, nom: 'Appareil photo argentique format 120' },
      { id: 2, nom: 'Pellicule 400 ISO (incluses)' }
    ],
    coordonnees: [
      { id: 1, lat: 47.2138, lng: -1.5564, name: 'Place du Bouffay' },
      { id: 2, lat: 47.2140, lng: -1.5566, name: 'Rue Kervégan' },
      { id: 3, lat: 47.2142, lng: -1.5568, name: 'Place Saint-Pierre' },
      { id: 4, lat: 47.2144, lng: -1.5570, name: 'Rue de la Fosse' },
      { id: 5, lat: 47.2146, lng: -1.5572, name: 'Quai de la Fosse' }
    ],
    parcours: [
      { id: 1, titre: 'Départ - Place du Bouffay', description: 'Rendez-vous devant la fontaine', duree: '30 min', distance: '0 km' },
      { id: 2, titre: 'Étape 1 - Rue Kervégan', description: 'Découverte des façades médiévales', duree: '45 min', distance: '200m' },
      { id: 3, titre: 'Étape 2 - Place Saint-Pierre', description: 'Photographie de l\'église', duree: '30 min', distance: '400m' },
      { id: 4, titre: 'Étape 3 - Rue de la Fosse', description: 'Portraits de rue', duree: '45 min', distance: '600m' },
      { id: 5, titre: 'Arrivée - Quai de la Fosse', description: 'Vue sur la Loire', duree: '30 min', distance: '800m' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock de l'API /api/balades
vi.mocked(fetch).mockImplementation((input: string | URL | Request) => {
  const url = input.toString();
  
  if (url === '/api/balades') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, balades: mockBalades })
    } as Response);
  }
  
  if (url === '/api/balades/update-places') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, balades: mockBalades })
    } as Response);
  }
  
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' })
  } as Response);
});

// Mock de window.open
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true
});

// Mock de window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: vi.fn(),
    replace: vi.fn()
  },
  writable: true
});

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// add more mocks here if you need them
