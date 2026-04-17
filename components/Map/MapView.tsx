'use client';

import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Species, OccurrenceProperties, SpeciesFilters } from '@/types/species';
import { MAP_CONFIG, RISK_COLORS } from '@/lib/mapConfig';
import { filterOccurrencesByYear } from '@/lib/speciesData';

interface MapViewProps {
  occurrences: GeoJSON.FeatureCollection<GeoJSON.Point, OccurrenceProperties> | null;
  departments: GeoJSON.FeatureCollection | null;
  filteredSpecies: Species[];
  filters: SpeciesFilters;
  selectedSpecies: Species | null;
  onSelectSpecies: (species: Species | null) => void;
  allSpecies: Species[];
}

export default function MapView({
  occurrences,
  departments,
  filteredSpecies,
  filters,
  selectedSpecies,
  onSelectSpecies,
  allSpecies,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popup = useRef<maplibregl.Popup | null>(null);

  // Init map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_CONFIG.style,
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.zoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    map.current.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    popup.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add sources and layers when data loads
  useEffect(() => {
    if (!map.current || !departments || !occurrences) return;

    const addLayers = () => {
      if (!map.current) return;

      // Departments source
      if (!map.current.getSource('departments')) {
        map.current.addSource('departments', { type: 'geojson', data: departments });
        map.current.addLayer({
          id: 'departments-fill',
          type: 'fill',
          source: 'departments',
          paint: {
            'fill-color': [
              'interpolate', ['linear'],
              ['get', 'speciesCount'],
              0, '#1e293b',
              5, '#1e4d6b',
              8, '#0f7a72',
              12, '#10b981',
              14, '#34d399',
            ],
            'fill-opacity': 0.45,
          },
        });
        map.current.addLayer({
          id: 'departments-outline',
          type: 'line',
          source: 'departments',
          paint: {
            'line-color': '#2d3348',
            'line-width': 1,
          },
        });
      }

      // Occurrences source
      if (!map.current.getSource('occurrences')) {
        map.current.addSource('occurrences', {
          type: 'geojson',
          data: occurrences,
          cluster: true,
          clusterMaxZoom: 9,
          clusterRadius: 40,
        });

        // Cluster circles
        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'occurrences',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step', ['get', 'point_count'],
              '#10b981', 5,
              '#f59e0b', 15,
              '#ef4444',
            ],
            'circle-radius': ['step', ['get', 'point_count'], 18, 5, 24, 15, 30],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#0f1117',
            'circle-opacity': 0.9,
          },
        });

        // Cluster count labels
        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'occurrences',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 12,
            'text-font': ['Noto Sans Regular'],
          },
          paint: { 'text-color': '#0f1117' },
        });

        // Individual points
        map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'occurrences',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': [
              'match', ['get', 'riskLevel'],
              'alto', '#ef4444',
              'medio', '#f59e0b',
              'bajo', '#3b82f6',
              '#10b981',
            ],
            'circle-radius': 7,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#0f1117',
            'circle-opacity': 0.9,
          },
        });
      }

      // Hover popup on unclustered points
      map.current.on('mouseenter', 'unclustered-point', (e) => {
        if (!map.current || !popup.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties as OccurrenceProperties;
        const coords = (feature.geometry as GeoJSON.Point).coordinates.slice();
        popup.current
          .setLngLat([coords[0], coords[1]])
          .setHTML(`
            <div style="line-height:1.4">
              <strong style="color:#10b981">${props.commonName}</strong><br/>
              <em style="color:#8892a4;font-size:11px">${props.scientificName}</em><br/>
              <span style="color:#e2e8f0;font-size:12px">${props.department} · ${props.year}</span>
            </div>
          `)
          .addTo(map.current);
      });

      map.current.on('mouseleave', 'unclustered-point', () => {
        if (!map.current || !popup.current) return;
        map.current.getCanvas().style.cursor = '';
        popup.current.remove();
      });

      // Click on point → select species
      map.current.on('click', 'unclustered-point', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties as OccurrenceProperties;
        const found = allSpecies.find((s) => s.id === props.speciesId);
        if (found) onSelectSpecies(found);
      });

      // Click on cluster → zoom in
      map.current.on('click', 'clusters', (e) => {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties.cluster_id;
        const source = map.current.getSource('occurrences') as maplibregl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId).then((zoom) => {
          if (!map.current) return;
          const coords = (features[0].geometry as GeoJSON.Point).coordinates;
          map.current.easeTo({ center: [coords[0], coords[1]], zoom: zoom ?? 10 });
        });
      });

      map.current.on('mouseenter', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    };

    if (map.current.isStyleLoaded()) {
      addLayers();
    } else {
      map.current.on('load', addLayers);
    }
  }, [departments, occurrences, allSpecies, onSelectSpecies]);

  // Update occurrences when filters/year change
  useEffect(() => {
    if (!map.current || !occurrences) return;
    const source = map.current.getSource('occurrences') as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    const activeIds = new Set(filteredSpecies.map((s) => s.id));
    const filtered = filterOccurrencesByYear(occurrences, filters.year, activeIds);
    source.setData(filtered);
  }, [occurrences, filteredSpecies, filters.year]);

  // Fly to selected species
  useEffect(() => {
    if (!map.current || !selectedSpecies || !occurrences) return;
    const pts = occurrences.features.filter((f) => f.properties.speciesId === selectedSpecies.id);
    if (!pts.length) return;
    const lngs = pts.map((f) => f.geometry.coordinates[0]);
    const lats = pts.map((f) => f.geometry.coordinates[1]);
    const cx = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    const cy = (Math.min(...lats) + Math.max(...lats)) / 2;
    map.current.flyTo({ center: [cx, cy], zoom: 7, duration: 1200 });
  }, [selectedSpecies, occurrences]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}
