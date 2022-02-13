import React from 'react';
import { RelationshipProperties } from '../models/types';
import './RelationshipListItem.css';

interface RelationshipListItemProps {
  relationship: RelationshipProperties
}

function RelationshipListItem({ relationship }: RelationshipListItemProps) {
  return (
    <>
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
    </>
  );
}

export default RelationshipListItem;
