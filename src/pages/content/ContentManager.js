import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import SearchInput from '../../components/common/SearchInput';
import StatusBadge, { NeutralBadge } from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import { EmptyState, TableSkeleton, ErrorBanner } from '../../components/common/States';
import { ConfirmDialog } from '../../components/common/Modal';
import ContentFormModal from './ContentFormModal';
import ContentDetailModal from './ContentDetailModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDebounce } from '../../hooks/useDebounce';
import * as adminService from '../../services/adminService';
import { resolveFileUrl } from '../../utils/fileUrl';
import { formatDate, initials } from '../../utils/format';
import { errorMessage } from '../../utils/errorMessage';
import { CONTENT_STATUS_LIST } from '../../utils/constants';
import '../../styles/table.css';

export default function ContentManager({ config }) {
  const { isSuperAdmin } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const label = t(config.labelKey);
  const singular = t(config.singularKey);

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [businessFilter, setBusinessFilter] = useState('');
  const [extraFilter, setExtraFilter] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [businessOptions, setBusinessOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [rowAction, setRowAction] = useState(null);

  useEffect(() => {
    if (isSuperAdmin && businessOptions.length === 0) {
      adminService
        .listModeratedContent('businesses', { status: 'all', limit: 200 })
        .then((res) => setBusinessOptions(res.data.items.map((b) => ({ value: String(b.id), label: b.companyName }))))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin]);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setEditItem(null);
      setFormOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, businessFilter, extraFilter, debouncedSearch, config.key]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (isSuperAdmin) {
        res = await adminService.listModeratedContent(config.moderationType, {
          status: statusFilter || 'all',
          businessId: businessFilter || undefined,
          page,
          limit: 10,
        });
      } else {
        res = await config.service.mine({ status: statusFilter || undefined, page, limit: 10 });
      }
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, config, statusFilter, businessFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredItems = useMemo(() => {
    let list = items;
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      list = list.filter((it) => String(it[config.titleField] || '').toLowerCase().includes(q));
    }
    if (extraFilter && config.listFilters?.length) {
      const filterDef = config.listFilters[0];
      if (filterDef.name === 'upcoming') {
        const today = new Date().toISOString().slice(0, 10);
        list = list.filter((it) => (extraFilter === 'true' ? it.launchDate > today : it.launchDate && it.launchDate <= today));
      } else if (filterDef.name === 'type') {
        list = list.filter((it) => it.type === extraFilter);
      }
    }
    return list;
  }, [items, debouncedSearch, extraFilter, config]);

  const openCreate = () => {
    setEditItem(null);
    setFormOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditItem(null);
    load();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setRowAction(`delete-${confirmDelete.id}`);
    try {
      await config.service.remove(confirmDelete.id);
      toast.success(`${singular} ${t('common.delete').toLowerCase()}`);
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setRowAction(null);
    }
  };

  const handleModerate = async (item, newStatus) => {
    setRowAction(`${newStatus}-${item.id}`);
    try {
      await adminService.setContentStatus(config.moderationType, item.id, newStatus);
      toast.success(`${singular} ${t(`status.${newStatus}`).toLowerCase()}`);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setRowAction(null);
    }
  };

  const renderThumb = (item) => {
    const url = config.imageField && item[config.imageField] ? resolveFileUrl(item[config.imageField]) : null;
    if (url) return <img src={url} alt="" className="cell-thumb__img" />;
    return <div className="cell-thumb__placeholder">{initials(item[config.titleField] || '?')}</div>;
  };

  return (
    <div>
      <PageHeader
        title={label}
        subtitle={isSuperAdmin ? t('content.subtitleSuper', { label: label.toLowerCase() }) : t('content.subtitleBusiness', { label: label.toLowerCase() })}
        actions={
          <Button variant="primary" onClick={openCreate} icon={<Icon name="plus" size={15} />}>
            {t('content.newOf', { singular })}
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      <div className="table-wrap responsive-list">
        <div className="table-toolbar">
          <SearchInput value={search} onChange={setSearch} placeholder={t(config.searchPlaceholderKey)} />
          <div className="table-toolbar__filters">
            <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">{t('common.allStatuses')}</option>
              {CONTENT_STATUS_LIST.map((s) => (
                <option key={s} value={s}>
                  {t(`status.${s}`)}
                </option>
              ))}
            </select>
            {isSuperAdmin && (
              <select className="select" value={businessFilter} onChange={(e) => setBusinessFilter(e.target.value)}>
                <option value="">{t('common.allBusinesses')}</option>
                <option value="none">{t('content.filter.adminPosts')}</option>
                {businessOptions.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            )}
            {config.listFilters?.map((f) => (
              <select key={f.name} className="select" value={extraFilter} onChange={(e) => setExtraFilter(e.target.value)}>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {t(o.labelKey)}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={config.imageField ? 'image' : 'fileText'}
            title={t('content.emptyTitle', { label: label.toLowerCase() })}
            message={t('content.emptyMessage', { singular: singular.toLowerCase() })}
            actionLabel={t('content.newOf', { singular })}
            onAction={openCreate}
          />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{singular}</th>
                  {isSuperAdmin && <th>{t('content.table.business')}</th>}
                  <th>{t('common.status')}</th>
                  <th>{t('content.table.date')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="cell-thumb">
                        {config.imageField && renderThumb(item)}
                        <div>
                          <div className="cell-title">{item[config.titleField]}</div>
                        </div>
                      </div>
                    </td>
                    {isSuperAdmin && <td>{item.business?.companyName || <NeutralBadge>{t('content.adminPost')}</NeutralBadge>}</td>}
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="text-muted">{formatDate(item[config.dateField] || item.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        {isSuperAdmin && item.status === 'PENDING' && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleModerate(item, 'PUBLISHED')}
                              loading={rowAction === `PUBLISHED-${item.id}`}
                              title={t('common.approve')}
                            >
                              <Icon name="check" size={14} />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleModerate(item, 'REJECTED')}
                              loading={rowAction === `REJECTED-${item.id}`}
                              title={t('common.reject')}
                            >
                              <Icon name="x" size={14} />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" className="btn--icon" onClick={() => setDetailItem(item)} title={t('common.view')}>
                          <Icon name="eye" size={15} />
                        </Button>
                        <Button variant="ghost" size="sm" className="btn--icon" onClick={() => openEdit(item)} title={t('common.edit')}>
                          <Icon name="edit" size={15} />
                        </Button>
                        <Button variant="ghost" size="sm" className="btn--icon" onClick={() => setConfirmDelete(item)} title={t('common.delete')}>
                          <Icon name="trash" size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="card-list">
              {filteredItems.map((item) => (
                <div className="item-card" key={item.id}>
                  <div className="item-card__top">
                    {config.imageField && renderThumb(item)}
                    <div className="item-card__body">
                      <div className="item-card__title">{item[config.titleField]}</div>
                      <div className="item-card__meta">{isSuperAdmin ? item.business?.companyName || t('content.adminPost') : formatDate(item[config.dateField] || item.createdAt)}</div>
                      <div className="item-card__badge"><StatusBadge status={item.status} /></div>
                    </div>
                  </div>
                  <div className="item-card__actions">
                    {isSuperAdmin && item.status === 'PENDING' && (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => handleModerate(item, 'PUBLISHED')} loading={rowAction === `PUBLISHED-${item.id}`}>
                          {t('common.approve')}
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleModerate(item, 'REJECTED')} loading={rowAction === `REJECTED-${item.id}`}>
                          {t('common.reject')}
                        </Button>
                      </>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => setDetailItem(item)}>
                      {t('common.view')}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(item)}>
                      {t('common.edit')}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setConfirmDelete(item)}>
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

      <ContentFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        config={config}
        item={editItem}
        isSuperAdmin={isSuperAdmin}
        businessOptions={businessOptions}
        defaultBusinessId={businessFilter && businessFilter !== 'none' ? businessFilter : ''}
        onSaved={handleSaved}
      />

      <ContentDetailModal open={Boolean(detailItem)} onClose={() => setDetailItem(null)} config={config} item={detailItem} />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title={t('common.deleteConfirmTitle', { item: singular.toLowerCase() })}
        message={t('content.deleteBody', { name: confirmDelete?.[config.titleField] })}
        confirmLabel={t('common.delete')}
        loading={rowAction === `delete-${confirmDelete?.id}`}
      />
    </div>
  );
}
