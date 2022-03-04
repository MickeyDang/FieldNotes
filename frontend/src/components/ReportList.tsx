import React from 'react';
import { ReportProperties } from '../models/types';
import NotebookReportListItem from './NotebookReportListItem';
import ReportListItem from './ReportListItem';

interface ReportListProps {
  reports: ReportProperties[],
  isSearchMode: boolean,
  projectRepIds: string[],
  onRepIdsUpdate: Function,
}

function ReportList({
  reports, isSearchMode, projectRepIds, onRepIdsUpdate,
}: ReportListProps) {
  const handleReportToggled = (relId: string, addingToProject: boolean) => {
    if (addingToProject) {
      projectRepIds.push(relId);
      onRepIdsUpdate(projectRepIds);
    } else {
      onRepIdsUpdate(projectRepIds.filter((id) => id !== relId));
    }
  };

  return (
    <>
      {reports.map((report) => (
        isSearchMode
          ? (
            <ReportListItem
              key={report.properties.id}
              report={report}
              isInProject={projectRepIds.includes(report.properties.id)}
              onToggle={handleReportToggled}
            />
          )
          : <NotebookReportListItem key={report.properties.id} report={report} />
      ))}
    </>
  );
}

export default ReportList;
