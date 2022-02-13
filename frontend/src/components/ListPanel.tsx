import React, { useState } from 'react';
import {
  Container,
  Row,
  Accordion,
} from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import { Chip, TextField } from '@mui/material';
import Slider from '@mui/material/Slider';
import { RelationshipProperties, ReportProperties, DateRangeProperties } from '../models/types';
import './ListPanel.css';
import RelationshipList from './RelationshipList';
import ReportList from './ReportList';
import hints from '../constants';

interface ListPanelProps {
  reportResults: ReportProperties[],
  relationshipResults: RelationshipProperties[],
  onSearchChange: Function,
  onTimeRangeChange: Function,
  dateRangeResults: DateRangeProperties,
}

function ListPanel({
  onSearchChange, onTimeRangeChange, reportResults, relationshipResults, dateRangeResults,
}: ListPanelProps) {
  const updateSearch = (_: any, values: string[]) => onSearchChange(values);
  const updateTimeRange = (values: number[]) => onTimeRangeChange(values);

  console.log('in listpanel, daterange: ', dateRangeResults.monthsInRange);
  // const numMonths = (dateRangeResults.newestYear)

  const maxMonths = dateRangeResults.monthsInRange ?? 0;
  const [timeRange, setTimeRange] = useState<number[]>([0, maxMonths]);

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

  const handleChange = (event: Event, newValue: number | number[]) => {
    setTimeRange(newValue as number[]);
    const newTimeValues = [
      newValue,
      dateRangeResults.oldestYearMonth,
      dateRangeResults.newestYearMonth,
      maxMonths,
    ];
    console.log('sending: ', newTimeValues);
    updateTimeRange(newTimeValues as number[]);
  };

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
      <Row className="time-slider-container">
        <Slider
          // getAriaLabel={() => ''}
          value={timeRange}
          onChange={handleChange}
          valueLabelDisplay="auto"
          defaultValue={maxMonths}
          step={1}
          marks={marks}
          min={0}
          max={maxMonths}
          color="primary"
          // getAriaValueText={timeRange}
        />
      </Row>
      <Row>
        <Accordion defaultActiveKey={['reports', 'relationships']} flush alwaysOpen>
          <Accordion.Item eventKey="reports">
            <Accordion.Header> Reports </Accordion.Header>
            <Accordion.Body className="section-body">
              <ReportList reports={reportResults} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="relationships">
            <Accordion.Header> Relationships </Accordion.Header>
            <Accordion.Body className="section-body">
              <RelationshipList relationships={relationshipResults} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
    </Container>
  );
}

export default ListPanel;
