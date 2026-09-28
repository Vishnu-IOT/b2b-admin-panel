import api from './api';

// POST /api/auth/login -> { user, token }
export const login = (email, password) => api.post('/auth/login', { email, password });

// GET /api/auth/me -> user (with business included)
export const me = () => api.get('/auth/me');

// PUT /api/auth/change-password
export const changePassword = (currentPassword, newPassword) =>
  api.put('/auth/change-password', { currentPassword, newPassword });
