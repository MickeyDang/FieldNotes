import React, { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Col,
} from 'react-bootstrap';
import _ from 'lodash';
import searchData from '../services/SearchService';
import findDateRange from '../services/FindDateRange';
import ListPanel from './ListPanel';
import MapPanel from './MapPanel';
import './SelectedProjectPage.css';
import { BoundingBox } from '../models/types';

function SelectedProjectPage() {
  const [searchParams, setSearchParams] = useState({});
  const [reports, setReports] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [dateRange, setDateRange] = useState({});

  const executeSearch = useCallback(async () => {
    const response = await searchData(searchParams);
    setReports(response.reports);
    setRelationships(response.relationships);
  }, [searchParams]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  useEffect(() => {
    // declare the data fetching function
    console.log('testttttttt');
    const fetchData = async () => {
      const response = await findDateRange();
      console.log('SelectedProjPage, res: ', response);
      setDateRange(response);
    };

    // call the function
    fetchData()
      // make sure to catch any error
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
