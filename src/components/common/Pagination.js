import Icon from './Icon';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/table.css';

export default function Pagination({ page, totalPages, total, limit, onChange }) {
  const { t } = useLanguage();
  if (!total) return null;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="pagination-bar">
      <span className="pagination-bar__info">{t('pagination.showing', { start, end, total })}</span>
      <div className="pagination-bar__controls">
        <button type="button" className="btn btn--secondary btn--sm btn--icon" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <Icon name="chevronLeft" size={16} />
        </button>
        <span className="pagination-bar__page">{t('pagination.page', { page, totalPages: totalPages || 1 })}</span>
        <button
          type="button"
          className="btn btn--secondary btn--sm btn--icon"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </div>
  );
}
