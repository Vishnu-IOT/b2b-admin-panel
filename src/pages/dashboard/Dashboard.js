import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import PageHeader from '../../components/common/PageHeader';
import SuperAdminDashboard from './SuperAdminDashboard';
import BusinessAdminDashboard from './BusinessAdminDashboard';

export default function Dashboard() {
  const { user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();

  return (
    <div>
      <PageHeader
        title={t('dashboard.welcome', { name: user.name.split(' ')[0] })}
        subtitle={isSuperAdmin ? t('dashboard.subtitleSuper') : t('dashboard.subtitleBusiness')}
      />
      {isSuperAdmin ? <SuperAdminDashboard /> : <BusinessAdminDashboard />}
    </div>
  );
}
