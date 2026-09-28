import { useLanguage } from '../../context/LanguageContext';
import '../../styles/badges.css';

export default function StatusBadge({ status }) {
  const { t } = useLanguage();
  if (!status) return null;
  return <span className={`badge badge--${status}`}>{t(`status.${status}`)}</span>;
}

export function RoleBadge({ role }) {
  const { t } = useLanguage();
  return <span className="badge badge--role">{role === 'SUPER_ADMIN' ? t('users.roleSuperAdmin') : t('users.roleBusinessAdmin')}</span>;
}

export function NeutralBadge({ children }) {
  return <span className="badge badge--neutral">{children}</span>;
}
