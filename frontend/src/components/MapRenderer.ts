import { Position } from 'geojson';
import mapboxgl from 'mapbox-gl';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const BLUE = '#8FB1BB';
const DARK_BLUE = '#1A85A7';
const ORANGE = '#F29D49';
const BEIGE = '#B4A88C';
const navigation = new mapboxgl.NavigationControl({ showCompass: false });

let sourceLoaded = false;

export function updateDataSources(
  reports: any,
  relationships: any,
  box: Position[],
  isSearchMode: boolean,
  map: mapboxgl.Map,
) {
  if (sourceLoaded) {
    const reportSource: mapboxgl.GeoJSONSource = map.getSource('reports') as mapboxgl.GeoJSONSource;
    const relationshipSource: mapboxgl.GeoJSONSource = map.getSource('relationships') as mapboxgl.GeoJSONSource;
    reportSource.setData({
      type: 'FeatureCollection',
      features: reports,
    });
    relationshipSource.setData({
      type: 'FeatureCollection',
      features: relationships,
    });

    const boxSource: mapboxgl.GeoJSONSource = map.getSource('box') as mapboxgl.GeoJSONSource;
    boxSource.setData({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [isSearchMode ? box : []],
      },
      properties: {
        title: 'bounding box',
      },
    });
  }
}

export function setupMapInteractions(map: mapboxgl.Map) {
  // Add zoom controls to the map.
  if (!map.hasControl(navigation)) {
    map.addControl(navigation, 'bottom-right');
  }
}

function setupDataSources(
  reports: any,
  relationships: any,
  box: Position[],
  isSearchMode: boolean,
  map: mapboxgl.Map,
) {
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
  if (isSearchMode) {
    map.addSource('box', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [box],
        },
        properties: {
          title: 'bounding box',
        },
      },
    });
  }
}

function setupLayers(map: mapboxgl.Map) {
  const reportFillLayer: mapboxgl.AnyLayer = {
    id: 'report-fill',
    type: 'fill',
    source: 'reports',
    paint: {
      'fill-color': BLUE,
      'fill-opacity': 0.6,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  const reportLineLayer: mapboxgl.AnyLayer = {
    id: 'report-boundary',
    type: 'line',
    source: 'reports',
    paint: {
      'line-color': DARK_BLUE,
      'line-width': 1,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  const relationshipFillLayer: mapboxgl.AnyLayer = {
    id: 'relationship-fill',
    type: 'circle',
    source: 'relationships',
    paint: {
      // Make circles larger as the user zooms from z12 to z22.
      'circle-radius': { base: 5, stops: [[12, 10], [22, 180]] },
      'circle-color': ORANGE,
      'circle-opacity': 1,
    },
  };

  const boxLineLayer: mapboxgl.AnyLayer = {
    id: 'box-boundary',
    type: 'line',
    source: 'box',
    paint: {
      'line-color': BEIGE,
      'line-width': 3,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  map.addLayer(reportFillLayer);
  map.addLayer(reportLineLayer);
  map.addLayer(relationshipFillLayer);
  map.addLayer(boxLineLayer);
}

export function setupMapFeatures(
  reports: any,
  relationships: any,
  box: any,
  isSearchMode: boolean,
  map: mapboxgl.Map,
) {
  if (!sourceLoaded) {
    setupDataSources(reports, relationships, box, isSearchMode, map);
    setupLayers(map);
    sourceLoaded = true;
  }
}
