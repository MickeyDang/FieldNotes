import React from 'react';
import {
  Col,
  Row,
} from 'react-bootstrap';
import { ReportProperties } from '../models/types';
import './ReportListItem.css';

interface ReportListItemProps {
  report: ReportProperties
}

function ReportListItem({ report }: ReportListItemProps) {
  const formatTags = (tags: string[]) => (
    // eslint-disable-next-line no-nested-ternary
    tags.length > 1
      ? `${tags[0]} and more...`
      : tags.length > 0
        ? tags[0]
        : ''
  );

  return (
    <Col>
      <Row className="header">{report.properties.name}</Row>
      <Row className="description">
        {formatTags(report.properties.tags)}
        {' '}
        &#8226;
        {' '}
        {report.properties.creationDate}
      </Row>
    </Col>
  );
}

export default ReportListItem;
