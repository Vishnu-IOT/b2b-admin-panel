import api, { toRequestBody } from './api';

/**
 * Every "business-owned content" route (stories, strategies, achievements, products,
 * enquiries, videos) is built from the same backend router (routes/contentRouter.js):
 *   GET    /<base>            public list
 *   GET    /<base>/mine       caller's own items, any status (?businessId= for Super Admin)
 *   GET    /<base>/:id        detail
 *   POST   /<base>            create
 *   PUT    /<base>/:id        update
 *   DELETE /<base>/:id        delete
 *
 * fileFieldNames lists the multipart field names this entity accepts (e.g. ['coverImage'],
 * ['image'], ['video', 'thumbnail']) so we know which payload keys to send as files.
 */
export function createContentService(basePath, fileFieldNames = []) {
  const splitFiles = (payload) => {
    const files = {};
    const fields = { ...payload };
    fileFieldNames.forEach((f) => {
      if (payload[f] instanceof File) {
        files[f] = payload[f];
        delete fields[f];
      } else if (typeof fields[f] !== 'string' || fields[f] === '') {
        // Not a fresh upload and not a plain string value to keep (e.g. an object/preview) — omit.
        if (fields[f] !== undefined && typeof fields[f] !== 'string') delete fields[f];
      }
    });
    return { fields, files };
  };

  return {
    list: (params = {}) => api.get(basePath, { params }),
    mine: (params = {}) => api.get(`${basePath}/mine`, { params }),
    getOne: (id) => api.get(`${basePath}/${id}`),
    create: (payload) => {
      const { fields, files } = splitFiles(payload);
      return api.post(basePath, toRequestBody(fields, files));
    },
    update: (id, payload) => {
      const { fields, files } = splitFiles(payload);
      return api.put(`${basePath}/${id}`, toRequestBody(fields, files));
    },
    remove: (id) => api.delete(`${basePath}/${id}`),
  };
}

export const storyService = createContentService('/stories', ['coverImage', 'coverImage2']);
export const strategyService = createContentService('/strategies', ['coverImage', 'coverImage2']);
export const achievementService = createContentService('/achievements', ['image', 'image2']);
export const productService = createContentService('/products', ['image', 'image2']);
export const enquiryService = createContentService('/enquiries', []);
export const videoService = createContentService('/videos', ['video', 'thumbnail']);
