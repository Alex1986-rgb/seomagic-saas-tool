
import React, { ReactNode, useState } from 'react';
import { LayoutDashboard, TrendingUp, Search, Globe, FileText, Bell, User, Settings, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">
      {/* Mobile menu toggle */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
          <span>{menuOpen ? 'Закрыть' : 'Меню'}</span>
        </Button>
      </div>
      
      {/* Sidebar - visible on md+ screens or when toggled on mobile */}
      <div className={`md:col-span-1 ${menuOpen ? 'block' : 'hidden md:block'}`}>
        <nav className="neo-card p-4 space-y-1 sticky top-24">
          <NavButton 
            active={activeTab === 'dashboard'} 
            icon={<LayoutDashboard size={18} />} 
            onClick={() => {
              setActiveTab('dashboard');
              setMenuOpen(false);
            }}
          >
            Обзор
          </NavButton>
          <NavButton 
            active={activeTab === 'positions'} 
            icon={<TrendingUp size={18} />} 
            onClick={() => {
              setActiveTab('positions');
              setMenuOpen(false);
            }}
          >
            Позиции сайта
          </NavButton>
          <NavButton 
            active={activeTab === 'audits'} 
            icon={<Search size={18} />} 
            onClick={() => {
              setActiveTab('audits');
              setMenuOpen(false);
            }}
          >
            Аудиты
          </NavButton>
          <NavButton 
            active={activeTab === 'sites'} 
            icon={<Globe size={18} />} 
            onClick={() => {
              setActiveTab('sites');
              setMenuOpen(false);
            }}
          >
            Оптимизация сайтов
          </NavButton>
          <NavButton 
            active={activeTab === 'reports'} 
            icon={<FileText size={18} />} 
            onClick={() => {
              setActiveTab('reports');
              setMenuOpen(false);
            }}
          >
            Отчеты
          </NavButton>
          <NavButton 
            active={activeTab === 'notifications'} 
            icon={<Bell size={18} />} 
            onClick={() => {
              setActiveTab('notifications');
              setMenuOpen(false);
            }}
          >
            Уведомления
          </NavButton>
          <NavButton 
            active={activeTab === 'account'} 
            icon={<User size={18} />} 
            onClick={() => {
              setActiveTab('account');
              setMenuOpen(false);
            }}
          >
            Аккаунт
          </NavButton>
          <NavButton 
            active={activeTab === 'settings'} 
            icon={<Settings size={18} />} 
            onClick={() => {
              setActiveTab('settings');
              setMenuOpen(false);
            }}
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
