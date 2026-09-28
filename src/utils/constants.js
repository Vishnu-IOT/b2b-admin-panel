// Mirrors backend config/constants.js and services/moderationService.js — do not rename.

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  BUSINESS_ADMIN: 'BUSINESS_ADMIN',
};

export const CONTENT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
};

export const CONTENT_STATUS_LIST = Object.values(CONTENT_STATUS);

export const CATEGORY_STATUS_LIST = ['ACTIVE', 'INACTIVE'];

export const VIDEO_TYPES = ['YOUTUBE', 'UPLOAD'];

// URL segments accepted by GET/PATCH/DELETE /api/admin/content/:type
export const MODERATION_CONTENT_TYPES = {
  businesses: 'Businesses',
  stories: 'Business Stories',
  strategies: 'Business Strategies',
  achievements: 'Achievements',
  products: 'Products',
  enquiries: 'Supplier Enquiries',
  videos: 'Business Videos',
  questions: 'Questions',
  answers: 'Answers',
};

export const RESOURCE_CATEGORY_NAMES = [
  'Marketing',
  'Sales',
  'Business Strategy',
  'GST',
  'Tax',
  'MSME',
  'Startup',
  'Finance',
  'Government Schemes',
];
