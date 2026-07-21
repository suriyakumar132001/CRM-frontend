import api from './axios';

export const getDailyReport = (date) => api.get('/daily-report', { params: date ? { date } : {} });
export const getReportRange = (days = 7) => api.get('/daily-report/range', { params: { days } });
export const setTarget = (data) => api.put('/daily-report/target', data);