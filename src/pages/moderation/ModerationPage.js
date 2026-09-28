import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import { EmptyState, TableSkeleton, ErrorBanner } from '../../components/common/States';
import { ConfirmDialog } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import * as adminService from '../../services/adminService';
import { MODERATION_CONTENT_TYPES, CONTENT_STATUS_LIST } from '../../utils/constants';
import { moderationTypeLabel } from '../../utils/moderationHelpers';
import { itemTitle, itemOwnerLabel } from '../../utils/moderationHelpers';
import { formatDateTime } from '../../utils/format';
import { errorMessage } from '../../utils/errorMessage';

const TYPES = Object.keys(MODERATION_CONTENT_TYPES);

export default function ModerationPage() {
  const toast = useToast();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState(TYPES.includes(searchParams.get('type')) ? searchParams.get('type') : 'businesses');
  const [status, setStatus] = useState('PENDING');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rowAction, setRowAction] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    setSearchParams(type === 'businesses' ? {} : { type }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => setPage(1), [type, status]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.listModeratedContent(type, { status, page, limit: 10 });
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [type, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleModerate = async (item, newStatus) => {
    setRowAction(`${newStatus}-${item.id}`);
    try {
      await adminService.setContentStatus(type, item.id, newStatus);
      toast.success(`${moderationTypeLabel(type, t)} · ${t(`status.${newStatus}`)}`);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setRowAction(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setRowAction(`delete-${confirmDelete.id}`);
    try {
      await adminService.deleteModeratedContent(type, confirmDelete.id);
      toast.success(t('common.delete'));
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setRowAction(null);
    }
  };

  return (
    <div>
      <PageHeader title={t('moderation.title')} subtitle={t('moderation.subtitle')} />

      <div className="tabs scrollbar-thin" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
        {TYPES.map((tp) => (
          <button key={tp} className={type === tp ? 'active' : ''} onClick={() => setType(tp)} type="button" style={{ flexShrink: 0 }}>
            {moderationTypeLabel(tp, t)}
          </button>
        ))}
      </div>

      <div className="filter-bar" style={{ marginBottom: 14 }}>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
          <option value="all">{t('common.allStatuses')}</option>
          {CONTENT_STATUS_LIST.map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="table-wrap responsive-list">
        {loading ? (
          <TableSkeleton rows={5} />
        ) : items.length === 0 ? (
          <EmptyState
            icon="shield"
            title={t('moderation.emptyTitle')}
            message={t('moderation.emptyMessage', { status: status === 'all' ? '' : `${t(`status.${status}`)} `, type: moderationTypeLabel(type, t) })}
          />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('moderation.table.item')}</th>
                  <th>{t('moderation.table.owner')}</th>
                  <th>{t('common.status')}</th>
                  <th>{t('moderation.table.submitted')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="cell-title">{itemTitle(type, item)}</td>
                    <td className="text-muted">{itemOwnerLabel(type, item) || '—'}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="text-muted">{formatDateTime(item.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        {item.status !== 'PUBLISHED' && (
                          <Button variant="secondary" size="sm" onClick={() => handleModerate(item, 'PUBLISHED')} loading={rowAction === `PUBLISHED-${item.id}`} title={t('common.approve')}>
                            <Icon name="check" size={14} /> {t('common.approve')}
                          </Button>
                        )}
                        {item.status !== 'REJECTED' && (
                          <Button variant="danger" size="sm" onClick={() => handleModerate(item, 'REJECTED')} loading={rowAction === `REJECTED-${item.id}`} title={t('common.reject')}>
                            <Icon name="x" size={14} /> {t('common.reject')}
                          </Button>
                        )}
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
              {items.map((item) => (
                <div className="item-card" key={item.id}>
                  <div className="item-card__top">
                    <div style={{ flex: 1 }}>
                      <div className="item-card__title">{itemTitle(type, item)}</div>
                      <div className="item-card__meta">{itemOwnerLabel(type, item)}</div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="item-card__actions">
                    {item.status !== 'PUBLISHED' && (
                      <Button variant="secondary" size="sm" onClick={() => handleModerate(item, 'PUBLISHED')}>
                        {t('common.approve')}
                      </Button>
                    )}
                    {item.status !== 'REJECTED' && (
                      <Button variant="danger" size="sm" onClick={() => handleModerate(item, 'REJECTED')}>
                        {t('common.reject')}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(item)}>
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

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title={t('moderation.deleteTitle')}
        message={t('moderation.deleteBody')}
        confirmLabel={t('common.delete')}
        loading={rowAction === `delete-${confirmDelete?.id}`}
      />
    </div>
  );
}
