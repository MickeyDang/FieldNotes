import React from 'react';
import './PanelNavigator.css';

interface PanelNavigatorProps {
  onSearchToggled: Function;
  onNotebookToggled: Function;
}

function PanelNavigator({ onSearchToggled, onNotebookToggled }: PanelNavigatorProps) {
  const toggleSearch = () => onSearchToggled();
  const toggleNotebook = () => onNotebookToggled();

  return (
    <div className="nav-container">
      <button className="nav-tab nav-search" type="button" onClick={toggleSearch}>Search</button>
      <button className="nav-tab nav-notebook" type="button" onClick={toggleNotebook}>Notebook</button>
    </div>
  );
}

export default PanelNavigator;
