import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import getAllData from '../services/SearchService';
import ListPanel from './ListPanel';
import MapPanel from './MapPanel';
import './SelectedProjectPage.css';

type BoundingBox = [[number, number], [number, number]];

export interface SearchParameters {
  searchQuery?: string[];
  boundingBox?: BoundingBox;
}

function SelectedProjectPage() {
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    getAllData(searchParams);
  }, [searchParams]);

  const updateSearchQuery = (updatedSearchQuery: string) => {
    const updatedParams = { ...searchParams, searchQuery: updatedSearchQuery };
    if (!_.isEqual(updatedParams, searchParams)) {
      setSearchParams(updatedParams);
    }
  };

  const updateBoundingBoxQuery = (updatedBoundingBoxQuery: BoundingBox) => {
    const updatedParams = { ...searchParams, boundingBox: updatedBoundingBoxQuery };
    if (!_.isEqual(updatedParams, searchParams)) {
      setSearchParams(updatedParams);
    }
  };

  return (
    <>
      <p>This is the Selected Project Page</p>
      <div className="container">
        <ListPanel
          onSearchChange={updateSearchQuery}
        />
        <MapPanel
          onBoundingBoxChange={updateBoundingBoxQuery}
        />
      </div>
    </>
  );
}

export default SelectedProjectPage;
