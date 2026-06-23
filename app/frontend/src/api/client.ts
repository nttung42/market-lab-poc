import type { Project, Persona } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    const errorMsg = await response.text().catch(() => 'Unknown API error');
    throw new Error(errorMsg || `HTTP error ${response.status}`);
  }
  return response.json();
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE_URL}/projects`);
  return handleResponse<Project[]>(res);
}

export async function getProject(projectId: string): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}`);
  return handleResponse<Project>(res);
}

export async function getProjectPersonas(projectId: string): Promise<Persona[]> {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/personas`);
  return handleResponse<Persona[]>(res);
}

export async function getPersona(personaId: string): Promise<Persona> {
  const res = await fetch(`${API_BASE_URL}/personas/${personaId}`);
  return handleResponse<Persona>(res);
}
