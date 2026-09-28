import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { TextField, TextareaField, SelectField } from '../../components/common/FormField';
import FileUploadField from '../../components/common/FileUploadField';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { errorMessage } from '../../utils/errorMessage';
import * as businessService from '../../services/businessService';
import { CONTENT_STATUS_LIST } from '../../utils/constants';
import { LANGUAGE_OPTIONS } from '../../i18n/translations';

const empty = { companyName: '', industry: '', location: '', website: '', phone: '', email: '', description: '', story: '', logo: null, coverImage: null, language: 'en' };

export default function BusinessFormModal({ open, onClose, business, ownerOptions, onSaved }) {
  const toast = useToast();
  const { t } = useLanguage();
  const isEdit = Boolean(business);
  const [values, setValues] = useState(empty);
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('PUBLISHED');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const FIELDS = [
    { name: 'companyName', label: t('field.companyName'), required: true, full: true },
    { name: 'industry', label: t('field.industry') },
    { name: 'location', label: t('field.location') },
    { name: 'website', label: t('field.website'), placeholder: 'https://example.com' },
    { name: 'phone', label: t('field.phone') },
    { name: 'email', label: t('field.email'), type: 'email' },
  ];

  useEffect(() => {
    if (!open) return;
    if (business) {
      setValues({
        companyName: business.companyName || '',
        industry: business.industry || '',
        location: business.location || '',
        website: business.website || '',
        phone: business.phone || '',
        email: business.email || '',
        description: business.description || '',
        story: business.story || '',
        logo: business.logo || null,
        coverImage: business.coverImage || null,
        language: business.language === 'ta' ? 'ta' : 'en',
      });
      setStatus(business.status || 'PUBLISHED');
    } else {
      setValues(empty);
      setUserId('');
      setStatus('PUBLISHED');
    }
    setErrors({});
  }, [open, business]);

  const setField = (name, val) => setValues((prev) => ({ ...prev, [name]: val }));

  const validate = () => {
    const errs = {};
    if (!values.companyName.trim()) errs.companyName = t('field.companyName');
    if (!isEdit && !userId) errs.userId = t('businesses.ownerPlaceholder');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...values, status };
      if (!isEdit) payload.userId = userId;
      if (isEdit) {
        await businessService.updateBusiness(business.id, payload);
        toast.success(t('common.saveChanges'));
      } else {
        await businessService.createBusiness(payload);
        toast.success(t('businesses.createButton'));
      }
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? t('businesses.modalTitleEdit') : t('businesses.modalTitleNew')} size="lg">
      <form onSubmit={(e) => e.preventDefault()}>
        {!isEdit && (
          <SelectField
            label={t('businesses.ownerLabel')}
            required
            placeholder={t('businesses.ownerPlaceholder')}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            options={ownerOptions}
            error={errors.userId}
            hint={ownerOptions.length === 0 ? t('content.noBusinessOptions') : undefined}
            full
          />
        )}

        <div className="form-grid">
          {FIELDS.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              required={f.required}
              full={f.full}
              type={f.type || 'text'}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={(e) => setField(f.name, e.target.value)}
              error={errors[f.name]}
            />
          ))}
          <SelectField label={t('field.language')} value={values.language} onChange={(e) => setField('language', e.target.value)} options={LANGUAGE_OPTIONS} hint={t('field.language.hint')} />
        </div>

        <TextareaField label={t('field.description')} rows={4} full value={values.description} onChange={(e) => setField('description', e.target.value)} />
        <TextareaField label={t('field.story')} rows={6} full value={values.story} onChange={(e) => setField('story', e.target.value)} />

        <div className="form-grid">
          <FileUploadField kind="image" label={t('field.logo')} value={values.logo} onChange={(f) => setField('logo', f)} />
          <FileUploadField kind="image" label={t('field.coverImage')} value={values.coverImage} onChange={(f) => setField('coverImage', f)} />
        </div>

        <SelectField label={t('common.status')} value={status} onChange={(e) => setStatus(e.target.value)} options={CONTENT_STATUS_LIST.map((s) => ({ value: s, label: t(`status.${s}`) }))} full />

        <div className="form-actions">
          <Button variant="ghost" type="button" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            {isEdit ? t('common.saveChanges') : t('businesses.createButton')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
