'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Species, SpeciesFilters } from '@/types/species';
import SearchBar from './SearchBar';
import FilterPanel from '@/components/Sidebar/FilterPanel';
import StatsPanel from '@/components/Sidebar/StatsPanel';

interface HeaderProps {
  allSpecies: Species[];
  filteredSpecies: Species[];
  filters: SpeciesFilters;
  onFiltersChange: (f: SpeciesFilters) => void;
}

export default function Header({ allSpecies, filteredSpecies, filters, onFiltersChange }: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <header className="relative z-30 flex-shrink-0" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl">🌿</span>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-white leading-none">Especies Invasoras</h1>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Colombia</p>
          </div>
        </div>

        <div className="w-px h-6 flex-shrink-0" style={{ background: 'var(--border)' }} />

        {/* Search */}
        <div className="flex-1 min-w-0 max-w-xs">
          <SearchBar
            value={filters.search}
            onChange={(v) => onFiltersChange({ ...filters, search: v })}
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((p) => !p)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
            showFilters
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'text-slate-400 border-white/10 hover:bg-white/5'
          }`}
        >
          {showFilters ? <X size={14} /> : <SlidersHorizontal size={14} />}
          <span className="hidden sm:inline">Filtros</span>
        </button>

        <div className="w-px h-6 flex-shrink-0 hidden sm:block" style={{ background: 'var(--border)' }} />

        {/* Stats */}
        <StatsPanel allSpecies={allSpecies} filteredSpecies={filteredSpecies} />
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <FilterPanel filters={filters} onChange={onFiltersChange} />
        </div>
      )}
    </header>
  );
}
