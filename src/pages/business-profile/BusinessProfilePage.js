import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import { EmptyState, PageLoader, ErrorBanner } from '../../components/common/States';
import BusinessProfileFormModal from './BusinessProfileFormModal';
import { useLanguage } from '../../context/LanguageContext';
import { errorMessage } from '../../utils/errorMessage';
import { resolveFileUrl } from '../../utils/fileUrl';
import { initials, formatDate } from '../../utils/format';
import * as businessService from '../../services/businessService';
import '../../styles/pages.css';

export default function BusinessProfilePage() {
  const { t } = useLanguage();
  const [business, setBusiness] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await businessService.getMyBusiness();
      setBusiness(res.data);
      setIsNew(false);
    } catch (err) {
      if (err.status === 404) {
        setBusiness(null);
        setIsNew(true);
      } else {
        setError(errorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaved = (updated) => {
    setBusiness(updated);
    setIsNew(false);
    setFormOpen(false);
  };

  if (loading) return <PageLoader />;

  const DETAIL_FIELDS = [
    { name: 'description', label: t('businessProfile.shortDescription') },
    { name: 'story', label: t('businessProfile.companyStory') },
  ];

  return (
    <div>
      <PageHeader
        title={t('businessProfile.title')}
        subtitle={business ? t('businessProfile.subtitleHas') : t('businessProfile.subtitleNew')}
        actions={
          business && (
            <Button variant="primary" onClick={() => setFormOpen(true)} icon={<Icon name="edit" size={15} />}>
              {t('businessProfile.editProfile')}
            </Button>
          )
        }
      />

      {error && <ErrorBanner message={error} />}

      {!business ? (
        <div className="panel">
          <div className="panel__body" style={{ padding: '36px 20px' }}>
            <EmptyState
              icon="building"
              title={t('businessProfile.emptyTitle')}
              message={t('businessProfile.emptyMessage')}
              actionLabel={t('businessProfile.setupAction')}
              onAction={() => setFormOpen(true)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="profile-card">
            <div className="profile-card__cover">{business.coverImage && <img src={resolveFileUrl(business.coverImage)} alt="" />}</div>
            <div className="profile-card__body">
              <div className="profile-card__logo">{business.logo ? <img src={resolveFileUrl(business.logo)} alt="" /> : initials(business.companyName)}</div>
              <div className="profile-card__name">
                <h2 style={{ margin: 0 }}>{business.companyName}</h2>
                <StatusBadge status={business.status} />
              </div>
              <div className="profile-card__meta">
                {business.industry && (
                  <span>
                    <Icon name="briefcase" size={14} /> {business.industry}
                  </span>
                )}
                {business.location && (
                  <span>
                    <Icon name="mapPin" size={14} /> {business.location}
                  </span>
                )}
                {business.website && (
                  <span>
                    <Icon name="globe" size={14} /> {business.website}
                  </span>
                )}
                {business.phone && (
                  <span>
                    <Icon name="phone" size={14} /> {business.phone}
                  </span>
                )}
                {business.email && (
                  <span>
                    <Icon name="mail" size={14} /> {business.email}
                  </span>
                )}
                <span>
                  <Icon name="globe" size={14} /> {business.language === 'ta' ? t('field.language.tamil') : t('field.language.english')}
                </span>
              </div>
            </div>
          </div>

          {business.status !== 'PUBLISHED' && (
            <div className="panel" style={{ borderColor: 'var(--color-pending-border)' }}>
              <div className="panel__body" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
                <Icon name="clock" size={18} style={{ color: 'var(--color-pending)', flexShrink: 0 }} />
                <div style={{ fontSize: '0.86rem' }}>
                  {t('common.status')}: <strong>{t(`status.${business.status}`)}</strong>.{' '}
                  {business.status === 'PENDING' && t('businessProfile.statusPending')}
                  {business.status === 'DRAFT' && t('businessProfile.statusDraft')}
                  {business.status === 'REJECTED' && t('businessProfile.statusRejected')}
                </div>
              </div>
            </div>
          )}

          <div className="detail-panel">
            <div className="detail-panel__meta">
              <span>
                {t('common.created')} {formatDate(business.createdAt)}
              </span>
              {business.updatedAt && (
                <span>
                  {t('common.updated')} {formatDate(business.updatedAt)}
                </span>
              )}
            </div>
            <div className="form-grid">
              {DETAIL_FIELDS.map((f) => (
                <div key={f.name} className="field field--full">
                  <label className="field__label">{f.label}</label>
                  <div className="detail-panel__content" style={{ fontSize: '0.88rem' }}>
                    {business[f.name] || <span className="text-faint">{t('common.notProvided')}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <BusinessProfileFormModal open={formOpen} onClose={() => setFormOpen(false)} business={business} isNew={isNew} onSaved={handleSaved} />
    </div>
  );
}
