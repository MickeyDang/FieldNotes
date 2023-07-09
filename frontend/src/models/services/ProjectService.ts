import { Project } from '../types';

const ROOT_URL = process.env.REACT_APP_ROOT_URL ? `${process.env.REACT_APP_ROOT_URL}` : 'http://localhost:8000';

export async function fetchProject(): Promise<Project> {
  const response = await (await fetch(`${ROOT_URL}/projects`)).json();
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
  const updatedProject = (await (await fetch(`${ROOT_URL}/projects`, requestOptions)).json()).project;
  return {
    // eslint-disable-next-line no-underscore-dangle
    projectId: updatedProject._id,
    repIds: updatedProject.reports,
    relIds: updatedProject.relationships,
  } as Project;
}
