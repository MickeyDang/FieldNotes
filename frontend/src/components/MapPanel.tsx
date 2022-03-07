import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { LngLat } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Position } from 'geojson';
import './MapPanel.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { findMidpoint } from './MapUtils';
import {
  setupMapFeatures, updateDataSources, setupMapInteractions,
} from './MapRenderer';
import {
  Annotations, Project, ReportProperties, TextAnnotation, TagCount,
} from '../models/types';
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
  selectedProject: Project,
  reportClicked: Function,
  selectedReport: ReportProperties | null,
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
  annotations,
  setAnnotations,
  isSearchMode,
  tagsSummary,
  selectedProject,
  reportClicked,
  selectedReport,
}: MapPanelProps) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map>(null);
  const [totalDataPoints, setTotalDataPoints] = useState(0);
  const searchBox = useRef<Position[]>([]);
  const [annotationMode, setAnnotationMode] = useState('none');
  const drawRef = useRef<MapboxDraw>(null);
  const [textAnnotation, setTextAnnotation] = useState('');
  const [textAnnotationLngLat, setTextAnnotationLngLat] = useState<LngLat>();
  const [textAnnotationMarker, setTextAnnotationMarker] = useState<mapboxgl.Marker>();

  const onClickText = (e: { lngLat: any; }) => {
    setTextAnnotationLngLat(e.lngLat);
  };
  const onClickTextRef = useRef(onClickText);
  onClickTextRef.current = onClickText;

  useEffect(() => {
    if (annotationMode === 'text' && textAnnotationLngLat && mapRef.current && !isSearchMode) {
      const map = mapRef.current;
      setTextAnnotationMarker(new mapboxgl.Marker({ color: '#D7CFBE' })
        .setLngLat(textAnnotationLngLat)
        .addTo(map));
    }
  }, [textAnnotationLngLat]);

  useEffect(() => {
    if (isSearchMode && textAnnotationMarker) {
      textAnnotationMarker.remove();
    }
  }, [isSearchMode]);

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
      onBoundingBoxChange(box);
      (searchBox as any).current = getSearchedAreaBox();
    }
  };

  const updateAnnotationMode = (updatedMode: string) => {
    setAnnotationMode((annotationMode === updatedMode) ? '' : updatedMode);
  };

  const enableDrawingByMode = (map: any) => {
    switch (annotationMode) {
      case 'polygon':
        drawRef.current?.changeMode('draw_polygon');
        map.off('click', onClickTextRef.current);
        break;

      case 'text':
        drawRef.current?.changeMode('simple_select');
        map.once('click', onClickTextRef.current);
        break;

      default:
        map.off('click', onClickTextRef.current);
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
          selectedProject,
          map,
          selectedReport,
        );
      });

      enableDrawingByMode(map);

      const updatedAnnotations = { ...annotations };
      map.on('draw.create', () => {
        const features = draw?.getAll();
        if (features) {
          updatedAnnotations.polygons = features;
        }
      });
      map.on('draw.update', () => {
        const features = draw?.getAll();
        if (features) {
          updatedAnnotations.polygons = features;
        }
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      const handleHoverOn = (e: any) => {
        if (e.features.length) {
          map.getCanvas().style.cursor = 'pointer';
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { type } = e.features[0].geometry;
          // eslint-disable-next-line no-unused-vars
          const { name, id } = e.features[0].properties;
          const midpoint = type === 'Polygon' ? findMidpoint(coordinates) : coordinates;
          popup.setLngLat(midpoint).setHTML(name).addTo(map);
        }
      };

      map.on('mouseenter', 'search-report-fill', handleHoverOn);
      map.on('mouseenter', 'search-relationship-fill', handleHoverOn);
      map.on('mouseenter', 'sel-report-fill', handleHoverOn);
      map.on('mouseenter', 'sel-relationship-fill', handleHoverOn);

      const handleHoverOff = () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      };

      map.on('mouseleave', 'search-report-fill', handleHoverOff);
      map.on('mouseleave', 'search-relationship-fill', handleHoverOff);
      map.on('mouseleave', 'sel-report-fill', handleHoverOff);
      map.on('mouseleave', 'sel-relationship-fill', handleHoverOff);

      const handleReportClicked = (e: any) => {
        if (e.features.length) {
          const { id } = e.features[0].properties;
          reportClicked(id);
        }
      };

      map.on('click', 'search-report-fill', handleReportClicked);
      map.on('click', 'sel-report-fill', handleReportClicked);

      setupMapInteractions(map);
      updateDataSources(
        reportResults,
        relationshipResults,
        box,
        isSearchMode,
        updatedAnnotations,
        selectedProject,
        map,
        selectedReport,
      );
    }
    setTotalDataPoints(reportResults.length + relationshipResults.length);
  }, [
    reportResults,
    relationshipResults,
    isSearchMode,
    annotationMode,
    annotations,
    selectedProject,
    selectedReport,
  ]);

  const handleTextOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTextAnnotation(event.target.value);
  };

  const addText = () => {
    if (annotationMode === 'text' && textAnnotation.length > 0 && textAnnotationLngLat) {
      const newText: TextAnnotation = { lnglat: textAnnotationLngLat, text: textAnnotation };
      const updatedAnnotations = { ...annotations };
      updatedAnnotations.texts.push(newText);
      setAnnotations(updatedAnnotations);
      setTextAnnotation('');
    }
  };

  const handleTextSubmit = () => {
    if (textAnnotationMarker) {
      textAnnotationMarker.remove();
    }
    addText();
  };

  return (
    <div className="map-panel-container">
      <div className="map" ref={mapContainerRef} />
      {isSearchMode
        ? (
          <>
            <button className="search-button" type="button" onClick={updateSearch}>Search Area</button>
            {/* { (reportResults.length > 0 || relationshipResults.length > 0)
              ? (
                <KeywordOverview
                  tagsSummary={tagsSummary}
                  totalDataPoints={totalDataPoints}
                />
              ) : null} */}
            {(reportResults.length > 0 || relationshipResults.length > 0)
                && (
                <KeywordOverview
                  tagsSummary={tagsSummary}
                  totalDataPoints={totalDataPoints}
                />
                )}
          </>
        )
        : (
          <>
            <AnnotationBar
              onAnnotationModeSelect={updateAnnotationMode}
              annotationMode={annotationMode}
            />
            {annotationMode === 'text' ? (
              <Box
                component="form"
                className="text-annotation-input-box"
                noValidate
                autoComplete="off"
              >
                <TextField id="outlined-basic" className="text-annotation-input-field" label="Notes" variant="outlined" size="small" value={textAnnotation} onChange={handleTextOnChange} />
                <Button variant="contained" className="text-annotation-input-button" onClick={handleTextSubmit}>ADD</Button>
              </Box>
            ) : null}
          </>
        )}
    </div>
  );
}

export default MapPanel;
