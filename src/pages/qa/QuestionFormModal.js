import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { TextField, TextareaField } from '../../components/common/FormField';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { errorMessage } from '../../utils/errorMessage';
import * as qaService from '../../services/qaService';

const empty = { title: '', description: '', category: '' };

export default function QuestionFormModal({ open, onClose, question, onSaved }) {
  const toast = useToast();
  const { t } = useLanguage();
  const isEdit = Boolean(question);
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(question ? { title: question.title, description: question.description, category: question.category || '' } : empty);
    setErrors({});
  }, [open, question]);

  const setField = (name, val) => setValues((prev) => ({ ...prev, [name]: val }));

  const validate = () => {
    const errs = {};
    if (!values.title.trim()) errs.title = t('field.title');
    if (!values.description.trim()) errs.description = t('qa.description');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await qaService.updateQuestion(question.id, values);
        toast.success(t('common.saveChanges'));
      } else {
        await qaService.createQuestion(values);
        toast.success(t('qa.postQuestion'));
      }
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? t('qa.modalTitleEdit') : t('qa.modalTitleNew')}>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField label={t('field.title')} required full value={values.title} onChange={(e) => setField('title', e.target.value)} error={errors.title} />
        <TextField label={t('qa.category')} full value={values.category} onChange={(e) => setField('category', e.target.value)} placeholder={t('qa.categoryPlaceholder')} />
        <TextareaField label={t('qa.description')} required rows={6} full value={values.description} onChange={(e) => setField('description', e.target.value)} error={errors.description} />
        <div className="form-actions">
          <Button variant="ghost" type="button" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            {isEdit ? t('common.saveChanges') : t('qa.postQuestion')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
