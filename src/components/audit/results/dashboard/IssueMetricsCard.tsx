import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, FileText, Heading1, Link2, Eye, Zap, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

interface IssueMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface IssueMetricsCardProps {
  pctMissingTitle?: number;
  pctMissingH1?: number;
  pctMissingDescription?: number;
  pctMissingCanonical?: number;
  pctNotIndexable?: number;
  pctThinContent?: number;
  pctSlowPages?: number;
  pctPagesWithRedirects?: number;
  pctLongRedirectChains?: number;
}

const IssueMetricsCard: React.FC<IssueMetricsCardProps> = ({
  pctMissingTitle = 0,
  pctMissingH1 = 0,
  pctMissingDescription = 0,
  pctMissingCanonical = 0,
  pctNotIndexable = 0,
  pctThinContent = 0,
  pctSlowPages = 0,
  pctPagesWithRedirects = 0,
  pctLongRedirectChains = 0
}) => {
  const metrics: IssueMetric[] = [
    { label: 'Без Title', value: pctMissingTitle, icon: <FileText className="h-4 w-4" />, color: 'text-orange-500' },
    { label: 'Без H1', value: pctMissingH1, icon: <Heading1 className="h-4 w-4" />, color: 'text-orange-500' },
    { label: 'Без Description', value: pctMissingDescription, icon: <FileText className="h-4 w-4" />, color: 'text-orange-500' },
    { label: 'Без Canonical', value: pctMissingCanonical, icon: <Link2 className="h-4 w-4" />, color: 'text-yellow-500' },
    { label: 'Не индексируются', value: pctNotIndexable, icon: <Eye className="h-4 w-4" />, color: 'text-red-500' },
    { label: 'Тонкий контент', value: pctThinContent, icon: <FileText className="h-4 w-4" />, color: 'text-yellow-500' },
    { label: 'Медленные', value: pctSlowPages, icon: <Zap className="h-4 w-4" />, color: 'text-red-500' },
    { label: 'С редиректами', value: pctPagesWithRedirects, icon: <Repeat className="h-4 w-4" />, color: 'text-yellow-500' },
    { label: 'Длинные цепочки', value: pctLongRedirectChains, icon: <AlertCircle className="h-4 w-4" />, color: 'text-red-500' }
  ];

  const significantMetrics = metrics.filter(m => m.value > 0);

  if (significantMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Метрики проблем</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">✅ Критических проблем не обнаружено</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-warning" />
          Метрики проблем
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {significantMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
            >
              <span className={metric.color}>{metric.icon}</span>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-lg font-semibold">{metric.value.toFixed(1)}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueMetricsCard;
