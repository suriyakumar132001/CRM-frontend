import api from './axios';

export const getPolicies = (page = 1, limit = 10) =>
  api.get('/policies', { params: { page, limit } });
export const createPolicy = (data) => api.post('/policies', data);
export const updatePolicy = (id, data) => api.put(`/policies/${id}`, data);
export const deletePolicy = (id) => api.delete(`/policies/${id}`);
export const deleteAllPolicies = () => api.delete('/policies/bulk/all');
export const getExpiringPolicies = (days = 30) => api.get(`/policies/expiring/soon?days=${days}`);