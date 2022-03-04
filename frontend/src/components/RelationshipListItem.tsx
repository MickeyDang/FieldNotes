import React from 'react';
import { RelationshipProperties } from '../models/types';
import './RelationshipListItem.css';

interface RelationshipListItemProps {
  relationship: RelationshipProperties,
  isInProject: boolean,
  onToggle: Function,
}

function RelationshipListItem({ relationship, isInProject, onToggle }: RelationshipListItemProps) {
  const buttonPrompt = isInProject ? '-' : '+';

  const handleToggle = () => {
    onToggle(relationship.properties.id, !isInProject);
  };

  return (
    <div className="search-item-container">
      <div className="item-details-container">
        <div className="list-item-header">{relationship.properties.name}</div>
        <div className="description">
          <span className="tag-color">{relationship.properties.type}</span>
          {' '}
          <span className="dot">&#8226;</span>
          {' '}
          <span className="date-color">
            {new Date(relationship.properties.lastContacted).toLocaleDateString()}
          </span>
        </div>
      </div>
      <button type="button" className="toggle-button" onClick={handleToggle}>{buttonPrompt}</button>
    </div>
  );
}

export default RelationshipListItem;
