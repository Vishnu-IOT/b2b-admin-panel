import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { TextField, TextareaField, SelectField } from '../../components/common/FormField';
import FileUploadField from '../../components/common/FileUploadField';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { errorMessage } from '../../utils/errorMessage';
import { LANGUAGE_OPTIONS } from '../../i18n/translations';
import * as businessService from '../../services/businessService';

const empty = {
  companyName: '',
  industry: '',
  location: '',
  website: '',
  phone: '',
  email: '',
  description: '',
  story: '',
  logo: null,
  coverImage: null,
  language: 'en',
};

const toFormValues = (b) => ({
  companyName: b?.companyName || '',
  industry: b?.industry || '',
  location: b?.location || '',
  website: b?.website || '',
  phone: b?.phone || '',
  email: b?.email || '',
  description: b?.description || '',
  story: b?.story || '',
  logo: b?.logo || null,
  coverImage: b?.coverImage || null,
  language: b?.language === 'ta' ? 'ta' : 'en',
});

export default function BusinessProfileFormModal({ open, onClose, business, isNew, onSaved }) {
  const toast = useToast();
  const { t, setLanguage } = useLanguage();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(null); // 'DRAFT' | 'PENDING' | 'PUBLISHED' | null

  // Once approved, edits apply directly: no resubmission and no draft button (which would unpublish it).
  const isApproved = !isNew && business?.status === 'PUBLISHED';

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
    setValues(toFormValues(business));
    setErrors({});
  }, [open, business]);

  const setField = (name, val) => setValues((prev) => ({ ...prev, [name]: val }));

  const validate = () => {
    const errs = {};
    if (!values.companyName.trim()) errs.companyName = `${t('field.companyName')} ${t('common.notProvided').toLowerCase()}`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (statusIntent) => {
    if (!validate()) return;
    setSaving(statusIntent);
    try {
      const payload = { ...values, status: statusIntent };
      const res = isNew ? await businessService.createBusiness(payload) : await businessService.updateMyBusiness(payload);
      toast.success(isNew ? t('businessProfile.title') : t('common.saveChanges'));
      setLanguage(res.data.language); // reflect the new language across the whole panel immediately
      onSaved(res.data);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isNew ? t('businessProfile.modalTitleNew') : t('businessProfile.modalTitleEdit')} size="lg">
      <form onSubmit={(e) => e.preventDefault()}>
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
          <SelectField
            label={t('field.language')}
            value={values.language}
            onChange={(e) => setField('language', e.target.value)}
            options={LANGUAGE_OPTIONS}
            hint={t('field.language.hint')}
          />
        </div>

        <TextareaField label={t('businessProfile.shortDescription')} rows={4} full value={values.description} onChange={(e) => setField('description', e.target.value)} />
        <TextareaField label={t('businessProfile.companyStory')} rows={7} full value={values.story} onChange={(e) => setField('story', e.target.value)} />

        <div className="form-grid">
          <FileUploadField kind="image" label={t('field.logo')} value={values.logo} onChange={(f) => setField('logo', f)} />
          <FileUploadField kind="image" label={t('field.coverImage')} value={values.coverImage} onChange={(f) => setField('coverImage', f)} />
        </div>

        {isApproved && <div className="field__hint" style={{ marginBottom: 10 }}>{t('businessProfile.approvedNote')}</div>}

        <div className={`form-actions ${isApproved ? '' : 'form-actions--split'}`}>
          {!isApproved && (
            <Button variant="secondary" onClick={() => handleSave('DRAFT')} loading={saving === 'DRAFT'} disabled={Boolean(saving)}>
              {t('businessProfile.saveAsDraft')}
            </Button>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" type="button" onClick={onClose} disabled={Boolean(saving)}>
              {t('common.cancel')}
            </Button>
            {isApproved ? (
              <Button variant="primary" onClick={() => handleSave('PUBLISHED')} loading={saving === 'PUBLISHED'} disabled={Boolean(saving)}>
                {t('common.saveChanges')}
              </Button>
            ) : (
              <Button variant="primary" onClick={() => handleSave('PENDING')} loading={saving === 'PENDING'} disabled={Boolean(saving)}>
                {isNew ? t('businessProfile.submitForApproval') : t('businessProfile.saveAndResubmit')}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
