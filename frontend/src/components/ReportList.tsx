import React from 'react';
import { ReportProperties } from '../models/types';
import ReportListItem from './ReportListItem';

interface ReportListProps {
  reports: ReportProperties[]
}

function ReportList({ reports }: ReportListProps) {
  return (
    <>
      {reports.map((report, index) => <ReportListItem key={index.toString()} report={report} />)}
    </>
  );
}

export default ReportList;
