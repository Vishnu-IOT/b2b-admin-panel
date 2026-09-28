import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import { useLanguage } from '../../context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="empty-state" style={{ minHeight: '70vh' }}>
      <div className="empty-state__icon">
        <Icon name="alertCircle" size={24} />
      </div>
      <h3>{t('notFound.title')}</h3>
      <p>{t('notFound.message')}</p>
      <Link to="/dashboard" className="btn btn--primary btn--sm">
        {t('notFound.back')}
      </Link>
    </div>
  );
}
