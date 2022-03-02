import React from 'react';
import { RelationshipProperties, ReportProperties } from '../models/types';
import RelationshipList from './RelationshipList';
import ReportList from './ReportList';
import './NotebookPanel.css';

interface NotebookPanelProps {
  reportResults: ReportProperties[],
  relationshipResults: RelationshipProperties[],
}

function NotebookPanel({ reportResults, relationshipResults }: NotebookPanelProps) {
  return (
    <div className="notebook-container">
      <h1 className="notebook-title"> Notebook Panel</h1>
      <ReportList reports={reportResults} isSearchMode={false} />
      <RelationshipList relationships={relationshipResults} isSearchMode={false} />
    </div>
  );
}

export default NotebookPanel;
