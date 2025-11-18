import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { performanceMonitor } from '@/utils/performance';
import { BarChart3, RefreshCw, Trash2 } from 'lucide-react';

export const PerformanceDebugger: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadMetrics = () => {
    const allMetrics = performanceMonitor.getMetrics() as any[];
    setMetrics(allMetrics || []);
  };

  useEffect(() => {
    loadMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(loadMetrics, 2000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleReset = () => {
    performanceMonitor.reset();
    setMetrics([]);
  };

  const handlePrintReport = () => {
    performanceMonitor.printReport();
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance Debugger
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'text-primary' : ''}
            >
              <RefreshCw className={`h-3 w-3 ${autoRefresh ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" variant="ghost" onClick={handlePrintReport}>
              📊
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-xs max-h-96 overflow-y-auto">
        {metrics.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No metrics recorded yet
          </p>
        ) : (
          <div className="space-y-2">
            {metrics
              .sort((a, b) => b.renderCount - a.renderCount)
              .slice(0, 10)
              .map((metric) => (
                <div
                  key={metric.componentId}
                  className="p-2 bg-muted rounded-md"
                >
                  <div className="font-medium">{metric.componentId}</div>
                  <div className="flex justify-between text-muted-foreground mt-1">
                    <span>Renders: {metric.renderCount}</span>
                    <span>Avg: {metric.averageDuration.toFixed(2)}ms</span>
                  </div>
                  {metric.slowRenders > 0 && (
                    <div className="text-amber-600 mt-1">
                      ⚠️ {metric.slowRenders} slow renders
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceDebugger;
