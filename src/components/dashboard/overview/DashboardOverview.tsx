
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { InfoCard } from './InfoCard';
import SparkAreaChart from '@/components/charts/SparkAreaChart';
import { Activity, ArrowUpRight, Users, LineChart } from 'lucide-react';
import { mockAudits } from '@/data/mockData';

interface DashboardOverviewProps {
  onStartNewAudit?: () => void;
  onAddSite?: () => void;
  onCreateReport?: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onStartNewAudit,
  onAddSite,
  onCreateReport
}) => {
  const navigate = useNavigate();
  
  const navigateToAudit = () => {
    navigate('/audit');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Обзор</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard
          title="Активные сканирования"
          value="12"
          change="+2.5% с прошлого месяца"
          icon={<Activity className="h-5 w-5" />}
        />
        <InfoCard
          title="Оптимизированные сайты"
          value="8"
          change="+4 новых сайта"
          icon={<ArrowUpRight className="h-5 w-5" />}
        />
        <InfoCard
          title="Общее количество сайтов"
          value="24"
          change="+3 новых сайта"
          icon={<Users className="h-5 w-5" />}
        />
        <InfoCard
          title="Средний рост позиций"
          value="+14.2%"
          change="+2.4% с прошлого месяца"
          icon={<LineChart className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="neo-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Последние аудиты</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Обновить</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockAudits.slice(0, 4).map((audit) => (
              <div key={audit.id} className="flex justify-between items-center py-2 border-b border-border-secondary last:border-0">
                <div>
                  <h4 className="font-medium">{audit.url}</h4>
                  <p className="text-xs text-muted-foreground">{new Date(audit.date).toLocaleDateString()}</p>
                </div>
                <div className={`text-lg font-semibold ${
                  audit.score >= 80 ? 'text-green-500' : 
                  audit.score >= 60 ? 'text-amber-500' : 'text-destructive'
                }`}>
                  {audit.score}/100
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="link" className="mt-2 w-full" onClick={navigateToAudit}>
            Посмотреть все аудиты
          </Button>
        </motion.div>
        
        <motion.div
          className="neo-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">Тренд SEO оценок</h3>
              <p className="text-sm text-muted-foreground">За последний месяц</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">76.8</div>
              <div className="text-xs text-green-500">+12.4%</div>
            </div>
          </div>
          
          <div className="h-56">
            <SparkAreaChart />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;
