import React from 'react';
import './NotebookHeader.css';

function NotebookHeader({ textValue, numItems }: any) {
  return (
    <p className="nb-title-badge-container" style={{ color: '#2A2925' }}>
      <span className="nb-section-title">{textValue}</span>
      {' '}
      <span
        style={{ backgroundColor: '#00000010', color: '#5F5B51' }}
        className="nb-badge"
      >
        {numItems}
      </span>
    </p>
  );
}

export default NotebookHeader;
