import axios from "axios";

// The backend serves the API at :5000/api and static uploads at :5000/uploads.
// Override with REACT_APP_API_URL in a .env file when deploying.
export const API_BASE = process.env.REACT_APP_API_URL || "https://darkslateblue-vulture-672842.hostingersite.com/api/api";
export const FILES_BASE = API_BASE.replace(/\/api\/?$/, "");

const client = axios.create({ baseURL: API_BASE });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("vartha_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Every backend response is { success, message, data } (or { success:false, message, errors }).
// Unwrap here so the rest of the app just deals with `data`.
client.interceptors.response.use(
  (res) => res.data.data,
  (err) => {
    const payload = err.response && err.response.data;
    const message = (payload && payload.message) || err.message || "Something went wrong";
    const errors = payload && payload.errors;
    return Promise.reject({ message, errors, status: err.response && err.response.status });
  }
);

/** Resolves a path returned by the API (e.g. "/uploads/images/x.png") to a full URL. */
export function fileUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${FILES_BASE}${path}`;
}

export default client;
