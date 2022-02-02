import React from 'react';
import ListPanel from './ListPanel';
import MapPanel from './MapPanel';
import './SelectedProjectPage.css';

function SelectedProjectPage() {
  return (
    <>
      <p>This is the Selected Project Page</p>
      <div className="container">
        <ListPanel />
        <MapPanel />
      </div>
    </>
  );
}

export default SelectedProjectPage;
