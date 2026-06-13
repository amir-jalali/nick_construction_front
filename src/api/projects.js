import api from './axios'

export const getProjects = () => api.get('/projects/')
export const getProject = (id) => api.get(`/projects/${id}/`)
export const getProjectProgress = (id) => api.get(`/projects/${id}/progress/`)
export const getProjectMedia = (id) => api.get(`/projects/${id}/media/`)
export const getProjectNotes = (id) => api.get(`/projects/${id}/notes/`)