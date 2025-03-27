
import React from 'react';
import { User, Settings, CreditCard, FileText, Bell, History, BarChart, Globe } from 'lucide-react';
import ProfileNavButton from './ProfileNavButton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="md:col-span-1 mb-6 md:mb-0">
      <div className="neo-card p-4 md:p-6 text-center mb-4 md:mb-6">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
          <User className="h-8 w-8 md:h-12 md:w-12 text-primary" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold">Иван Петров</h3>
        <p className="text-sm text-muted-foreground">Pro план</p>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Участник с Мая 2023</p>
        
        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link to="/position-tracker">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2 text-xs md:text-sm py-1 md:py-2">
              <Globe className="h-3 w-3 md:h-4 md:w-4" />
              <span>Анализ позиций</span>
            </Button>
          </Link>
          <Link to="/audit">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2 text-xs md:text-sm py-1 md:py-2">
              <History className="h-3 w-3 md:h-4 md:w-4" />
              <span>Запустить аудит</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <nav className="neo-card p-2 md:p-4 space-y-1">
        <ProfileNavButton 
          active={activeTab === 'audits'} 
          icon={<History size={16} />} 
          onClick={() => onTabChange('audits')}
          className="text-xs md:text-sm py-2"
        >
          История аудитов
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'positions'} 
          icon={<BarChart size={16} />} 
          onClick={() => onTabChange('positions')}
          badge={<Badge className="ml-1 bg-primary text-[10px] md:text-xs py-0 px-1 md:px-2">Новое</Badge>}
          className="text-xs md:text-sm py-2"
        >
          Позиции сайта
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'reports'} 
          icon={<FileText size={16} />} 
          onClick={() => onTabChange('reports')}
          className="text-xs md:text-sm py-2"
        >
          Отчеты
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'subscription'} 
          icon={<CreditCard size={16} />} 
          onClick={() => onTabChange('subscription')}
          className="text-xs md:text-sm py-2"
        >
          Подписка
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'notifications'} 
          icon={<Bell size={16} />} 
          onClick={() => onTabChange('notifications')}
          badge={<Badge className="ml-1 bg-red-500 text-[10px] md:text-xs py-0 px-1 md:px-2">3</Badge>}
          className="text-xs md:text-sm py-2"
        >
          Уведомления
        </ProfileNavButton>
        <ProfileNavButton 
          active={activeTab === 'settings'} 
          icon={<Settings size={16} />} 
          onClick={() => onTabChange('settings')}
          className="text-xs md:text-sm py-2"
        >
          Настройки
        </ProfileNavButton>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
