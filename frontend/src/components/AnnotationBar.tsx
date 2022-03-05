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
      <button className="annotation-button-point" type="button" onClick={() => updateMode('point')}>Point</button>
      <button className="annotation-button-polygon" type="button" onClick={() => updateMode('polygon')}>Polygon</button>
      <button className="annotation-button-text" type="button" onClick={() => updateMode('text')}>Text</button>
      <button className="annotation-button-off" type="button" onClick={() => updateMode('none')}>X</button>
      <h3 className="annotation-label">Annotation Tools</h3>
    </div>
  );
}

export default AnnotationBar;
