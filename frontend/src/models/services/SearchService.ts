import { SearchParameters } from '../types';
import { formatRelationships, formatReports } from './Utils';

const ROOT_URL = process.env.REACT_APP_ROOT_URL ? `${process.env.REACT_APP_ROOT_URL}` : 'http://localhost:8000';

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

async function searchData(params: SearchParameters) {
  const res = await (await fetch(`${ROOT_URL}/alldata?${new URLSearchParams(formatParameters(params))}`)).json();

  const allData = {
    reports: formatReports(res.reports),
    relationships: formatRelationships(res.relationships),
  };

  return allData;
}

export default searchData;
