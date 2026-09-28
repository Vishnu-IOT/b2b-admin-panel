import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { TextField, TextareaField, SelectField } from '../../components/common/FormField';
import FileUploadField from '../../components/common/FileUploadField';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { errorMessage } from '../../utils/errorMessage';
import * as resourceService from '../../services/resourceService';

const empty = { categoryId: '', title: '', summary: '', content: '', coverImage: null, file: null, sourceType: 'NONE', videoUrl: '', video: null };

export default function ResourcePostFormModal({ open, onClose, post, categoryOptions, onSaved }) {
  const toast = useToast();
  const { t } = useLanguage();
  const isEdit = Boolean(post);
  const [values, setValues] = useState(empty);
  const [status, setStatus] = useState('PUBLISHED');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (post) {
      setValues({
        categoryId: String(post.categoryId || post.category?.id || ''),
        title: post.title || '',
        summary: post.summary || '',
        content: post.content || '',
        coverImage: post.coverImage || null,
        file: post.filePath || null,
        sourceType: post.videoUrl ? (/youtube/i.test(post.videoUrl) ? 'YOUTUBE' : 'UPLOAD') : 'NONE',
        videoUrl: post.videoUrl && /youtube/i.test(post.videoUrl) ? post.videoUrl : '',
        video: post.videoUrl && !/youtube/i.test(post.videoUrl) ? post.videoUrl : null,
      });
      setStatus(post.status || 'PUBLISHED');
    } else {
      setValues(empty);
      setStatus('PUBLISHED');
    }
    setErrors({});
  }, [open, post]);

  const setField = (name, val) => setValues((prev) => ({ ...prev, [name]: val }));

  const validate = () => {
    const errs = {};
    if (!values.categoryId) errs.categoryId = t('resourcePosts.categoryPlaceholder');
    if (!values.title.trim()) errs.title = t('field.title');
    if (values.sourceType === 'YOUTUBE' && !values.videoUrl.trim()) errs.videoUrl = t('content.youtubeLink');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        categoryId: values.categoryId,
        title: values.title,
        summary: values.summary,
        content: values.content,
        status,
      };
      if (values.coverImage instanceof File) payload.coverImage = values.coverImage;
      if (values.file instanceof File) payload.file = values.file;
      if (values.sourceType === 'YOUTUBE') payload.videoUrl = values.videoUrl.trim();
      else if (values.sourceType === 'UPLOAD' && values.video instanceof File) payload.video = values.video;

      if (isEdit) {
        await resourceService.updateResourcePost(post.id, payload);
        toast.success(t('common.saveChanges'));
      } else {
        await resourceService.createResourcePost(payload);
        toast.success(t('resourcePosts.createButton'));
      }
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? t('resourcePosts.modalTitleEdit') : t('resourcePosts.modalTitleNew')} size="lg">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <SelectField
            label={t('resourcePosts.category')}
            required
            placeholder={t('resourcePosts.categoryPlaceholder')}
            value={values.categoryId}
            onChange={(e) => setField('categoryId', e.target.value)}
            options={categoryOptions}
            error={errors.categoryId}
          />
          <TextField label={t('field.title')} required value={values.title} onChange={(e) => setField('title', e.target.value)} error={errors.title} />
          <TextareaField label={t('resourcePosts.summary')} rows={3} full value={values.summary} onChange={(e) => setField('summary', e.target.value)} />
          <TextareaField label={t('field.content')} rows={10} full value={values.content} onChange={(e) => setField('content', e.target.value)} />
        </div>

        <FileUploadField kind="image" label={t('field.coverImage')} value={values.coverImage} onChange={(f) => setField('coverImage', f)} />
        <FileUploadField kind="document" label={t('resourcePosts.attachment')} value={values.file} onChange={(f) => setField('file', f)} />

        <div className="field field--full">
          <label className="field__label">{t('resourcePosts.videoOptional')}</label>
          <div className="toggle-tabs">
            <button type="button" className={values.sourceType === 'NONE' ? 'active' : ''} onClick={() => setField('sourceType', 'NONE')}>
              {t('resourcePosts.none')}
            </button>
            <button type="button" className={values.sourceType === 'YOUTUBE' ? 'active' : ''} onClick={() => setField('sourceType', 'YOUTUBE')}>
              {t('content.youtubeLink')}
            </button>
            <button type="button" className={values.sourceType === 'UPLOAD' ? 'active' : ''} onClick={() => setField('sourceType', 'UPLOAD')}>
              {t('content.uploadFile')}
            </button>
          </div>
          {values.sourceType === 'YOUTUBE' && (
            <TextField placeholder={t('content.youtubeUrlPlaceholder')} value={values.videoUrl} onChange={(e) => setField('videoUrl', e.target.value)} error={errors.videoUrl} full />
          )}
          {values.sourceType === 'UPLOAD' && <FileUploadField kind="video" value={values.video} onChange={(f) => setField('video', f)} />}
        </div>

        <SelectField
          label={t('common.status')}
          full
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: 'DRAFT', label: t('resourcePosts.statusDraft') },
            { value: 'PUBLISHED', label: t('resourcePosts.statusPublished') },
          ]}
        />

        <div className="form-actions">
          <Button variant="ghost" type="button" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            {isEdit ? t('common.saveChanges') : t('resourcePosts.createButton')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
