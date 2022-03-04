import React from 'react';
import { RelationshipProperties } from '../models/types';
import './RelationshipListItem.css';

interface RelationshipListItemProps {
  relationship: RelationshipProperties,
  isInProject: boolean,
<<<<<<< HEAD
  onToggle: Function,
}

function RelationshipListItem({ relationship, isInProject, onToggle }: RelationshipListItemProps) {
  const buttonPrompt = isInProject ? '-' : '+';

  const handleToggle = () => {
    onToggle(relationship.properties.id, !isInProject);
  };

=======
}

function RelationshipListItem({ relationship, isInProject }: RelationshipListItemProps) {
  const buttonPrompt = isInProject ? '-' : '+';

>>>>>>> 82a94f8 (displayed togglable button for each list item)
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
<<<<<<< HEAD
      <button type="button" onClick={handleToggle}>{buttonPrompt}</button>
=======
      <button type="button">{buttonPrompt}</button>
>>>>>>> 82a94f8 (displayed togglable button for each list item)
    </>
  );
}

export default RelationshipListItem;
