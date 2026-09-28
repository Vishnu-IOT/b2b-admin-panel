import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { TextField, TextareaField, SelectField } from '../../components/common/FormField';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { errorMessage } from '../../utils/errorMessage';
import * as resourceService from '../../services/resourceService';
import { CATEGORY_STATUS_LIST } from '../../utils/constants';

const empty = { name: '', description: '', status: 'ACTIVE' };

export default function ResourceCategoryFormModal({ open, onClose, category, onSaved }) {
  const toast = useToast();
  const { t } = useLanguage();
  const isEdit = Boolean(category);
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(category ? { name: category.name, description: category.description || '', status: category.status } : empty);
    setErrors({});
  }, [open, category]);

  const setField = (name, val) => setValues((prev) => ({ ...prev, [name]: val }));

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = t('resourceCategories.name');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await resourceService.updateResourceCategory(category.id, values);
        toast.success(t('common.saveChanges'));
      } else {
        await resourceService.createResourceCategory(values);
        toast.success(t('resourceCategories.createButton'));
      }
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? t('resourceCategories.modalTitleEdit') : t('resourceCategories.modalTitleNew')}>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField label={t('resourceCategories.name')} required full value={values.name} onChange={(e) => setField('name', e.target.value)} error={errors.name} />
        <TextareaField label={t('field.description')} rows={4} full value={values.description} onChange={(e) => setField('description', e.target.value)} />
        <SelectField
          label={t('common.status')}
          full
          value={values.status}
          onChange={(e) => setField('status', e.target.value)}
          options={CATEGORY_STATUS_LIST.map((s) => ({ value: s, label: t(`status.${s}`) }))}
        />
        <div className="form-actions">
          <Button variant="ghost" type="button" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            {isEdit ? t('common.saveChanges') : t('resourceCategories.createButton')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
