import React, { useState } from 'react';
import Header from '@/components/Header';
import { 
  Home, 
  Star, 
  Calendar, 
  HelpCircle, 
  Layers,
  Settings as SettingsIcon,
  Bell, 
  Volume2, 
  Moon, 
  Sun,
  Smartphone,
  Globe,
  Info,
  Heart,
  BookOpen,
  Target,
  TrendingUp,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, AppLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';
import MobileNavigation from '@/components/MobileNavigation';
import { notifications, hapticFeedback, storage } from '@/utils/capacitorUtils';
import { userDataAPI } from '@/lib/api';
import { useAuth } from '@/hooks/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const { isAuthenticated } = useAuth();
  // Load settings from storage and API on mount
  React.useEffect(() => {
    const loadSettings = async () => {
      let notifEnabled = false;
      if (isAuthenticated) {
        try {
          const data = await userDataAPI.getAll();
          notifEnabled = !!data.dailyVerseNotificationEnabled;
        } catch (e) {
          console.error("Error loading notification settings", e);
        }
      }
      
      const autoPlay = await storage.get('autoPlayEnabled');
      const darkMode = await storage.get('darkModeEnabled');
      
      setNotificationsEnabled(notifEnabled);
      setAutoPlayEnabled(autoPlay || false);
      setDarkModeEnabled(darkMode || false);
    };
    
    loadSettings();
  }, [isAuthenticated]);
  const [language, setLanguage] = useLanguage();

  const handleNotificationToggle = async () => {
    hapticFeedback.light();
    if (!notificationsEnabled) {
      try {
        const hasPermission = await notifications.requestPermissions();
        if (hasPermission) {
          await notifications.scheduleDailyReminders();
          setNotificationsEnabled(true);
          if (isAuthenticated) {
            await userDataAPI.updateSettings({ dailyVerseNotificationEnabled: true }).catch(console.error);
          }
        }
      } catch (error) {
        console.error('Notification permission denied');
      }
    } else {
      await notifications.cancelAll();
      setNotificationsEnabled(false);
      if (isAuthenticated) {
        await userDataAPI.updateSettings({ dailyVerseNotificationEnabled: false }).catch(console.error);
      }
    }
  };

  const handleAutoPlayToggle = async () => {
    hapticFeedback.light();
    setAutoPlayEnabled(!autoPlayEnabled);
    await storage.set('autoPlayEnabled', !autoPlayEnabled);
  };

  const handleDarkModeToggle = async () => {
    hapticFeedback.light();
    setDarkModeEnabled(!darkModeEnabled);
    await storage.set('darkModeEnabled', !darkModeEnabled);
    // Apply dark mode class to body
    if (!darkModeEnabled) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as AppLanguage);
  };

  const settingsSections = [
    {
      title: t('notifications'),
      icon: Bell,
      items: [
        {
          label: t('dailyVerseNotification'),
          description: t('dailyVerseNotificationDescription'),
          type: 'toggle',
          value: notificationsEnabled,
          onChange: handleNotificationToggle
        }
      ]
    },
    {
      title: t('performance'),
      icon: Smartphone,
      items: [
        {
          label: t('selectLanguage'),
          description: t('selectLanguageDescription'),
          type: 'select',
          value: language,
          options: [
            { value: 'hindi', label: 'हिंदी' },
            { value: 'english', label: 'English' }
          ],
          onChange: handleLanguageChange
        }
      ]
    },
    {
      title: t('info'),
      icon: Info,
      items: [
        {
          label: t('appVersion'),
          description: 'v1.0.0',
          type: 'info'
        },
        {
          label: t('developer'),
          description: 'Rudra Rathod',
          type: 'info'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 to-amber-25 flex flex-col mobile-content">
      <Header />
      
      <main className="flex-1 mobile-px mobile-py">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6 text-center">
            <div>
              <h2 className="mobile-text-2xl font-bold text-orange-900">{t('settings')}</h2>
              <p className="text-orange-700">{t('configureYourPreferences')}</p>
            </div>
        </div>

          {/* Quick Stats */}
          <div className="mobile-card mobile-px mobile-py mb-6">
            <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-lg font-bold text-orange-900">700+</div>
                <div className="text-xs text-orange-600">श्लोक</div>
                    </div>
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold text-green-900">18</div>
                <div className="text-xs text-green-600">अध्याय</div>
              </div>
                    <div className="text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <div className="text-lg font-bold text-red-900">∞</div>
                <div className="text-xs text-red-600">ज्ञान</div>
              </div>
                  </div>
                </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {settingsSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mobile-card mobile-px mobile-py">
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className="w-5 h-5 text-orange-600" />
                  <h3 className="mobile-text-lg font-bold text-orange-900">
                    {section.title}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-orange-100 last:border-b-0">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              
                      {item.type === 'toggle' && (
                        <button
                          onClick={item.onChange}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? 'bg-orange-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                      
                      {item.type === 'select' && (
                        <select
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                          className="p-2 border border-orange-200 rounded-lg bg-white text-sm"
                        >
                          {item.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {item.type === 'info' && (
                        <span className="text-sm text-gray-500">{item.description}</span>
                      )}
                </div>
              ))}
                </div>
              </div>
            ))}
              </div>
              
          {/* Quick Actions */}
          <div className="mobile-card mobile-px mobile-py mt-6">
            <h3 className="mobile-text-lg font-bold text-orange-900 mb-4">{t('quickActions')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/quiz')}
                className="touch-button bg-yellow-100 text-yellow-700 rounded-lg p-3 flex flex-col items-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{t('quiz')}</span>
              </button>
              <button
                onClick={() => navigate('/flashcards')}
                className="touch-button bg-green-100 text-green-700 rounded-lg p-3 flex flex-col items-center gap-2"
              >
                <Layers className="w-5 h-5" />
                <span className="text-sm font-medium">{t('flashcards')}</span>
              </button>
              <button
                onClick={() => navigate('/bookmarks')}
                className="touch-button bg-red-100 text-red-700 rounded-lg p-3 flex flex-col items-center gap-2"
              >
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">{t('bookmarks')}</span>
              </button>
                </div>
              </div>
              
          {/* App Info */}
          <div className="mobile-card mobile-px mobile-py mt-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-6 h-6 text-orange-600" />
              <h4 className="mobile-text-lg font-bold text-orange-900">{t('srimadBhagavadGita')}</h4>
            </div>
            <p className="text-sm text-orange-600 mb-3">
              {t('srimadBhagavadGitaDescription')}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-orange-500">
              <span>Made with ❤️</span>
              <span>•</span>
              <span>Rudra Rathod</span>
            </div>
              </div>
        </div>
      </main>
      <MobileNavigation />
    </div>
  );
};

export default Settings; 