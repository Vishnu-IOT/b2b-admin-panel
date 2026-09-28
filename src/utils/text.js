/** Strips simple HTML tags and truncates to `length` characters at a word boundary. */
export function excerpt(raw, length = 160) {
  if (!raw) return "";
  const text = raw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= length) return text;
  return `${text.slice(0, length).replace(/\s+\S*$/, "")}…`;
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function readingTime(raw) {
  if (!raw) return "1 min read";
  const words = raw.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/** Converts a canonical YouTube watch URL into an embeddable iframe URL. */
export function youtubeEmbedUrl(watchUrl) {
  try {
    const u = new URL(watchUrl);
    const id = u.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}
