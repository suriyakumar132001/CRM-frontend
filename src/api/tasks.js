import api from './axios';

export const getTasks = (completed) =>
  api.get('/tasks', { params: completed !== undefined ? { completed } : {} });
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const toggleTask = (id) => api.patch(`/tasks/${id}/toggle`);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);