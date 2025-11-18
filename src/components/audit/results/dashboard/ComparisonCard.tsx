import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComparisonData } from '@/services/audit/historyService';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComparisonCardProps {
  comparison: ComparisonData | null;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ comparison }) => {
  if (!comparison || !comparison.previous) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Сравнение с предыдущим аудитом</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Нет предыдущего аудита для сравнения. 
            Данные появятся после проведения следующего аудита.
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-success">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold">+{change.toFixed(1)}</span>
        </div>
      );
    }
    if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-destructive">
          <TrendingDown className="w-4 h-4" />
          <span className="font-semibold">{change.toFixed(1)}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Minus className="w-4 h-4" />
        <span className="font-semibold">0</span>
      </div>
    );
  };

  const metrics = [
    { label: 'Общий балл', change: comparison.changes.globalScore },
    { label: 'SEO', change: comparison.changes.seoScore },
    { label: 'Технические', change: comparison.changes.technicalScore },
    { label: 'Контент', change: comparison.changes.contentScore },
    { label: 'Производительность', change: comparison.changes.performanceScore },
  ];

  const issueMetrics = [
    { label: 'Отсутствие Title', change: comparison.changes.pctMissingTitle },
    { label: 'Отсутствие H1', change: comparison.changes.pctMissingH1 },
    { label: 'Отсутствие Description', change: comparison.changes.pctMissingDescription },
    { label: 'Медленные страницы', change: comparison.changes.pctSlowPages },
    { label: 'Тонкий контент', change: comparison.changes.pctThinContent },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Сравнение с предыдущим аудитом</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scores Comparison */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Изменение оценок</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-muted/50 rounded-lg"
              >
                <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                {renderChangeIndicator(metric.change)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Issues Comparison */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Изменение проблем (%)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {issueMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="p-3 bg-muted/50 rounded-lg"
              >
                <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                {/* For issues, negative is good */}
                {metric.change < 0 ? (
                  <div className="flex items-center gap-1 text-success">
                    <TrendingDown className="w-4 h-4" />
                    <span className="font-semibold">{metric.change.toFixed(1)}%</span>
                  </div>
                ) : metric.change > 0 ? (
                  <div className="flex items-center gap-1 text-destructive">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">+{metric.change.toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Minus className="w-4 h-4" />
                    <span className="font-semibold">0%</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonCard;
