import React from 'react';
import { ReportProperties } from '../models/types';
import './ReportListItem.css';

interface ReportListItemProps {
  report: ReportProperties,
  isInProject: boolean,
  onToggle: Function,
  toDetails: Function,
}

function ReportListItem({
  report, isInProject, onToggle, toDetails,
}: ReportListItemProps) {
  const formatTags = (tags: string[]) => (
    // eslint-disable-next-line no-nested-ternary
    tags.length > 1
      ? `${tags[0]} and more...`
      : tags.length > 0
        ? tags[0]
        : ''
  );

  const buttonPrompt = isInProject ? 'x' : '+';
  const tooltipPrompt = isInProject ? 'Remove from Notebook' : 'Add to Notebook';
  const headerStyle = isInProject
    ? 'project-list-item-header'
    : 'list-item-header';

  const handleToggle = () => {
    onToggle(report.properties.id, !isInProject);
  };

  const goToDetails = () => toDetails(report);

  return (
    <div className="search-item-container">
      <button
        className="fn-hoverable-select item-details-container"
        type="button"
        onClick={goToDetails}
      >
        <div
          className={headerStyle}
        >
          {report.properties.name}
        </div>
        <div className="description">
          <span className="tag-color">{formatTags(report.properties.tags)}</span>
          {' '}
          <span className="dot">&#8226;</span>
          {' '}
          <span className="date-color">
            Created
            {' '}
            {new Date(report.properties.creationDate).toLocaleDateString()}
          </span>
        </div>
      </button>
      <button type="button" className="toggle-button" onClick={handleToggle}>
        <span className="tooltiptext">{tooltipPrompt}</span>
        <span className="toggle-button-text">{buttonPrompt}</span>
      </button>
    </div>
  );
}

export default ReportListItem;
