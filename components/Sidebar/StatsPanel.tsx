'use client';

import { Leaf, MapPin, TrendingUp } from 'lucide-react';
import type { Species } from '@/types/species';
import { getTopDepartment, getMostExtended } from '@/lib/speciesData';

interface StatsPanelProps {
  allSpecies: Species[];
  filteredSpecies: Species[];
}

export default function StatsPanel({ allSpecies, filteredSpecies }: StatsPanelProps) {
  const topDept = getTopDepartment(allSpecies);
  const mostExtended = getMostExtended(allSpecies);

  return (
    <div className="flex items-center gap-4">
      <Stat
        icon={<Leaf size={14} className="text-emerald-400" />}
        label="Especies"
        value={`${filteredSpecies.length} / ${allSpecies.length}`}
      />
      <div className="hidden sm:block w-px h-6" style={{ background: 'var(--border)' }} />
      <Stat
        icon={<MapPin size={14} className="text-amber-400" />}
        label="Depto. más afectado"
        value={topDept}
        className="hidden sm:flex"
      />
      <div className="hidden md:block w-px h-6" style={{ background: 'var(--border)' }} />
      <Stat
        icon={<TrendingUp size={14} className="text-blue-400" />}
        label="Más extendida"
        value={mostExtended}
        className="hidden md:flex"
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  className = 'flex',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`items-center gap-2 ${className}`}>
      {icon}
      <div>
        <p className="text-xs text-slate-500 leading-none">{label}</p>
        <p className="text-sm font-semibold text-white mt-0.5 truncate max-w-32">{value}</p>
      </div>
    </div>
  );
}
