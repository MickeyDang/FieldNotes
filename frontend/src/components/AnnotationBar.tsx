import React from 'react';
import './AnnotationBar.css';

interface AnnotationBarProps {
  onAnnotationModeSelect: Function,
}

function AnnotationBar({
  onAnnotationModeSelect,
}: AnnotationBarProps) {
  const updateMode = (updatedMode: string) => {
    onAnnotationModeSelect(updatedMode);
  };

  return (
    <div className="annotation-bar-container">
      <button className="annotation-button polygon" type="button" onClick={() => updateMode('polygon')}> </button>
      <button className="annotation-button text" type="button" onClick={() => updateMode('text')}> </button>
      <h3 className="annotation-label">ANNOTATION TOOLS</h3>
    </div>
  );
}

export default AnnotationBar;
