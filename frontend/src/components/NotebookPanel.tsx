import React from 'react';
import { Project, RelationshipProperties, ReportProperties } from '../models/types';
import RelationshipList from './RelationshipList';
import ReportList from './ReportList';
import './NotebookPanel.css';
import NotebookHeader from './NotebookHeader';

interface NotebookPanelProps {
  reportResults: ReportProperties[],
  relationshipResults: RelationshipProperties[],
  project: Project,
  onProjectUpdate: Function,
}

function NotebookPanel({
  reportResults, relationshipResults, project, onProjectUpdate,
}: NotebookPanelProps) {
  const handleRepIdsUpdate = (repIds: string[]) => {
    onProjectUpdate({
      projectId: project.projectId,
      repIds,
      relIds: project.relIds,
    });
  };

  const handleRelIdsUpdate = (relIds: string[]) => {
    onProjectUpdate({
      projectId: project.projectId,
      repIds: project.repIds,
      relIds,
    });
  };

  return (
    <div className="notebook-container">
      <NotebookHeader textValue="Added Data Points" numItems={reportResults.length + relationshipResults.length} />
      <ReportList
        toDetails={() => console.log('No Operation on toDetails()')}
        reports={reportResults}
        isSearchMode={false}
        projectRepIds={project.repIds}
        onRepIdsUpdate={handleRepIdsUpdate}
      />
      <RelationshipList
        relationships={relationshipResults}
        isSearchMode={false}
        projectRelIds={project.relIds}
        onRelIdsUpdate={handleRelIdsUpdate}
      />
    </div>
  );
}

export default NotebookPanel;
