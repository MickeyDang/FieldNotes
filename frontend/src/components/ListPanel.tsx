import React from 'react';
import './ListPanel.css';

interface ListPanelProps {
  onSearchChange: Function,
}

function ListPanel({ onSearchChange }: ListPanelProps) {
  // TODO: make the search query change based on form input.
  const updateSearch = () => onSearchChange(['Community Centres']);

  return (
    <div className="list-container">
      <p>This is the List Panel</p>
      <button type="button" onClick={updateSearch}>Search for Community Centres</button>
    </div>
  );
}

export default ListPanel;
