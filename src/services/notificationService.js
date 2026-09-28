import api from './api';

export const listNotifications = (params = {}) => api.get('/notifications', { params });
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markAllRead = () => api.patch('/notifications/read-all');
export const markRead = (id) => api.patch(`/notifications/${id}/read`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
