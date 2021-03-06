import React from 'react';
import { RelationshipProperties } from '../models/types';
import './RelationshipListItem.css';

interface RelationshipListItemProps {
  relationship: RelationshipProperties,
  isInProject: boolean,
  onToggle: Function,
}

function RelationshipListItem({ relationship, isInProject, onToggle }: RelationshipListItemProps) {
  const handleToggle = () => {
    onToggle(relationship.properties.id, !isInProject);
  };

  const buttonPrompt = isInProject ? 'x' : '+';
  const tooltipPrompt = isInProject ? 'Remove from Notebook' : 'Add to Notebook';
  const headerStyle = isInProject ? 'project-list-item-header' : 'list-item-header';

  return (
    <div className="search-item-container">
      <div className="item-details-container">
        <div className={headerStyle}>{relationship.properties.name}</div>
        <div className="description">
          <span className="tag-color">{relationship.properties.type}</span>
          {' '}
          <span className="dot">&#8226;</span>
          {' '}
          <span className="date-color">
            Last contacted
            {' '}
            {new Date(relationship.properties.lastContacted).toLocaleDateString()}
          </span>
        </div>
      </div>
      <button type="button" className="toggle-button" onClick={handleToggle}>
        <span className="tooltiptext">{tooltipPrompt}</span>
        <span className="toggle-button-text">{buttonPrompt}</span>
      </button>
    </div>
  );
}

export default RelationshipListItem;
