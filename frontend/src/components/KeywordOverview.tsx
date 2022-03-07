import React from 'react';
import './KeywordOverview.css';
import { TagCount } from '../models/types';
import KeywordOverviewItem from './KeywordOverviewItem';

interface KeywordOverviewProps {
    tagsSummary: TagCount[],
    totalDataPoints: number,
  }

function KeywordOverview({ tagsSummary, totalDataPoints }: KeywordOverviewProps) {
  return (
    <div className="keyword-overview-container">
      <h3 className="keyword-overview-title">KEYWORD OVERVIEW</h3>
      <p className="keyword-overview-label">
        from
        {' '}
        {totalDataPoints}
        {' '}
        data points in this search
      </p>
      <div className="keyword-overview-list">
        {tagsSummary.map((tagCount) => (
          <KeywordOverviewItem tagCount={tagCount} />
        ))}
      </div>
    </div>
  );
}

export default KeywordOverview;
