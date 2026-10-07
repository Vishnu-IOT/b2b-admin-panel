import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import SearchInput from '../../components/common/SearchInput';
import { RoleBadge } from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import { EmptyState, TableSkeleton, ErrorBanner } from '../../components/common/States';
import { ConfirmDialog } from '../../components/common/Modal';
import UserFormModal from './UserFormModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDebounce } from '../../hooks/useDebounce';
import * as adminService from '../../services/adminService';
import { formatDate, initials } from '../../utils/format';
import { errorMessage } from '../../utils/errorMessage';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setEditUser(null);
      setFormOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setPage(1), [debouncedSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listUsers({ q: debouncedSearch || undefined, page, limit: 10 });
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditUser(null);
    setFormOpen(true);
  };
  const openEdit = (u) => {
    setEditUser(u);
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
      await adminService.deleteUser(confirmDelete.id);
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
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        actions={
          <Button variant="primary" onClick={openCreate} icon={<Icon name="plus" size={15} />}>
            {t('users.new')}
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      <div className="table-wrap responsive-list">
        <div className="table-toolbar">
          <SearchInput value={search} onChange={setSearch} placeholder={t('users.searchPlaceholder')} />
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : items.length === 0 ? (
          <EmptyState icon="users" title={t('users.emptyTitle')} message={t('users.emptyMessage')} actionLabel={t('users.new')} onAction={openCreate} />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('users.table.user')}</th>
                  <th>{t('users.table.role')}</th>
                  <th>{t('users.table.business')}</th>
                  <th>{t('users.table.joined')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="avatar-chip">
                        <div className="avatar-chip__circle">{initials(u.name)}</div>
                        <div>
                          <div className="cell-title">{u.name}</div>
                          <div className="cell-sub">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="text-muted">{u.business?.companyName || '—'}</td>
                    <td className="text-muted">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <Button variant="ghost" size="sm" className="btn--icon" onClick={() => openEdit(u)} title={t('common.edit')}>
                          <Icon name="edit" size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="btn--icon"
                          onClick={() => setConfirmDelete(u)}
                          title={u.id === currentUser.id ? t('users.cannotDeleteSelf') : t('common.delete')}
                          disabled={u.id === currentUser.id}
                        >
                          <Icon name="trash" size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="card-list">
              {items.map((u) => (
                <div className="item-card" key={u.id}>
                  <div className="item-card__top">
                    <div className="avatar-chip__circle">{initials(u.name)}</div>
                    <div className="item-card__body">
                      <div className="item-card__title">{u.name}</div>
                      <div className="item-card__meta">{u.email}</div>
                      <div className="item-card__badge"><RoleBadge role={u.role} /></div>
                    </div>
                  </div>
                  <div className="item-card__actions">
                    <Button variant="secondary" size="sm" onClick={() => openEdit(u)}>
                      {t('common.edit')}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setConfirmDelete(u)} disabled={u.id === currentUser.id}>
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

      <UserFormModal open={formOpen} onClose={() => setFormOpen(false)} user={editUser} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title={t('common.deleteConfirmTitle', { item: t('users.table.user').toLowerCase() })}
        message={t('users.deleteBody', { name: confirmDelete?.name, withBusiness: confirmDelete?.business ? t('users.deleteWithBusiness') : '' })}
        confirmLabel={t('common.delete')}
        loading={deleting}
      />
    </div>
  );
}
