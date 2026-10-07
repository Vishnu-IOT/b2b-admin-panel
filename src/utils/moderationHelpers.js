import { truncate } from './format';

/** Translated label for a moderation content type key (businesses, stories, ...). */
export const moderationTypeLabel = (type, t) => t(`moderation.type.${type}`);

/** Every moderated content type has a different "name" field — this normalizes it. */
export function itemTitle(type, item) {
  if (!item) return '';
  if (type === 'businesses') return item.companyName;
  if (type === 'products') return item.name;
  if (type === 'answers') return truncate(item.answer, 70);
  return item.title || item.name || `#${item.id}`;
}

// `t` is optional: when given, posts without a business are labelled "Admin post".
export function itemOwnerLabel(type, item, t) {
  if (item?.business?.companyName) return item.business.companyName;
  if (t && item && item.businessId === null) return t('content.adminPost');
  if (item?.owner?.name) return item.owner.name;
  if (item?.user?.name) return item.user.name;
  return null;
}
