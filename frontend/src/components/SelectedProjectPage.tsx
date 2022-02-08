import React, { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Col,
} from 'react-bootstrap';
import _ from 'lodash';
import searchData from '../services/SearchService';
import ListPanel from './ListPanel';
import MapPanel from './MapPanel';
import './SelectedProjectPage.css';
import { BoundingBox } from '../models/types';

function SelectedProjectPage() {
  const [searchParams, setSearchParams] = useState({});
  const [reports, setReports] = useState([]);
  const [relationships, setRelationships] = useState([]);

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
    <Container>
      <Col xs={8} md={6} lg={5}>
        <button type="button" onClick={clearQuery}>Clear All Filters</button>
        <ListPanel
          reportResults={reports}
          relationshipResults={relationships}
          onSearchChange={updateSearchQuery}
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
