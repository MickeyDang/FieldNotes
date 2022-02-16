import React from 'react';
import { ReportProperties } from '../models/types';
import './ReportListItem.css';

interface ReportListItemProps {
  report: ReportProperties
}

function ReportListItem({ report }: ReportListItemProps) {
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
      <div className="list-item-header">{report.properties.name}</div>
      <div className="description">
        <span className="tag-color">{formatTags(report.properties.tags)}</span>
        {' '}
        <span className="dot">&#8226;</span>
        {' '}
        <span className="date-color">{new Date(report.properties.creationDate).toLocaleDateString()}</span>
      </div>
    </>
  );
}

export default ReportListItem;
