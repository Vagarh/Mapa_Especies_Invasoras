'use client';

import type { RiskLevel } from '@/types/species';

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  alto: { label: 'Alto riesgo', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  medio: { label: 'Riesgo medio', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  bajo: { label: 'Bajo riesgo', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
};

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const { label, className } = riskConfig[level];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${className} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {label}
    </span>
  );
}

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'purple';
}

export function Tag({ children, variant = 'default' }: TagProps) {
  const variants = {
    default: 'bg-white/5 text-slate-300 border-white/10',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    purple: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
