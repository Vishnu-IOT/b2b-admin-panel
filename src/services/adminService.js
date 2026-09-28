import api from './api';

// GET /api/admin/stats
export const getStats = () => api.get('/admin/stats');

// GET /api/admin/pending
export const getPendingCounts = () => api.get('/admin/pending');

// ---- Business users: /api/admin/users ----

export const listUsers = (params = {}) => api.get('/admin/users', { params });
export const getUser = (id) => api.get(`/admin/users/${id}`);
export const createUser = (payload) => api.post('/admin/users', payload);
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// ---- Content moderation: /api/admin/content/:type ----

export const listModeratedContent = (type, params = {}) => api.get(`/admin/content/${type}`, { params });
export const setContentStatus = (type, id, status) => api.patch(`/admin/content/${type}/${id}/status`, { status });
export const deleteModeratedContent = (type, id) => api.delete(`/admin/content/${type}/${id}`);
