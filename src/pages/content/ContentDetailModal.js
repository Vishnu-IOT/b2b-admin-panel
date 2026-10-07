import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Icon from '../../components/common/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { resolveFileUrl, youtubeId } from '../../utils/fileUrl';
import { formatDateTime, formatDate } from '../../utils/format';

export default function ContentDetailModal({ open, onClose, config, item }) {
  const { t } = useLanguage();
  if (!item) return null;
  const title = item[config.titleField];
  const imageUrls = (config.fileFields || [])
    .filter((f) => f.kind === 'image' && item[f.name])
    .map((f) => resolveFileUrl(item[f.name]));

  return (
    <Modal open={open} onClose={onClose} title={title || t(config.singularKey)} size="lg">
      <div className="detail-panel__meta">
        <StatusBadge status={item.status} />
        {item.business?.companyName && <span>{item.business.companyName}</span>}
        {item.businessId === null && <span>{t('content.adminPost')}</span>}
        <span>
          {t('common.created')} {formatDateTime(item.createdAt)}
        </span>
        {item.updatedAt && (
          <span>
            {t('common.updated')} {formatDateTime(item.updatedAt)}
          </span>
        )}
      </div>

      {imageUrls.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${imageUrls.length > 1 ? 200 : 280}px, 1fr))`, gap: 12, marginBottom: 16 }}>
          {imageUrls.map((url) => (
            <img key={url} src={url} alt={title} style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--color-border)' }} />
          ))}
        </div>
      )}

      {config.isVideoSource && (
        <div style={{ marginBottom: 16 }}>
          {item.type === 'YOUTUBE' && item.youtubeUrl ? (
            <div className="video-thumb">
              <iframe
                title={title}
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0 }}
                src={`https://www.youtube.com/embed/${youtubeId(item.youtubeUrl)}`}
                allowFullScreen
              />
            </div>
          ) : item.videoPath ? (
            <video src={resolveFileUrl(item.videoPath)} controls style={{ width: '100%', borderRadius: 10, maxHeight: 320 }} />
          ) : null}
        </div>
      )}

      <div className="form-grid">
        {config.fields
          .filter((f) => f.name !== config.titleField)
          .map((f) => (
            <div key={f.name} className={`field ${f.full ? 'field--full' : ''}`}>
              <label className="field__label">{t(f.labelKey)}</label>
              <div className="detail-panel__content" style={{ fontSize: '0.86rem' }}>
                {f.type === 'date' ? formatDate(item[f.name]) : item[f.name] || <span className="text-faint">{t('common.notProvided')}</span>}
              </div>
            </div>
          ))}
      </div>

      {item.businessId === null && (
        <div className="field">
          <label className="field__label">
            <Icon name="building" size={13} /> {t('content.selectBusiness')}
          </label>
          <div className="detail-panel__content" style={{ fontSize: '0.86rem' }}>
            {t('content.adminPost')}
          </div>
        </div>
      )}

      {item.business && (
        <div className="field">
          <label className="field__label">
            <Icon name="building" size={13} /> {t('content.selectBusiness')}
          </label>
          <div className="detail-panel__content" style={{ fontSize: '0.86rem' }}>
            {item.business.companyName}
          </div>
        </div>
      )}
    </Modal>
  );
}
