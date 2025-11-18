/**
 * Performance monitoring utilities for React components
 */

interface RenderMetrics {
  componentId: string;
  renderCount: number;
  totalDuration: number;
  averageDuration: number;
  slowRenders: number;
  lastRenderTime: number;
}

class PerformanceMonitor {
  private metrics: Map<string, RenderMetrics> = new Map();
  private slowRenderThreshold = 16; // 16ms (60fps)
  private enabled = process.env.NODE_ENV === 'development';

  recordRender(id: string, duration: number) {
    if (!this.enabled) return;

    const existing = this.metrics.get(id);
    
    if (existing) {
      const newRenderCount = existing.renderCount + 1;
      const newTotalDuration = existing.totalDuration + duration;
      
      this.metrics.set(id, {
        componentId: id,
        renderCount: newRenderCount,
        totalDuration: newTotalDuration,
        averageDuration: newTotalDuration / newRenderCount,
        slowRenders: duration > this.slowRenderThreshold 
          ? existing.slowRenders + 1 
          : existing.slowRenders,
        lastRenderTime: duration
      });
    } else {
      this.metrics.set(id, {
        componentId: id,
        renderCount: 1,
        totalDuration: duration,
        averageDuration: duration,
        slowRenders: duration > this.slowRenderThreshold ? 1 : 0,
        lastRenderTime: duration
      });
    }
  }

  getMetrics(id?: string): RenderMetrics | RenderMetrics[] | null {
    if (id) {
      return this.metrics.get(id) || null;
    }
    return Array.from(this.metrics.values());
  }

  getSlowComponents(threshold: number = 16): RenderMetrics[] {
    return Array.from(this.metrics.values())
      .filter(m => m.averageDuration > threshold)
      .sort((a, b) => b.averageDuration - a.averageDuration);
  }

  getMostReRendered(limit: number = 10): RenderMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.renderCount - a.renderCount)
      .slice(0, limit);
  }

  printReport() {
    if (!this.enabled) return;

    console.group('🎯 Performance Report');
    
    console.log('\n📊 Slow Components (avg > 16ms):');
    this.getSlowComponents().forEach(m => {
      console.log(
        `  ${m.componentId}: avg ${m.averageDuration.toFixed(2)}ms, ` +
        `${m.renderCount} renders, ${m.slowRenders} slow`
      );
    });
    
    console.log('\n🔄 Most Re-rendered:');
    this.getMostReRendered().forEach(m => {
      console.log(
        `  ${m.componentId}: ${m.renderCount} renders, ` +
        `avg ${m.averageDuration.toFixed(2)}ms`
      );
    });
    
    console.groupEnd();
  }

  reset() {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Expose for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = performanceMonitor;
}
