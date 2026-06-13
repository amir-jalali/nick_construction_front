import api from './axios'

export const register = (data) => api.post('/users/register/', data)
export const login = (data) => api.post('/users/login/', data)
export const getProfile = () => api.get('/users/profile/')
export const updateProfile = (data) => api.put('/users/profile/', data)
export const getUserStats = () => api.get('/users/stats/')