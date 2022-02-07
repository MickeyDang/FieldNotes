import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPanel.css';
import { setupDataSources, setupLayers, setupMapInteractions } from './MapRenderer';

interface MapPanelProps {
  reportResults: any[],
  relationshipResults: any[],
  onBoundingBoxChange: Function,
}

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API}`;

const VANCOUVER_LAT = -123.127;
const VANCOUVER_LNG = 49.28;
const DEFAULT_ZOOM_LEVEL = 12.5;

function MapPanel({ reportResults, relationshipResults, onBoundingBoxChange }: MapPanelProps) {
  const mapContainerRef = useRef(null);

  // TODO: make the bounding box parameter change based on map viewport.
  const updateSearch = () => onBoundingBoxChange([[-124, 49], [-123, 50]]);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [VANCOUVER_LAT, VANCOUVER_LNG],
      zoom: DEFAULT_ZOOM_LEVEL,
    });

    map.on('render', () => {
      map.resize();
    });

    map.on('load', async () => {
      setupDataSources(reportResults, relationshipResults, map);
      setupLayers(map);
    });

    // change cursor to pointer when user hovers over a clickable feature
    map.on('mouseenter', (e: any) => {
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
      <button type="button" onClick={updateSearch}>Search Area</button>
      <div className="map" ref={mapContainerRef} />
    </div>
  );
}

export default MapPanel;
