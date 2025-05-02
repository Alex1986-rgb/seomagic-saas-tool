
export class ConcurrencyManager {
  private maxConcurrentTasks: number;
  private runningTasks: number = 0;
  private taskQueue: (() => Promise<void>)[] = [];

  constructor(maxConcurrentTasks: number = 10) {
    this.maxConcurrentTasks = maxConcurrentTasks;
  }

  async executeWithThrottle(task: () => Promise<void>): Promise<void> {
    if (this.runningTasks < this.maxConcurrentTasks) {
      return this.executeTask(task);
    } else {
      return new Promise<void>(resolve => {
        this.taskQueue.push(async () => {
          await this.executeTask(task);
          resolve();
        });
      });
    }
  }

  private async executeTask(task: () => Promise<void>): Promise<void> {
    this.runningTasks++;
    try {
      await task();
    } finally {
      this.runningTasks--;
      this.executeNextTask();
    }
  }

  private executeNextTask(): void {
    if (this.taskQueue.length > 0 && this.runningTasks < this.maxConcurrentTasks) {
      const nextTask = this.taskQueue.shift();
      if (nextTask) {
        nextTask();
      }
    }
  }
}
