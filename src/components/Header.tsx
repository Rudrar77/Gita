import { BookOpen, Menu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

const Header = () => {
  const navigate = useNavigate();
  const t = useTranslation();

  return (
    <header className="bg-gradient-to-r from-orange-100 via-amber-200 to-yellow-100 shadow-lg border-b border-orange-200 safe-area-top">
      <div className="mobile-px mobile-py">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 shadow-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white drop-shadow" />
            </div>
            <div className="flex flex-col">
              <h1 className="mobile-text-xl font-extrabold text-orange-900 tracking-tight drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                श्रीमद्भगवद्गीता
              </h1>
              <div className="text-xs text-orange-700 font-medium tracking-wide">
                जीवन का दिव्य मार्गदर्शन
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => navigate('/settings')}
            className="touch-button bg-orange-100 text-orange-700 rounded-full p-2 shadow-md"
            title={t('settings')}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
