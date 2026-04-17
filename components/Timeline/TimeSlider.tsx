'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface TimeSliderProps {
  year: number;
  onChange: (year: number | ((prev: number) => number)) => void;
  min?: number;
  max?: number;
}

export default function TimeSlider({ year, onChange, min = 1900, max = 2024 }: TimeSliderProps) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        onChange((prev) => {
          if (prev >= max) {
            setPlaying(false);
            return max;
          }
          return prev + 1;
        });
      }, 120);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, max, onChange]);

  const pct = ((year - min) / (max - min)) * 100;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
    >
      <button
        onClick={() => setPlaying((p) => !p)}
        className="flex-shrink-0 p-1.5 rounded-full text-emerald-400 hover:bg-emerald-500/10 transition-colors"
        aria-label={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs text-slate-500 flex-shrink-0 w-10 text-right">{min}</span>
        <div className="relative flex-1 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${pct}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={year}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-xs text-slate-500 flex-shrink-0 w-10">{max}</span>
      </div>

      <div
        className="flex-shrink-0 px-3 py-1 rounded-md text-sm font-bold text-emerald-400"
        style={{ background: 'var(--background)', minWidth: '4.5rem', textAlign: 'center' }}
      >
        {year}
      </div>
    </div>
  );
}
