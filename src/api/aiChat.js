import api from './axios';

export const sendChatMessage = (message) => api.post('/ai/chat', { message });