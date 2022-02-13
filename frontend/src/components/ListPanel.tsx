import React from 'react';
import {
  Container,
  Row,
  Col,
  Accordion,
} from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import { Chip, TextField } from '@mui/material';
import { RelationshipProperties, ReportProperties } from '../models/types';
import './ListPanel.css';
import RelationshipList from './RelationshipList';
import ReportList from './ReportList';
import hints from '../constants';

interface ListPanelProps {
  reportResults: ReportProperties[],
  relationshipResults: RelationshipProperties[],
  onSearchChange: Function,
}

function ListPanel({ onSearchChange, reportResults, relationshipResults }: ListPanelProps) {
  const updateSearch = (_: any, values: string[]) => onSearchChange(values);

  return (
    <Container fluid className="list-container">
      <Row className="searchbar">
        <Col>
          <Autocomplete
            multiple
            selectOnFocus
            clearOnBlur
            options={hints}
            renderInput={(params) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                label="keywords"
              />
            )}
            renderTags={(value, getTagProps) => value.map((option, index) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))}
            onChange={updateSearch}
          />
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
