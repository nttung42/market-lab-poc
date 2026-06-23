import type { Project, Persona, Respondent, Study, Question, StudyResults } from '../types';

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

export async function generateRespondents(projectId: string, countPerPersona: number): Promise<Respondent[]> {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/respondents/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ count_per_persona: countPerPersona }),
  });
  return handleResponse<Respondent[]>(res);
}

export async function getProjectRespondents(projectId: string): Promise<Respondent[]> {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/respondents`);
  return handleResponse<Respondent[]>(res);
}

export async function getProjectStudies(projectId: string): Promise<Study[]> {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/studies`);
  return handleResponse<Study[]>(res);
}

export async function createStudy(projectId: string, title: string): Promise<Study> {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/studies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  return handleResponse<Study>(res);
}

export async function getStudy(studyId: string): Promise<Study> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}`);
  return handleResponse<Study>(res);
}

export async function addQuestion(studyId: string, question: { id: string; text: string; type: string; position: number; options: { id: string; text: string; value: string }[] }): Promise<Question> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(question),
  });
  return handleResponse<Question>(res);
}

export async function runStudy(studyId: string, personaIds: string[]): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ persona_ids: personaIds }),
  });
  return handleResponse<any[]>(res);
}

export async function getStudyResults(studyId: string): Promise<StudyResults> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/results`);
  return handleResponse<StudyResults>(res);
}

export async function createProject(project: Omit<Project, 'id' | 'is_seeded' | 'created_at'>): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });
  return handleResponse<Project>(res);
}

export async function updateProject(projectId: string, project: Omit<Project, 'id' | 'is_seeded' | 'created_at'>): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });
  return handleResponse<Project>(res);
}

export async function deleteProject(projectId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
  });
  await handleResponse<{ success: boolean; message: string }>(res);
}

export async function createPersona(projectId: string, persona: Omit<Persona, 'id' | 'project_id'>): Promise<Persona> {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/personas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(persona),
  });
  return handleResponse<Persona>(res);
}

export async function updatePersona(personaId: string, persona: Omit<Persona, 'id' | 'project_id'>): Promise<Persona> {
  const res = await fetch(`${API_BASE_URL}/personas/${personaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(persona),
  });
  return handleResponse<Persona>(res);
}

export async function deletePersona(personaId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/personas/${personaId}`, {
    method: 'DELETE',
  });
  await handleResponse<{ success: boolean; message: string }>(res);
}

export async function updateStudy(studyId: string, title: string): Promise<Study> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  return handleResponse<Study>(res);
}

export async function deleteStudy(studyId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}`, {
    method: 'DELETE',
  });
  await handleResponse<{ success: boolean; message: string }>(res);
}


