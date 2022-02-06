<<<<<<< HEAD
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import searchData, { BoundingBox } from '../services/SearchService';
=======
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import getAllData from '../services/SearchService';
>>>>>>> b8cd68c (setting up frontend search service)
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
  const [reports, setReports] = useState({});
  const [relationships, setRelationships] = useState({});

  const executeSearch = useCallback(async () => {
    const response = await searchData(searchParams);
    setReports(response.reports);
    setRelationships(response.relationships);
  }, [searchParams]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  const updateSearchQuery = (updatedSearchQuery: string[]) => {
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

  const clearQuery = () => setSearchParams({});

  return (
    <>
      <p>This is the Selected Project Page</p>
      <button type="button" onClick={clearQuery}>Clear All Filters</button>
      <div className="container">
        <ListPanel
          onSearchChange={updateSearchQuery}
        />
        <MapPanel
          reportResults={reports}
          relationshipResults={relationships}
          onBoundingBoxChange={updateBoundingBoxQuery}
        />
      </div>
    </>
  );
}

export default SelectedProjectPage;
