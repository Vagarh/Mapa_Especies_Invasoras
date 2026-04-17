'use client';

import type { SpeciesFilters, Kingdom, Habitat, RiskLevel } from '@/types/species';

interface FilterPanelProps {
  filters: SpeciesFilters;
  onChange: (filters: SpeciesFilters) => void;
}

type FilterOption<T extends string> = { value: T | 'all'; label: string };

const kingdomOptions: FilterOption<Kingdom>[] = [
  { value: 'all', label: 'Todos' },
  { value: 'Animalia', label: 'Animal' },
  { value: 'Plantae', label: 'Vegetal' },
  { value: 'Fungi', label: 'Hongo' },
];

const habitatOptions: FilterOption<Habitat>[] = [
  { value: 'all', label: 'Todos' },
  { value: 'marino', label: 'Marino' },
  { value: 'dulceacuícola', label: 'Dulceacuícola' },
  { value: 'terrestre', label: 'Terrestre' },
  { value: 'marino-terrestre', label: 'Mixto' },
];

const riskOptions: FilterOption<RiskLevel>[] = [
  { value: 'all', label: 'Todos' },
  { value: 'alto', label: 'Alto' },
  { value: 'medio', label: 'Medio' },
  { value: 'bajo', label: 'Bajo' },
];

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption<T>[];
  value: T | 'all';
  onChange: (v: T | 'all') => void;
}) {
  return (
    <div>
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1.5">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
              value === opt.value
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <FilterGroup
        label="Reino"
        options={kingdomOptions}
        value={filters.kingdom}
        onChange={(v) => onChange({ ...filters, kingdom: v as Kingdom | 'all' })}
      />
      <FilterGroup
        label="Hábitat"
        options={habitatOptions}
        value={filters.habitat}
        onChange={(v) => onChange({ ...filters, habitat: v as Habitat | 'all' })}
      />
      <FilterGroup
        label="Riesgo"
        options={riskOptions}
        value={filters.riskLevel}
        onChange={(v) => onChange({ ...filters, riskLevel: v as RiskLevel | 'all' })}
      />
    </div>
  );
}
