import React from 'react';
import { RelationshipProperties } from '../models/types';
import NotebookRelationshipListItem from './NotebookRelationshipListItem';
import RelationshipListItem from './RelationshipListItem';

interface RelationshipListProps {
  relationships: RelationshipProperties[],
  isSearchMode: boolean,
}

function RelationshipList({ relationships, isSearchMode }: RelationshipListProps) {
  return (
    <>
      {relationships.map((rel) => (
        isSearchMode
          ? (
            <RelationshipListItem
              key={rel.properties.id}
              relationship={rel}
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
