import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Star, 
  HelpCircle, 
  Layers 
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();

  const navItems = [
    { label: t('home'), icon: Home, path: '/' },
    { label: t('quiz'), icon: HelpCircle, path: '/quiz' },
    { label: t('flashcards'), icon: Layers, path: '/flashcards' },
    { label: t('bookmarks'), icon: Star, path: '/bookmarks' },
  ];

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 w-full z-50 safe-area-bottom bg-white/95 backdrop-blur-md md:hidden" style={{borderTop: 'none', boxShadow: 'none'}}>
      <div className="flex justify-around items-center py-1 px-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              className={`flex flex-col items-center justify-center gap-0 px-2 py-1 rounded-lg transition-all focus:outline-none touch-button ${
                isActive 
                  ? 'text-orange-800 font-bold bg-orange-100' 
                  : 'text-orange-500 hover:text-orange-700'
              }`}
              onClick={() => {
                navigate(path);
                if (navigator.vibrate) {
                  navigator.vibrate(50);
                }
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-6 h-6 mb-0 transition-transform ${
                isActive ? 'scale-110' : ''
              }`} />
              <span className="text-[11px] leading-tight font-medium mt-1">
                {label}
              </span>
              {isActive && (
                <span className="block w-5 h-1 rounded-full bg-orange-600 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;