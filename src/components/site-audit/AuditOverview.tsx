
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Clock, Globe, Search, Smartphone, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';

interface AuditOverviewProps {
  auditData: any;
}

const AuditOverview: React.FC<AuditOverviewProps> = ({ auditData }) => {
  const {
    score,
    pageCount,
    details,
    issues
  } = auditData;

  const issuesCount = (issues?.critical?.length || 0) + 
    (issues?.important?.length || 0) + 
    (issues?.opportunities?.length || 0) + 
    (issues?.minor?.length || 0);
  
  const passedCount = issues?.passed?.length || 0;
  
  const metrics = [
    {
      title: "Общая оценка",
      value: score,
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: "SEO оптимизация",
      value: details?.seo?.score,
      icon: <Search className="h-5 w-5" />
    },
    {
      title: "Производительность",
      value: details?.performance?.score,
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: "Технические аспекты",
      value: details?.technical?.score,
      icon: <Globe className="h-5 w-5" />
    }
  ];

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      {metric.icon}
                    </div>
                    <h3 className="font-medium">{metric.title}</h3>
                  </div>
                  <Badge variant={
                    metric.value >= 80 ? 'outline' :
                    metric.value >= 60 ? 'secondary' : 'destructive'
                  }>
                    {metric.value}/100
                  </Badge>
                </div>
                <Progress 
                  value={metric.value} 
                  className={`h-2 mt-2 ${getProgressColor(metric.value)}`}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Проблемы сайта</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-3">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{issuesCount}</p>
                  <p className="text-sm text-muted-foreground">проблем обнаружено</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    {issues?.critical?.length || 0} критических
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                    {issues?.important?.length || 0} важных
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Успешные проверки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{passedCount}</p>
                  <p className="text-sm text-muted-foreground">проверок пройдено</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(passedCount / (passedCount + issuesCount)) * 100} className="h-2 bg-green-500" />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((passedCount / (passedCount + issuesCount)) * 100)}% всех проверок
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Мобильная версия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-3">
                  <Smartphone className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {details?.technical?.metrics?.mobileFriendly ? "Да" : "Нет"}
                  </p>
                  <p className="text-sm text-muted-foreground">Адаптирован для мобильных</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {details?.technical?.metrics?.mobileFriendly ? (
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" /> Сайт оптимизирован для мобильных
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                    <AlertCircle className="h-3 w-3 mr-1" /> Требуется оптимизация
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Site Details */}
      <motion.div
        custom={7}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Card>
          <CardHeader>
            <CardTitle>Детали сайта</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">URL сайта</p>
                <p className="font-medium">{auditData.url}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Проверено страниц</p>
                <p className="font-medium">{pageCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">HTTPS</p>
                <p className="font-medium flex items-center">
                  {details?.technical?.metrics?.httpsEnabled ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Включен
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1 text-red-500" /> Отсутствует
                    </>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Время загрузки</p>
                <p className="font-medium">{details?.performance?.metrics?.loadingTime}с</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Первый контент</p>
                <p className="font-medium">{details?.performance?.metrics?.firstContentfulPaint}с</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Длина заголовка</p>
                <p className="font-medium">{details?.seo?.metrics?.titleLength} символов</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuditOverview;
