
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
    id: '10',
    nom: 'Canon F-1',
    marque: 'Canon',
    modele: 'F-1',
    categorie: 'SLR',
    annee: 1971,
    description: 'Le premier SLR professionnel de Canon, conçu pour les photographes professionnels. Une construction robuste et des performances exceptionnelles.',
    caracteristiques: [
      'Format 35mm',
      'Monture FD',
      'Entièrement mécanique',
      'Mise au point manuelle',
      'Construction professionnelle',
      'Vitesses de 1s à 1/2000s'
    ],
    image: '/flotte/SLR/canon-f1.jpg',
    statut: 'disponible',
    prixLocation: 55
  },
  {
    id: '11',
    nom: 'Zorki 4',
    marque: 'Zorki',
    modele: '4',
    categorie: 'SLR',
    annee: 1956,
    description: 'Un SLR soviétique robuste et fiable, inspiré du Leica. Parfait pour découvrir la photographie argentique avec un budget accessible.',
    caracteristiques: [
      'Format 35mm',
      'Monture M39',
      'Entièrement mécanique',
      'Mise au point manuelle',
      'Construction soviétique robuste',
      'Vitesses de 1s à 1/1000s'
    ],
    image: '/flotte/SLR/zorki-4.jpg',
    statut: 'disponible',
    prixLocation: 30
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
    id: '12',
    nom: 'Voigtländer Bessa',
    marque: 'Voigtländer',
    modele: 'Bessa',
    categorie: 'Folding',
    annee: 1939,
    description: 'Un folding Voigtländer des années 30, élégant et compact. Parfait pour la photographie de voyage avec son design pliable.',
    caracteristiques: [
      'Format 6x9 cm',
      'Objectif Skopar 105mm f/4.5',
      'Pliage ultra-compact',
      'Mise au point par estimation',
      'Pellicule 120',
      'Design art déco'
    ],
    image: '/flotte/Folding/voigtlander-bessa-1939.webp',
    statut: 'disponible',
    prixLocation: 45
  },
  {
    id: '13',
    nom: 'AGFA Record III',
    marque: 'AGFA',
    modele: 'Record III',
    categorie: 'Folding',
    annee: 1950,
    description: 'Un folding AGFA robuste et fiable des années 50. Excellent rapport qualité-prix pour découvrir le format moyen.',
    caracteristiques: [
      'Format 6x9 cm',
      'Objectif Solinar 75mm f/3.5',
      'Pliage compact',
      'Mise au point par estimation',
      'Pellicule 120',
      'Construction allemande'
    ],
    image: '/flotte/Folding/agfa-record-3.png',
    statut: 'disponible',
    prixLocation: 40
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
