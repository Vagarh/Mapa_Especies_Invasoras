import type { Species, SpeciesFilters, OccurrenceProperties } from '@/types/species';

export async function fetchSpecies(): Promise<Species[]> {
  const res = await fetch('/data/species_info.json');
  return res.json();
}

export async function fetchOccurrences(): Promise<GeoJSON.FeatureCollection<GeoJSON.Point, OccurrenceProperties>> {
  const res = await fetch('/data/species.geojson');
  return res.json();
}

export async function fetchDepartments(): Promise<GeoJSON.FeatureCollection> {
  const res = await fetch('/data/departments.geojson');
  return res.json();
}

export function filterSpecies(species: Species[], filters: SpeciesFilters): Species[] {
  return species.filter((s) => {
    if (filters.kingdom !== 'all' && s.kingdom !== filters.kingdom) return false;
    if (filters.habitat !== 'all' && s.habitat !== filters.habitat) return false;
    if (filters.riskLevel !== 'all' && s.riskLevel !== filters.riskLevel) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!s.commonName.toLowerCase().includes(q) && !s.scientificName.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function filterOccurrencesByYear(
  geojson: GeoJSON.FeatureCollection<GeoJSON.Point, OccurrenceProperties>,
  maxYear: number,
  activeIds: Set<string>
): GeoJSON.FeatureCollection<GeoJSON.Point, OccurrenceProperties> {
  return {
    ...geojson,
    features: geojson.features.filter(
      (f) => f.properties.year <= maxYear && activeIds.has(f.properties.speciesId)
    ),
  };
}

export function getTopDepartment(species: Species[]): string {
  const counts: Record<string, number> = {};
  species.forEach((s) => {
    s.detectedDepartments.forEach((d) => {
      counts[d] = (counts[d] || 0) + 1;
    });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
}

export function getMostExtended(species: Species[]): string {
  return [...species].sort((a, b) => b.occurrenceCount - a.occurrenceCount)[0]?.commonName ?? '—';
}
