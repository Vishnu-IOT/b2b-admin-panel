import api, { toRequestBody } from './api';

// ---- Resource categories: /api/resource-categories ----

export const listResourceCategories = (params = {}) => api.get('/resource-categories', { params });
export const getResourceCategory = (idOrSlug) => api.get(`/resource-categories/${idOrSlug}`);
export const createResourceCategory = (payload) => api.post('/resource-categories', payload);
export const updateResourceCategory = (id, payload) => api.put(`/resource-categories/${id}`, payload);
export const deleteResourceCategory = (id) => api.delete(`/resource-categories/${id}`);

// ---- Resource posts: /api/resources ----

const RESOURCE_FILE_FIELDS = ['coverImage', 'file', 'video'];

const splitResourceFiles = (payload) => {
  const files = {};
  const fields = { ...payload };
  RESOURCE_FILE_FIELDS.forEach((f) => {
    if (payload[f] instanceof File) {
      files[f] = payload[f];
      delete fields[f];
    } else if (fields[f] !== undefined && typeof fields[f] !== 'string') {
      delete fields[f];
    }
  });
  return { fields, files };
};

export const listResourcePosts = (params = {}) => api.get('/resources', { params });
export const getResourcePost = (idOrSlug) => api.get(`/resources/${idOrSlug}`);

export const createResourcePost = (payload) => {
  const { fields, files } = splitResourceFiles(payload);
  return api.post('/resources', toRequestBody(fields, files));
};

export const updateResourcePost = (id, payload) => {
  const { fields, files } = splitResourceFiles(payload);
  return api.put(`/resources/${id}`, toRequestBody(fields, files));
};

export const deleteResourcePost = (id) => api.delete(`/resources/${id}`);
