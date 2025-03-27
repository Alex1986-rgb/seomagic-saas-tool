import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Bell,
  Lock,
  Link
} from 'lucide-react';
import Layout from '@/components/Layout';
import ClientPositionTracker from '@/components/client/ClientPositionTracker';
import ClientAudits from '@/components/client/ClientAudits';
import ClientReports from '@/components/client/ClientReports';
import ClientNotifications from '@/components/client/ClientNotifications';
import ClientSettings from '@/components/client/ClientSettings';
import { useToast } from "@/hooks/use-toast";
import DeepCrawlButton from '@/components/audit/deep-crawl/DeepCrawlButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UrlForm from '@/components/url-form/UrlForm';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);
  const [isNotificationsSettingsOpen, setIsNotificationsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeepCrawlComplete = (pageCount: number) => {
    toast({
      title: "Глубокий аудит завершен",
      description: `Обнаружено ${pageCount} страниц на сайте`,
    });
  };

  const handleStartNewAudit = () => {
    setIsNewAuditDialogOpen(true);
  };

  const handleAddSite = () => {
    navigate('/add-site');
    toast({
      title: "Добавление сайта",
      description: "Открыта форма добавления нового сайта для оптимизации",
    });
  };

  const handleCreateReport = () => {
    navigate('/reports/create');
    toast({
      title: "Создание отчета",
      description: "Открыта форма создания нового отчета",
    });
  };

  const handleNotificationSettings = () => {
    setIsNotificationsSettingsOpen(true);
  };

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
                <DashboardOverview 
                  onStartNewAudit={handleStartNewAudit}
                  onAddSite={handleAddSite}
                  onCreateReport={handleCreateReport}
                />
              )}
            
              {activeTab === 'positions' && (
                <ClientPositionTracker />
              )}
            
              {activeTab === 'audits' && (
                <ClientAudits onStartNewAudit={handleStartNewAudit} />
              )}
              
              {activeTab === 'sites' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Оптимизированные сайты</h2>
                    <Button className="gap-2" onClick={handleAddSite}>
                      <Globe size={16} className="mr-2" />
                      Добавить сайт
                    </Button>
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
                <ClientReports />
              )}
              
              {activeTab === 'notifications' && (
                <ClientNotifications />
              )}
              
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Информация об аккаунте</h2>
                    <Button className="gap-2" onClick={() => setActiveTab('settings')}>
                      <Settings size={16} className="mr-2" />
                      Редактировать
                    </Button>
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

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="gap-2">
                        <Lock className="h-4 w-4" />
                        Изменить пароль
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <User className="h-4 w-4" />
                        Редактировать профиль
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <ClientSettings />
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isNewAuditDialogOpen} onOpenChange={setIsNewAuditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Новый SEO аудит</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <UrlForm />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotificationsSettingsOpen} onOpenChange={setIsNotificationsSettingsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Настройки уведомлений</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <ClientNotifications />
          </div>
        </DialogContent>
      </Dialog>
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
      <Button variant="outline" size="sm">
        Аналитика
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={`/audit?url=${encodeURIComponent(url)}`}>
          Оптимизировать
        </a>
      </Button>
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
      <Button variant="outline" size="sm">
        Просмотр
      </Button>
      <Button variant="outline" size="sm">
        Скачать
      </Button>
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

interface DashboardOverviewProps {
  onStartNewAudit: () => void;
  onAddSite: () => void;
  onCreateReport: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onStartNewAudit, 
  onAddSite, 
  onCreateReport 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Обзор SEO-активности</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar size={16} className="mr-2" />
            За месяц
          </Button>
          <Button className="gap-2" onClick={onCreateReport}>
            <FileSpreadsheet size={16} className="mr-2" />
            Экспорт
          </Button>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Последние аудиты</h3>
            <Button variant="outline" size="sm" onClick={onStartNewAudit}>
              Новый аудит
            </Button>
          </div>
          
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
            <Button variant="link" className="p-0" onClick={() => navigate('/audits')}>
              Посмотреть все аудиты →
            </Button>
          </div>
        </div>
        
        <div className="neo-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Сайты для оптимизации</h3>
            <Button variant="outline" size="sm" onClick={onAddSite}>
              Добавить сайт
            </Button>
          </div>
          
          <div className="space-y-3">
            <SiteListItem url="example.com" score={82} status="optimized" />
            <SiteListItem url="company-blog.net" score={76} status="in-progress" />
            <SiteListItem url="online-store.com" score={65} status="needs-attention" />
          </div>
          
          <div className="mt-4">
            <Button variant="link" className="p-0" onClick={() => navigate('/sites')}>
              Все сайты →
            </Button>
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

const SiteListItem = ({ url, score, status }) => {
  const getStatusBadge = () => {
    switch(status) {
      case 'optimized':
        return <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">Оптимизирован</span>;
      case 'in-progress':
        return <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-0.5 rounded-full">В процессе</span>;
      case 'needs-attention':
        return <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">Требует внимания</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex justify-between items-center py-2 border-b border-border-secondary last:border-0">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{url}</h4>
          {getStatusBadge()}
        </div>
      </div>
      <div className={`text-lg font-semibold ${
        score >= 80 ? 'text-green-500' : 
        score >= 60 ? 'text-amber-500' : 'text-destructive'
      }`}>
        {score}/100
      </div>
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

export default Dashboard;
