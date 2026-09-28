const FILES_ORIGIN = process.env.REACT_APP_FILES_ORIGIN || 'http://localhost:5000';

/**
 * The backend stores only the public path of an uploaded file, e.g. "/uploads/images/xxx.jpg"
 * (see backend utils/fileUtils.js -> toPublicPath). This turns that into an absolute URL the
 * browser can load. External URLs (YouTube links etc.) are returned unchanged.
 */
export function resolveFileUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith('/uploads/')) return `${FILES_ORIGIN}${pathOrUrl}`;
  return pathOrUrl;
}

export function isYoutubeUrl(value) {
  return typeof value === 'string' && /youtube\.com|youtu\.be/i.test(value);
}

/** Extracts a YouTube video id from a normalized watch/embed/short URL for thumbnail/embed use. */
export function youtubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/);
  return match ? match[1] : null;
}

export function youtubeThumbnail(url) {
  const id = youtubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}
