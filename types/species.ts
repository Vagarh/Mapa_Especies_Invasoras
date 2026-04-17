export type Kingdom = 'Animalia' | 'Plantae' | 'Fungi';
export type Habitat = 'marino' | 'dulceacuícola' | 'terrestre' | 'marino-terrestre';
export type RiskLevel = 'alto' | 'medio' | 'bajo';

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  kingdom: Kingdom;
  class: string;
  order: string;
  family: string;
  origin: string;
  originCountry: string;
  originFlag: string;
  firstDetectedColombia: number;
  detectedDepartments: string[];
  habitat: Habitat;
  riskLevel: RiskLevel;
  impactType: string[];
  description: string;
  imageUrl: string;
  gbifUrl?: string;
  sibUrl?: string;
  occurrenceCount: number;
}

export interface SpeciesFilters {
  kingdom: Kingdom | 'all';
  habitat: Habitat | 'all';
  riskLevel: RiskLevel | 'all';
  year: number;
  search: string;
}

export interface OccurrenceProperties {
  speciesId: string;
  commonName: string;
  scientificName: string;
  year: number;
  department: string;
  locality?: string;
  kingdom: Kingdom;
  habitat: Habitat;
  riskLevel: RiskLevel;
}
