import React, { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Col,
} from 'react-bootstrap';
import _ from 'lodash';
import searchData from '../services/SearchService';
import findDateRange from '../services/DateRangeService';
import ListPanel from './ListPanel';
import MapPanel from './MapPanel';
import './SelectedProjectPage.css';
import { BoundingBox, DateRangeProperties } from '../models/types';

function SelectedProjectPage() {
  const [searchParams, setSearchParams] = useState({});
  const [reports, setReports] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [dateRange, setDateRange] = useState({} as DateRangeProperties);

  const executeSearch = useCallback(async () => {
    const response = await searchData(searchParams);
    setReports(response.reports);
    setRelationships(response.relationships);
  }, [searchParams]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  // Get oldest and newest dates for time range filter
  useEffect(() => {
    const fetchData = async () => {
      const response: DateRangeProperties = await findDateRange();
      setDateRange(response);
    };

    fetchData()
      .catch(console.error);
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

  return (
    <Container className="project-view">
      <Col xs={8} md={6} lg={5}>
        <ListPanel
          reportResults={reports}
          relationshipResults={relationships}
          onSearchChange={updateSearchQuery}
          onTimeRangeChange={updateTimeRange}
          dateRangeResults={dateRange}
        />
      </Col>
      <Col xs={4} md={6} lg={7}>
        <MapPanel
          reportResults={reports}
          relationshipResults={relationships}
          onBoundingBoxChange={updateBoundingBoxQuery}
        />
      </Col>
    </Container>
  );
}

export default SelectedProjectPage;
