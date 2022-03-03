import { formatRelationships, formatReports } from './Utils';

const ROOT_URL = process.env.REACT_APP_ROOT_URL ? `${process.env.REACT_APP_ROOT_URL}` : 'http://localhost:8000';

async function searchDataInProject(id: string) {
  const res = await (await fetch(`${ROOT_URL}/projectdata/${id}`)).json();

  const allData = {
    reports: formatReports(res.reports),
    relationships: formatRelationships(res.relationships),
  };

  return allData;
}

export default searchDataInProject;
