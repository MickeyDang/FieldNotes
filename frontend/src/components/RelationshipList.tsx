import React from 'react';
import {
  Row,
} from 'react-bootstrap';
import { RelationshipProperties } from '../models/types';

interface RelationshipListProps {
  relationships: RelationshipProperties[]
}

function RelationshipList({ relationships }: RelationshipListProps) {
  return (
    <>
      {relationships.map((rels, index) => <Row key={index.toString()}>{rels.properties.name}</Row>)}
    </>
  );
}

export default RelationshipList;
