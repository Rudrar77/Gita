import React, { createContext, useContext, useState, useEffect } from 'react';
import { userDataAPI } from '@/lib/api';
import { useAuth } from '@/hooks/AuthContext';

export type AppLanguage = 'hindi' | 'english';

const LanguageContext = createContext<{
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}>({
  language: 'hindi',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('hindi');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      userDataAPI.getAll().then(data => {
        if (data.appLanguage === 'english' || data.appLanguage === 'hindi') {
          setLanguageState(data.appLanguage);
        }
      }).catch(err => console.error("Error loading language preference:", err));
    }
  }, [isAuthenticated]);

  const setLanguage = async (lang: AppLanguage) => {
    setLanguageState(lang);
    if (isAuthenticated) {
      try {
        await userDataAPI.updateSettings({ appLanguage: lang });
      } catch (err) {
        console.error("Error saving language preference:", err);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): [AppLanguage, (lang: AppLanguage) => void] => {
  const { language, setLanguage } = useContext(LanguageContext);
  return [language, setLanguage];
};