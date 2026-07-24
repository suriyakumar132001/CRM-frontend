import api from './axios';

export const generateFollowUp = (entityType, entityId, channel, tone) =>
  api.post('/ai-followup/generate', { entityType, entityId, channel, tone });