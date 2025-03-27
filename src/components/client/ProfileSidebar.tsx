
import React from 'react';
import { User, Settings, CreditCard, FileText, Bell, History, BarChart, Globe } from 'lucide-react';
import ProfileNavButton from './ProfileNavButton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="md:col-span-1">
      <div className="neo-card p-6 text-center mb-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Иван Петров</h3>
        <p className="text-muted-foreground">Pro план</p>
        <p className="text-sm text-muted-foreground mt-1">Участник с Мая 2023</p>
        
        <div className="mt-4">
          <Link to="/position-tracker">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Анализ позиций сайта</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <nav className="neo-card p-4 space-y-1">
        <ProfileNavButton 
          active={activeTab === 'audits'} 
          icon={<History size={18} />} 
          onClick={() => onTabChange('audits')}
        >
          История аудитов
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'positions'} 
          icon={<BarChart size={18} />} 
          onClick={() => onTabChange('positions')}
        >
          Позиции сайта
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'reports'} 
          icon={<FileText size={18} />} 
          onClick={() => onTabChange('reports')}
        >
          Отчеты
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'subscription'} 
          icon={<CreditCard size={18} />} 
          onClick={() => onTabChange('subscription')}
        >
          Подписка
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'notifications'} 
          icon={<Bell size={18} />} 
          onClick={() => onTabChange('notifications')}
        >
          Уведомления
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'settings'} 
          icon={<Settings size={18} />} 
          onClick={() => onTabChange('settings')}
        >
          Настройки
        </ProfileNavButton>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
