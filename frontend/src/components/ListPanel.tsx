import React from 'react';
import {
  Container,
  Row,
  Col,
  Accordion,
} from 'react-bootstrap';
import { RelationshipProperties, ReportProperties } from '../models/types';
import './ListPanel.css';
import RelationshipList from './RelationshipList';
import ReportList from './ReportList';

interface ListPanelProps {
  reportResults: ReportProperties[],
  relationshipResults: RelationshipProperties[],
  onSearchChange: Function,
}

function ListPanel({ onSearchChange, reportResults, relationshipResults }: ListPanelProps) {
  // TODO: make the search query change based on form input.
  const updateSearch = () => onSearchChange(['Temperature']);

  return (
    <Container fluid className="list-container">
      <Row>
        <Col>
          Searchbar
          <button type="button" onClick={updateSearch}>Search for Keywords</button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Accordion defaultActiveKey={['reports', 'relationships']} flush alwaysOpen>

            <Accordion.Item eventKey="reports">
              <Accordion.Header> Reports </Accordion.Header>
              <Accordion.Body>
                <ReportList reports={reportResults} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="relationships">
              <Accordion.Header> Relationships </Accordion.Header>
              <Accordion.Body>
                <RelationshipList relationships={relationshipResults} />
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default ListPanel;
