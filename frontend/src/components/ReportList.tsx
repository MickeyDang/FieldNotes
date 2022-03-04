import React from 'react';
import { ReportProperties } from '../models/types';
import NotebookReportListItem from './NotebookReportListItem';
import ReportListItem from './ReportListItem';

interface ReportListProps {
  reports: ReportProperties[],
  isSearchMode: boolean,
  projectRepIds: string[],
}

function ReportList({ reports, isSearchMode, projectRepIds }: ReportListProps) {
  return (
    <>
      {reports.map((report) => (
        isSearchMode
          ? (
            <ReportListItem
              key={report.properties.id}
              report={report}
              isInProject={projectRepIds.includes(report.properties.id)}
            />
          )
          : <NotebookReportListItem key={report.properties.id} report={report} />
      ))}
    </>
  );
}

export default ReportList;
