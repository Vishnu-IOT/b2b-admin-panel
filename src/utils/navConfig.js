import { ROLES } from './constants';

export const SUPER_ADMIN_NAV = [
  { section: null, items: [{ to: '/dashboard', labelKey: 'nav.dashboard', icon: 'layout' }] },
  {
    sectionKey: 'nav.section.platform',
    items: [
      { to: '/businesses', labelKey: 'nav.businesses', icon: 'building' },
      { to: '/users', labelKey: 'nav.businessAdmins', icon: 'users' },
    ],
  },
  {
    sectionKey: 'nav.section.content',
    items: [
      { to: '/stories', labelKey: 'nav.stories', icon: 'fileText' },
      { to: '/strategies', labelKey: 'nav.strategies', icon: 'briefcase' },
      { to: '/achievements', labelKey: 'nav.achievements', icon: 'award' },
      { to: '/products', labelKey: 'nav.products', icon: 'package' },
      { to: '/videos', labelKey: 'nav.videos', icon: 'video' },
      { to: '/enquiries', labelKey: 'nav.enquiries', icon: 'inbox' },
      { to: '/qa', labelKey: 'nav.qa', icon: 'message' },
    ],
  },
  {
    sectionKey: 'nav.section.resources',
    items: [
      { to: '/resource-categories', labelKey: 'nav.resourceCategories', icon: 'folder' },
      { to: '/resource-posts', labelKey: 'nav.resourcePosts', icon: 'fileText' },
    ],
  },
  {
    sectionKey: 'nav.section.review',
    items: [{ to: '/moderation', labelKey: 'nav.moderation', icon: 'shield', badgeKey: 'total' }],
  },
];

export const BUSINESS_ADMIN_NAV = [
  { section: null, items: [{ to: '/dashboard', labelKey: 'nav.dashboard', icon: 'layout' }] },
  { sectionKey: 'nav.section.business', items: [{ to: '/business-profile', labelKey: 'nav.businessProfile', icon: 'building' }] },
  {
    sectionKey: 'nav.section.content',
    items: [
      { to: '/stories', labelKey: 'nav.stories', icon: 'fileText' },
      { to: '/strategies', labelKey: 'nav.strategies', icon: 'briefcase' },
      { to: '/achievements', labelKey: 'nav.achievements', icon: 'award' },
      { to: '/products', labelKey: 'nav.products', icon: 'package' },
      { to: '/videos', labelKey: 'nav.videos', icon: 'video' },
      { to: '/enquiries', labelKey: 'nav.enquiries', icon: 'inbox' },
      { to: '/qa', labelKey: 'nav.qa', icon: 'message' },
    ],
  },
];

export const navForRole = (role) => (role === ROLES.SUPER_ADMIN ? SUPER_ADMIN_NAV : BUSINESS_ADMIN_NAV);
