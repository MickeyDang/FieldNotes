import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPanel.css';
import {
  setupMapFeatures, updateDataSources, setupMapInteractions,
} from './MapRenderer';

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
  const mapRef = useRef<mapboxgl.Map>(null);

  const extractBoundingBox = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      const sw = map.getBounds().getSouthWest();
      const ne = map.getBounds().getNorthEast();

      return [[sw.lng, sw.lat], [ne.lng, ne.lat]];
    }
    return [];
  };

  const updateSearch = () => {
    const box = extractBoundingBox();
    if (box.length > 0) {
      onBoundingBoxChange(extractBoundingBox());
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      (mapRef as any).current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [VANCOUVER_LAT, VANCOUVER_LNG],
        zoom: DEFAULT_ZOOM_LEVEL,
      });
    } else {
      const map = mapRef.current;

      map.on('render', () => {
        map.resize();
      });

      map.on('load', async () => {
        setupMapFeatures(reportResults, relationshipResults, map);
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
      updateDataSources(reportResults, relationshipResults, map);
    }
  }, [reportResults, relationshipResults]);

  return (
    <div className="map-panel-container">
      <div className="map" ref={mapContainerRef} />
      <button className="search-button" type="button" onClick={updateSearch}>Search Area</button>
    </div>
  );
}

export default MapPanel;
