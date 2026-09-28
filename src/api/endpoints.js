import client from "./client";

/* ---------- Auth ---------- */
export const authApi = {
  register: (payload) => client.post("/auth/register", payload),
  login: (payload) => client.post("/auth/login", payload),
  me: () => client.get("/auth/me"),
  changePassword: (payload) => client.put("/auth/change-password", payload),
};

/* ---------- Business directory + profile ---------- */
export const businessApi = {
  list: (params) => client.get("/business", { params }),
  getMine: () => client.get("/business/me"),
  updateMine: (payload) => client.put("/business/me", toFormData(payload), multipartHeaders(payload)),
  getOne: (idOrSlug) => client.get(`/business/${idOrSlug}`),
  create: (payload) => client.post("/business", toFormData(payload), multipartHeaders(payload)),
  update: (id, payload) => client.put(`/business/${id}`, toFormData(payload), multipartHeaders(payload)),
};

/* ---------- Shared shape for business-owned content ---------- */
function contentApi(path) {
  return {
    list: (params) => client.get(`/${path}`, { params }),
    mine: (params) => client.get(`/${path}/mine`, { params }),
    getOne: (idOrSlug) => client.get(`/${path}/${idOrSlug}`),
    create: (payload) => client.post(`/${path}`, toFormData(payload), multipartHeaders(payload)),
    update: (id, payload) => client.put(`/${path}/${id}`, toFormData(payload), multipartHeaders(payload)),
    remove: (id) => client.delete(`/${path}/${id}`),
  };
}

export const storiesApi = contentApi("stories");
export const strategiesApi = contentApi("strategies");
export const achievementsApi = contentApi("achievements");
export const productsApi = contentApi("products");
export const enquiriesApi = contentApi("enquiries");
export const videosApi = contentApi("videos");

/* ---------- Q&A ---------- */
export const questionsApi = {
  list: (params) => client.get("/questions", { params }),
  mine: (params) => client.get("/questions/mine", { params }),
  getOne: (id) => client.get(`/questions/${id}`),
  create: (payload) => client.post("/questions", payload),
  update: (id, payload) => client.put(`/questions/${id}`, payload),
  remove: (id) => client.delete(`/questions/${id}`),
};

export const answersApi = {
  list: (questionId, params) => client.get("/answers", { params: { questionId, ...params } }),
  create: (payload) => client.post("/answers", payload),
  update: (id, payload) => client.put(`/answers/${id}`, payload),
  remove: (id) => client.delete(`/answers/${id}`),
};

/* ---------- Resources ---------- */
export const resourceCategoriesApi = {
  list: (params) => client.get("/resource-categories", { params }),
  getOne: (idOrSlug) => client.get(`/resource-categories/${idOrSlug}`),
};

export const resourcesApi = {
  list: (params) => client.get("/resources", { params }),
  getOne: (idOrSlug) => client.get(`/resources/${idOrSlug}`),
};

/* ---------- Newsletter ---------- */
export const newsletterApi = {
  subscribe: (email) => client.post("/newsletter/subscribe", { email }),
};

/* helper: send multipart/form-data automatically when a File is present in the payload */
function multipartHeaders(payload) {
  const hasFile = payload && Object.values(payload).some((v) => v instanceof File);
  return hasFile ? { headers: { "Content-Type": "multipart/form-data" } } : {};
}

/** Turns a plain object into FormData when it contains File values (for multipart endpoints). */
export function toFormData(payload) {
  const hasFile = Object.values(payload).some((v) => v instanceof File);
  if (!hasFile) return payload;
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") fd.append(k, v);
  });
  return fd;
}
