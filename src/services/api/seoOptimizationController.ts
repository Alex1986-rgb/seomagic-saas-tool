import { CrawlOptions, OptimizationOptions } from '@/types/audit';
import { openaiService } from './openaiService';

class SeoOptimizationController {
  async startOptimization(
    url: string,
    crawlOptions: CrawlOptions,
    optimizationOptions: OptimizationOptions
  ) {
    try {
      // Validate crawl options
      if (!crawlOptions.maxDepth) {
        crawlOptions.maxDepth = 5; // Default depth
      }
      
      if (!crawlOptions.checkPerformance) {
        crawlOptions.checkPerformance = true; // Default to true
      }

      // Start the optimization process
      const taskId = `task_${Date.now()}`;
      
      // Store task info
      localStorage.setItem(`task_${url}`, JSON.stringify({
        id: taskId,
        url,
        crawlOptions,
        optimizationOptions,
        status: 'started',
        startTime: new Date().toISOString()
      }));

      return taskId;
    } catch (error) {
      console.error('Error starting optimization:', error);
      throw new Error('Failed to start optimization');
    }
  }

  getTaskStatus(taskId: string) {
    try {
      const taskJson = localStorage.getItem(`task_${taskId}`);
      if (!taskJson) {
        throw new Error('Task not found');
      }
      
      const task = JSON.parse(taskJson);
      
      // Simulate task completion after some time
      if (task.status === 'started') {
        const startTime = new Date(task.startTime).getTime();
        const now = Date.now();
        const elapsedTime = now - startTime;
        
        if (elapsedTime > 10000) { // Simulate completion after 10 seconds
          task.status = 'completed';
          task.endTime = new Date().toISOString();
          localStorage.setItem(`task_${taskId}`, JSON.stringify(task));
        }
      }
      
      return task;
    } catch (error) {
      console.error('Error getting task status:', error);
      return {
        id: taskId,
        url: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const seoOptimizationController = new SeoOptimizationController();
