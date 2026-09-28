import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import { TextareaField } from '../../components/common/FormField';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import * as qaService from '../../services/qaService';
import * as adminService from '../../services/adminService';
import { errorMessage } from '../../utils/errorMessage';
import { timeAgo } from '../../utils/format';

export default function QuestionDetailModal({ open, onClose, questionId, onChanged }) {
  const { user, isSuperAdmin } = useAuth();
  const toast = useToast();
  const { t } = useLanguage();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    if (!questionId) return;
    setLoading(true);
    try {
      const res = await qaService.getQuestion(questionId);
      setQuestion(res.data);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setReplyText('');
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, questionId]);

  const canManage = (item) => isSuperAdmin || item.userId === user.id;

  const postReply = async () => {
    if (!replyText.trim()) return;
    setPosting(true);
    try {
      await qaService.createAnswer(questionId, replyText.trim());
      setReplyText('');
      await load();
      onChanged?.();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setPosting(false);
    }
  };

  const deleteAnswer = async (id) => {
    setBusyId(id);
    try {
      await qaService.deleteAnswer(id);
      toast.success(t('common.delete'));
      await load();
      onChanged?.();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const moderateAnswer = async (id, status) => {
    setBusyId(id);
    try {
      await adminService.setContentStatus('answers', id, status);
      toast.success(t(`status.${status}`));
      await load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={question?.title || t('qa.title')} size="lg">
      {loading || !question ? (
        <p className="text-muted">{t('common.loading')}</p>
      ) : (
        <>
          <div className="detail-panel__meta">
            <StatusBadge status={question.status} />
            {question.category && <span>{question.category}</span>}
            <span>{t('qa.askedBy')} {question.user?.name || t('qa.unknownUser')}</span>
            <span>{timeAgo(question.createdAt)}</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 20 }}>{question.description}</p>

          <h3 style={{ fontSize: '0.95rem', marginBottom: 8 }}>
            {t('qa.answersHeading')} {question.answers?.length ? `(${question.answers.length})` : ''}
          </h3>

          {(!question.answers || question.answers.length === 0) && (
            <p className="text-muted" style={{ fontSize: '0.84rem' }}>
              {t('qa.noAnswers')}
            </p>
          )}

          {question.answers?.map((a) => (
            <div className="answer-item" key={a.id}>
              <div className="answer-item__head">
                <span className="answer-item__author">{a.user?.name || t('qa.unknownUser')}</span>
                <span className="answer-item__time">{timeAgo(a.createdAt)}</span>
              </div>
              <div className="answer-item__body">{a.answer}</div>
              <div className="row-actions" style={{ justifyContent: 'flex-start', marginTop: 6 }}>
                {isSuperAdmin && a.status === 'PENDING' && (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => moderateAnswer(a.id, 'PUBLISHED')} loading={busyId === a.id}>
                      {t('common.approve')}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => moderateAnswer(a.id, 'REJECTED')} loading={busyId === a.id}>
                      {t('common.reject')}
                    </Button>
                  </>
                )}
                {canManage(a) && (
                  <Button variant="ghost" size="sm" onClick={() => deleteAnswer(a.id)} loading={busyId === a.id}>
                    <Icon name="trash" size={13} /> {t('common.delete')}
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 18, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
            <TextareaField label={t('qa.postAnswerLabel')} rows={3} full value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={t('qa.postAnswerPlaceholder')} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="sm" onClick={postReply} loading={posting} disabled={!replyText.trim()}>
                {t('qa.postAnswerButton')}
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
