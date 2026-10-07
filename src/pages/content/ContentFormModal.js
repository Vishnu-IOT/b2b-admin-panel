import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { TextField, TextareaField, DateField, SelectField } from '../../components/common/FormField';
import FileUploadField from '../../components/common/FileUploadField';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { errorMessage } from '../../utils/errorMessage';
import { CONTENT_STATUS_LIST } from '../../utils/constants';

const emptyValues = (config) => {
  const v = {};
  config.fields.forEach((f) => {
    v[f.name] = '';
  });
  (config.fileFields || []).forEach((f) => {
    v[f.name] = null;
  });
  if (config.isVideoSource) {
    v.sourceType = 'YOUTUBE';
    v.youtubeUrl = '';
    v.video = null;
  }
  return v;
};

export default function ContentFormModal({ open, onClose, config, item, isSuperAdmin, businessOptions, defaultBusinessId = '', onSaved }) {
  const toast = useToast();
  const { t } = useLanguage();
  const isEdit = Boolean(item);
  const [values, setValues] = useState(() => emptyValues(config));
  const [businessId, setBusinessId] = useState('');
  const [status, setStatus] = useState('PUBLISHED');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(null); // 'DRAFT' | 'PENDING' | 'SAVE' | null

  const singular = t(config.singularKey);

  useEffect(() => {
    if (!open) return;
    if (item) {
      const v = {};
      config.fields.forEach((f) => {
        v[f.name] = item[f.name] ?? '';
      });
      (config.fileFields || []).forEach((f) => {
        v[f.name] = item[f.name] || null;
      });
      if (config.isVideoSource) {
        v.sourceType = item.type || 'YOUTUBE';
        v.youtubeUrl = item.youtubeUrl || '';
        v.video = item.videoPath || null;
      }
      setValues(v);
      setBusinessId(item.businessId ? String(item.businessId) : ''); // '' = admin post (no business)
      setStatus(item.status || 'PUBLISHED');
    } else {
      setValues(emptyValues(config));
      setBusinessId(defaultBusinessId || '');
      setStatus('PUBLISHED');
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item, config]);

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    const errs = {};
    config.fields.forEach((f) => {
      if (f.required && !String(values[f.name] || '').trim()) errs[f.name] = t(f.labelKey);
    });
    if (config.isVideoSource) {
      if (values.sourceType === 'YOUTUBE' && !String(values.youtubeUrl || '').trim()) {
        errs.youtubeUrl = t('content.youtubeLink');
      }
      if (values.sourceType === 'UPLOAD' && !values.video) {
        errs.video = t('content.uploadFile');
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildPayload = (statusToSend) => {
    const payload = {};
    config.fields.forEach((f) => {
      payload[f.name] = values[f.name] === '' ? '' : values[f.name];
    });
    (config.fileFields || []).forEach((f) => {
      if (values[f.name] instanceof File) payload[f.name] = values[f.name];
    });
    if (config.isVideoSource) {
      if (values.sourceType === 'YOUTUBE') {
        payload.youtubeUrl = values.youtubeUrl.trim();
      } else if (values.video instanceof File) {
        payload.video = values.video;
      }
    }
    // Super Admin: '' means "no business" — an admin post. Sent on edit too so a post can be moved or detached.
    if (isSuperAdmin) payload.businessId = businessId;
    payload.status = statusToSend;
    return payload;
  };

  const submit = async (statusToSend) => {
    if (!validate()) return;
    setSaving(statusToSend);
    try {
      const payload = buildPayload(statusToSend);
      if (isEdit) {
        await config.service.update(item.id, payload);
        toast.success(`${singular} ${t('common.saveChanges').toLowerCase()}`);
      } else {
        await config.service.create(payload);
        toast.success(`${singular} ${t('common.create').toLowerCase()}`);
      }
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? t('content.modalTitleEdit', { singular }) : t('content.modalTitleNew', { singular })} size="lg">
      <form onSubmit={(e) => e.preventDefault()}>
        {isSuperAdmin && (
          <SelectField
            label={t('content.selectBusiness')}
            hint={t('content.adminPostHint')}
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            options={[{ value: '', label: t('content.noBusinessOption') }, ...businessOptions]}
            full
          />
        )}

        <div className="form-grid">
          {config.fields.map((f) => {
            const commonProps = {
              key: f.name,
              label: t(f.labelKey),
              required: f.required,
              full: f.full,
              value: values[f.name] ?? '',
              onChange: (e) => setField(f.name, e.target.value),
              error: errors[f.name],
              maxLength: f.max,
              hint: f.hintKey ? t(f.hintKey) : undefined,
            };
            if (f.type === 'textarea') return <TextareaField {...commonProps} rows={f.rows} />;
            if (f.type === 'date') return <DateField {...commonProps} />;
            return <TextField {...commonProps} type="text" />;
          })}
        </div>

        {config.isVideoSource && (
          <div className="field field--full">
            <label className="field__label">{t('content.videoSource')}</label>
            <div className="toggle-tabs">
              <button type="button" className={values.sourceType === 'YOUTUBE' ? 'active' : ''} onClick={() => setField('sourceType', 'YOUTUBE')}>
                {t('content.youtubeLink')}
              </button>
              <button type="button" className={values.sourceType === 'UPLOAD' ? 'active' : ''} onClick={() => setField('sourceType', 'UPLOAD')}>
                {t('content.uploadFile')}
              </button>
            </div>
            {values.sourceType === 'YOUTUBE' ? (
              <TextField
                placeholder={t('content.youtubeUrlPlaceholder')}
                value={values.youtubeUrl}
                onChange={(e) => setField('youtubeUrl', e.target.value)}
                error={errors.youtubeUrl}
                full
              />
            ) : (
              <FileUploadField kind="video" value={values.video} onChange={(f) => setField('video', f)} />
            )}
            {errors.video && <div className="field__error">{errors.video}</div>}
          </div>
        )}

        <div className={(config.fileFields || []).length > 1 ? 'form-grid' : undefined}>
          {(config.fileFields || []).map((f) => (
            <FileUploadField key={f.name} kind={f.kind} label={t(f.labelKey)} value={values[f.name]} onChange={(file) => setField(f.name, file)} />
          ))}
        </div>

        {isSuperAdmin && (
          <SelectField
            label={t('common.status')}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={CONTENT_STATUS_LIST.map((s) => ({ value: s, label: t(`status.${s}`) }))}
            full
          />
        )}

        <div className={`form-actions ${!isSuperAdmin ? 'form-actions--split' : ''}`}>
          {!isSuperAdmin && (
            <Button variant="secondary" onClick={() => submit('DRAFT')} loading={saving === 'DRAFT'} disabled={Boolean(saving)}>
              {t('content.saveAsDraft')}
            </Button>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" type="button" onClick={onClose} disabled={Boolean(saving)}>
              {t('common.cancel')}
            </Button>
            {isSuperAdmin ? (
              <Button variant="primary" onClick={() => submit(status)} loading={saving === status}>
                {isEdit ? t('common.saveChanges') : t('common.create')}
              </Button>
            ) : (
              <Button variant="primary" onClick={() => submit('PENDING')} loading={saving === 'PENDING'} disabled={Boolean(saving)}>
                {t('content.submitForReview')}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
