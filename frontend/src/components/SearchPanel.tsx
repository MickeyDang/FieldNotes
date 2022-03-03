import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Accordion,
  Card,
} from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import { Chip, TextField } from '@mui/material';
import Slider from '@mui/material/Slider';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  RelationshipProperties, ReportProperties, DateRangeProperties, Annotations,
} from '../models/types';
import './SearchPanel.css';
import RelationshipList from './RelationshipList';
import ReportList from './ReportList';
import hints from '../constants';
import ContextAwareToggle from './ContextAwareToggle';
import PaginationSelector from './PaginationSelector';

interface SearchPanelProps {
  reportResults: ReportProperties[],
  relationshipResults: RelationshipProperties[],
  dateRangeResults: DateRangeProperties,
  onSearchChange: Function,
  onTimeRangeChange: Function,
  onSortChange: Function,
  annotations: Annotations,
}

const PAGE_LENGTH = 6;

function SearchPanel({
  onSearchChange,
  onSortChange,
  onTimeRangeChange,
  reportResults,
  relationshipResults,
  dateRangeResults,
  // Remove this statement once annotations is implemented
  // eslint-disable-next-line no-unused-vars
  annotations,
}: SearchPanelProps) {
  const updateSearch = (_: any, values: string[]) => onSearchChange(values);
  const updateTimeRange = (values: number[]) => onTimeRangeChange(values);
  const updateSort = (values: string[]) => onSortChange(values);

  const maxMonths = dateRangeResults.monthsInRange ?? 0;
  const defaultTimeRange = [0, maxMonths];

  const [timeRange, setTimeRange] = useState<number[]>(defaultTimeRange);
  const [reportCursor, setReportCursor] = useState(0);
  const [relCursor, setRelCursor] = useState(0);
  const [sortReports, setSortReports] = useState('creationDate');
  const [sortRelationships, setSortRelationships] = useState('name');

  const handleReportCursorNext = () => setReportCursor(reportCursor + PAGE_LENGTH);
  const handleReportCursorPrev = () => setReportCursor(reportCursor - PAGE_LENGTH);
  const handleRelCursorNext = () => setRelCursor(relCursor + PAGE_LENGTH);
  const handleRelCursorPrev = () => setRelCursor(relCursor - PAGE_LENGTH);

  const marks = [
    {
      value: 0,
      label: dateRangeResults.oldestDateDisplay,
    },
    {
      value: maxMonths,
      label: dateRangeResults.newestDateDisplay,
    },
  ];

  const handleTimeRangeChange = (event: Event, newValue: number | number[]) => {
    setTimeRange(newValue as number[]);
    const newTimeValues = [
      newValue,
      dateRangeResults.oldestYearMonth,
      dateRangeResults.newestYearMonth,
      maxMonths,
    ];
    updateTimeRange(newTimeValues as number[]);
  };

  const handleSortReportsChange = (event: SelectChangeEvent) => {
    setSortReports(event.target.value as string);
  };

  const handleSortRelationshipsChange = (event: SelectChangeEvent) => {
    setSortRelationships(event.target.value as string);
  };

  useEffect(() => {
    updateSort([sortReports, sortRelationships]);
  }, [sortReports, sortRelationships]);

  useEffect(() => {
    setTimeRange(defaultTimeRange);
    const newTimeValues = [
      defaultTimeRange,
      dateRangeResults.oldestYearMonth,
      dateRangeResults.newestYearMonth,
      maxMonths,
    ];
    updateTimeRange(newTimeValues as number[]);
  }, [maxMonths]);

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
              <Slider
                id="time-range-slider"
                value={timeRange}
                onChange={handleTimeRangeChange}
                valueLabelDisplay="auto"
                defaultValue={[0, maxMonths]}
                step={1}
                marks={marks}
                min={0}
                max={maxMonths}
                classes={{
                  markLabel: 'fieldnotes-mark-label',
                }}
              />
              <ReportList
                isSearchMode
                reports={reportResults.slice(reportCursor, reportCursor + PAGE_LENGTH)}
              />
              <div className="footer-container">
                <FormControl
                  hiddenLabel
                  size="small"
                  variant="filled"
                  id="sort-reports-form"
                >
                  <Select
                    autoWidth
                    variant="standard"
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
              </div>
            </Card.Body>
          </Accordion.Collapse>
          <ContextAwareToggle textBody="Relationships" numItems={relationshipResults.length} eventKey="relationships" />
          <Accordion.Collapse className="section-body" eventKey="relationships">
            <Card.Body>
              <RelationshipList
                isSearchMode
                relationships={relationshipResults.slice(relCursor, relCursor + PAGE_LENGTH)}
              />
              <div className="footer-container">
                <FormControl
                  hiddenLabel
                  size="small"
                  variant="filled"
                  id="sort-relationships-form"
                >
                  <Select
                    autoWidth
                    variant="standard"
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
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Accordion>
      </Row>
    </Container>
  );
}

export default SearchPanel;