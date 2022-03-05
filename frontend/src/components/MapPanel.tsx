import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Position } from 'geojson';
import './MapPanel.css';
import {
  setupMapFeatures, updateDataSources, setupMapInteractions,
} from './MapRenderer';
import {
  Annotations,
  PointAnnotation,
} from '../models/types';
import AnnotationBar from './AnnotationBar';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface MapPanelProps {
  reportResults: any[],
  relationshipResults: any[],
  onBoundingBoxChange: Function,
  annotations: Annotations,
  setAnnotations: Function,
  isSearchMode: boolean,
}

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API}`;

const VANCOUVER_LAT = -123.127;
const VANCOUVER_LNG = 49.28;
const DEFAULT_ZOOM_LEVEL = 12.5;

function MapPanel({
  // Remove linter statements once annotations and setAnnotations are implemented
  reportResults,
  relationshipResults,
  onBoundingBoxChange,
  // eslint-disable-next-line no-unused-vars
  annotations,
  // eslint-disable-next-line no-unused-vars
  setAnnotations,
  isSearchMode,
}: MapPanelProps) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map>(null);
  const searchBox = useRef<Position[]>([]);
  const [annotationMode, setAnnotationMode] = useState('none');
  const drawRef = useRef<MapboxDraw>(null);

  const extractBoundingBox = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      const sw = map.getBounds().getSouthWest();
      const ne = map.getBounds().getNorthEast();

      return [[sw.lng, sw.lat], [ne.lng, ne.lat]];
    }
    return [];
  };

  const getSearchedAreaBox = () => {
    if (mapRef.current && isSearchMode) {
      const map = mapRef.current;
      const sw = map.getBounds().getSouthWest();
      const se = map.getBounds().getSouthEast();
      const ne = map.getBounds().getNorthEast();
      const nw = map.getBounds().getNorthWest();

      return [
        [sw.lng, sw.lat],
        [se.lng, se.lat],
        [ne.lng, ne.lat],
        [nw.lng, nw.lat],
        [sw.lng, sw.lat],
      ];
    }
    return [];
  };

  const updateSearch = () => {
    const box = extractBoundingBox();
    if (box.length > 0) {
      onBoundingBoxChange(extractBoundingBox());
      (searchBox as any).current = getSearchedAreaBox();
    }
  };

  const updateAnnotationMode = (updatedMode: string) => {
    console.log(updatedMode);
    setAnnotationMode(updatedMode);

    switch (annotationMode) {
      case 'polygon':
        console.log('polygon!');
        drawRef.current?.changeMode('draw_polygon');
        break;

      default:
        drawRef.current?.changeMode('simple_select');
        break;
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

      (drawRef as any).current = new MapboxDraw({
        displayControlsDefault: false,
        defaultMode: 'simple_select',
      });
    } else {
      const map = mapRef.current;
      const box = searchBox.current;
      const draw = drawRef.current;

      map.on('render', () => {
        map.resize();
      });

      map.on('load', async () => {
        setupMapFeatures(
          reportResults,
          relationshipResults,
          box,
          isSearchMode,
          annotations,
          draw!,
          map,
        );
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

      const updatedAnnotations = { ...annotations };
      switch (annotationMode) {
        case 'none':
          console.log('none!');
          break;

        case 'point':
          console.log('point!');
          map.once('click', (e) => {
            const newPoint: PointAnnotation = { lnglat: e.lngLat };
            updatedAnnotations.points.push(newPoint);
            setAnnotations(updatedAnnotations);
          });
          break;

        case 'polygon':
          console.log('polygon!');
          break;

        case 'text':
          console.log('text!');
          break;

        default:
          break;
      }

      map.on('draw.create', () => {
        console.log('creating');
      });
      map.on('draw.update', () => {
        console.log('update');
      });

      setupMapInteractions(map);
      updateDataSources(
        reportResults,
        relationshipResults,
        box,
        isSearchMode,
        updatedAnnotations,
        map,
      );
    }
  }, [reportResults, relationshipResults, annotationMode, annotations]);

  return (
    <div className="map-panel-container">
      <div className="map" ref={mapContainerRef} />
      {isSearchMode
        ? (
          <button className="search-button" type="button" onClick={updateSearch}>Search Area</button>
        )
        : (
          <AnnotationBar
            onAnnotationModeSelect={updateAnnotationMode}
          />
        )}
    </div>
  );
}

export default MapPanel;
