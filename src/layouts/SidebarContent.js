import { NavLink } from 'react-router-dom';
import Icon from '../components/common/Icon';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { navForRole } from '../utils/navConfig';
import { initials } from '../utils/format';

export default function SidebarContent({ pendingTotal = 0, onNavigate }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const sections = navForRole(user.role);

  return (
    <>
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">BM</div>
        <div className="sidebar__brand-text">
          <strong>{t('nav.brandName')}</strong>
          <span>{t('nav.brandSub')}</span>
        </div>
      </div>

      <nav className="sidebar__nav scrollbar-thin">
        {sections.map((sec, i) => (
          <div key={i}>
            {sec.sectionKey && <div className="sidebar__section-label">{t(sec.sectionKey)}</div>}
            {sec.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
                onClick={onNavigate}
              >
                <Icon name={item.icon} size={17} />
                {t(item.labelKey)}
                {item.badgeKey === 'total' && pendingTotal > 0 && <span className="sidebar__link-badge">{pendingTotal}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{initials(user.name)}</div>
          <div className="sidebar__user-info">
            <strong>{user.name}</strong>
            <span>{user.role === 'SUPER_ADMIN' ? t('users.roleSuperAdmin') : t('users.roleBusinessAdmin')}</span>
          </div>
          <button type="button" className="btn btn--ghost btn--icon" onClick={logout} aria-label={t('nav.logout')} title={t('nav.logout')}>
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
