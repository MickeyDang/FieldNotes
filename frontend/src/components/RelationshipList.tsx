import React from 'react';
import { RelationshipProperties } from '../models/types';
import NotebookRelationshipListItem from './NotebookRelationshipListItem';
import RelationshipListItem from './RelationshipListItem';

interface RelationshipListProps {
  relationships: RelationshipProperties[],
  isSearchMode: boolean,
  projectRelIds: string[],
<<<<<<< HEAD
  onRelIdsUpdate: Function,
}

function RelationshipList({
  relationships, isSearchMode, projectRelIds, onRelIdsUpdate,
}: RelationshipListProps) {
  const handleRelationshipToggled = (relId: string, addingToProject: boolean) => {
    if (addingToProject) {
      projectRelIds.push(relId);
      onRelIdsUpdate(projectRelIds);
    } else {
      onRelIdsUpdate(projectRelIds.filter((id) => id !== relId));
    }
  };

=======
}

function RelationshipList({ relationships, isSearchMode, projectRelIds }: RelationshipListProps) {
>>>>>>> 82a94f8 (displayed togglable button for each list item)
  return (
    <>
      {relationships.map((rel) => (
        isSearchMode
          ? (
            <RelationshipListItem
              key={rel.properties.id}
              relationship={rel}
              isInProject={projectRelIds.includes(rel.properties.id)}
<<<<<<< HEAD
              onToggle={handleRelationshipToggled}
=======
>>>>>>> 82a94f8 (displayed togglable button for each list item)
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
