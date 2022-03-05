/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import './KeywordOverview.css';
import { TagCount } from '../models/types';
import KeywordOverviewItem from './KeywordOverviewItem';

interface KeywordOverviewProps {
    tagsSummary: TagCount[],
    totalDataPoints: number,
    appendSearchQuery: Function,
  }

function KeywordOverview({
  tagsSummary,
  totalDataPoints,
  appendSearchQuery,
}: KeywordOverviewProps) {
  // eslint-disable-next-line no-unused-vars
//   const [colour, setColour] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [appendKeywords, setAppendKeywords] = useState<string[]>([]);

  const handleClick = (searchKeyword: string, colour: string, setColour: Function) => {
    // user has selected this keyword, append
    if (colour === '') {
      setColour('#D7CFBE');
      setAppendKeywords([...appendKeywords, searchKeyword]);
    } else {
      setColour('');
      //   console.log('try removing word: ', appendKeywords.filter((item) => item !== searchKeyword));
      setAppendKeywords(appendKeywords.filter((item) => item !== searchKeyword));
    }
  };

  useEffect(() => {
    appendSearchQuery(appendKeywords);
  }, [appendKeywords]);

  const handleKeyPress = (event: any, searchKeyword: string, colour: string, setColour: Function) => {
    if (event.key === 'Enter') {
      setColour(colour === '' ? '#D7CFBE' : '');
      setAppendKeywords(colour === '' ? ([...appendKeywords, searchKeyword]) : appendKeywords.filter((item) => item !== searchKeyword));
    }
  };

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
          <KeywordOverviewItem tagCount={tagCount} handleClick={handleClick} handleKeyPress={handleKeyPress} />
        ))}
      </div>
    </div>
  );
}

export default KeywordOverview;
