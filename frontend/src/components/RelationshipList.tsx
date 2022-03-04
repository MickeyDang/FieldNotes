import React from 'react';
import { RelationshipProperties } from '../models/types';
import NotebookRelationshipListItem from './NotebookRelationshipListItem';
import RelationshipListItem from './RelationshipListItem';

interface RelationshipListProps {
  relationships: RelationshipProperties[],
  isSearchMode: boolean,
  projectRelIds: string[],
  onRelIdsUpdate: Function,
}

function RelationshipList({
  relationships, isSearchMode, projectRelIds, onRelIdsUpdate,
}: RelationshipListProps) {
  // eslint-disable-next-line no-unused-vars
  const handleRelationshipToggled = (relId: string, addingToProject: boolean) => {
    if (addingToProject) {
      projectRelIds.push(relId);
      onRelIdsUpdate(projectRelIds);
    } else {
      onRelIdsUpdate(projectRelIds.filter((id) => id !== relId));
    }
  };

  return (
    <>
      {relationships.map((rel) => (
        isSearchMode
          ? (
            <RelationshipListItem
              key={rel.properties.id}
              relationship={rel}
              isInProject={projectRelIds.includes(rel.properties.id)}
            />
          )
          : (
            <NotebookRelationshipListItem
              key={rel.properties.id}
              relationship={rel}
            />
          )
      ))}
    </>
  );
}

export default RelationshipList;
