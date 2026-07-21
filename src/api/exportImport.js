import api from './axios';

export const downloadContactsExcel = async () => {
  const response = await api.get('/export/contacts', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'contacts.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadLeadsExcel = async () => {
  const response = await api.get('/export/leads', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'leads.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const importContactsExcel = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/export/contacts/import', formData);
};

export const downloadPoliciesExcel = async () => {
  const response = await api.get('/export/policies', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'policies.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const importPoliciesExcel = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/export/policies/import', formData);
};

export const downloadPayoutsExcel = async () => {
  const response = await api.get('/export/payouts', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'payouts.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const importPayoutsExcel = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/export/payouts/import', formData);
};

export const downloadDailyReportExcel = async (date) => {
  const response = await api.get('/export/daily-report', {
    responseType: 'blob',
    params: date ? { date } : {},
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `daily-report-${date || 'today'}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadMisPoliciesExcel = async () => {
  const response = await api.get('/export/mis-policies', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'mis-policies.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const importMisPoliciesExcel = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/export/mis-policies/import', formData);
};