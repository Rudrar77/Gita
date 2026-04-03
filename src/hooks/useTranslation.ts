import { useLanguage } from './useLanguage';
import { ui } from '../i18n/ui';

export function useTranslation() {
  const [language] = useLanguage();
  return (key) => {
    if (!ui[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key; // Return the key as fallback
    }
    return ui[key][language] || ui[key].english || key;
  };
} 