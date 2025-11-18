import React, { Profiler, ProfilerOnRenderCallback } from 'react';
import { performanceMonitor } from '@/utils/performance';

interface PerformanceProfilerProps {
  id: string;
  children: React.ReactNode;
  enabled?: boolean;
}

const onRenderCallback: ProfilerOnRenderCallback = (
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime // when React committed this update
) => {
  // Record metrics in performance monitor
  performanceMonitor.recordRender(id, actualDuration);
  
  // Log performance data
  console.log(`⚡ Profiler [${id}]:`, {
    phase,
    actualDuration: `${actualDuration.toFixed(2)}ms`,
    baseDuration: `${baseDuration.toFixed(2)}ms`,
    renderTime: `${(commitTime - startTime).toFixed(2)}ms`,
    timestamp: new Date(commitTime).toISOString()
  });

  // Warn about slow renders
  if (actualDuration > 100) {
    console.warn(`⚠️ Slow render detected in [${id}]: ${actualDuration.toFixed(2)}ms`);
  }

  // Track re-renders
  if (phase === 'update') {
    console.log(`🔄 Re-render in [${id}]`);
  }
};

export const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({ 
  id, 
  children, 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
};

export default PerformanceProfiler;
