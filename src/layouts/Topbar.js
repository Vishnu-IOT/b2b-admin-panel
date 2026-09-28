import { useEffect, useRef, useState } from 'react';
import Icon from '../components/common/Icon';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import * as notificationService from '../services/notificationService';
import { timeAgo } from '../utils/format';
import { errorMessage } from '../utils/errorMessage';

export default function Topbar({ title, onOpenDrawer }) {
  const toast = useToast();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const loadUnread = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnread(res.data.count);
    } catch {
      /* silent — badge is non-critical */
    }
  };

  useEffect(() => {
    loadUnread();
    const t = setInterval(loadUnread, 45000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (open && panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest('.js-notif-trigger')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const togglePanel = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      try {
        const res = await notificationService.listNotifications({ limit: 8 });
        setItems(res.data.items);
      } catch (err) {
        toast.error(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleItemClick = async (n) => {
    if (!n.isRead) {
      try {
        await notificationService.markRead(n.id);
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
        setUnread((c) => Math.max(0, c - 1));
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <header className="topbar">
      <button type="button" className="topbar__menu-btn" onClick={onOpenDrawer} aria-label={t('topbar.notifications')}>
        <Icon name="menu" size={19} />
      </button>
      <div className="topbar__title">{title}</div>
      <div className="topbar__actions">
        <button type="button" className="icon-btn js-notif-trigger" onClick={togglePanel} aria-label={t('topbar.notifications')}>
          <Icon name="bell" size={17} />
          {unread > 0 && <span className="icon-btn__dot" />}
        </button>
      </div>

      {open && (
        <div className="notif-panel" ref={panelRef}>
          <div className="notif-panel__header">
            <strong style={{ fontSize: '0.86rem' }}>{t('topbar.notifications')}</strong>
            <button type="button" className="btn btn--ghost btn--sm" onClick={handleMarkAll}>
              {t('topbar.markAllRead')}
            </button>
          </div>
          <div className="notif-panel__list scrollbar-thin">
            {loading && <div style={{ padding: 16, fontSize: '0.82rem', color: 'var(--color-text-faint)' }}>{t('topbar.loading')}</div>}
            {!loading && items.length === 0 && (
              <div style={{ padding: 16, fontSize: '0.82rem', color: 'var(--color-text-faint)' }}>{t('topbar.allCaughtUp')}</div>
            )}
            {items.map((n) => (
              <div key={n.id} className={`notif-item ${!n.isRead ? 'notif-item--unread' : ''}`} onClick={() => handleItemClick(n)}>
                <div className="notif-item__title">{n.title}</div>
                {n.message && <div className="text-muted" style={{ fontSize: '0.78rem' }}>{n.message}</div>}
                <div className="notif-item__time">{timeAgo(n.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
