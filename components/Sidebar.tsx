import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../types';
import { AquaTrackLogoIcon, HomeIcon, UsersIcon, WetlandIcon, Cog6ToothIcon, BeakerIcon, QuestionMarkCircleIcon } from './common/Icons';

interface SidebarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeRole, onRoleChange }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const roles = [
    { role: UserRole.HOUSEHOLD, icon: HomeIcon, tKey: 'role_household' },
    { role: UserRole.COMMUNITY, icon: UsersIcon, tKey: 'role_community' },
    { role: UserRole.WETLAND, icon: WetlandIcon, tKey: 'role_wetland' },
    { role: UserRole.ADMIN, icon: Cog6ToothIcon, tKey: 'role_admin' },
    { role: UserRole.RESEARCHER, icon: BeakerIcon, tKey: 'role_researcher' },
  ];

  return (
    <aside className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 flex-shrink-0">
        <AquaTrackLogoIcon className="w-8 h-8 text-eco-green" />
        {isExpanded && <h1 className="ml-2 text-xl font-bold text-gray-800">{t('app_name')}</h1>}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className={`px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isExpanded && 'text-center'}`}>{isExpanded ? t('roles') : t('roles_short')}</p>
        <ul>
          {roles.map(({ role, icon: Icon, tKey }) => (
            <li key={role}>
              <button
                onClick={() => onRoleChange(role)}
                className={`w-full flex items-center px-3 py-2.5 my-1 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  activeRole === role
                    ? 'bg-eco-green text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${!isExpanded && 'justify-center'}`}
                title={isExpanded ? '' : t(tKey, role) as string}
              >
                <Icon className="w-5 h-5" />
                {isExpanded && <span className="ml-3">{t(tKey, role) as string}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
         <button className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 ${!isExpanded && 'justify-center'}`}>
            <QuestionMarkCircleIcon className="w-5 h-5" />
            {isExpanded && <span className="ml-3">{t('help_support')}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;