import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'hindi' | 'english';

const LanguageContext = createContext<{
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}>({
  language: 'hindi',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const stored = localStorage.getItem('appLanguage');
    return (stored === 'english' || stored === 'hindi') ? stored : 'hindi';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

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