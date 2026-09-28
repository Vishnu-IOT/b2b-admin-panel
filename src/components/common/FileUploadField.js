import { useMemo } from 'react';
import Icon from './Icon';
import { useLanguage } from '../../context/LanguageContext';
import { resolveFileUrl } from '../../utils/fileUrl';
import '../../styles/forms.css';

const ACCEPT = {
  image: 'image/jpeg,image/png,image/webp,image/gif',
  video: 'video/mp4,video/webm,video/quicktime',
  document: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const LIMITS = { image: '5 MB', video: '200 MB', document: '20 MB' };
const TYPE_KEY = { image: 'fileUpload.imageTypes', video: 'fileUpload.videoTypes', document: 'fileUpload.docTypes' };

/**
 * value: either a File (freshly picked) or a string (existing stored path/URL) or null.
 * onChange(File | null)
 */
export default function FileUploadField({ label, hint, kind = 'image', value, onChange, required }) {
  const { t } = useLanguage();
  const previewUrl = useMemo(() => {
    if (value instanceof File) return URL.createObjectURL(value);
    if (typeof value === 'string' && value) return resolveFileUrl(value);
    return null;
  }, [value]);

  const fileName = value instanceof File ? value.name : typeof value === 'string' ? value.split('/').pop() : null;

  return (
    <div className="field">
      {label && (
        <label className="field__label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="upload-box">
        <div className="upload-box__preview">
          {previewUrl && kind === 'image' && <img src={previewUrl} alt="" />}
          {previewUrl && kind === 'video' && <video src={previewUrl} muted />}
          {!previewUrl && <Icon name={kind === 'video' ? 'video' : kind === 'document' ? 'fileText' : 'image'} size={22} />}
        </div>
        <div className="upload-box__body">
          <div className="upload-box__filename">{fileName || t('fileUpload.noFile')}</div>
          <div className="upload-box__meta">
            {t(TYPE_KEY[kind])} · {t('fileUpload.upTo', { limit: LIMITS[kind] })}
          </div>
        </div>
        <div className="upload-box__actions">
          <label className="file-input-label">
            <Icon name="upload" size={14} />
            {fileName ? t('fileUpload.replace') : t('fileUpload.upload')}
            <input type="file" accept={ACCEPT[kind]} onChange={(e) => onChange(e.target.files?.[0] || null)} />
          </label>
          {value && (
            <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={() => onChange(null)} aria-label="Remove file">
              <Icon name="x" size={15} />
            </button>
          )}
        </div>
      </div>
      {hint && <div className="field__hint">{hint}</div>}
    </div>
  );
}
