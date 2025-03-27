
import React, { ReactNode } from 'react';
import { LayoutDashboard, TrendingUp, Search, Globe, FileText, Bell, User, Settings } from 'lucide-react';
import { NavButton } from './NavButton';

interface DashboardLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  activeTab, 
  setActiveTab, 
  children 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div className="md:col-span-1">
        <nav className="neo-card p-4 space-y-1 sticky top-24">
          <NavButton 
            active={activeTab === 'dashboard'} 
            icon={<LayoutDashboard size={18} />} 
            onClick={() => setActiveTab('dashboard')}
          >
            Обзор
          </NavButton>
          <NavButton 
            active={activeTab === 'positions'} 
            icon={<TrendingUp size={18} />} 
            onClick={() => setActiveTab('positions')}
          >
            Позиции сайта
          </NavButton>
          <NavButton 
            active={activeTab === 'audits'} 
            icon={<Search size={18} />} 
            onClick={() => setActiveTab('audits')}
          >
            Аудиты
          </NavButton>
          <NavButton 
            active={activeTab === 'sites'} 
            icon={<Globe size={18} />} 
            onClick={() => setActiveTab('sites')}
          >
            Оптимизация сайтов
          </NavButton>
          <NavButton 
            active={activeTab === 'reports'} 
            icon={<FileText size={18} />} 
            onClick={() => setActiveTab('reports')}
          >
            Отчеты
          </NavButton>
          <NavButton 
            active={activeTab === 'notifications'} 
            icon={<Bell size={18} />} 
            onClick={() => setActiveTab('notifications')}
          >
            Уведомления
          </NavButton>
          <NavButton 
            active={activeTab === 'account'} 
            icon={<User size={18} />} 
            onClick={() => setActiveTab('account')}
          >
            Аккаунт
          </NavButton>
          <NavButton 
            active={activeTab === 'settings'} 
            icon={<Settings size={18} />} 
            onClick={() => setActiveTab('settings')}
          >
            Настройки
          </NavButton>
        </nav>
      </div>
      
      <div className="md:col-span-3">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
