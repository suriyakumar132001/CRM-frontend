import api from './axios';

export const getContacts = (page = 1, limit = 10) =>
  api.get('/contacts', { params: { page, limit } });
export const getContact = (id) => api.get(`/contacts/${id}`);
export const createContact = (data) => api.post('/contacts', data);
export const updateContact = (id, data) => api.put(`/contacts/${id}`, data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);