import api from './axios';

export const getMisPolicies = (page = 1, limit = 10) =>
  api.get('/mis-policies', { params: { page, limit } });
export const createMisPolicy = (data) => api.post('/mis-policies', data);
export const updateMisPolicy = (id, data) => api.put(`/mis-policies/${id}`, data);
export const deleteMisPolicy = (id) => api.delete(`/mis-policies/${id}`);

export const scanPolicyPdf = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/mis-policies/scan-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};