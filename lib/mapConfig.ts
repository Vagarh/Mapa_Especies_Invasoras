export const MAP_CONFIG = {
  center: [-74.3, 4.5] as [number, number],
  zoom: 5.2,
  minZoom: 4,
  maxZoom: 14,
  style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
  bounds: [[-82, -5], [-66, 14]] as [[number, number], [number, number]],
};

export const RISK_COLORS: Record<string, string> = {
  alto: '#ef4444',
  medio: '#f59e0b',
  bajo: '#3b82f6',
};

export const KINGDOM_COLORS: Record<string, string> = {
  Animalia: '#10b981',
  Plantae: '#84cc16',
  Fungi: '#a78bfa',
};

export const DEPARTMENT_HEAT_COLORS = [
  '#1e3a5f',
  '#1e4d6b',
  '#1a6578',
  '#0f7a72',
  '#10b981',
];
