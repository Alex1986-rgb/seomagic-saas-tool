import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, CheckCircle, XCircle, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

interface PerformanceMetricsCardProps {
  avgLoadTimeMs?: number;
  successRate?: number;
  redirectPagesCount?: number;
  errorPagesCount?: number;
  totalPages?: number;
}

const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({
  avgLoadTimeMs = 0,
  successRate = 0,
  redirectPagesCount = 0,
  errorPagesCount = 0,
  totalPages = 0
}) => {
  const metrics = [
    {
      label: 'Средняя загрузка',
      value: `${(avgLoadTimeMs / 1000).toFixed(2)}s`,
      icon: <Clock className="h-4 w-4" />,
      color: avgLoadTimeMs > 3000 ? 'text-red-500' : avgLoadTimeMs > 1500 ? 'text-yellow-500' : 'text-green-500'
    },
    {
      label: 'Успешность',
      value: `${successRate.toFixed(1)}%`,
      icon: <CheckCircle className="h-4 w-4" />,
      color: successRate >= 95 ? 'text-green-500' : successRate >= 85 ? 'text-yellow-500' : 'text-red-500'
    },
    {
      label: 'Редиректы',
      value: `${redirectPagesCount} стр.`,
      icon: <Repeat className="h-4 w-4" />,
      color: 'text-yellow-500'
    },
    {
      label: 'Ошибки',
      value: `${errorPagesCount} стр.`,
      icon: <XCircle className="h-4 w-4" />,
      color: errorPagesCount > 0 ? 'text-red-500' : 'text-green-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Метрики производительности
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`${metric.color} flex justify-center mb-2`}>
                {metric.icon}
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsCard;
