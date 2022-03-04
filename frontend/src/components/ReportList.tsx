import React from 'react';
import { ReportProperties } from '../models/types';
import NotebookReportListItem from './NotebookReportListItem';
import ReportListItem from './ReportListItem';

interface ReportListProps {
  reports: ReportProperties[],
  isSearchMode: boolean,
  projectRepIds: string[],
<<<<<<< HEAD
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

=======
}

function ReportList({ reports, isSearchMode, projectRepIds }: ReportListProps) {
>>>>>>> 82a94f8 (displayed togglable button for each list item)
  return (
    <>
      {reports.map((report) => (
        isSearchMode
          ? (
            <ReportListItem
              key={report.properties.id}
              report={report}
              isInProject={projectRepIds.includes(report.properties.id)}
<<<<<<< HEAD
              onToggle={handleReportToggled}
=======
>>>>>>> 82a94f8 (displayed togglable button for each list item)
            />
          )
          : <NotebookReportListItem key={report.properties.id} report={report} />
      ))}
    </>
  );
}

export default ReportList;
