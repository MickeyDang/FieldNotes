import mapboxgl from 'mapbox-gl';

const SEARCH_ITEM_COLOUR = '#1A85A7'; // teal
const SELECTED_ITEM_COLOUR = '#E28D38'; // orange
// const LIGHT_BEIGE = '#D7CFBE';

export const selReportFillLayer: mapboxgl.AnyLayer = {
  id: 'sel-report-fill',
  type: 'fill',
  source: 'selected-reports',
  paint: {
    'fill-color': SELECTED_ITEM_COLOUR,
    'fill-opacity': 0.1,
  },
  filter: ['==', '$type', 'Polygon'],
};

export const selReportLineLayer: mapboxgl.AnyLayer = {
  id: 'sel-report-boundary',
  type: 'line',
  source: 'selected-reports',
  paint: {
    'line-color': SELECTED_ITEM_COLOUR,
    'line-width': 1,
  },
  filter: ['==', '$type', 'Polygon'],
};

export const selRelationshipFillLayer: mapboxgl.AnyLayer = {
  id: 'sel-relationship-fill',
  type: 'circle',
  source: 'selected-relationships',
  paint: {
    // Make circles larger as the user zooms from z12 to z22.
    'circle-radius': { base: 5, stops: [[12, 10], [22, 180]] },
    'circle-color': SELECTED_ITEM_COLOUR,
    'circle-opacity': 1,
  },
};

export const searchReportFillLayer: mapboxgl.AnyLayer = {
  id: 'search-report-fill',
  type: 'fill',
  source: 'search-reports',
  paint: {
    'fill-color': SEARCH_ITEM_COLOUR,
    'fill-opacity': 0.1,
  },
  filter: ['==', '$type', 'Polygon'],
};

export const searchReportLineLayer: mapboxgl.AnyLayer = {
  id: 'search-report-boundary',
  type: 'line',
  source: 'search-reports',
  paint: {
    'line-color': SEARCH_ITEM_COLOUR,
    'line-width': 1,
  },
  filter: ['==', '$type', 'Polygon'],
};

export const searchRelationshipFillLayer: mapboxgl.AnyLayer = {
  id: 'search-relationship-fill',
  type: 'circle',
  source: 'search-relationships',
  paint: {
    // Make circles larger as the user zooms from z12 to z22.
    'circle-radius': { base: 5, stops: [[12, 10], [22, 180]] },
    'circle-color': SEARCH_ITEM_COLOUR,
    'circle-opacity': 1,
  },
};

export const textAnnotationFillLayer: mapboxgl.AnyLayer = {
  id: 'text-fill',
  type: 'symbol',
  source: 'texts',
  layout: {
    'text-field': ['get', 'title'],
  },
  paint: {
    'text-halo-color': '#D7CFBE',
    'text-halo-width': 2,
  },
};

export const boxLineLayer: mapboxgl.AnyLayer = {
  id: 'box-boundary',
  type: 'line',
  source: 'box',
  paint: {
    'line-color': SEARCH_ITEM_COLOUR,
    'line-width': 3,
  },
  filter: ['==', '$type', 'Polygon'],
};
