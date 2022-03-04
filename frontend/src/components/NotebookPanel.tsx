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
}

function NotebookPanel({ reportResults, relationshipResults, project }: NotebookPanelProps) {
  return (
    <div className="notebook-container">
      <NotebookHeader textValue="Data" numItems={reportResults.length + relationshipResults.length} />
      <ReportList
        reports={reportResults}
        isSearchMode={false}
        projectRepIds={project.repIds}
      />
      <RelationshipList
        relationships={relationshipResults}
        isSearchMode={false}
        projectRelIds={project.relIds}
      />
      <hr className="nb-divider" />
      <NotebookHeader textValue="Annotations" numItems={0} />
    </div>
  );
}

export default NotebookPanel;
