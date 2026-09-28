import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { errorMessage } from '../../utils/errorMessage';
import Button from '../../components/common/Button';
import { TextField } from '../../components/common/FormField';
import '../../styles/auth.css';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <aside className="auth-screen__aside">
        <div className="auth-screen__brand">
          <div className="auth-screen__brand-mark">BM</div>
          <strong>{t('nav.brandName')}</strong>
        </div>
        <div className="auth-screen__quote">
          <h2>{t('login.quoteTitle')}</h2>
          <p>{t('login.quoteText')}</p>
        </div>
        <div />
      </aside>
      <main className="auth-screen__main">
        <div className="auth-card">
          <h1>{t('login.title')}</h1>
          <p className="lead">{t('login.lead')}</p>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label={t('login.email')}
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              full
            />
            <TextField
              label={t('login.password')}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              full
            />
            <Button type="submit" variant="primary" block loading={loading}>
              {t('login.submit')}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
