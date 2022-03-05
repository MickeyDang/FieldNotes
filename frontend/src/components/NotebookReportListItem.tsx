import React, { useState } from 'react';
import { ReportProperties } from '../models/types';
import './NotebookListItem.css';

interface ReportListItemProps {
  report: ReportProperties,
  onToggle: Function,
}

function NotebookReportListItem({ report, onToggle }: ReportListItemProps) {
  const [inProject, setInProject] = useState(true);

  const formatTags = (tags: string[]) => (
    // eslint-disable-next-line no-nested-ternary
    tags.length > 1
      ? `${tags[0]} and more...`
      : tags.length > 0
        ? tags[0]
        : ''
  );

  const handleToggle = () => {
    onToggle(report.properties.id, !inProject);
    setInProject(!inProject);
  };

  const buttonPrompt = inProject ? 'x' : '+';

  return (
    <div className="nb-list-item-container">
      <div className="nb-list-item-image">
        <img src="/report.png" alt="" height="16" />
      </div>
      <div className="nb-text-container">
        <div className="nb-list-item-header">{report.properties.name}</div>
        <div className="nb-description">
          <span className="nb-tag-color">{formatTags(report.properties.tags)}</span>
          {' '}
          <span className="nb-dot">&#8226;</span>
          {' '}
          <span className="nb-date-color">{new Date(report.properties.creationDate).toLocaleDateString()}</span>
        </div>
      </div>
      <button type="button" className="nb-toggle-button" onClick={handleToggle}>
        {buttonPrompt}
      </button>
    </div>
  );
}

export default NotebookReportListItem;
