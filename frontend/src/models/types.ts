export type BoundingBox = [[number, number], [number, number]];

export interface SearchParameters {
  searchQuery?: string[];
  boundingBox?: BoundingBox;
  sortQuery?: string[];
}

export type ReportProperties = {
  properties: {
    name: string
    tags: string[]
    creationDate: string
  }
}

export type RelationshipProperties = {
  properties: {
    name: string,
    type: string,
    lastContacted: Date,
    reports: any[],
  }
}
