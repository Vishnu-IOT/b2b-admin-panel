import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import * as businessService from '../services/businessService';
import { translations } from '../i18n/translations';
import { ROLES } from '../utils/constants';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated || !user || user.role !== ROLES.BUSINESS_ADMIN) {
      setLanguageState('en');
      return undefined;
    }
    businessService
      .getMyBusiness()
      .then((res) => {
        if (!cancelled) setLanguageState(res.data.language === 'ta' ? 'ta' : 'en');
      })
      .catch(() => {
        if (!cancelled) setLanguageState('en');
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user]);

  // Called right after a business profile save so the whole UI updates immediately,
  // without waiting for a refetch.
  const setLanguage = useCallback((lang) => setLanguageState(lang === 'ta' ? 'ta' : 'en'), []);

  const t = useCallback(
    (key, vars) => {
      let str = translations[language]?.[key] ?? translations.en[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        });
      }
      return str;
    },
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
