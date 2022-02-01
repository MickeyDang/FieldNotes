import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPanel.css';

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API}`;

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

  console.log(data);
  return reports;
}

function MapPanel() {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-123.127, 49.28],
      zoom: 12.5,
    });

    // fetch and display reports
    map.on('load', async () => {
      const reports = await getReports();
      console.log(reports);
      map.addSource('reports', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: reports,
        },
      });

      map.addLayer({
        id: 'report-fill',
        type: 'fill',
        source: 'reports',
        paint: {
          'fill-color': '#8FB1BB', // blue color fill
          'fill-opacity': 0.6,
        },
        filter: ['==', '$type', 'Polygon'],
      });
      map.addLayer({
        id: 'report-boundary',
        type: 'line',
        source: 'reports',
        paint: {
          'line-color': '#1A85A7',
          'line-width': 1,
        },
        filter: ['==', '$type', 'Polygon'],
      });
    });

    // Add zoom controls to the map.
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

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

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
}

export default MapPanel;
