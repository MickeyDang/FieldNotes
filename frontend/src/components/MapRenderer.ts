import mapboxgl from 'mapbox-gl';

const BLUE = '#8FB1BB';
const DARK_BLUE = '#1A85A7';
const ORANGE = '#F29D49';

export function setupDataSources(reports: any, relationships: any, map: mapboxgl.Map) {
  map.addSource('reports', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: reports,
    },
  });
  map.addSource('relationships', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: relationships,
    },
  });
}

export function setupMapInteractions(map: mapboxgl.Map) {
  // Add zoom controls to the map.
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
}

export function setupLayers(map: mapboxgl.Map) {
  const reportFillLayer:mapboxgl.AnyLayer = {
    id: 'report-fill',
    type: 'fill',
    source: 'reports',
    paint: {
      'fill-color': BLUE,
      'fill-opacity': 0.6,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  const reportLineLayer:mapboxgl.AnyLayer = {
    id: 'report-boundary',
    type: 'line',
    source: 'reports',
    paint: {
      'line-color': DARK_BLUE,
      'line-width': 1,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  const relationshipFillLayer:mapboxgl.AnyLayer = {
    id: 'relationship-fill',
    type: 'circle',
    source: 'relationships',
    paint: {
      // Make circles larger as the user zooms from z12 to z22.
      'circle-radius': { base: 1, stops: [[12, 2], [22, 180]] },
      'circle-color': ORANGE,
      'circle-opacity': 1,
    },
  };

  map.addLayer(reportFillLayer);
  map.addLayer(reportLineLayer);
  map.addLayer(relationshipFillLayer);
}
