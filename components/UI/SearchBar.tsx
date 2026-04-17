'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar especie…' }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search size={14} className="absolute left-3 text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-8 py-2 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
        style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 text-slate-500 hover:text-white transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
