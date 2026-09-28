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
import QuestionFormModal from './QuestionFormModal';
import QuestionDetailModal from './QuestionDetailModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDebounce } from '../../hooks/useDebounce';
import * as qaService from '../../services/qaService';
import * as adminService from '../../services/adminService';
import { timeAgo } from '../../utils/format';
import { errorMessage } from '../../utils/errorMessage';
import '../../styles/pages.css';

export default function QuestionsPage() {
  const { user, isSuperAdmin } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tab, setTab] = useState('mine');
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [rowAction, setRowAction] = useState(null);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setEditQuestion(null);
      setFormOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setPage(1), [tab, debouncedSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { q: debouncedSearch || undefined, page, limit: 10 };
      const res = tab === 'mine' ? await qaService.listMyQuestions(params) : await qaService.listQuestions(params);
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [tab, debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  const canManage = (q) => isSuperAdmin || q.userId === user.id;

  const openCreate = () => {
    setEditQuestion(null);
    setFormOpen(true);
  };
  const openEdit = (q) => {
    setEditQuestion(q);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setRowAction(`delete-${confirmDelete.id}`);
    try {
      await qaService.deleteQuestion(confirmDelete.id);
      toast.success(t('common.delete'));
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setRowAction(null);
    }
  };

  const handleModerate = async (q, status) => {
    setRowAction(`${status}-${q.id}`);
    try {
      await adminService.setContentStatus('questions', q.id, status);
      toast.success(t(`status.${status}`));
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
        title={t('qa.title')}
        subtitle={t('qa.subtitle')}
        actions={
          <Button variant="primary" onClick={openCreate} icon={<Icon name="plus" size={15} />}>
            {t('qa.askQuestion')}
          </Button>
        }
      />

      <div className="tabs">
        <button className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')} type="button">
          {t('qa.tabMine')}
        </button>
        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')} type="button">
          {t('qa.tabAll')}
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="filter-bar" style={{ marginBottom: 14 }}>
        <SearchInput value={search} onChange={setSearch} placeholder={t('qa.searchPlaceholder')} />
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : items.length === 0 ? (
        <EmptyState icon="message" title={t('qa.emptyTitle')} message={t('qa.emptyMessage')} actionLabel={t('qa.askQuestion')} onAction={openCreate} />
      ) : (
        <>
          {items.map((q) => (
            <div className="qa-item" key={q.id}>
              <div className="qa-item__top">
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setDetailId(q.id)}>
                  <div className="qa-item__title">{q.title}</div>
                  <div className="qa-item__desc">{q.description.length > 160 ? `${q.description.slice(0, 160)}…` : q.description}</div>
                  <div className="qa-item__meta">
                    {q.category && <span>{q.category}</span>}
                    <span>{q.user?.name}</span>
                    <span>{timeAgo(q.createdAt)}</span>
                    <span>{q.answerCount ?? 0} {t('qa.answers')}</span>
                  </div>
                </div>
                <StatusBadge status={q.status} />
              </div>
              <div className="row-actions" style={{ justifyContent: 'flex-start', marginTop: 10 }}>
                <Button variant="secondary" size="sm" onClick={() => setDetailId(q.id)}>
                  {t('qa.viewAndAnswer')}
                </Button>
                {isSuperAdmin && q.status === 'PENDING' && (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => handleModerate(q, 'PUBLISHED')} loading={rowAction === `PUBLISHED-${q.id}`}>
                      {t('common.approve')}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleModerate(q, 'REJECTED')} loading={rowAction === `REJECTED-${q.id}`}>
                      {t('common.reject')}
                    </Button>
                  </>
                )}
                {canManage(q) && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(q)}>
                      {t('common.edit')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(q)}>
                      {t('common.delete')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onChange={setPage} />
        </>
      )}

      <QuestionFormModal open={formOpen} onClose={() => setFormOpen(false)} question={editQuestion} onSaved={handleSaved} />

      <QuestionDetailModal open={Boolean(detailId)} onClose={() => setDetailId(null)} questionId={detailId} onChanged={load} />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title={t('common.deleteConfirmTitle', { item: t('qa.title').toLowerCase() })}
        message={t('qa.deleteBody', { name: confirmDelete?.title })}
        confirmLabel={t('common.delete')}
        loading={rowAction === `delete-${confirmDelete?.id}`}
      />
    </div>
  );
}
