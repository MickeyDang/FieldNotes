import React from 'react';
import { RelationshipProperties } from '../models/types';
import RelationshipListItem from './RelationshipListItem';

interface RelationshipListProps {
  relationships: RelationshipProperties[]
}

function RelationshipList({ relationships }: RelationshipListProps) {
  return (
    <>
      {relationships.map((rel, index) => (
        <RelationshipListItem
          key={index.toString()}
          relationship={rel}
        />
      ))}
    </>
  );
}

export default RelationshipList;
