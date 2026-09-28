import { useEffect } from 'react';
import Icon from './Icon';
import Button from './Button';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/modal.css';

export default function Modal({ open, onClose, title, size, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`modal ${size ? `modal--${size}` : ''}`} role="dialog" aria-modal="true">
        <div className="modal__header">
          <h3>{title}</h3>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel, danger = true, loading = false }) {
  const { t } = useLanguage();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || t('common.areYouSure')}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button variant={danger ? 'danger-solid' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel || t('common.confirm')}
          </Button>
        </>
      }
    >
      <div className="confirm-dialog">
        <p>{message}</p>
      </div>
    </Modal>
  );
}
