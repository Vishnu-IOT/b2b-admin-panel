import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import SearchInput from '../../components/common/SearchInput';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import { EmptyState, TableSkeleton, ErrorBanner } from '../../components/common/States';
import { ConfirmDialog } from '../../components/common/Modal';
import ResourcePostFormModal from './ResourcePostFormModal';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDebounce } from '../../hooks/useDebounce';
import * as resourceService from '../../services/resourceService';
import { resolveFileUrl } from '../../utils/fileUrl';
import { formatDate, initials } from '../../utils/format';
import { errorMessage } from '../../utils/errorMessage';

export default function ResourcePostsPage() {
  const toast = useToast();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    resourceService
      .listResourceCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setEditPost(null);
      setFormOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setPage(1), [statusFilter, categoryFilter, debouncedSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await resourceService.listResourcePosts({
        status: statusFilter || undefined,
        categoryId: categoryFilter || undefined,
        q: debouncedSearch || undefined,
        page,
        limit: 10,
      });
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  const openCreate = () => {
    setEditPost(null);
    setFormOpen(true);
  };
  const openEdit = async (post) => {
    try {
      const res = await resourceService.getResourcePost(post.id);
      setEditPost(res.data);
      setFormOpen(true);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleSaved = () => {
    setFormOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await resourceService.deleteResourcePost(confirmDelete.id);
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
        title={t('resourcePosts.title')}
        subtitle={t('resourcePosts.subtitle')}
        actions={
          <Button variant="primary" onClick={openCreate} icon={<Icon name="plus" size={15} />}>
            {t('resourcePosts.new')}
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      <div className="table-wrap responsive-list">
        <div className="table-toolbar">
          <SearchInput value={search} onChange={setSearch} placeholder={t('resourcePosts.searchPlaceholder')} />
          <div className="table-toolbar__filters">
            <select className="select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">{t('common.allCategories')}</option>
              {categoryOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">{t('common.allStatuses')}</option>
              <option value="DRAFT">{t('status.DRAFT')}</option>
              <option value="PUBLISHED">{t('status.PUBLISHED')}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : items.length === 0 ? (
          <EmptyState icon="fileText" title={t('resourcePosts.emptyTitle')} message={t('resourcePosts.emptyMessage')} actionLabel={t('resourcePosts.new')} onAction={openCreate} />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('resourcePosts.table.post')}</th>
                  <th>{t('resourcePosts.table.category')}</th>
                  <th>{t('common.status')}</th>
                  <th>{t('resourcePosts.table.published')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="cell-thumb">
                        {p.coverImage ? <img src={resolveFileUrl(p.coverImage)} alt="" className="cell-thumb__img" /> : <div className="cell-thumb__placeholder">{initials(p.title)}</div>}
                        <div className="cell-title">{p.title}</div>
                      </div>
                    </td>
                    <td className="text-muted">{p.category?.name || '—'}</td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="text-muted">{formatDate(p.publishedAt || p.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <Button variant="ghost" size="sm" className="btn--icon" onClick={() => openEdit(p)} title={t('common.edit')}>
                          <Icon name="edit" size={15} />
                        </Button>
                        <Button variant="ghost" size="sm" className="btn--icon" onClick={() => setConfirmDelete(p)} title={t('common.delete')}>
                          <Icon name="trash" size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="card-list">
              {items.map((p) => (
                <div className="item-card" key={p.id}>
                  <div className="item-card__top">
                    {p.coverImage ? <img src={resolveFileUrl(p.coverImage)} alt="" className="cell-thumb__img" /> : <div className="cell-thumb__placeholder">{initials(p.title)}</div>}
                    <div style={{ flex: 1 }}>
                      <div className="item-card__title">{p.title}</div>
                      <div className="item-card__meta">{p.category?.name}</div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="item-card__actions">
                    <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>
                      {t('common.edit')}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setConfirmDelete(p)}>
                      {t('common.delete')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onChange={setPage} />
          </>
        )}
      </div>

      <ResourcePostFormModal open={formOpen} onClose={() => setFormOpen(false)} post={editPost} categoryOptions={categoryOptions} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title={t('common.deleteConfirmTitle', { item: t('resourcePosts.table.post').toLowerCase() })}
        message={t('resourcePosts.deleteBody', { name: confirmDelete?.title })}
        confirmLabel={t('common.delete')}
        loading={deleting}
      />
    </div>
  );
}
