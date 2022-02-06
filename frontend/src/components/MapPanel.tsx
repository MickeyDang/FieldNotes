import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPanel.css';

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API}`;

const VANCOUVER_LAT = -123.127;
const VANCOUVER_LNG = 49.28;
const DEFAULT_ZOOM_LEVEL = 12.5;
const BLUE = '#8FB1BB';
const DARK_BLUE = '#1A85A7';
const ORANGE = '#F29D49';

async function getReports() {
  const res = await fetch('http://localhost:8000/reports/');
  const data = await res.json();

  // shape into valid geojson for adding to the map
  const reports = data.map((report: { location: { coordinates: any[]; }; name: any; }) => (
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [report.location.coordinates[0]],
      },
      properties: {
        name: report.name,
      },
    }
  ));

  return reports;
}

async function getRelationships() {
  const res = await fetch('http://localhost:8000/relationships/');
  const data = await res.json();

  // eslint-disable-next-line max-len
  const relationships = data.map((rel: { location: { coordinates: any[]; }; _id: any; name: any; type: any; lastContacted: any; reports: any; }) => (
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [rel.location.coordinates[0], rel.location.coordinates[1]],
      },
      properties: {
        // eslint-disable-next-line no-underscore-dangle
        id: rel._id,
        name: rel.name,
        type: rel.type,
        lastContacted: rel.lastContacted,
        reports: rel.reports,
      },
    }
  ));

  return relationships;
}

async function setupDataSources(map: mapboxgl.Map) {
  const reports = await getReports();
  const relationships = await getRelationships();
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

function setupMapInteractions(map: mapboxgl.Map) {
  // Add zoom controls to the map.
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
}

function setupLayers(map: mapboxgl.Map) {
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

function MapPanel() {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [VANCOUVER_LAT, VANCOUVER_LNG],
      zoom: DEFAULT_ZOOM_LEVEL,
    });

    map.on('load', async () => {
      await setupDataSources(map);
      setupLayers(map);
    });

    // change cursor to pointer when user hovers over a clickable feature
    map.on('mouseenter', (e) => {
      if (e.features.length) {
        map.getCanvas().style.cursor = 'pointer';
      }
    });

    // reset cursor to default when user is no longer hovering over a clickable feature
    map.on('mouseleave', () => {
      map.getCanvas().style.cursor = '';
    });

    setupMapInteractions(map);

    return () => map.remove();
  }, []);

  return (
    <div className="map-panel-container">
      <div className="map" ref={mapContainerRef} />
    </div>
  );
}

export default MapPanel;
