import React from 'react';
import './KeywordOverview.css';
import { TagCount } from '../models/types';

interface KeywordOverviewProps {
    tagsSummary: TagCount[],
    totalDataPoints: number,
  }

function KeywordOverview({ tagsSummary, totalDataPoints }: KeywordOverviewProps) {
  const listItems = tagsSummary.map((tagCount) => (
    <div className="row">
      <div className="col-sm">
        {tagCount[0]}
      </div>
      <div className="col-sm text-end">
        {tagCount[1]}
      </div>
    </div>
  ));

  return (
    <div className="keyword-overview-container">
      <h5 className="keyword-overview-title">KEYWORD OVERVIEW</h5>
      <p className="keyword-overview-label">
        from
        {' '}
        {totalDataPoints}
        {' '}
        data points in this search
      </p>
      {listItems}
    </div>
  );
}

export default KeywordOverview;
