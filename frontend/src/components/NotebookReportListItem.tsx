import React from 'react';
import { ReportProperties } from '../models/types';
import './NotebookListItem.css';

interface ReportListItemProps {
  report: ReportProperties
}

function NotebookReportListItem({ report }: ReportListItemProps) {
  const formatTags = (tags: string[]) => (
    // eslint-disable-next-line no-nested-ternary
    tags.length > 1
      ? `${tags[0]} and more...`
      : tags.length > 0
        ? tags[0]
        : ''
  );

  return (
    <>
      <div className="nb-list-item-header">{report.properties.name}</div>
      <div className="nb-description">
        <span className="nb-tag-color">{formatTags(report.properties.tags)}</span>
        {' '}
        <span className="nb-dot">&#8226;</span>
        {' '}
        <span className="nb-date-color">{new Date(report.properties.creationDate).toLocaleDateString()}</span>
      </div>
    </>
  );
}

export default NotebookReportListItem;
