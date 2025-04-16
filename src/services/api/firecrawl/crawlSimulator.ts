
import { crawlTasks, CrawlTask } from './types';
import { generateSampleUrls } from './sitemapUtils';

/**
 * Simulates a crawling process for demonstration purposes
 */
export const simulateCrawlProgress = (taskId: string): void => {
  // Find the task
  const taskIndex = crawlTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;
  
  const task = crawlTasks[taskIndex];
  if (!task) return;
  
  // Update status
  task.status = 'in_progress';
  task.progress = 0;
  task.estimated_total_pages = Math.floor(Math.random() * 500) + 100;
  
  // Save changes
  crawlTasks[taskIndex] = task;
  localStorage.setItem(`crawl_task_${task.id}`, JSON.stringify(task));
  
  // Simulate the scanning process
  const interval = setInterval(() => {
    // Find the task again (it might have been updated)
    const updatedTaskIndex = crawlTasks.findIndex(t => t.id === taskId);
    if (updatedTaskIndex === -1) {
      clearInterval(interval);
      return;
    }
    
    const updatedTask = crawlTasks[updatedTaskIndex];
    if (!updatedTask) {
      clearInterval(interval);
      return;
    }
    
    // Increase progress
    const step = Math.floor(Math.random() * 10) + 1;
    updatedTask.pages_scanned += step;
    updatedTask.progress = Math.min(
      Math.floor((updatedTask.pages_scanned / updatedTask.estimated_total_pages) * 100),
      99
    );
    updatedTask.updated_at = new Date().toISOString();
    
    // If we've reached 100% or exceeded expected page count
    if (updatedTask.pages_scanned >= updatedTask.estimated_total_pages) {
      updatedTask.status = 'completed';
      updatedTask.progress = 100;
      updatedTask.pages_scanned = updatedTask.estimated_total_pages;
      
      // Generate random URLs for demonstration
      updatedTask.urls = generateSampleUrls(updatedTask.url, updatedTask.estimated_total_pages);
      
      clearInterval(interval);
    }
    
    // Save changes
    crawlTasks[updatedTaskIndex] = updatedTask;
    localStorage.setItem(`crawl_task_${updatedTask.id}`, JSON.stringify(updatedTask));
  }, 1000);
};
