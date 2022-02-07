export type BoundingBox = [[number, number], [number, number]];

export interface SearchParameters {
  searchQuery?: string[];
  boundingBox?: BoundingBox;
}

type RelationshipFeature = {
  location: { coordinates: any[]; };
  _id: any;
  name: any;
  type: any;
  lastContacted: any;
  reports: any;
};

type ReportFeature = {
  location: { coordinates: any[]; };
  name: any;
}

function formatParameters(params: SearchParameters) {
  const bottomLeftLatLng = params.boundingBox?.[0];
  const topRightLatLng = params.boundingBox?.[1];

  console.log(bottomLeftLatLng);
  console.log(topRightLatLng);
  return {
    query: params.searchQuery?.join(',') ?? '',
    box: bottomLeftLatLng && topRightLatLng
      ? `${bottomLeftLatLng[0]},${bottomLeftLatLng[1]},${topRightLatLng[0]},${topRightLatLng[1]}`
      : '',
  };
}

async function getReports() {
  const res = await fetch('http://localhost:8000/reports/');
  const data = await res.json();

  // shape into valid geojson for adding to the map
  const reports = data.map((report: ReportFeature) => (
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [report.location.coordinates[0]],
      },
      properties: {
        name: report.name,
      },
    }
  ));

  return reports;
}

async function getRelationships() {
  const res = await fetch('http://localhost:8000/relationships/');
  const data = await res.json();

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
        // eslint-disable-next-line no-underscore-dangle
        id: rel._id,
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
  console.debug(`Response: ${JSON.stringify(res)}`);

  const allData = {
    reports: await getReports(),
    relationships: await getRelationships(),
  };

  return allData;
}

export default searchData;
