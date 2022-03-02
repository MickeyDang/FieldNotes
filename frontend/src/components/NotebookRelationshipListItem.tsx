import React from 'react';
import { RelationshipProperties } from '../models/types';
import './NotebookListItem.css';

interface RelationshipListItemProps {
  relationship: RelationshipProperties
}

function NotebookRelationshipListItem({ relationship }: RelationshipListItemProps) {
  return (
    <>
      <div className="nb-list-item-header">{relationship.properties.name}</div>
      <div className="nb-description">
        <span className="nb-tag-color">{relationship.properties.type}</span>
        {' '}
        <span className="nb-dot">&#8226;</span>
        {' '}
        <span className="nb-date-color">
          {new Date(relationship.properties.lastContacted).toLocaleDateString()}
        </span>
      </div>
    </>
  );
}

export default NotebookRelationshipListItem;
