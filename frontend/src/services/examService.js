import { api, withAuth } from './api';

export const startSession = (token, payload) => api.post('/exam/sessions/start', payload, withAuth(token));
export const completeSession = (token, sessionId) => api.post(`/exam/sessions/${sessionId}/complete`, {}, withAuth(token));
export const loginUser = (payload) => api.post('/auth/login', payload);
