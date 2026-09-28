import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { NeutralBadge } from '../../components/common/StatusBadge';
import { EmptyState, CardSkeleton, ErrorBanner } from '../../components/common/States';
import { ConfirmDialog } from '../../components/common/Modal';
import ResourceCategoryFormModal from './ResourceCategoryFormModal';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import * as resourceService from '../../services/resourceService';
import { errorMessage } from '../../utils/errorMessage';
import '../../styles/pages.css';

export default function ResourceCategoriesPage() {
  const toast = useToast();
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await resourceService.listResourceCategories();
      setCategories(res.data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditCategory(null);
    setFormOpen(true);
  };
  const openEdit = (c) => {
    setEditCategory(c);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await resourceService.deleteResourceCategory(confirmDelete.id);
      toast.success(t('common.delete'));
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t('resourceCategories.title')}
        subtitle={t('resourceCategories.subtitle')}
        actions={
          <Button variant="primary" onClick={openCreate} icon={<Icon name="plus" size={15} />}>
            {t('resourceCategories.new')}
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <CardSkeleton count={6} />
      ) : categories.length === 0 ? (
        <EmptyState icon="folder" title={t('resourceCategories.emptyTitle')} message={t('resourceCategories.emptyMessage')} actionLabel={t('resourceCategories.new')} onAction={openCreate} />
      ) : (
        <div className="category-grid">
          {categories.map((c) => (
            <div className="category-card" key={c.id}>
              <div className="category-card__top">
                <div>
                  <div className="category-card__title">{c.name}</div>
                  <div className="category-card__count">{t('resourceCategories.postCount', { count: c.postCount, plural: c.postCount === 1 ? '' : 's' })}</div>
                </div>
                <NeutralBadge>{t(`status.${c.status}`)}</NeutralBadge>
              </div>
              {c.description && <p className="text-muted" style={{ fontSize: '0.82rem', margin: '4px 0' }}>{c.description}</p>}
              <div className="category-card__actions">
                <Button variant="secondary" size="sm" onClick={() => openEdit(c)}>
                  <Icon name="edit" size={13} /> {t('common.edit')}
                </Button>
                <Button variant="danger" size="sm" onClick={() => setConfirmDelete(c)}>
                  <Icon name="trash" size={13} /> {t('common.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ResourceCategoryFormModal open={formOpen} onClose={() => setFormOpen(false)} category={editCategory} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title={t('common.deleteConfirmTitle', { item: t('resourceCategories.name').toLowerCase() })}
        message={t('resourceCategories.deleteBody', { name: confirmDelete?.name })}
        confirmLabel={t('common.delete')}
        loading={deleting}
      />
    </div>
  );
}
