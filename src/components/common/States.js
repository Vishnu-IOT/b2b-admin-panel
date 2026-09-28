import Icon from './Icon';
import Button from './Button';
import '../../styles/states.css';

export function EmptyState({ icon = 'inbox', title = 'Nothing here yet', message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon name={icon} size={24} />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} icon={<Icon name="plus" size={15} />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-row" key={i}>
          <div className="skeleton" />
          <div className="skeleton-lines">
            <div className="skeleton" style={{ height: 12, width: '46%' }} />
            <div className="skeleton" style={{ height: 10, width: '28%' }} />
          </div>
          <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 999 }} />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="stat-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton" style={{ height: 92 }} key={i} />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <span className="spinner spinner--dark" style={{ width: 26, height: 26, borderWidth: 3 }} />
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="error-banner">
      <Icon name="alertCircle" size={17} />
      <span>{message}</span>
    </div>
  );
}
