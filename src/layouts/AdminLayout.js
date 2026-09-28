import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarContent from './SidebarContent';
import Topbar from './Topbar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { navForRole } from '../utils/navConfig';
import * as adminService from '../services/adminService';
import '../styles/layout.css';

function pageTitleKey(pathname, role) {
  const sections = navForRole(role);
  for (const sec of sections) {
    for (const item of sec.items) {
      if (pathname === item.to || pathname.startsWith(`${item.to}/`)) return item.labelKey;
    }
  }
  return null;
}

export default function AdminLayout() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingTotal, setPendingTotal] = useState(0);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (user.role !== 'SUPER_ADMIN') return;
    adminService
      .getPendingCounts()
      .then((res) => setPendingTotal(Object.values(res.data).reduce((a, b) => a + b, 0)))
      .catch(() => {});
  }, [user.role, location.pathname]);

  const titleKey = pageTitleKey(location.pathname, user.role);
  const title = titleKey ? t(titleKey) : t('topbar.defaultTitle');

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <SidebarContent pendingTotal={pendingTotal} />
      </aside>

      {drawerOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="drawer">
            <SidebarContent pendingTotal={pendingTotal} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </>
      )}

      <div className="app-main">
        <Topbar title={title} onOpenDrawer={() => setDrawerOpen(true)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
