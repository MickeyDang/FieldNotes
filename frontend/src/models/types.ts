export type BoundingBox = [[number, number], [number, number]];

export interface SearchParameters {
  searchQuery?: string[];
  boundingBox?: BoundingBox;
  timeRange?: number[];
  sortQuery?: string[];
}

export type ReportProperties = {
  properties: {
    name: string,
    tags: string[],
    creationDate: string,
    id: string,
  }
}

export type RelationshipProperties = {
  properties: {
    name: string,
    type: string,
    lastContacted: Date,
    reports: any[],
    id: string,
  }
}

export type DateRangeProperties = {
  oldestDateDisplay: string,
  newestDateDisplay: string,
  monthsInRange: number,
  oldestYearMonth: number[],
  newestYearMonth: number[],
}

export type Annotations = {
  point: number[],
  polygon: number[],
  text: string[],
}

export type RelationshipFeature = {
  location: { coordinates: number[]; };
  name: string;
  type: string;
  lastContacted: Date;
  reports: any;
  _id: string;
};

export type ReportFeature = {
  location: { coordinates: number[]; };
  name: string;
  tags: string[];
  creationDate: Date;
  _id: string;
}

export type Project = {
  repIds: string[];
  relIds: string[];
}
