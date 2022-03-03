import React from 'react';
import { RelationshipProperties, ReportProperties } from '../models/types';
import RelationshipList from './RelationshipList';
import ReportList from './ReportList';
import './NotebookPanel.css';
import NotebookHeader from './NotebookHeader';

interface NotebookPanelProps {
  reportResults: ReportProperties[],
  relationshipResults: RelationshipProperties[],
}

function NotebookPanel({ reportResults, relationshipResults }: NotebookPanelProps) {
  return (
    <div className="notebook-container">
      <NotebookHeader textValue="Data" numItems={reportResults.length + relationshipResults.length} />
      <ReportList reports={reportResults} isSearchMode={false} />
      <RelationshipList relationships={relationshipResults} isSearchMode={false} />
      <hr className="nb-divider" />
      <NotebookHeader textValue="Annotations" numItems={0} />
    </div>
  );
}

export default NotebookPanel;
