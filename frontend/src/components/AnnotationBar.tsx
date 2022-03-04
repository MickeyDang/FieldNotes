import React from 'react';
import './AnnotationBar.css';

interface AnnotationBarProps {
  onAnnotationModeChange: Function,
}

function AnnotationBar({
  onAnnotationModeChange,
}: AnnotationBarProps) {
  const updateMode = (updatedMode: string) => {
    onAnnotationModeChange(updatedMode);
  };

  return (
    <div className="annotation-bar-container">
      <button className="annotation-button" type="button" onClick={() => updateMode('point')}>Point</button>
      <h3 className="annotation-label">Annotation Tools</h3>
    </div>
  );
}

export default AnnotationBar;
