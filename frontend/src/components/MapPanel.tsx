import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapPanel.css';

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API}`;

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
    <div className="map-panel-container">
      <p>This is the Map Panel</p>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
}

export default MapPanel;
