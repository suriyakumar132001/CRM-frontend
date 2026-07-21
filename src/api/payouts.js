import api from './axios';

export const getPayouts = (page = 1, limit = 10, type) =>
  api.get('/payouts', { params: { page, limit, ...(type ? { type } : {}) } });
export const createPayout = (data) => api.post('/payouts', data);
export const deletePayout = (id) => api.delete(`/payouts/${id}`);