import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Globe, 
  RefreshCw, 
  Search, 
  Settings, 
  User,
  BarChart2,
  TrendingUp,
  LayoutDashboard,
  Activity,
  FileSpreadsheet,
  Bell
} from 'lucide-react';
import Layout from '@/components/Layout';
import ClientPositionTracker from '@/components/client/ClientPositionTracker';

const mockAudits = [
  {
    id: '1',
    url: 'https://example.com',
    date: '2023-09-15T14:30:00Z',
    score: 67,
    status: 'completed',
  },
  {
    id: '2',
    url: 'https://company-blog.net',
    date: '2023-09-10T09:15:00Z',
    score: 84,
    status: 'completed',
  },
  {
    id: '3',
    url: 'https://e-store.example',
    date: '2023-09-05T18:45:00Z',
    score: 42,
    status: 'completed',
  },
  {
    id: '4',
    url: 'https://new-project.com',
    date: '2023-09-01T11:20:00Z',
    score: null,
    status: 'processing',
  },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('positions');

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Панель управления</h1>
            <p className="text-lg text-muted-foreground">
              Управляйте вашими SEO-аудитами и отслеживайте позиции сайта
            </p>
          </div>
          
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
              {activeTab === 'dashboard' && (
                <DashboardOverview />
              )}
            
              {activeTab === 'positions' && (
                <ClientPositionTracker />
              )}
            
              {activeTab === 'audits' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Недавние аудиты</h2>
                    <button className="bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center">
                      <Search size={16} className="mr-2" />
                      Новый аудит
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {mockAudits.map((audit) => (
                      <AuditCard key={audit.id} audit={audit} />
                    ))}
                  </div>
                </>
              )}
              
              {activeTab === 'sites' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Оптимизированные сайты</h2>
                    <button className="bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center">
                      <Globe size={16} className="mr-2" />
                      Добавить сайт
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SiteCard 
                      url="https://example.com" 
                      lastOptimized="2023-10-12" 
                      score={82} 
                    />
                    <SiteCard 
                      url="https://company-blog.net" 
                      lastOptimized="2023-10-08" 
                      score={76} 
                    />
                    <SiteCard 
                      url="https://online-store.com" 
                      lastOptimized="2023-10-15" 
                      score={65} 
                    />
                    <SiteCard 
                      url="https://portfolio-site.net" 
                      lastOptimized="2023-10-10" 
                      score={89} 
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Отчеты</h2>
                    <button className="bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center">
                      <FileText size={16} className="mr-2" />
                      Создать отчет
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReportCard 
                      title="Ежемесячный отчет" 
                      date="2023-10-01" 
                      type="PDF" 
                    />
                    <ReportCard 
                      title="Сравнительный анализ" 
                      date="2023-09-15" 
                      type="Excel" 
                    />
                    <ReportCard 
                      title="Аналитика ключевых слов" 
                      date="2023-09-10" 
                      type="PDF" 
                    />
                    <ReportCard 
                      title="Технический аудит" 
                      date="2023-09-05" 
                      type="HTML" 
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Уведомления</h2>
                    <button className="bg-secondary text-foreground px-4 py-2 rounded-full text-sm flex items-center">
                      <Settings size={16} className="mr-2" />
                      Настройки уведомлений
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <NotificationCard 
                      title="Проверка позиций завершена" 
                      description="Проверка позиций для сайта example.com успешно завершена" 
                      time="10 минут назад"
                      type="info"
                    />
                    <NotificationCard 
                      title="Улучшение позиций" 
                      description="Ключевое слово 'SEO оптимизация' поднялось на 5 позиций" 
                      time="3 часа назад"
                      type="success"
                    />
                    <NotificationCard 
                      title="Аудит сайта" 
                      description="Аудит сайта company-blog.net завершен, найдено 12 проблем" 
                      time="Вчера, 18:45"
                      type="warning"
                    />
                    <NotificationCard 
                      title="Срок подписки" 
                      description="Ваша подписка 'Бизнес' истекает через 5 дней" 
                      time="2 дня назад"
                      type="error"
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Информация об аккаунте</h2>
                    <button className="bg-secondary text-foreground px-4 py-2 rounded-full text-sm flex items-center">
                      <Settings size={16} className="mr-2" />
                      Редактировать
                    </button>
                  </div>
                  
                  <div className="neo-card p-6">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">Иван Петров</h3>
                        <p className="text-muted-foreground">ivan@example.com</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Текущий тариф</h4>
                        <p className="font-medium">Бизнес</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Дата продления</h4>
                        <p className="font-medium">15 ноября 2023</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Использовано проверок</h4>
                        <p className="font-medium">42/100</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Дата регистрации</h4>
                        <p className="font-medium">5 марта 2023</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Настройки</h2>
                    <p className="text-muted-foreground">Управление настройками аккаунта и системы</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingsCard 
                      title="Профиль" 
                      description="Управление личной информацией" 
                      icon={<User className="h-6 w-6" />} 
                    />
                    <SettingsCard 
                      title="Уведомления" 
                      description="Настройка оповещений и сообщений" 
                      icon={<Bell className="h-6 w-6" />} 
                    />
                    <SettingsCard 
                      title="Безопасность" 
                      description="Изменение пароля и настройки безопасности" 
                      icon={<Lock className="h-6 w-6" />} 
                    />
                    <SettingsCard 
                      title="Интеграции" 
                      description="Подключение внешних сервисов" 
                      icon={<Link className="h-6 w-6" />} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const NavButton: React.FC<{
  children: React.ReactNode;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}> = ({ children, icon, active, onClick }) => (
  <button
    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-primary text-white' 
        : 'text-foreground hover:bg-secondary'
    }`}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium">{children}</span>
  </button>
);

const AuditCard: React.FC<{ audit: any }> = ({ audit }) => (
  <div className="neo-card p-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-medium mb-1">{audit.url}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar size={14} className="mr-1" />
          <span className="mr-4">
            {new Date(audit.date).toLocaleDateString()}
          </span>
          <Clock size={14} className="mr-1" />
          <span>
            {new Date(audit.date).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0">
        {audit.status === 'processing' ? (
          <div className="flex items-center text-primary">
            <RefreshCw size={18} className="mr-2 animate-spin" />
            <span>Обработка...</span>
          </div>
        ) : (
          <>
            <div className="mr-6">
              <div className="text-sm text-muted-foreground mb-1">SEO оценка</div>
              <div className={`text-xl font-semibold ${
                audit.score >= 80 ? 'text-green-500' : 
                audit.score >= 60 ? 'text-amber-500' : 'text-destructive'
              }`}>
                {audit.score}/100
              </div>
            </div>
            
            <a 
              href={`/audit?url=${encodeURIComponent(audit.url)}`} 
              className="bg-secondary text-foreground px-4 py-2 rounded-full text-sm hover:bg-secondary/80 transition-colors"
            >
              Смотреть детали
            </a>
          </>
        )}
      </div>
    </div>
  </div>
);

const SiteCard: React.FC<{ url: string; lastOptimized: string; score: number }> = ({ 
  url, lastOptimized, score 
}) => (
  <div className="neo-card p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-medium">{url}</h3>
        <p className="text-sm text-muted-foreground">
          Последняя оптимизация: {new Date(lastOptimized).toLocaleDateString()}
        </p>
      </div>
      <div className={`text-xl font-semibold ${
        score >= 80 ? 'text-green-500' : 
        score >= 60 ? 'text-amber-500' : 'text-destructive'
      }`}>
        {score}/100
      </div>
    </div>
    <div className="flex gap-2">
      <button className="bg-secondary text-foreground px-3 py-1.5 rounded-full text-xs">
        Аналитика
      </button>
      <button className="bg-secondary text-foreground px-3 py-1.5 rounded-full text-xs">
        Оптимизировать
      </button>
    </div>
  </div>
);

const ReportCard: React.FC<{ title: string; date: string; type: string }> = ({ 
  title, date, type 
}) => (
  <div className="neo-card p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </p>
      </div>
      <div className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded">
        {type}
      </div>
    </div>
    <div className="flex gap-2">
      <button className="bg-secondary text-foreground px-3 py-1.5 rounded-full text-xs">
        Просмотр
      </button>
      <button className="bg-secondary text-foreground px-3 py-1.5 rounded-full text-xs">
        Скачать
      </button>
    </div>
  </div>
);

const SettingsCard: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ReactNode 
}> = ({ 
  title, description, icon 
}) => (
  <div className="neo-card p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="p-3 bg-primary/10 rounded-lg text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </div>
);

const DashboardOverview = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Обзор SEO-активности</h2>
        <div className="flex gap-2">
          <button className="bg-secondary text-foreground px-4 py-2 rounded-full text-sm flex items-center">
            <Calendar size={16} className="mr-2" />
            За месяц
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center">
            <FileSpreadsheet size={16} className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard 
          title="Проверки позиций" 
          value="42" 
          change={"+12%"} 
          icon={<Activity className="h-5 w-5 text-blue-500" />}
        />
        <InfoCard 
          title="Новые аудиты" 
          value="7" 
          change={"-3%"} 
          icon={<Search className="h-5 w-5 text-amber-500" />}
          isNegative
        />
        <InfoCard 
          title="Средняя позиция" 
          value="14.3" 
          change={"+2 позиции"} 
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
        />
      </div>
      
      <div className="neo-card p-6">
        <h3 className="text-lg font-semibold mb-4">График позиций сайта</h3>
        <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">График изменения позиций в течение времени</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="neo-card p-6">
          <h3 className="text-lg font-semibold mb-4">Последние аудиты</h3>
          {mockAudits.slice(0, 2).map((audit) => (
            <div key={audit.id} className="flex justify-between items-center py-3 border-b border-border-secondary last:border-0">
              <div>
                <h4 className="font-medium">{audit.url}</h4>
                <div className="text-sm text-muted-foreground">
                  {new Date(audit.date).toLocaleDateString()}
                </div>
              </div>
              <div className={`text-lg font-semibold ${
                audit.score >= 80 ? 'text-green-500' : 
                audit.score >= 60 ? 'text-amber-500' : 'text-destructive'
              }`}>
                {audit.status === 'processing' ? 
                  <RefreshCw size={18} className="animate-spin" /> :
                  `${audit.score}/100`
                }
              </div>
            </div>
          ))}
          <div className="mt-4">
            <a href="#" className="text-primary text-sm hover:underline">Посмотреть все аудиты →</a>
          </div>
        </div>
        
        <div className="neo-card p-6">
          <h3 className="text-lg font-semibold mb-4">Активность</h3>
          <div className="space-y-4">
            <ActivityItem 
              icon={<TrendingUp className="h-4 w-4" />} 
              title="Проверка позиций" 
              description="Проверены позиции для сайта example.com" 
              time="2 часа назад"
            />
            <ActivityItem 
              icon={<Search className="h-4 w-4" />} 
              title="Новый аудит" 
              description="Запущен аудит для company-blog.net" 
              time="Вчера"
            />
            <ActivityItem 
              icon={<FileText className="h-4 w-4" />} 
              title="Отчет сгенерирован" 
              description="Создан отчет по аудиту для e-store.example" 
              time="3 дня назад"
            />
          </div>
          <div className="mt-4">
            <a href="#" className="text-primary text-sm hover:underline">Вся активность →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value, change, icon, isNegative = false }) => {
  return (
    <div className="neo-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-full bg-primary/10">{icon}</div>
        <div className={`text-sm font-medium ${isNegative ? 'text-destructive' : 'text-green-500'}`}>
          {change}
        </div>
      </div>
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
};

const ActivityItem = ({ icon, title, description, time }) => {
  return (
    <div className="flex gap-4">
      <div className="p-2 rounded-full bg-secondary">
        {icon}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
};

const NotificationCard = ({ title, description, time, type = 'info' }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success': return 'border-l-4 border-l-green-500';
      case 'warning': return 'border-l-4 border-l-amber-500';
      case 'error': return 'border-l-4 border-l-destructive';
      default: return 'border-l-4 border-l-blue-500';
    }
  };
  
  return (
    <div className={`neo-card p-4 ${getTypeStyles()}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

import { Bell, Lock, Link } from 'lucide-react';

export default Dashboard;
