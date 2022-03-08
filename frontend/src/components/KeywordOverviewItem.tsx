import React from 'react';
import './KeywordOverviewItem.css';
import { TagCount } from '../models/types';

interface KeywordOverviewItemProps {
    tagCount: TagCount,
  }

function KeywordOverviewItem({ tagCount }: KeywordOverviewItemProps) {
  const tag = tagCount[0];
  const count = tagCount[1];

  return (
    <div className="row keyword-overview-items" key={tag}>
      <div className="col-10 keyword-overview-label">
        {tag}
      </div>
      <div className="col-2 text-end keyword-overview-count">
        {count}
      </div>
    </div>
  );
}

export default KeywordOverviewItem;
