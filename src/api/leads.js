import api from './axios';

export const getLeads = (page = 1, limit = 10) =>
  api.get('/leads', { params: { page, limit } });
export const getLead = (id) => api.get(`/leads/${id}`);
export const createLead = (data) => api.post('/leads', data);
export const updateLead = (id, data) => api.put(`/leads/${id}`, data);
export const deleteLead = (id) => api.delete(`/leads/${id}`);