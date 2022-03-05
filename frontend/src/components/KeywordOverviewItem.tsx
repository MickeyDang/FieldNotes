import React, { useState } from 'react';
import './KeywordOverviewItem.css';
import { TagCount } from '../models/types';

interface KeywordOverviewItemProps {
    tagCount: TagCount,
    handleClick: Function,
    handleKeyPress: Function,
  }

function KeywordOverviewItem({ tagCount, handleClick, handleKeyPress }: KeywordOverviewItemProps) {
  const [colour, setColour] = useState('');

  const tag = tagCount[0];
  const count = tagCount[1];
  return (
    <div className="row keyword-overview-items" key={tag} onClick={() => handleClick(tag, colour, setColour)} style={{ background: colour }} role="button" onKeyPress={(e) => handleKeyPress(e, tag, colour, setColour)} tabIndex={0}>
      <div className="col-10">
        {tag}
      </div>
      <div className="col-2 text-end">
        {count}
      </div>
    </div>
  );
}

export default KeywordOverviewItem;
