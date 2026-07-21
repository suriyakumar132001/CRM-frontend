import api from './axios';

export const getTodayPolicies = () => api.get('/policies/today');
export const getAgentWiseStats = (from, to) => api.get('/stats/agent-wise', { params: { from, to } });