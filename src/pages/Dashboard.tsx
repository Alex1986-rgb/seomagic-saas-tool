
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Globe, 
  RefreshCw, 
  Search, 
  Settings, 
  User 
} from 'lucide-react';
import Layout from '@/components/Layout';

// Mock data for demonstration
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
  const [activeTab, setActiveTab] = useState('audits');

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Панель управления</h1>
            <p className="text-lg text-muted-foreground">
              Управляйте вашими SEO-аудитами и оптимизированными сайтами
            </p>
          </div>
          
          {/* Dashboard Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <nav className="neo-card p-4 space-y-1">
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
                  Оптимизированные сайты
                </NavButton>
                <NavButton 
                  active={activeTab === 'reports'} 
                  icon={<FileText size={18} />} 
                  onClick={() => setActiveTab('reports')}
                >
                  Отчеты
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
                <div className="glass-panel p-8 text-center">
                  <Globe size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Пока нет оптимизированных сайтов</h3>
                  <p className="text-muted-foreground mb-6">
                    После завершения аудита вы можете сгенерировать оптимизированную версию вашего сайта.
                  </p>
                  <button className="bg-primary text-white px-6 py-2 rounded-full">
                    Начать с аудита
                  </button>
                </div>
              )}
              
              {['reports', 'account', 'settings'].includes(activeTab) && (
                <div className="glass-panel p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">Скоро будет доступно</h3>
                  <p className="text-muted-foreground">
                    Эта функция находится в разработке и будет доступна в ближайшее время.
                  </p>
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

export default Dashboard;
