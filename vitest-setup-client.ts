import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock de fetch pour les tests
global.fetch = vi.fn();

// Mock des données de test
const mockBalades = [
  {
    id: 1,
    date: "2024-02-15",
    heure: "14:00",
    lieu: "Quartier du Bouffay",
    theme: "Architecture médiévale",
    placesDisponibles: 2,
    placesInitiales: 5,
    prix: "45€",
    description: "Découverte des façades historiques et des ruelles pittoresques",
    consignes: [
      { id: 1, texte: "Apportez des vêtements confortables et adaptés à la météo", baladeId: 1 },
      { id: 2, texte: "Chaussures de marche recommandées", baladeId: 1 }
    ],
    materiel: [
      { id: 1, nom: "Appareil photo argentique format 120", baladeId: 1 },
      { id: 2, nom: "Pellicule 400 ISO (incluses)", baladeId: 1 }
    ],
    coordonnees: [
      { id: 1, lat: 47.2138, lng: -1.5564, name: "Place du Bouffay", baladeId: 1 }
    ],
    parcours: [
      { id: 1, titre: "Départ - Place du Bouffay", description: "Rendez-vous devant la fontaine", duree: "30 min", distance: "0 km", baladeId: 1 }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    date: "2024-02-22",
    heure: "10:00",
    lieu: "Île de Nantes",
    theme: "Street Art & Contemporain",
    placesDisponibles: 5,
    placesInitiales: 5,
    prix: "45€",
    description: "Capture des œuvres d'art urbain et de l'architecture moderne",
    consignes: [
      { id: 3, texte: "Vêtements urbains et confortables", baladeId: 2 }
    ],
    materiel: [
      { id: 3, nom: "Appareil photo argentique 35mm", baladeId: 2 }
    ],
    coordonnees: [
      { id: 2, lat: 47.2038, lng: -1.5644, name: "Hangar à Bananes", baladeId: 2 }
    ],
    parcours: [
      { id: 2, titre: "Départ - Hangar à Bananes", description: "Rendez-vous devant le Hangar", duree: "30 min", distance: "0 km", baladeId: 2 }
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
