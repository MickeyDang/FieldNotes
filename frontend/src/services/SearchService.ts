import { SearchParameters } from '../models/types';

type RelationshipFeature = {
  location: { coordinates: number[]; };
  name: string;
  type: string;
  lastContacted: Date;
  reports: any;
};

type ReportFeature = {
  location: { coordinates: number[]; };
  name: string;
  tags: string[];
  creationDate: Date;
}

function formatParameters(params: SearchParameters) {
  const bottomLeftLatLng = params.boundingBox?.[0];
  const topRightLatLng = params.boundingBox?.[1];
  return {
    query: params.searchQuery?.join(',') ?? '',
    box: bottomLeftLatLng && topRightLatLng
      ? `${bottomLeftLatLng[0]},${bottomLeftLatLng[1]},${topRightLatLng[0]},${topRightLatLng[1]}`
      : '',
    time: `${params.timeRange}` ?? '',
    sortOrderParams: params.sortQuery?.join(',') ?? '',
  };
}

function formatReports(data: any) {
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

function formatRelationships(data: any) {
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
      },
    }
  ));

  return relationships;
}

async function searchData(params: SearchParameters) {
  const res = await (await fetch(`http://localhost:8000/alldata?${new URLSearchParams(formatParameters(params))}`)).json();

  const allData = {
    reports: formatReports(res.reports),
    relationships: formatRelationships(res.relationships),
  };

  return allData;
}

export default searchData;
