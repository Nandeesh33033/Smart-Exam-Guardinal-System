import { api, withAuth } from './api';

export const logViolation = (token, payload) => api.post('/violations', payload, withAuth(token));
export const fetchAuditorOverview = (token) => api.get('/exam/auditor/overview', withAuth(token));
