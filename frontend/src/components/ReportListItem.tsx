import React from 'react';
import { ReportProperties } from '../models/types';
import './ReportListItem.css';

interface ReportListItemProps {
  report: ReportProperties,
  isInProject: boolean,
<<<<<<< HEAD
  onToggle: Function,
}

function ReportListItem({ report, isInProject, onToggle }: ReportListItemProps) {
=======
}

function ReportListItem({ report, isInProject }: ReportListItemProps) {
>>>>>>> 82a94f8 (displayed togglable button for each list item)
  const formatTags = (tags: string[]) => (
    // eslint-disable-next-line no-nested-ternary
    tags.length > 1
      ? `${tags[0]} and more...`
      : tags.length > 0
        ? tags[0]
        : ''
  );

  const buttonPrompt = isInProject ? '-' : '+';

<<<<<<< HEAD
  const handleToggle = () => {
    onToggle(report.properties.id, !isInProject);
  };

=======
>>>>>>> 82a94f8 (displayed togglable button for each list item)
  return (
    <>
      <div className="list-item-header">{report.properties.name}</div>
      <div className="description">
        <span className="tag-color">{formatTags(report.properties.tags)}</span>
        {' '}
        <span className="dot">&#8226;</span>
        {' '}
        <span className="date-color">{new Date(report.properties.creationDate).toLocaleDateString()}</span>
      </div>
<<<<<<< HEAD
      <button type="button" onClick={handleToggle}>{buttonPrompt}</button>
=======
      <button type="button">{buttonPrompt}</button>
>>>>>>> 82a94f8 (displayed togglable button for each list item)
    </>
  );
}

export default ReportListItem;
