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
import BusinessFormModal from './BusinessFormModal';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDebounce } from '../../hooks/useDebounce';
import * as adminService from '../../services/adminService';
import * as businessService from '../../services/businessService';
import { resolveFileUrl } from '../../utils/fileUrl';
import { formatDate, initials } from '../../utils/format';
import { errorMessage } from '../../utils/errorMessage';
import { CONTENT_STATUS_LIST } from '../../utils/constants';

export default function BusinessesPage() {
  const toast = useToast();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ownerOptions, setOwnerOptions] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editBusiness, setEditBusiness] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [rowAction, setRowAction] = useState(null);

  const loadOwnerOptions = useCallback(async () => {
    try {
      const res = await adminService.listUsers({ role: 'BUSINESS_ADMIN', limit: 200 });
      const withoutBusiness = res.data.items.filter((u) => !u.business);
      setOwnerOptions(withoutBusiness.map((u) => ({ value: String(u.id), label: `${u.name} (${u.email})` })));
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    loadOwnerOptions();
  }, [loadOwnerOptions]);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setEditBusiness(null);
      setFormOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setPage(1), [statusFilter, debouncedSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listModeratedContent('businesses', { status: statusFilter || 'all', page, limit: 10 });
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = debouncedSearch.trim()
    ? items.filter((b) => b.companyName.toLowerCase().includes(debouncedSearch.trim().toLowerCase()))
    : items;

  const openCreate = () => {
    setEditBusiness(null);
    setFormOpen(true);
  };
  const openEdit = (b) => {
    setEditBusiness(b);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    load();
    loadOwnerOptions();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setRowAction(`delete-${confirmDelete.id}`);
    try {
      await businessService.deleteBusiness(confirmDelete.id);
      toast.success(t('common.delete'));
      setConfirmDelete(null);
      load();
      loadOwnerOptions();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setRowAction(null);
    }
  };

  const handleModerate = async (b, newStatus) => {
    setRowAction(`${newStatus}-${b.id}`);
    try {
      await adminService.setContentStatus('businesses', b.id, newStatus);
      toast.success(t(`status.${newStatus}`));
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setRowAction(null);
    }
  };

  return (
    <div>
      <PageHeader
        title={t('businesses.title')}
        subtitle={t('businesses.subtitle')}
        actions={
          <Button variant="primary" onClick={openCreate} icon={<Icon name="plus" size={15} />}>
            {t('businesses.new')}
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      <div className="table-wrap responsive-list">
        <div className="table-toolbar">
          <SearchInput value={search} onChange={setSearch} placeholder={t('field.companyName')} />
          <div className="table-toolbar__filters">
            <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">{t('common.allStatuses')}</option>
              {CONTENT_STATUS_LIST.map((s) => (
                <option key={s} value={s}>
                  {t(`status.${s}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : filtered.length === 0 ? (
          <EmptyState icon="building" title={t('businesses.emptyTitle')} message={t('businesses.emptyMessage')} actionLabel={t('businesses.new')} onAction={openCreate} />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('businesses.table.business')}</th>
                  <th>{t('businesses.table.owner')}</th>
                  <th>{t('businesses.table.industryLocation')}</th>
                  <th>{t('common.status')}</th>
                  <th>{t('businesses.table.created')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="cell-thumb">
                        {b.logo ? <img src={resolveFileUrl(b.logo)} alt="" className="cell-thumb__img" /> : <div className="cell-thumb__placeholder">{initials(b.companyName)}</div>}
                        <div className="cell-title">{b.companyName}</div>
                      </div>
                    </td>
                    <td>{b.owner ? `${b.owner.name}` : '—'}</td>
                    <td className="text-muted">
                      {b.industry || '—'}
                      {b.location ? ` · ${b.location}` : ''}
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="text-muted">{formatDate(b.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        {b.status === 'PENDING' && (
                          <>
                            <Button variant="secondary" size="sm" onClick={() => handleModerate(b, 'PUBLISHED')} loading={rowAction === `PUBLISHED-${b.id}`} title={t('common.approve')}>
                              <Icon name="check" size={14} />
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleModerate(b, 'REJECTED')} loading={rowAction === `REJECTED-${b.id}`} title={t('common.reject')}>
                              <Icon name="x" size={14} />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" className="btn--icon" onClick={() => openEdit(b)} title={t('common.edit')}>
                          <Icon name="edit" size={15} />
                        </Button>
                        <Button variant="ghost" size="sm" className="btn--icon" onClick={() => setConfirmDelete(b)} title={t('common.delete')}>
                          <Icon name="trash" size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="card-list">
              {filtered.map((b) => (
                <div className="item-card" key={b.id}>
                  <div className="item-card__top">
                    {b.logo ? <img src={resolveFileUrl(b.logo)} alt="" className="cell-thumb__img" /> : <div className="cell-thumb__placeholder">{initials(b.companyName)}</div>}
                    <div className="item-card__body">
                      <div className="item-card__title">{b.companyName}</div>
                      <div className="item-card__meta">{b.owner?.name || '—'}</div>
                      <div className="item-card__badge"><StatusBadge status={b.status} /></div>
                    </div>
                  </div>
                  <div className="item-card__actions">
                    {b.status === 'PENDING' && (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => handleModerate(b, 'PUBLISHED')}>
                          {t('common.approve')}
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleModerate(b, 'REJECTED')}>
                          {t('common.reject')}
                        </Button>
                      </>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => openEdit(b)}>
                      {t('common.edit')}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setConfirmDelete(b)}>
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

      <BusinessFormModal open={formOpen} onClose={() => setFormOpen(false)} business={editBusiness} ownerOptions={ownerOptions} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title={t('common.deleteConfirmTitle', { item: t('businesses.title').toLowerCase() })}
        message={t('businesses.deleteBody', { name: confirmDelete?.companyName })}
        confirmLabel={t('common.delete')}
        loading={rowAction === `delete-${confirmDelete?.id}`}
      />
    </div>
  );
}
