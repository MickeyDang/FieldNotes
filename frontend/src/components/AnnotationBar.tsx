import React, { useEffect, useState } from 'react';
import './AnnotationBar.css';

interface AnnotationBarProps {
  onAnnotationModeSelect: Function,
  annotationMode: string,
  isSearchMode: Boolean,
}

function AnnotationBar({
  onAnnotationModeSelect,
  annotationMode,
  isSearchMode,
}: AnnotationBarProps) {
  const updateMode = (updatedMode: string) => {
    onAnnotationModeSelect(updatedMode);
  };
  const [polygonButtonClass, setPolygonButtonClass] = useState('annotation-button polygon');
  const [textButtonClass, setTextButtonClass] = useState('annotation-button text');

  useEffect(() => {
    if (isSearchMode) {
      updateMode('');
    } else {
      setPolygonButtonClass((annotationMode === 'polygon') ? 'annotation-button polygon active' : 'annotation-button polygon');
      setTextButtonClass((annotationMode === 'text') ? 'annotation-button text active' : 'annotation-button text');
    }
  }, [isSearchMode, annotationMode]);

  return (
    <div className="annotation-bar-container">
      <button className={polygonButtonClass} type="button" onClick={() => updateMode('polygon')}> </button>
      <button className={textButtonClass} type="button" onClick={() => updateMode('text')}> </button>
      <div className="annotation-label">ANNOTATION TOOLS</div>
    </div>
  );
}

export default AnnotationBar;
