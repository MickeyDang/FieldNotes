import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Accordion,
  Card,
} from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import { Chip, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { RelationshipProperties, ReportProperties } from '../models/types';
import './ListPanel.css';
import RelationshipList from './RelationshipList';
import ReportList from './ReportList';
import hints from '../constants';
import ContextAwareToggle from './ContextAwareToggle';
import PaginationSelector from './PaginationSelector';

interface ListPanelProps {
  reportResults: ReportProperties[],
  relationshipResults: RelationshipProperties[],
  onSearchChange: Function,
  onSortChange: Function,
}

const PAGE_LENGTH = 6;

function ListPanel({
  onSearchChange, onSortChange, reportResults, relationshipResults,
}: ListPanelProps) {
  const updateSearch = (_: any, values: string[]) => onSearchChange(values);
  const updateSort = (values: string[]) => onSortChange(values);

  const [reportCursor, setReportCursor] = useState(0);
  const [relCursor, setRelCursor] = useState(0);
  const [sortReports, setSortReports] = useState('creationDate');
  const [sortRelationships, setSortRelationships] = useState('name');

  const handleReportCursorNext = () => setReportCursor(reportCursor + PAGE_LENGTH);
  const handleReportCursorPrev = () => setReportCursor(reportCursor - PAGE_LENGTH);
  const handleRelCursorNext = () => setRelCursor(relCursor + PAGE_LENGTH);
  const handleRelCursorPrev = () => setRelCursor(relCursor - PAGE_LENGTH);

  const handleSortReportsChange = (event: SelectChangeEvent) => {
    setSortReports(event.target.value as string);
  };
  const handleSortRelationshipsChange = (event: SelectChangeEvent) => {
    setSortRelationships(event.target.value as string);
  };

  useEffect(() => {
    updateSort([sortReports, sortRelationships]);
  }, [sortReports, sortRelationships]);

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
              <ReportList reports={reportResults.slice(reportCursor, reportCursor + PAGE_LENGTH)} />
              <FormControl fullWidth>
                <Select
                  labelId="sort-reports-on"
                  id="sort-reports-select"
                  value={sortReports}
                  label="Sort by"
                  onChange={handleSortReportsChange}
                >
                  <MenuItem value="creationDate">Created Date</MenuItem>
                  <MenuItem value="name">Alphabetical</MenuItem>
                </Select>
              </FormControl>
              <PaginationSelector
                items={reportResults}
                pageLimit={PAGE_LENGTH}
                cursor={reportCursor}
                onNext={handleReportCursorNext}
                onPrev={handleReportCursorPrev}
              />
            </Card.Body>
          </Accordion.Collapse>
          <ContextAwareToggle textBody="Relationships" numItems={relationshipResults.length} eventKey="relationships" />
          <Accordion.Collapse className="section-body" eventKey="relationships">
            <Card.Body>
              <RelationshipList
                relationships={relationshipResults.slice(relCursor, relCursor + PAGE_LENGTH)}
              />
              <FormControl fullWidth>
                <Select
                  labelId="sort-relationships-on"
                  id="sort-relationships-select"
                  value={sortRelationships}
                  label="Sort by"
                  onChange={handleSortRelationshipsChange}
                >
                  <MenuItem value="lastContacted">Last Contacted</MenuItem>
                  <MenuItem value="firstContacted">First Contacted</MenuItem>
                  <MenuItem value="name">Alphabetical</MenuItem>
                </Select>
              </FormControl>
              <PaginationSelector
                items={relationshipResults}
                pageLimit={PAGE_LENGTH}
                cursor={relCursor}
                onNext={handleRelCursorNext}
                onPrev={handleRelCursorPrev}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Accordion>
      </Row>
    </Container>
  );
}

export default ListPanel;
