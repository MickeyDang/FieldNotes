import React from 'react';
import { ReportProperties } from '../models/types';
import NotebookReportListItem from './NotebookReportListItem';
import ReportListItem from './ReportListItem';

interface ReportListProps {
  reports: ReportProperties[],
  isSearchMode: boolean,
}

function ReportList({ reports, isSearchMode }: ReportListProps) {
  return (
    <>
      {reports.map((report) => (
        isSearchMode
          ? <ReportListItem key={report.properties.name} report={report} />
          : <NotebookReportListItem key={report.properties.name} report={report} />
      ))}
    </>
  );
}

export default ReportList;
