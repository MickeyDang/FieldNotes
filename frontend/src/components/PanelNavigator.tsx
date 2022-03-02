import React from 'react';

interface PanelNavigatorProps {
  onSearchToggled: Function;
  onNotebookToggled: Function;
}

function PanelNavigator({ onSearchToggled, onNotebookToggled }: PanelNavigatorProps) {
  const toggleSearch = () => onSearchToggled();
  const toggleNotebook = () => onNotebookToggled();

  return (
    <div>
      <button type="button" onClick={toggleSearch}>Search</button>
      <button type="button" onClick={toggleNotebook}>Notebook</button>
    </div>
  );
}

export default PanelNavigator;
