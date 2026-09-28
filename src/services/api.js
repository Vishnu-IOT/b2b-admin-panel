import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://darkslateblue-vulture-672842.hostingersite.com/api/api';

export const TOKEN_KEY = 'b2b_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({ baseURL, timeout: 30000 });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Listeners the app can subscribe to for session expiry, without a circular import into AuthContext.
const unauthorizedListeners = new Set();
export const onUnauthorized = (fn) => {
  unauthorizedListeners.add(fn);
  return () => unauthorizedListeners.delete(fn);
};

api.interceptors.response.use(
  (response) => response.data, // backend always responds { success, message, data }
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;
    const message = payload?.message || error.message || 'Something went wrong';
    const errors = payload?.errors || null;

    if (status === 401) {
      clearToken();
      unauthorizedListeners.forEach((fn) => fn());
    }

    return Promise.reject({ status, message, errors, raw: error });
  }
);

export default api;

/**
 * Builds a multipart/form-data body when files are present, otherwise a plain JSON-able object.
 * `files` is a map of fieldName -> File (or null/undefined to skip).
 */
export function toRequestBody(fields = {}, files = {}) {
  const hasFiles = Object.values(files).some((f) => f instanceof File);
  if (!hasFiles) {
    // Strip undefined so we don't overwrite existing values with "undefined" on partial edits.
    const clean = {};
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== undefined) clean[k] = v;
    });
    return clean;
  }
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, v);
  });
  Object.entries(files).forEach(([k, v]) => {
    if (v instanceof File) form.append(k, v);
  });
  return form;
}
