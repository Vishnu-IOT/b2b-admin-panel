import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import { CardSkeleton, ErrorBanner } from '../../components/common/States';
import { useLanguage } from '../../context/LanguageContext';
import { storyService, strategyService, achievementService, productService, enquiryService, videoService } from '../../services/contentService';
import * as businessService from '../../services/businessService';
import { CONTENT_STATUS } from '../../utils/constants';
import { errorMessage } from '../../utils/errorMessage';
import '../../styles/dashboard.css';

const TYPES = [
  { key: 'stories', labelKey: 'nav.stories', service: storyService, icon: 'fileText', to: '/stories' },
  { key: 'strategies', labelKey: 'nav.strategies', service: strategyService, icon: 'briefcase', to: '/strategies' },
  { key: 'achievements', labelKey: 'nav.achievements', service: achievementService, icon: 'award', to: '/achievements' },
  { key: 'products', labelKey: 'nav.products', service: productService, icon: 'package', to: '/products' },
  { key: 'videos', labelKey: 'nav.videos', service: videoService, icon: 'video', to: '/videos' },
  { key: 'enquiries', labelKey: 'nav.enquiries', service: enquiryService, icon: 'inbox', to: '/enquiries' },
];

export default function BusinessAdminDashboard() {
  const { t } = useLanguage();
  const [business, setBusiness] = useState(null);
  const [hasBusiness, setHasBusiness] = useState(true);
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const bizRes = await businessService.getMyBusiness().catch((err) => {
          if (err.status === 404) return null;
          throw err;
        });
        if (cancelled) return;
        if (!bizRes) {
          setHasBusiness(false);
          setLoading(false);
          return;
        }
        setBusiness(bizRes.data);

        const results = await Promise.all(TYPES.map((tItem) => tItem.service.mine({ limit: 100 }).then((res) => res.data.items)));
        if (cancelled) return;
        const perType = {};
        TYPES.forEach((tItem, i) => {
          const items = results[i];
          perType[tItem.key] = {
            total: items.length,
            published: items.filter((x) => x.status === CONTENT_STATUS.PUBLISHED).length,
            pending: items.filter((x) => x.status === CONTENT_STATUS.PENDING).length,
            draft: items.filter((x) => x.status === CONTENT_STATUS.DRAFT).length,
            rejected: items.filter((x) => x.status === CONTENT_STATUS.REJECTED).length,
          };
        });
        setCounts(perType);
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

  if (loading) return <CardSkeleton count={4} />;
  if (error) return <ErrorBanner message={error} />;

  if (!hasBusiness) {
    return (
      <div className="panel">
        <div className="panel__body" style={{ padding: '36px 20px' }}>
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon name="building" size={24} />
            </div>
            <h3>{t('dashboard.setupPromptTitle')}</h3>
            <p>{t('dashboard.setupPromptMessage')}</p>
            <Link to="/business-profile" className="btn btn--primary btn--sm">
              {t('dashboard.setupPromptAction')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totals = counts
    ? Object.values(counts).reduce(
        (acc, c) => ({
          total: acc.total + c.total,
          published: acc.published + c.published,
          pending: acc.pending + c.pending,
          draft: acc.draft + c.draft,
          rejected: acc.rejected + c.rejected,
        }),
        { total: 0, published: 0, pending: 0, draft: 0, rejected: 0 }
      )
    : { total: 0, published: 0, pending: 0, draft: 0, rejected: 0 };

  return (
    <div>
      {business.status !== 'PUBLISHED' && (
        <div className="panel" style={{ borderColor: 'var(--color-pending-border)' }}>
          <div className="panel__body" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
            <Icon name="clock" size={18} style={{ color: 'var(--color-pending)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.86rem' }}>
              {t('common.status')}: <strong>{t(`status.${business.status}`)}</strong>.{' '}
              {business.status === 'PENDING' && t('dashboard.statusPending')}
              {business.status === 'DRAFT' && t('dashboard.statusDraft')}
              {business.status === 'REJECTED' && t('dashboard.statusRejected')}
            </div>
          </div>
        </div>
      )}

      <div className="stat-grid">
        <div className="stat-card">
          <div>
            <div className="stat-card__value">{totals.total}</div>
            <div className="stat-card__label">{t('dashboard.stat.totalPosts')}</div>
          </div>
          <div className="stat-card__icon">
            <Icon name="layout" size={18} />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-card__value">{totals.published}</div>
            <div className="stat-card__label">{t('dashboard.stat.published')}</div>
          </div>
          <div className="stat-card__icon">
            <Icon name="checkCircle" size={18} />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-card__value">{totals.pending}</div>
            <div className="stat-card__label">{t('dashboard.stat.pendingReview')}</div>
          </div>
          <div className="stat-card__icon">
            <Icon name="clock" size={18} />
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-card__value">{totals.rejected}</div>
            <div className="stat-card__label">{t('dashboard.stat.rejected')}</div>
          </div>
          <div className="stat-card__icon">
            <Icon name="alertCircle" size={18} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="panel">
            <div className="panel__header">
              <h3>{t('dashboard.yourContent')}</h3>
            </div>
            <div className="panel__body">
              <div className="table-wrap table-scroll" style={{ boxShadow: 'none', border: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('dashboard.table.type')}</th>
                      <th>{t('dashboard.table.total')}</th>
                      <th>{t('dashboard.table.published')}</th>
                      <th>{t('dashboard.table.pending')}</th>
                      <th>{t('dashboard.table.draft')}</th>
                      <th>{t('dashboard.table.rejected')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TYPES.map((tItem) => (
                      <tr key={tItem.key}>
                        <td>
                          <Link to={tItem.to} className="cell-title" style={{ textDecoration: 'none' }}>
                            {t(tItem.labelKey)}
                          </Link>
                        </td>
                        <td>{counts[tItem.key].total}</td>
                        <td>{counts[tItem.key].published}</td>
                        <td>{counts[tItem.key].pending}</td>
                        <td>{counts[tItem.key].draft}</td>
                        <td>{counts[tItem.key].rejected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panel__header">
              <h3>{t('dashboard.quickCreate')}</h3>
            </div>
            <div className="panel__body">
              <div className="quick-actions" style={{ flexDirection: 'column' }}>
                {TYPES.map((tItem) => (
                  <Link key={tItem.key} className="quick-action" to={`${tItem.to}?action=create`}>
                    <div className="quick-action__icon">
                      <Icon name={tItem.icon} size={16} />
                    </div>
                    <strong>{t('dashboard.newOf', { type: t(tItem.labelKey) })}</strong>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
