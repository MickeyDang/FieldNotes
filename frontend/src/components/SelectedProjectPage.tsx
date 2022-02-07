import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import searchData, { BoundingBox } from '../services/SearchService';
import ListPanel from './ListPanel';
import MapPanel from './MapPanel';
import './SelectedProjectPage.css';

function SelectedProjectPage() {
  const [searchParams, setSearchParams] = useState({});
  const [reports, setReports] = useState({});
  const [relationships, setRelationships] = useState({});

  useEffect(() => {
    const executeSearch = async () => {
      const response = await searchData(searchParams);
      setReports(response.reports);
      setRelationships(response.relationships);
    };

    executeSearch();
  }, [searchParams]);

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
