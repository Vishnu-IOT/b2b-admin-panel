// Groups the backend's 9 real resource categories into the 4 navigation buckets
// requested for the mega menu. Matching is done by category slug (kebab-case name).
export const RESOURCE_BUCKETS = {
  "marketing-sales": { label: "Marketing & Sales", slugs: ["marketing", "sales", "business-strategy"] },
  "gst-tax": { label: "GST & Tax", slugs: ["gst", "tax"] },
  "msme": { label: "MSME Benefits", slugs: ["msme", "government-schemes"] },
  "startup": { label: "Startup & Local Business", slugs: ["startup", "finance"] },
};

export function categoriesInBucket(bucketKey, allCategories) {
  const bucket = RESOURCE_BUCKETS[bucketKey];
  if (!bucket || !allCategories) return [];
  return allCategories.filter((c) => bucket.slugs.includes(c.slug));
}
