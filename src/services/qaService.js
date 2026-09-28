import api from './api';

// ---- Questions: /api/questions ----

export const listQuestions = (params = {}) => api.get('/questions', { params });
export const listMyQuestions = (params = {}) => api.get('/questions/mine', { params });
export const getQuestion = (id) => api.get(`/questions/${id}`);
export const createQuestion = (payload) => api.post('/questions', payload);
export const updateQuestion = (id, payload) => api.put(`/questions/${id}`, payload);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);

// ---- Answers: /api/answers ----

export const listAnswers = (questionId, params = {}) => api.get('/answers', { params: { ...params, questionId } });
export const createAnswer = (questionId, answer) => api.post('/answers', { questionId, answer });
export const updateAnswer = (id, answer) => api.put(`/answers/${id}`, { answer });
export const deleteAnswer = (id) => api.delete(`/answers/${id}`);
