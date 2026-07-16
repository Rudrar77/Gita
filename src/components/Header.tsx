import { BookOpen, Settings, LogOut, Home, HelpCircle, Layers, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: t('home'), icon: Home, path: '/' },
    { label: t('quiz'), icon: HelpCircle, path: '/quiz' },
    { label: t('flashcards'), icon: Layers, path: '/flashcards' },
    { label: t('bookmarks'), icon: Star, path: '/bookmarks' },
  ];

  return (
    <header className="bg-gradient-to-r from-orange-100 via-amber-200 to-yellow-100 shadow-lg border-b border-orange-200 safe-area-top sticky top-0 z-50">
      <div className="px-3 py-2 md:px-6 md:py-3 lg:px-8" style={{ maxWidth: '1360px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 shadow-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base md:text-lg lg:text-xl font-extrabold text-orange-900 tracking-tight leading-tight" style={{ fontFamily: 'serif' }}>
                श्रीमद्भगवद्गीता
              </h1>
              <div className="text-[9px] md:text-[11px] text-orange-700 font-medium tracking-wide">
                जीवन का दिव्य मार्गदर्शन
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-orange-800 hover:bg-orange-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            {user && (
              <div className="flex items-center gap-2 mr-1">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-orange-200 flex items-center justify-center text-orange-800 font-bold shadow-sm border border-orange-300 text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-sm font-semibold text-orange-800 max-w-[100px] truncate">
                  {user.name}
                </span>
              </div>
            )}
            <button
              onClick={() => navigate('/settings')}
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shadow-sm transition-colors"
              title={t('settings')}
            >
              <Settings className="w-[18px] h-[18px] md:w-5 md:h-5" />
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shadow-sm transition-colors"
                title="Logout"
              >
                <LogOut className="w-[18px] h-[18px] md:w-5 md:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
