import React from 'react';
import { RelationshipProperties } from '../models/types';
import NotebookRelationshipListItem from './NotebookRelationshipListItem';
import RelationshipListItem from './RelationshipListItem';

interface RelationshipListProps {
  relationships: RelationshipProperties[],
  isSearchMode: boolean,
  projectRelIds: string[],
}

function RelationshipList({ relationships, isSearchMode, projectRelIds }: RelationshipListProps) {
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
