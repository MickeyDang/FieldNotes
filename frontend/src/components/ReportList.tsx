import React from 'react';
import {
  Row,
} from 'react-bootstrap';
import { ReportProperties } from '../models/types';

interface ReportListProps {
  reports: ReportProperties[]
}

function ReportList({ reports }: ReportListProps) {
  return (
    <>
      {reports.map((report, index) => <Row key={index.toString()}>{report.properties.name}</Row>)}
    </>
  );
}

export default ReportList;
