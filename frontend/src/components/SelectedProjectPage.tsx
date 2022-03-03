import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import searchData from '../models/services/SearchService';
import findDateRange from '../models/services/DateRangeService';
import SearchPanel from './SearchPanel';
import MapPanel from './MapPanel';
import './SelectedProjectPage.css';
import { BoundingBox, DateRangeProperties, Annotations } from '../models/types';
import PanelNavigator from './PanelNavigator';
import NotebookPanel from './NotebookPanel';
import searchDataInProject from '../models/services/NotebookService';

function SelectedProjectPage() {
  const [searchParams, setSearchParams] = useState({});
  const [reports, setReports] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [dateRange, setDateRange] = useState({} as DateRangeProperties);
  const [annotations, setAnnotations] = useState({
    point: [],
    polygon: [],
    text: [],
  } as Annotations);
  const [isSearchMode, setIsSearchMode] = useState(true);

  const executeSearch = useCallback(async () => {
    const response = await searchData(searchParams);
    setReports(response.reports);
    setRelationships(response.relationships);
  }, [searchParams]);

  const executeNotebookSearch = useCallback(async () => {
    const response = await searchDataInProject('1234567890');
    setReports(response.reports);
    setRelationships(response.relationships);
  }, [isSearchMode]);

  useEffect(() => {
    if (isSearchMode) {
      executeSearch();
    } else {
      executeNotebookSearch();
    }
  }, [executeSearch, executeNotebookSearch]);

  // Get oldest and newest dates for time range filter
  useEffect(() => {
    const fetchData = async () => {
      const response: DateRangeProperties = await findDateRange();
      setDateRange(response);
    };

    fetchData().catch(console.error);
  }, []);

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

  const updateTimeRange = (updatedTimeRangeQuery: number[]) => {
    const updatedParams = { ...searchParams, timeRange: updatedTimeRangeQuery };
    if (!_.isEqual(updatedParams, searchParams)) {
      setSearchParams(updatedParams);
    }
  };

  const updateSortQuery = (updatedSortQuery: string[]) => {
    const updatedParams = { ...searchParams, sortQuery: updatedSortQuery };
    if (!_.isEqual(updatedParams, searchParams)) {
      setSearchParams(updatedParams);
    }
  };

  const handleSearchToggle = () => setIsSearchMode(true);

  const handleNotebookToggle = () => setIsSearchMode(false);

  return (
    <div className="project-view">
      <div className="list-panel-container">
        <PanelNavigator
          onSearchToggled={handleSearchToggle}
          onNotebookToggled={handleNotebookToggle}
        />
        {isSearchMode
          ? (
            <SearchPanel
              reportResults={reports}
              relationshipResults={relationships}
              onSearchChange={updateSearchQuery}
              onTimeRangeChange={updateTimeRange}
              dateRangeResults={dateRange}
              onSortChange={updateSortQuery}
              annotations={annotations}
            />
          ) : (
            <NotebookPanel
              reportResults={reports}
              relationshipResults={relationships}
            />
          )}
      </div>
      <div className="map-panel-container">
        <MapPanel
          reportResults={reports}
          relationshipResults={relationships}
          onBoundingBoxChange={updateBoundingBoxQuery}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
      </div>
    </div>
  );
}

export default SelectedProjectPage;
