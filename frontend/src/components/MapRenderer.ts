import { Position } from 'geojson';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Annotations, Project } from '../models/types';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const SEARCH_ITEM_COLOUR = '#1A85A7'; // teal
const SELECTED_ITEM_COLOUR = '#E28D38'; // orange

// const LIGHT_BEIGE = '#D7CFBE';
const navigation = new mapboxgl.NavigationControl({ showCompass: false });

let sourceLoaded = false;

function seperateProjectSources(
  reports: any[],
  relationships: any[],
  selectedProject: { repIds: string | any[]; relIds: string | any[]; },
) {
  const selectedReports = reports.filter(
    (report: { properties: { id: any; };
    }) => selectedProject.repIds.includes(report.properties.id),
  );
  const selectedRelationships = relationships.filter(
    (relationship: { properties: { id: any; };
    }) => selectedProject.relIds.includes(relationship.properties.id),
  );
  const searchReports = reports.filter(
    (report: { properties: { id: any; };
    }) => !selectedProject.repIds.includes(report.properties.id),
  );
  const searchRelationships = relationships.filter(
    (relationship: { properties: { id: any; };
    }) => !selectedProject.relIds.includes(relationship.properties.id),
  );

  return {
    selRep: selectedReports,
    selRel: selectedRelationships,
    searchRep: searchReports,
    searchRel: searchRelationships,
  };
}

export function updateDataSources(
  reports: any,
  relationships: any,
  box: Position[],
  isSearchMode: boolean,
  annotations: Annotations,
  selectedProject: Project,
  map: mapboxgl.Map,
) {
  if (sourceLoaded) {
    const data = seperateProjectSources(reports, relationships, selectedProject);
    const selReportSource: mapboxgl.GeoJSONSource = map.getSource('selected-reports') as mapboxgl.GeoJSONSource;
    const selRelationshipSource: mapboxgl.GeoJSONSource = map.getSource('selected-relationships') as mapboxgl.GeoJSONSource;
    const searchReportSource: mapboxgl.GeoJSONSource = map.getSource('search-reports') as mapboxgl.GeoJSONSource;
    const searchRelationshipSource: mapboxgl.GeoJSONSource = map.getSource('search-relationships') as mapboxgl.GeoJSONSource;
    const boxSource: mapboxgl.GeoJSONSource = map.getSource('box') as mapboxgl.GeoJSONSource;
    const textAnnotationSource: mapboxgl.GeoJSONSource = map.getSource('texts') as mapboxgl.GeoJSONSource;

    selReportSource.setData({
      type: 'FeatureCollection',
      features: data.selRep,
    });

    selRelationshipSource.setData({
      type: 'FeatureCollection',
      features: data.selRel,
    });

    searchReportSource.setData({
      type: 'FeatureCollection',
      features: data.searchRep,
    });

    searchRelationshipSource.setData({
      type: 'FeatureCollection',
      features: data.searchRel,
    });

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

    const layerIds = map.getStyle().layers?.map((item) => item.id).filter((s) => s.includes('gl-draw'));
    layerIds?.forEach((id) => {
      map.setLayoutProperty(id, 'visibility', isSearchMode ? 'none' : 'visible');
    });

    textAnnotationSource.setData({
      type: 'FeatureCollection',
      features: annotations.texts.map((text) => (
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: isSearchMode ? [] : [text.lnglat.lng, text.lnglat.lat],
          },
          properties: {
            title: text.text,
          },
        }
      )),
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
  annotations: Annotations,
  selectedProject: Project,
  map: mapboxgl.Map,
) {
  const data = seperateProjectSources(reports, relationships, selectedProject);

  map.addSource('selected-reports', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: data.selRep,
    },
  });
  map.addSource('selected-relationships', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: data.selRel,
    },
  });
  map.addSource('search-reports', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: data.searchRep,
    },
  });
  map.addSource('search-relationships', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: data.searchRel,
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
  map.addSource('texts', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: annotations.texts.map((text) => (
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: isSearchMode ? [] : [text.lnglat.lng, text.lnglat.lat],
          },
          properties: {
            title: text.text,
          },
        }
      )),
    },
  });
}

function setupLayers(map: mapboxgl.Map) {
  const selReportFillLayer: mapboxgl.AnyLayer = {
    id: 'sel-report-fill',
    type: 'fill',
    source: 'selected-reports',
    paint: {
      'fill-color': SELECTED_ITEM_COLOUR,
      'fill-opacity': 0.1,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  const selReportLineLayer: mapboxgl.AnyLayer = {
    id: 'sel-report-boundary',
    type: 'line',
    source: 'selected-reports',
    paint: {
      'line-color': SELECTED_ITEM_COLOUR,
      'line-width': 1,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  const selRelationshipFillLayer: mapboxgl.AnyLayer = {
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

  const searchReportFillLayer: mapboxgl.AnyLayer = {
    id: 'search-report-fill',
    type: 'fill',
    source: 'search-reports',
    paint: {
      'fill-color': SEARCH_ITEM_COLOUR,
      'fill-opacity': 0.1,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  const searchReportLineLayer: mapboxgl.AnyLayer = {
    id: 'search-report-boundary',
    type: 'line',
    source: 'search-reports',
    paint: {
      'line-color': SEARCH_ITEM_COLOUR,
      'line-width': 1,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  const searchRelationshipFillLayer: mapboxgl.AnyLayer = {
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

  const textAnnotationFillLayer: mapboxgl.AnyLayer = {
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

  const boxLineLayer: mapboxgl.AnyLayer = {
    id: 'box-boundary',
    type: 'line',
    source: 'box',
    paint: {
      'line-color': SEARCH_ITEM_COLOUR,
      'line-width': 3,
    },
    filter: ['==', '$type', 'Polygon'],
  };

  map.addLayer(selReportFillLayer);
  map.addLayer(selReportLineLayer);
  map.addLayer(selRelationshipFillLayer);
  map.addLayer(searchReportFillLayer);
  map.addLayer(searchReportLineLayer);
  map.addLayer(searchRelationshipFillLayer);
  map.addLayer(boxLineLayer);
  map.addLayer(textAnnotationFillLayer);
}

export function setupMapFeatures(
  reports: any,
  relationships: any,
  box: any,
  isSearchMode: boolean,
  annotations: Annotations,
  draw: MapboxDraw,
  selectedProject: Project,
  map: mapboxgl.Map,
) {
  if (!sourceLoaded) {
    setupDataSources(reports, relationships, box, isSearchMode, annotations, selectedProject, map);
    setupLayers(map);
    map.addControl((draw as any));
    sourceLoaded = true;
  }
}
