import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPanel.css';
import {
  setupMapFeatures, updateDataSources, setupMapInteractions,
} from './MapRenderer';
import { Annotations, TagCount } from '../models/types';
import AnnotationBar from './AnnotationBar';
import KeywordOverview from './KeywordOverview';

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
  tagsSummary: TagCount[],
  appendSearchQuery: Function,
  // onKeywordSearchChange: Function,
  // searchParams: object,
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
  tagsSummary,
  appendSearchQuery,
  // onKeywordSearchChange,
  // searchParams,
}: MapPanelProps) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map>(null);
  const [totalDataPoints, setTotalDataPoints] = useState(0);
  // const [keywordSearch, setKeywordSearch] = useState([]);
  // const updateKeywordSearch = (values: string[]) => onKeywordSearchChange(values);

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
    if (mapRef.current) {
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
      const box = getSearchedAreaBox();

      map.on('render', () => {
        map.resize();
      });

      map.on('load', async () => {
        setupMapFeatures(reportResults, relationshipResults, box, map);
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
      updateDataSources(reportResults, relationshipResults, box, map);
    }

    setTotalDataPoints(reportResults.length + relationshipResults.length);
  }, [reportResults, relationshipResults]);

  return (
    <div className="map-panel-container">
      <div className="map" ref={mapContainerRef} />
      {isSearchMode
        ? (
          <>
            <button className="search-button" type="button" onClick={updateSearch}>Search Area</button>
            { (reportResults.length > 0 || relationshipResults.length > 0)
              ? (
                <KeywordOverview
                  tagsSummary={tagsSummary}
                  totalDataPoints={totalDataPoints}
                  appendSearchQuery={appendSearchQuery}
                />
              ) : null}
          </>
        )
        : (
          <AnnotationBar />
        )}
    </div>
  );
}

export default MapPanel;
