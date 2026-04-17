'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Globe, ExternalLink, Leaf, Waves, TreePine } from 'lucide-react';
import type { Species } from '@/types/species';
import { RiskBadge, Tag } from '@/components/UI/Badge';

interface SpeciesCardProps {
  species: Species | null;
  onClose: () => void;
}

const habitatIcons: Record<string, React.ReactNode> = {
  marino: <Waves size={14} />,
  dulceacuícola: <Waves size={14} />,
  terrestre: <TreePine size={14} />,
  'marino-terrestre': <Globe size={14} />,
};

const habitatLabels: Record<string, string> = {
  marino: 'Marino',
  dulceacuícola: 'Dulceacuícola',
  terrestre: 'Terrestre',
  'marino-terrestre': 'Marino-Terrestre',
};

const impactLabels: Record<string, string> = {
  ecológico: 'Ecológico',
  económico: 'Económico',
  'salud pública': 'Salud Pública',
};

export default function SpeciesCard({ species, onClose }: SpeciesCardProps) {
  return (
    <AnimatePresence>
      {species && (
        <motion.aside
          key={species.id}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="absolute top-0 right-0 h-full w-96 max-w-full z-20 flex flex-col overflow-hidden"
          style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
        >
          {/* Species image */}
          <div className="relative h-52 flex-shrink-0 overflow-hidden bg-slate-900">
            {species.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={species.imageUrl}
                alt={species.commonName}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf size={48} className="text-emerald-500/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Header */}
            <div>
              <h2 className="text-xl font-semibold text-white leading-tight">{species.commonName}</h2>
              <p className="text-sm italic text-emerald-400 mt-0.5">{species.scientificName}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <RiskBadge level={species.riskLevel} />
                <Tag variant="green">
                  <span className="flex items-center gap-1">
                    {habitatIcons[species.habitat]}
                    {habitatLabels[species.habitat]}
                  </span>
                </Tag>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ background: 'var(--background)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Globe size={12} className="text-emerald-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Origen</span>
                </div>
                <p className="text-sm text-white font-medium">
                  {species.originFlag} {species.origin}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'var(--background)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar size={12} className="text-emerald-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">1ª detección</span>
                </div>
                <p className="text-sm text-white font-medium">{species.firstDetectedColombia}</p>
              </div>
              <div className="rounded-lg p-3 col-span-2" style={{ background: 'var(--background)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Taxonomía</span>
                </div>
                <p className="text-xs text-slate-300">
                  {species.kingdom} · {species.class} · {species.family}
                </p>
              </div>
            </div>

            {/* Departments */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin size={13} className="text-emerald-400" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Departamentos afectados
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {species.detectedDepartments.map((dep) => (
                  <Tag key={dep}>{dep}</Tag>
                ))}
              </div>
            </div>

            {/* Impact */}
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Impactos</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {species.impactType.map((impact) => (
                  <Tag key={impact} variant="purple">{impactLabels[impact] ?? impact}</Tag>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-slate-300 leading-relaxed">{species.description}</p>
            </div>

            {/* Occurrence count */}
            <div className="rounded-lg p-3 flex items-center justify-between" style={{ background: 'var(--background)' }}>
              <span className="text-xs text-slate-400">Registros GBIF</span>
              <span className="text-sm font-semibold text-emerald-400">
                {species.occurrenceCount.toLocaleString()}
              </span>
            </div>

            {/* Links */}
            <div className="flex gap-2 pb-2">
              {species.gbifUrl && (
                <a
                  href={species.gbifUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
                >
                  <ExternalLink size={12} />
                  GBIF
                </a>
              )}
              {species.sibUrl && (
                <a
                  href={species.sibUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 transition-colors"
                >
                  <ExternalLink size={12} />
                  SiB Colombia
                </a>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
