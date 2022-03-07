import { Position } from 'geojson';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {
  Annotations, Project, RelationshipProperties, ReportProperties,
} from '../models/types';
import {
  boxLineLayer,
  searchRelationshipFillLayer,
  searchReportFillLayer,
  searchReportLineLayer,
  selRelationshipFillLayer,
  selReportFillLayer,
  selReportLineLayer,
  textAnnotationFillLayer,
  getFocusReportFillLayer,
  getFocusReportLineLayer,
} from './MapUtils';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const navigation = new mapboxgl.NavigationControl({ showCompass: false });

let sourceLoaded = false;

function seperateProjectSources(
  reports: ReportProperties[],
  relationships: RelationshipProperties[],
  selectedProject: { repIds: string | any[]; relIds: string | any[]; },
  selectedReport: ReportProperties | null,
) {
  const selectedReports = reports.filter(
    (report: {
      properties: { id: any; };
    }) => selectedProject.repIds.includes(report.properties.id)
    && report.properties.id !== selectedReport?.properties.id,
  );
  const selectedRelationships = relationships.filter(
    (relationship: {
      properties: { id: any; };
    }) => selectedProject.relIds.includes(relationship.properties.id),
  );
  const searchReports = reports.filter(
    (report: {
      properties: { id: any; };
    }) => !selectedProject.repIds.includes(report.properties.id)
    && report.properties.id !== selectedReport?.properties.id,
  );
  const searchRelationships = relationships.filter(
    (relationship: {
      properties: { id: any; };
    }) => !selectedProject.relIds.includes(relationship.properties.id),
  );
  const focusSelReport = reports.filter(
    (report: ReportProperties) => report.properties.id === selectedReport?.properties.id
    && selectedProject.repIds.includes(report.properties.id),
  );
  const focusSearchReport = reports.filter(
    (report: ReportProperties) => report.properties.id === selectedReport?.properties.id
    && !selectedProject.repIds.includes(report.properties.id),
  );

  return {
    selRep: selectedReports,
    selRel: selectedRelationships,
    searchRep: searchReports,
    searchRel: searchRelationships,
    focusSelRep: focusSelReport,
    focusSearchRep: focusSearchReport,
  };
}

export function updateDataSources(
  reports: ReportProperties[],
  relationships: RelationshipProperties[],
  box: Position[],
  isSearchMode: boolean,
  annotations: Annotations,
  selectedProject: Project,
  map: mapboxgl.Map,
  selectedReport: ReportProperties | null,
) {
  if (sourceLoaded) {
    const {
      selRep,
      selRel,
      searchRep,
      searchRel,
      focusSelRep,
      focusSearchRep,
    } = seperateProjectSources(reports, relationships, selectedProject, selectedReport);
    const selReportSource: mapboxgl.GeoJSONSource = map.getSource('selected-reports') as mapboxgl.GeoJSONSource;
    const selRelationshipSource: mapboxgl.GeoJSONSource = map.getSource('selected-relationships') as mapboxgl.GeoJSONSource;
    const focusSearchRepSource: mapboxgl.GeoJSONSource = map.getSource('focus-search-reports') as mapboxgl.GeoJSONSource;
    const focusSelRepSource: mapboxgl.GeoJSONSource = map.getSource('focus-selected-reports') as mapboxgl.GeoJSONSource;
    const searchReportSource: mapboxgl.GeoJSONSource = map.getSource('search-reports') as mapboxgl.GeoJSONSource;
    const searchRelationshipSource: mapboxgl.GeoJSONSource = map.getSource('search-relationships') as mapboxgl.GeoJSONSource;
    const boxSource: mapboxgl.GeoJSONSource = map.getSource('box') as mapboxgl.GeoJSONSource;
    const textAnnotationSource: mapboxgl.GeoJSONSource = map.getSource('texts') as mapboxgl.GeoJSONSource;

    focusSelRepSource.setData({
      type: 'FeatureCollection',
      features: (focusSelRep as any[]),
    });

    focusSearchRepSource.setData({
      type: 'FeatureCollection',
      features: (focusSearchRep as any[]),
    });

    selReportSource.setData({
      type: 'FeatureCollection',
      features: (selRep as any[]),
    });

    selRelationshipSource.setData({
      type: 'FeatureCollection',
      features: (selRel as any[]),
    });

    searchReportSource.setData({
      type: 'FeatureCollection',
      features: (searchRep as any[]),
    });

    searchRelationshipSource.setData({
      type: 'FeatureCollection',
      features: (searchRel as any[]),
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

    const polygonLayerIds = map.getStyle().layers?.map((item) => item.id).filter((s) => s.includes('gl-draw'));
    polygonLayerIds?.forEach((id) => {
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
  reports: ReportProperties[],
  relationships: RelationshipProperties[],
  box: Position[],
  isSearchMode: boolean,
  annotations: Annotations,
  selectedProject: Project,
  map: mapboxgl.Map,
  selectedReport: ReportProperties | null,
) {
  const {
    selRep,
    selRel,
    searchRep,
    searchRel,
    focusSearchRep,
    focusSelRep,
  } = seperateProjectSources(reports, relationships, selectedProject, selectedReport);

  map.addSource('focus-search-reports', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: focusSearchRep as any[],
    },
  });
  map.addSource('focus-selected-reports', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: focusSelRep as any[],
    },
  });
  map.addSource('selected-reports', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: selRep as any[],
    },
  });
  map.addSource('selected-relationships', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: selRel as any[],
    },
  });
  map.addSource('search-reports', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: searchRep as any[],
    },
  });
  map.addSource('search-relationships', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: searchRel as any[],
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

    map.addSource('texts', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: annotations.texts.map((text) => (
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [text.lnglat.lng, text.lnglat.lat],
            },
            properties: {
              title: text.text,
            },
          }
        )),
      },
    });
  }
}

function setupLayers(map: mapboxgl.Map) {
  map.addLayer(selReportFillLayer);
  map.addLayer(selReportLineLayer);
  map.addLayer(selRelationshipFillLayer);
  map.addLayer(searchReportFillLayer);
  map.addLayer(searchReportLineLayer);
  map.addLayer(searchRelationshipFillLayer);
  map.addLayer(boxLineLayer);
  map.addLayer(textAnnotationFillLayer);
  map.addLayer(getFocusReportFillLayer(true));
  map.addLayer(getFocusReportFillLayer(false));
  map.addLayer(getFocusReportLineLayer(true));
  map.addLayer(getFocusReportLineLayer(false));
}

export function setupMapFeatures(
  reports: ReportProperties[],
  relationships: RelationshipProperties[],
  box: any,
  isSearchMode: boolean,
  annotations: Annotations,
  draw: MapboxDraw,
  selectedProject: Project,
  map: mapboxgl.Map,
  selectedReport: ReportProperties | null,
) {
  if (!sourceLoaded) {
    setupDataSources(
      reports,
      relationships,
      box,
      isSearchMode,
      annotations,
      selectedProject,
      map,
      selectedReport,
    );
    setupLayers(map);
    map.addControl((draw as any));
    sourceLoaded = true;
  }
}
