
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileSpreadsheet, Activity, Search, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { InfoCard } from './InfoCard';
import { SiteListItem } from '../sites/SiteListItem';

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

export default DashboardOverview;
