
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { withErrorBoundary } from '@/components/ErrorBoundary';
import { auditPagePath } from '@/modules/audit/utils/auditLinks';

interface SiteCardProps {
  url: string;
  lastOptimized: string;
  score: number;
  /** Последняя проверка сайта: ссылка откроет именно её. */
  taskId?: string | null;
  /** Открыть аналитику сайта. Без обработчика кнопки нет — раньше она ничего не делала. */
  onOpenAnalytics?: () => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({ url, lastOptimized, score, taskId, onOpenAnalytics }) => (
  <div className="neo-card p-6 hover:shadow-md transition-shadow duration-200">
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
      {onOpenAnalytics && (
        <Button variant="outline" size="sm" onClick={onOpenAnalytics}>
          Аналитика
        </Button>
      )}
      {/*
        Раньше: <a href="/audit?url=..."> — мимо адреса сборки (на подпути
        /seomagic-saas-tool/ это 404) и без номера проверки.
      */}
      <Button variant="outline" size="sm" asChild>
        <Link to={auditPagePath(url, taskId)}>
          Оптимизировать
        </Link>
      </Button>
    </div>
  </div>
);

// Export with error boundary for better fault tolerance
export default withErrorBoundary(SiteCard);
