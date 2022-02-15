import React, { useEffect, useState } from 'react';
import './PaginationSelector.css';

interface PaginationSelectorProps {
  items: any[];
  pageLimit: number;
  cursor: number;
  onNext: Function;
  onPrev: Function;
}

function PaginationSelector({
  items, pageLimit, cursor, onNext, onPrev,
}: PaginationSelectorProps) {
  const [nextActive, setNextActive] = useState(true);
  const [prevActive, setPrevActive] = useState(false);

  const onNextClick = () => onNext();
  const onPrevClick = () => onPrev();

  useEffect(() => {
    if (cursor + pageLimit < items.length && !nextActive) {
      setNextActive(true);
    } else if (cursor + pageLimit >= items.length) {
      setNextActive(false);
    }

    if (cursor > 0 && !prevActive) {
      setPrevActive(true);
    } else if (cursor === 0) {
      setPrevActive(false);
    }
  });

  return (
    <div id="pagination-container">
      <button
        className="pagination-button"
        type="button"
        disabled={!prevActive}
        onClick={onPrevClick}
      >
        Previous
      </button>
      <button
        className="pagination-button"
        type="button"
        disabled={!nextActive}
        onClick={onNextClick}
      >
        Next
      </button>
    </div>
  );
}

export default PaginationSelector;
