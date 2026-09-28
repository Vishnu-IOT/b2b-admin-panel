import api, { toRequestBody } from './api';

const FILE_FIELDS = ['logo', 'coverImage'];

const splitFiles = (payload) => {
  const files = {};
  const fields = { ...payload };
  FILE_FIELDS.forEach((f) => {
    if (payload[f] instanceof File) {
      files[f] = payload[f];
      delete fields[f];
    } else if (fields[f] === undefined) {
      delete fields[f];
    } else if (typeof fields[f] !== 'string') {
      delete fields[f]; // don't resend existing preview objects
    }
  });
  return { fields, files };
};

// GET /api/business (public directory, but useful for super admin to pick a business)
export const listBusinesses = (params = {}) => api.get('/business', { params });

// GET /api/business/me
export const getMyBusiness = () => api.get('/business/me');

// PUT /api/business/me
export const updateMyBusiness = (payload) => {
  const { fields, files } = splitFiles(payload);
  return api.put('/business/me', toRequestBody(fields, files));
};

// GET /api/business/:idOrSlug (profile + content)
export const getBusiness = (idOrSlug) => api.get(`/business/${idOrSlug}`);

// POST /api/business (Super Admin creates on behalf of a BUSINESS_ADMIN user, or a business admin creates their own)
export const createBusiness = (payload) => {
  const { fields, files } = splitFiles(payload);
  return api.post('/business', toRequestBody(fields, files));
};

// PUT /api/business/:id (Super Admin editing any business)
export const updateBusiness = (id, payload) => {
  const { fields, files } = splitFiles(payload);
  return api.put(`/business/${id}`, toRequestBody(fields, files));
};

// DELETE /api/business/:id (Super Admin)
export const deleteBusiness = (id) => api.delete(`/business/${id}`);
