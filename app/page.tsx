'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { Species, SpeciesFilters, OccurrenceProperties } from '@/types/species';
import { fetchSpecies, fetchOccurrences, fetchDepartments, filterSpecies } from '@/lib/speciesData';
import Header from '@/components/UI/Header';
import TimeSlider from '@/components/Timeline/TimeSlider';
import SpeciesCard from '@/components/Sidebar/SpeciesCard';

const MapView = dynamic(() => import('@/components/Map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#0f1117' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Cargando mapa…</p>
      </div>
    </div>
  ),
});

const DEFAULT_FILTERS: SpeciesFilters = {
  kingdom: 'all',
  habitat: 'all',
  riskLevel: 'all',
  year: 2024,
  search: '',
};

export default function Home() {
  const [allSpecies, setAllSpecies] = useState<Species[]>([]);
  const [occurrences, setOccurrences] = useState<GeoJSON.FeatureCollection<GeoJSON.Point, OccurrenceProperties> | null>(null);
  const [departments, setDepartments] = useState<GeoJSON.FeatureCollection | null>(null);
  const [filters, setFilters] = useState<SpeciesFilters>(DEFAULT_FILTERS);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  useEffect(() => {
    Promise.all([fetchSpecies(), fetchOccurrences(), fetchDepartments()]).then(
      ([species, occ, depts]) => {
        setAllSpecies(species);
        setOccurrences(occ);
        setDepartments(depts);
      }
    );
  }, []);

  const filteredSpecies = filterSpecies(allSpecies, filters);

  const handleYearChange = useCallback((yearOrFn: number | ((prev: number) => number)) => {
    setFilters((f) => ({
      ...f,
      year: typeof yearOrFn === 'function' ? yearOrFn(f.year) : yearOrFn,
    }));
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--background)' }}>
      <Header
        allSpecies={allSpecies}
        filteredSpecies={filteredSpecies}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden">
        <MapView
          occurrences={occurrences}
          departments={departments}
          filteredSpecies={filteredSpecies}
          filters={filters}
          selectedSpecies={selectedSpecies}
          onSelectSpecies={setSelectedSpecies}
          allSpecies={allSpecies}
        />

        {/* Species card panel */}
        <SpeciesCard species={selectedSpecies} onClose={() => setSelectedSpecies(null)} />

        {/* Legend */}
        <div
          className="absolute bottom-16 left-3 rounded-lg px-3 py-2.5 z-10 hidden sm:block"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Nivel de riesgo</p>
          <div className="space-y-1.5">
            {[
              { color: '#ef4444', label: 'Alto' },
              { color: '#f59e0b', label: 'Medio' },
              { color: '#3b82f6', label: 'Bajo' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-xs text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <TimeSlider year={filters.year} onChange={handleYearChange} />
    </div>
  );
}
