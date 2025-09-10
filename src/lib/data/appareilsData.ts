
export interface AppareilPhoto {
  id: string;
  nom: string;
  marque: string;
  modele: string;
  categorie: 'TLR' | 'SLR' | 'Folding' | 'Rangefinder' | 'Point & Shoot';
  annee: number;
  description: string;
  caracteristiques: string[];
  image: string;
  statut: 'disponible' | 'maintenance' | 'reserve';
  prixLocation?: number;
}

export const appareilsPhotos: AppareilPhoto[] = [
  {
    id: '1',
    nom: 'Rolleiflex 2.8F',
    marque: 'Rollei',
    modele: '2.8F',
    categorie: 'TLR',
    annee: 1960,
    description: 'Le mythique Rolleiflex 2.8F, un appareil TLR de légende avec son objectif Carl Zeiss Planar 80mm f/2.8. Parfait pour la photographie de rue et les portraits.',
    caracteristiques: [
      'Format 6x6 cm',
      'Objectif Carl Zeiss Planar 80mm f/2.8',
      'Visée reflex à deux objectifs',
      'Mise au point manuelle',
      'Vitesses de 1s à 1/500s'
    ],
    image: '/flotte/TLR/rolleiflex-2.8f.jpg',
    statut: 'disponible',
    prixLocation: 45
  },
  {
    id: '2',
    nom: 'Rolleicord V',
    marque: 'Rollei',
    modele: 'Rolleicord V',
    categorie: 'TLR',
    annee: 1955,
    description: 'Un TLR plus accessible que le Rolleiflex, mais avec la même qualité de construction allemande. Parfait pour découvrir le format carré.',
    caracteristiques: [
      'Format 6x6 cm',
      'Objectif Triotar 75mm f/3.5',
      'Visée reflex à deux objectifs',
      'Mise au point manuelle',
      'Vitesses de 1s à 1/300s'
    ],
    image: '/flotte/TLR/rolleicord-v.jpg',
    statut: 'disponible',
    prixLocation: 40
  },
  {
    id: '3',
    nom: 'Lubitel 2',
    marque: 'LOMO',
    modele: 'Lubitel 2',
    categorie: 'TLR',
    annee: 1955,
    description: 'Un TLR soviétique iconique, simple et robuste. Parfait pour découvrir la photographie argentique avec un budget serré. Sa construction en bakélite lui donne un charme unique.',
    caracteristiques: [
      'Format 6x6 cm',
      'Objectif Triplet 75mm f/4.5',
      'Visée reflex à deux objectifs',
      'Mise au point manuelle',
      'Vitesses de 1/30s à 1/250s + B',
      'Construction en bakélite'
    ],
    image: '/flotte/TLR/lubitel-2.jpg',
    statut: 'disponible',
    prixLocation: 25
  },
  {
    id: '4',
    nom: 'Yashica Mat 124G',
    marque: 'Yashica',
    modele: 'Mat 124G',
    categorie: 'TLR',
    annee: 1970,
    description: 'Un TLR abordable mais de qualité, idéal pour découvrir le format carré. Excellent rapport qualité-prix.',
    caracteristiques: [
      'Format 6x6 cm',
      'Objectif Yashinon 80mm f/3.5',
      'Visée reflex à deux objectifs',
      'Mise au point manuelle',
      'Pellicule 120'
    ],
    image: '/flotte/TLR/yashica-mat-124g.jpg',
    statut: 'disponible',
    prixLocation: 35
  },
  {
    id: '5',
    nom: 'Canon AE-1',
    marque: 'Canon',
    modele: 'AE-1',
    categorie: 'SLR',
    annee: 1976,
    description: 'Le premier SLR électronique de Canon, révolutionnaire à son époque. Parfait pour apprendre la photographie argentique.',
    caracteristiques: [
      'Format 35mm',
      'Monture FD',
      'Priorité à l\'ouverture',
      'Mise au point manuelle',
      'Vitesses de 2s à 1/1000s'
    ],
    image: '/flotte/SLR/canon-ae1.jpg',
    statut: 'disponible',
    prixLocation: 40
  },
  {
    id: '6',
    nom: 'Pentax K1000',
    marque: 'Pentax',
    modele: 'K1000',
    categorie: 'SLR',
    annee: 1976,
    description: 'Le SLR le plus simple et fiable jamais conçu. Idéal pour les débutants en photographie argentique.',
    caracteristiques: [
      'Format 35mm',
      'Monture K',
      'Entièrement manuel',
      'Mise au point manuelle',
      'Construction robuste'
    ],
    image: '/flotte/SLR/pentax-k1000.jpg',
    statut: 'disponible',
    prixLocation: 35
  },
  {
    id: '7',
    nom: 'Zeiss Ikon Super Ikonta',
    marque: 'Zeiss Ikon',
    modele: 'Super Ikonta 531/2',
    categorie: 'Folding',
    annee: 1938,
    description: 'Un folding de luxe des années 30, avec son système de pliage ingénieux. Un bijou de mécanique allemande.',
    caracteristiques: [
      'Format 6x6 cm',
      'Objectif Tessar 80mm f/3.5',
      'Pliage compact',
      'Mise au point par estimation',
      'Pellicule 120'
    ],
    image: '/flotte/Folding/zeiss-super-ikonta.jpg',
    statut: 'disponible',
    prixLocation: 50
  },
  {
    id: '8',
    nom: 'Voigtländer Bessa R2A',
    marque: 'Voigtländer',
    modele: 'Bessa R2A',
    categorie: 'Rangefinder',
    annee: 2004,
    description: 'Un rangefinder moderne avec télémètre intégré. Parfait pour la photographie de rue discrète.',
    caracteristiques: [
      'Format 35mm',
      'Monture M',
      'Télémètre intégré',
      'Mise au point par coïncidence',
      'Vitesses de 1s à 1/2000s'
    ],
    image: '/flotte/Rangefinder/voigtlander-bessa-r2a.jpg',
    statut: 'disponible',
    prixLocation: 45
  },
  {
    id: '9',
    nom: 'Olympus XA',
    marque: 'Olympus',
    modele: 'XA',
    categorie: 'Point & Shoot',
    annee: 1979,
    description: 'Le plus petit appareil 35mm au monde à son époque. Parfait pour la photographie de rue discrète.',
    caracteristiques: [
      'Format 35mm',
      'Objectif 35mm f/2.8',
      'Télémètre intégré',
      'Mise au point manuelle',
      'Très compact'
    ],
    image: '/flotte/Point-Shoot/olympus-xa.jpg',
    statut: 'disponible',
    prixLocation: 30
  }
];

export function getAppareilsByCategorie(): { [categorie: string]: AppareilPhoto[] } {
  const appareilsParCategorie: { [categorie: string]: AppareilPhoto[] } = {};
  
  appareilsPhotos.forEach(appareil => {
    if (!appareilsParCategorie[appareil.categorie]) {
      appareilsParCategorie[appareil.categorie] = [];
    }
    appareilsParCategorie[appareil.categorie].push(appareil);
  });
  
  return appareilsParCategorie;
}

export function getAppareilById(id: string): AppareilPhoto | undefined {
  return appareilsPhotos.find(appareil => appareil.id === id);
}

export function getAppareilsDisponibles(): AppareilPhoto[] {
  return appareilsPhotos.filter(appareil => appareil.statut === 'disponible');
}
