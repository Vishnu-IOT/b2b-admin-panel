import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import { CardSkeleton, ErrorBanner } from '../../components/common/States';
import { useLanguage } from '../../context/LanguageContext';
import * as adminService from '../../services/adminService';
import { moderationTypeLabel, itemTitle, itemOwnerLabel } from '../../utils/moderationHelpers';
import { timeAgo } from '../../utils/format';
import { errorMessage } from '../../utils/errorMessage';
import '../../styles/dashboard.css';

const RECENT_TYPES = ['businesses', 'stories', 'strategies', 'achievements', 'products', 'videos', 'enquiries', 'questions', 'answers'];

export default function SuperAdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, recentResults] = await Promise.all([
          adminService.getStats(),
          Promise.all(
            RECENT_TYPES.map((type) =>
              adminService
                .listModeratedContent(type, { status: 'all', limit: 4 })
                .then((res) => res.data.items.map((item) => ({ type, item })))
                .catch(() => [])
            )
          ),
        ]);
        if (cancelled) return;
        setStats(statsRes.data);
        const merged = recentResults
          .flat()
          .sort((a, b) => new Date(b.item.createdAt) - new Date(a.item.createdAt))
          .slice(0, 8);
        setRecent(merged);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <CardSkeleton count={6} />;
  if (error) return <ErrorBanner message={error} />;
  if (!stats) return null;

  const totalPending = Object.values(stats.pendingApproval).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="stat-grid">
        <StatCard label={t('dashboard.stat.businesses')} value={stats.totals.businesses} icon="building" to="/businesses" />
        <StatCard label={t('dashboard.stat.businessAdmins')} value={stats.totals.businessAdmins} icon="users" to="/users" />
        <StatCard label={t('dashboard.stat.resourcePosts')} value={stats.totals.resourcePosts} icon="fileText" to="/resource-posts" />
        <StatCard label={t('dashboard.stat.resourceCategories')} value={stats.totals.resourceCategories} icon="folder" to="/resource-categories" />
        <StatCard label={t('dashboard.stat.questions')} value={stats.totals.questions} icon="message" to="/qa" />
        <StatCard label={t('dashboard.stat.answers')} value={stats.totals.answers} icon="message" to="/qa" />
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="panel">
            <div className="panel__header">
              <h3>{t('dashboard.recentActivity')}</h3>
              <Link to="/moderation" className="btn btn--ghost btn--sm">
                {t('dashboard.viewAll')}
              </Link>
            </div>
            <div className="panel__body">
              {recent.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.86rem' }}>
                  {t('dashboard.noContentYet')}
                </p>
              ) : (
                <div className="timeline">
                  {recent.map(({ type, item }, i) => (
                    <div className="timeline-item" key={`${type}-${item.id}-${i}`}>
                      <span className="timeline-item__dot" />
                      <div style={{ flex: 1 }}>
                        <div className="timeline-item__title">
                          {moderationTypeLabel(type, t)} · {itemTitle(type, item)}
                        </div>
                        <div className="timeline-item__meta">
                          {itemOwnerLabel(type, item, t) ? `${itemOwnerLabel(type, item, t)} · ` : ''}
                          {timeAgo(item.createdAt)}
                        </div>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panel__header">
              <h3>
                {t('dashboard.pendingApproval')} {totalPending > 0 && <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.8rem' }}>({totalPending})</span>}
              </h3>
            </div>
            <div className="panel__body">
              <div className="pending-list">
                {Object.entries(stats.pendingApproval).map(([type, count]) => (
                  <Link to={`/moderation?type=${type}`} className="pending-row" key={type} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className="pending-row__label">{moderationTypeLabel(type, t)}</span>
                    <span className="pending-row__count">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel__header">
              <h3>{t('dashboard.quickActions')}</h3>
            </div>
            <div className="panel__body">
              <div className="quick-actions" style={{ flexDirection: 'column' }}>
                <Link className="quick-action" to="/businesses?action=create">
                  <div className="quick-action__icon">
                    <Icon name="building" size={16} />
                  </div>
                  <strong>{t('dashboard.addBusiness')}</strong>
                  <span className="text-muted" style={{ fontSize: '0.76rem' }}>
                    {t('dashboard.addBusinessDesc')}
                  </span>
                </Link>
                <Link className="quick-action" to="/users?action=create">
                  <div className="quick-action__icon">
                    <Icon name="users" size={16} />
                  </div>
                  <strong>{t('dashboard.addBusinessAdmin')}</strong>
                </Link>
                <Link className="quick-action" to="/stories?action=create">
                  <div className="quick-action__icon">
                    <Icon name="fileText" size={16} />
                  </div>
                  <strong>{t('dashboard.postStory')}</strong>
                  <span className="text-muted" style={{ fontSize: '0.76rem' }}>
                    {t('dashboard.postAsAdminDesc')}
                  </span>
                </Link>
                <Link className="quick-action" to="/achievements?action=create">
                  <div className="quick-action__icon">
                    <Icon name="award" size={16} />
                  </div>
                  <strong>{t('dashboard.postAchievement')}</strong>
                </Link>
                <Link className="quick-action" to="/resource-posts?action=create">
                  <div className="quick-action__icon">
                    <Icon name="fileText" size={16} />
                  </div>
                  <strong>{t('dashboard.publishResourcePost')}</strong>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, to }) {
  return (
    <Link to={to} className="stat-card" style={{ textDecoration: 'none' }}>
      <div>
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
      <div className="stat-card__icon">
        <Icon name={icon} size={18} />
      </div>
    </Link>
  );
}
