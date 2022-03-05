import { RelationshipFeature, ReportFeature } from '../types';

export function formatReports(data: any) {
  const reports = data.map((report: ReportFeature) => (
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [report.location.coordinates[0]],
      },
      properties: {
        name: report.name,
        tags: report.tags,
        creationDate: report.creationDate,
      },
    }
  ));

  return reports;
}

export function formatRelationships(data: any) {
  const relationships = data.map((
    rel: RelationshipFeature,
  ) => (
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [rel.location.coordinates[0], rel.location.coordinates[1]],
      },
      properties: {
        name: rel.name,
        type: rel.type,
        lastContacted: rel.lastContacted,
        reports: rel.reports,
        tags: rel.tags,
      },
    }
  ));

  return relationships;
}
