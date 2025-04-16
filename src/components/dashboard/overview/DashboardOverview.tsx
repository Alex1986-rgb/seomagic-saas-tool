
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { InfoCard } from './InfoCard';
import SparkAreaChart from '@/components/charts/SparkAreaChart';
import { Activity, ArrowUpRight, Users, LineChart, RefreshCw, Globe } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatDate } from '@/lib/utils';

const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    recentAudits, 
    auditMetrics, 
    fetchDashboardData 
  } = useDashboardData();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Обзор</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard
          title="Активные сканирования"
          value={String(auditMetrics.totalScans)}
          change="+2.5% с прошлого месяца"
          icon={<Activity className="h-5 w-5" />}
        />
        <InfoCard
          title="Оптимизированные сайты"
          value={String(auditMetrics.activeProjects)}
          change={`${auditMetrics.activeProjects} активных проектов`}
          icon={<ArrowUpRight className="h-5 w-5" />}
        />
        <InfoCard
          title="Средний балл SEO"
          value={`${Math.round(auditMetrics.averageScore)}%`}
          change="+3.2% с прошлого месяца"
          icon={<Users className="h-5 w-5" />}
        />
        <InfoCard
          title="Отслеживаемые позиции"
          value={String(auditMetrics.trackedPositions)}
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
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Обновить</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : recentAudits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Нет аудитов</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate('/audit')}
                >
                  Запустить первый аудит
                </Button>
              </div>
            ) : (
              recentAudits.map((audit) => (
                <div key={audit.id} className="flex justify-between items-center py-2 border-b border-border-secondary last:border-0">
                  <div>
                    <h4 className="font-medium">{audit.url || 'Unnamed Site'}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(audit.created_at)}
                    </p>
                  </div>
                  <div className={`text-lg font-semibold ${
                    audit.score >= 80 ? 'text-green-500' : 
                    audit.score >= 60 ? 'text-amber-500' : 'text-destructive'
                  }`}>
                    {audit.score}/100
                  </div>
                </div>
              ))
            )}
          </div>
          
          <Button variant="link" className="mt-2 w-full" onClick={() => navigate('/audit')}>
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
              <div className="text-2xl font-bold">{Math.round(auditMetrics.averageScore)}</div>
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
