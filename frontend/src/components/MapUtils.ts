import mapboxgl from 'mapbox-gl';

const SEARCH_ITEM_COLOUR = '#1A85A7'; // teal
const SELECTED_ITEM_COLOUR = '#E28D38'; // orange

const FOCUS_SEARCH_ITEM_COLOUR = '#055C77';
const FOCUS_SELECTED_ITEM_COLOUR = '#B96817';

const BEIGE = '#B4A88C';

export const polygonAnnotationStyle = [
  // ACTIVE (being drawn)
  // line stroke
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': BEIGE,
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
  // polygon fill
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'fill-color': BEIGE,
      'fill-outline-color': BEIGE,
      'fill-opacity': 0.1,
    },
  },
  // polygon mid points
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 2,
      'circle-color': BEIGE,
    },
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': BEIGE,
      'line-width': 2,
    },
  },
  // vertex point halos
  {
    id: 'gl-draw-polygon-and-line-vertex-halo-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 4,
      'circle-color': '#FFF',
    },
  },
  // vertex points
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 2,
      'circle-color': BEIGE,
    },
  },

  // INACTIVE (static, already drawn)
  // line stroke
  {
    id: 'gl-draw-line-static',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#000',
      'line-width': 3,
    },
  },
  // polygon fill
  {
    id: 'gl-draw-polygon-fill-static',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
    paint: {
      'fill-color': '#000',
      'fill-outline-color': '#000',
      'fill-opacity': 0.1,
    },
  },
  // polygon outline
  {
    id: 'gl-draw-polygon-stroke-static',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#000',
      'line-width': 3,
    },
  },
];

export const getFocusReportFillLayer = (isInProject: boolean) => ({
  id: isInProject ? 'focus-selected-report-fill' : 'focus-search-report-fill',
  type: 'fill',
  source: isInProject ? 'focus-selected-reports' : 'focus-search-reports',
  paint: {
    'fill-color': isInProject ? FOCUS_SELECTED_ITEM_COLOUR : FOCUS_SEARCH_ITEM_COLOUR,
    'fill-opacity': 0.3,
  },
  filter: ['==', '$type', 'Polygon'],
} as mapboxgl.AnyLayer);

export const getFocusReportLineLayer = (isInProject: boolean) => ({
  id: isInProject ? 'focus-selected-report-line' : 'focus-search-report-line',
  type: 'line',
  source: isInProject ? 'focus-selected-reports' : 'focus-search-reports',
  paint: {
    'line-color': isInProject ? FOCUS_SELECTED_ITEM_COLOUR : FOCUS_SEARCH_ITEM_COLOUR,
    'line-width': 3,
  },
  filter: ['==', '$type', 'Polygon'],
} as mapboxgl.AnyLayer);

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

export const findMidpoint = (coordinates: any) => {
  const sum = coordinates[0].reduce((a: any, b: any) => {
    // eslint-disable-next-line no-param-reassign
    a[0] += b[0];
    // eslint-disable-next-line no-param-reassign
    a[1] += b[1];
    return a;
  }, [0, 0]);

  return {
    lng: sum[0] / coordinates[0].length,
    lat: sum[1] / coordinates[0].length,
  };
};
