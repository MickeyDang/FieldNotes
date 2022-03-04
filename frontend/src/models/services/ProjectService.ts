import { Project } from '../types';

const ROOT_URL = process.env.REACT_APP_ROOT_URL ? `${process.env.REACT_APP_ROOT_URL}` : 'http://localhost:8000';

export async function fetchProject(): Promise<Project> {
  const response = await (await fetch(`${ROOT_URL}/projects/1234567890`)).json();
  return {
    // eslint-disable-next-line no-underscore-dangle
    projectId: response.project._id,
    repIds: response.project.reports,
    relIds: response.project.relationships,
  } as Project;
}

export async function updateProject(project: Project) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      relIds: project.relIds,
      repIds: project.repIds,
    }),
  };
  const response = (await fetch(`${ROOT_URL}/projects/${project.projectId}`, requestOptions)).json();
  console.log(JSON.stringify(response));
  return response;
}
