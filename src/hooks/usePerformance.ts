import { useEffect, useRef } from 'react';
import { performanceMonitor } from '@/utils/performance';

/**
 * Hook to track component render performance
 * @param componentName - Name of the component to track
 * @param enabled - Whether to enable tracking (default: development only)
 */
export const usePerformance = (
  componentName: string,
  enabled: boolean = process.env.NODE_ENV === 'development'
) => {
  const renderCount = useRef(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;

    if (renderCount.current > 1) {
      performanceMonitor.recordRender(componentName, renderTime);
      
      if (renderTime > 16) {
        console.warn(
          `⚠️ Slow render in ${componentName}: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
        );
      }
    }

    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
    getMetrics: () => performanceMonitor.getMetrics(componentName)
  };
};

/**
 * Hook to log when component mounts and unmounts
 * @param componentName - Name of the component
 */
export const useComponentLifecycle = (componentName: string) => {
  useEffect(() => {
    console.log(`✅ ${componentName} mounted`);
    return () => {
      console.log(`❌ ${componentName} unmounted`);
    };
  }, [componentName]);
};

/**
 * Hook to track specific actions performance
 * @param actionName - Name of the action to track
 */
export const useActionPerformance = (actionName: string) => {
  const measure = async <T,>(action: () => Promise<T> | T): Promise<T> => {
    const start = performance.now();
    try {
      const result = await action();
      const duration = performance.now() - start;
      console.log(`⏱️ ${actionName}: ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ ${actionName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };

  return { measure };
};
