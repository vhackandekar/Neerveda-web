
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../types';
import { UserCircleIcon } from './common/Icons';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: 'en' | 'ml') => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${i18n.language.startsWith('en') ? 'bg-white shadow-sm text-eco-green' : 'text-gray-600 hover:bg-gray-200'}`}
            >
                English
            </button>
            <button
                onClick={() => changeLanguage('ml')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${i18n.language === 'ml' ? 'bg-white shadow-sm text-eco-green' : 'text-gray-600 hover:bg-gray-200'}`}
            >
                മലയാളം
            </button>
        </div>
    );
};


interface HeaderProps {
  activeRole: UserRole;
}

const Header: React.FC<HeaderProps> = ({ activeRole }) => {
  const { t } = useTranslation();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
        {t('header_title', { role: t(`role_${activeRole.toLowerCase()}`, activeRole) })}
      </h1>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <span className="text-gray-600 hidden md:block">{t('welcome_user')}</span>
        <div className="relative group">
            <UserCircleIcon className="w-8 h-8 text-gray-400 cursor-not-allowed" />
            <div className="absolute right-0 top-full mt-2 w-max px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {t('profile_coming_soon')}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
