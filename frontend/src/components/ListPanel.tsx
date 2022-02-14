import React from 'react';
import {
  Container,
  Row,
  Accordion,
  Card,
} from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import { Chip, TextField } from '@mui/material';
import { RelationshipProperties, ReportProperties } from '../models/types';
import './ListPanel.css';
import RelationshipList from './RelationshipList';
import ReportList from './ReportList';
import hints from '../constants';
import ContextAwareToggle from './ContextAwareToggle';

interface ListPanelProps {
  reportResults: ReportProperties[],
  relationshipResults: RelationshipProperties[],
  onSearchChange: Function,
}

function ListPanel({ onSearchChange, reportResults, relationshipResults }: ListPanelProps) {
  const updateSearch = (_: any, values: string[]) => onSearchChange(values);

  return (
    <Container fluid className="list-container">
      <Row className="searchbar-container">
        <Autocomplete
          className="searchbar"
          multiple
          selectOnFocus
          clearOnBlur
          options={hints}
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              hiddenLabel
              placeholder="keywords"
            />
          )}
          renderTags={(value, getTagProps) => value.map((option, index) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))}
          onChange={updateSearch}
        />
      </Row>
      <Row>
        <Accordion defaultActiveKey={['reports', 'relationships']} flush alwaysOpen>
          <ContextAwareToggle textBody="Reports" numItems={reportResults.length} eventKey="reports" />
          <Accordion.Collapse className="section-body" eventKey="reports">
            <Card.Body>
              <ReportList reports={reportResults} />
            </Card.Body>
          </Accordion.Collapse>
          <ContextAwareToggle textBody="Relationships" numItems={relationshipResults.length} eventKey="relationships" />
          <Accordion.Collapse className="section-body" eventKey="relationships">
            <Card.Body>
              <RelationshipList relationships={relationshipResults} />
            </Card.Body>
          </Accordion.Collapse>
        </Accordion>
      </Row>
    </Container>
  );
}

export default ListPanel;
