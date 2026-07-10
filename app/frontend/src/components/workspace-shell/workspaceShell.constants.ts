export const currentUserName = 'Người dùng';
export const currentUserInitial = currentUserName.trim().charAt(0).toUpperCase();
export const defaultStudyId = 'study-concept-test';

export const appRoutes = {
  landing: '/',
  login: '/login',
  workspaceRoot: '/project',
  workspaceCreate: '/project/new',
  workspace(projectId: string) {
    return `/project/${projectId}`;
  },
  workspaceEdit(projectId: string) {
    return `/project/${projectId}/edit`;
  },
  personas(projectId: string) {
    return `/project/${projectId}/personas`;
  },
  respondents(projectId: string) {
    return `/project/${projectId}/respondents`;
  },
  studyBuilder(projectId: string) {
    return `/project/${projectId}/study-builder`;
  },
  results(projectId: string, studyId: string) {
    return `/project/${projectId}/results/${studyId}`;
  },
  reports(projectId: string, studyId: string) {
    return `/project/${projectId}/reports/${studyId}`;
  },
};
