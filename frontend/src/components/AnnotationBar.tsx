import React from 'react';
import './AnnotationBar.css';

interface AnnotationBarProps {
  onAnnotationModeSelect: Function,
  annotationMode: string,
}

function AnnotationBar({
  onAnnotationModeSelect,
  annotationMode,
}: AnnotationBarProps) {
  const updateMode = (updatedMode: string) => {
    onAnnotationModeSelect(updatedMode);
  };
  const polygonButtonClass = annotationMode === 'polygon' ? 'annotation-button polygon active' : 'annotation-button polygon';
  const textButtonClass = annotationMode === 'text' ? 'annotation-button text active' : 'annotation-button text';

  return (
    <div className="annotation-bar-container">
      <button className={polygonButtonClass} type="button" onClick={() => updateMode('polygon')}> </button>
      <button className={textButtonClass} type="button" onClick={() => updateMode('text')}> </button>
      <div className="annotation-label">ANNOTATION TOOLS</div>
    </div>
  );
}

export default AnnotationBar;
