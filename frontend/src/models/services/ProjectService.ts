import { Project } from '../types';

const ROOT_URL = process.env.REACT_APP_ROOT_URL ? `${process.env.REACT_APP_ROOT_URL}` : 'http://localhost:8000';

async function fetchProject(): Promise<Project> {
  const response = await (await fetch(`${ROOT_URL}/projects/1234567890`)).json();
  return {
    repIds: response.project.reports,
    relIds: response.project.relationships,
  } as Project;
}

export default fetchProject;
