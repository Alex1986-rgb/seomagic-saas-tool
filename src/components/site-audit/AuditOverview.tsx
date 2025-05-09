
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface AuditOverviewProps {
  auditData: any;
}

const AuditOverview: React.FC<AuditOverviewProps> = ({ auditData }) => {
  // Safely access nested properties
  const totalIssues = [
    ...(auditData.issues?.critical || []),
    ...(auditData.issues?.important || []),
    ...(auditData.issues?.opportunities || []),
    ...(auditData.issues?.minor || []),
  ].length;
  
  const criticalIssues = auditData.issues?.critical?.length || 0;
  const importantIssues = auditData.issues?.important?.length || 0;
  const opportunitiesCount = auditData.issues?.opportunities?.length || 0;
  const passedChecksCount = auditData.issues?.passed?.length || 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border">
        <CardHeader className="pb-4 bg-primary/5">
          <CardTitle>Общая оценка сайта</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`text-6xl font-bold ${getScoreColor(auditData.score)}`}
                  >
                    {auditData.score}
                  </motion.div>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={getProgressColor(auditData.score).replace('bg-', 'stroke-').replace('500', '500')}
                    strokeWidth="10"
                    strokeDasharray={`${auditData.score * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: `${auditData.score * 2.83} 283` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </svg>
              </div>
              <p className="mt-4 text-lg font-medium">из 100 баллов</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">SEO</span>
                  <span>{auditData.details?.seo?.score || 0}%</span>
                </div>
                <Progress value={auditData.details?.seo?.score || 0} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Производительность</span>
                  <span>{auditData.details?.performance?.score || 0}%</span>
                </div>
                <Progress value={auditData.details?.performance?.score || 0} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Техническая оптимизация</span>
                  <span>{auditData.details?.technical?.score || 0}%</span>
                </div>
                <Progress value={auditData.details?.technical?.score || 0} className="h-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/90 backdrop-blur-sm border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <span className="text-red-500 text-2xl font-bold">{criticalIssues}</span>
              </div>
              <p className="font-medium">Критические проблемы</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/90 backdrop-blur-sm border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                <span className="text-orange-500 text-2xl font-bold">{importantIssues}</span>
              </div>
              <p className="font-medium">Важные проблемы</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/90 backdrop-blur-sm border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                <span className="text-yellow-500 text-2xl font-bold">{opportunitiesCount}</span>
              </div>
              <p className="font-medium">Возможности</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/90 backdrop-blur-sm border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <span className="text-green-500 text-2xl font-bold">{passedChecksCount}</span>
              </div>
              <p className="font-medium">Успешных проверок</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle>Основные метрики</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-muted-foreground mb-1">Время загрузки</p>
              <p className="text-xl font-medium">{auditData.details?.performance?.metrics?.loadingTime || '0'} сек</p>
            </div>
            
            <div>
              <p className="text-muted-foreground mb-1">Первая отрисовка контента</p>
              <p className="text-xl font-medium">{auditData.details?.performance?.metrics?.firstContentfulPaint || '0'} сек</p>
            </div>
            
            <div>
              <p className="text-muted-foreground mb-1">Мобильная оптимизация</p>
              <p className="text-xl font-medium">
                {auditData.details?.technical?.metrics?.mobileFriendly ? 'Да' : 'Нет'}
              </p>
            </div>
            
            <div>
              <p className="text-muted-foreground mb-1">Длина заголовка</p>
              <p className="text-xl font-medium">{auditData.details?.seo?.metrics?.titleLength || '0'} символов</p>
            </div>
            
            <div>
              <p className="text-muted-foreground mb-1">Длина описания</p>
              <p className="text-xl font-medium">{auditData.details?.seo?.metrics?.descriptionLength || '0'} символов</p>
            </div>
            
            <div>
              <p className="text-muted-foreground mb-1">HTTPS</p>
              <p className="text-xl font-medium">
                {auditData.details?.technical?.metrics?.httpsEnabled ? 'Включен' : 'Отключен'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditOverview;
