import React from 'react';
import ListPanel from './ListPanel';
import MapPanel from './MapPanel';
import './SelectedProjectPage.css';

function SelectedProjectPage() {
  return (
    <div className="container">
      <ListPanel />
      <MapPanel />
    </div>
  );
}

export default SelectedProjectPage;
