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
        // eslint-disable-next-line no-underscore-dangle
        id: report._id,
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
        // eslint-disable-next-line no-underscore-dangle
        id: rel._id,
      },
    }
  ));

  return relationships;
}

export function formatTagSummary(data: any) {
  const reportsTags = formatReports(data).properties.tags;
  const relationshipsTags = formatRelationships(data).properties.tags;
  const tags = [...reportsTags, ...relationshipsTags];
  const tagSummary = tags.reduce((total, value) => {
    // eslint-disable-next-line no-param-reassign
    total[value] = (total[value] || 0) + 1;
    return total;
  }, {});
  console.log('group by: ', tagSummary);

  return tagSummary;
}
