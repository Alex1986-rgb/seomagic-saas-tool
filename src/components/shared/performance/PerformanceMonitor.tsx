
import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time To First Byte
  tti: number | null; // Time To Interactive
  memoryUsage: string | null; // Использование памяти
  jsHeapSizeLimit: string | null; // Лимит кучи JS
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  onMetricsCollected?: (metrics: PerformanceMetrics) => void;
  showDebugInfo?: boolean;
}

/**
 * Компонент для мониторинга производительности приложения
 */
const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  onMetricsCollected,
  showDebugInfo = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    tti: null,
    memoryUsage: null,
    jsHeapSizeLimit: null
  });

  useEffect(() => {
    if (!enabled) return;

    // Функция для форматирования байт в читаемый формат
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Собираем метрики производительности
    const collectMetrics = () => {
      const newMetrics: PerformanceMetrics = {
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
        tti: null,
        memoryUsage: null,
        jsHeapSizeLimit: null
      };

      // Time To First Byte
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
        newMetrics.ttfb = navEntry.responseStart;
      }

      // Метрики памяти (доступны только в Chrome)
      if (performance && 
          'memory' in performance && 
          (performance as any).memory) {
        const memory = (performance as any).memory;
        newMetrics.memoryUsage = formatBytes(memory.usedJSHeapSize);
        newMetrics.jsHeapSizeLimit = formatBytes(memory.jsHeapSizeLimit);
      }

      // FCP, LCP через PerformanceObserver API
      const paintEntries = performance.getEntriesByType('paint');
      for (const entry of paintEntries) {
        if (entry.name === 'first-contentful-paint') {
          newMetrics.fcp = entry.startTime;
        }
      }

      // TTI (приблизительный расчет)
      newMetrics.tti = performance.now();

      setMetrics(newMetrics);
      if (onMetricsCollected) {
        onMetricsCollected(newMetrics);
      }

      // Логирование метрик в консоль для отладки
      if (showDebugInfo) {
        console.info('Performance metrics:', newMetrics);
      }
    };

    // Наблюдатели за метриками
    let lcpObserver: PerformanceObserver;
    let fidObserver: PerformanceObserver;
    let clsObserver: PerformanceObserver;

    try {
      // Largest Contentful Paint
      lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const newMetrics = { ...metrics, lcp: lastEntry.startTime };
          setMetrics(newMetrics);
          if (onMetricsCollected) onMetricsCollected(newMetrics);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay
      fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstInput = entries[0];
        if (firstInput) {
          const newMetrics = { ...metrics, fid: (firstInput as PerformanceEventTiming).processingStart - firstInput.startTime };
          setMetrics(newMetrics);
          if (onMetricsCollected) onMetricsCollected(newMetrics);
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift
      let clsValue = 0;
      clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as PerformanceEntry[]) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value || 0;
            const newMetrics = { ...metrics, cls: clsValue };
            setMetrics(newMetrics);
            if (onMetricsCollected) onMetricsCollected(newMetrics);
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

    } catch (error) {
      console.warn('PerformanceObserver API not fully supported:', error);
    }

    // Собираем метрики после загрузки страницы
    window.addEventListener('load', collectMetrics);

    // Очистка наблюдателей при размонтировании
    return () => {
      window.removeEventListener('load', collectMetrics);
      if (lcpObserver) lcpObserver.disconnect();
      if (fidObserver) fidObserver.disconnect();
      if (clsObserver) clsObserver.disconnect();
    };
  }, [enabled, onMetricsCollected, showDebugInfo]);

  // Рендер отладочной информации
  if (enabled && showDebugInfo) {
    return (
      <div className="fixed bottom-0 right-0 bg-black/80 text-white p-2 text-xs z-50 rounded-tl-md">
        <div>FCP: {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'N/A'}</div>
        <div>LCP: {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A'}</div>
        <div>FID: {metrics.fid ? `${metrics.fid.toFixed(0)}ms` : 'N/A'}</div>
        <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}</div>
        <div>TTFB: {metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : 'N/A'}</div>
        <div>TTI: {metrics.tti ? `${metrics.tti.toFixed(0)}ms` : 'N/A'}</div>
        <div>Memory: {metrics.memoryUsage || 'N/A'}</div>
      </div>
    );
  }

  return null;
};

export default PerformanceMonitor;
