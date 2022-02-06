import React from 'react';
import './ListPanel.css';

interface ListPanelProps {
  onSearchChange: Function,
}

function ListPanel({ onSearchChange }: ListPanelProps) {
  const updateSearch = () => onSearchChange('Community Centres');
  return (
    <>
      <button type="button" onClick={updateSearch}>Search for Community Centres</button>
      <div className="list-container">
        <p>This is the List Panel</p>
      </div>
    </>
  );
}

export default ListPanel;
