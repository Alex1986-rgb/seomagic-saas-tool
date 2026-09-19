import { supabase } from '@/integrations/supabase/client';
import { CrawlOptions, OptimizationOptions } from '@/types/audit/crawl-options';
import { optimizationService } from '@/api/services/optimizationService';

/**
 * Запуск и отслеживание оптимизации сайта.
 *
 * Раньше контроллер делал вид, что работает: заводил задачу в localStorage и
 * объявлял её выполненной через десять секунд. Теперь он ведёт настоящую цепочку
 * серверных шагов:
 *
 *   audit-start(url) → audit-status(task_id) → optimization-start(task_id)
 *                                            → optimization-status(optimization_id)
 *
 * В localStorage остаётся только клиентский кеш: выбранные пользователем опции и
 * идентификатор запущенной оптимизации, чтобы опрос переживал перезагрузку страницы.
 */

interface OptimizationTaskState {
  url: string;
  options: OptimizationStartOptions;
  optimizationId?: string;
}

interface OptimizationStartOptions {
  fixMeta: boolean;
  fixHeadings: boolean;
  fixImages: boolean;
  generateSitemap: boolean;
  optimizeContentSeo: boolean;
}

export interface OptimizationTaskStatus {
  id: string;
  url: string;
  /** scanning | optimizing | completed | failed */
  status: string;
  stage?: string;
  progress: number;
  error?: string;
  result?: unknown;
}

const STATE_PREFIX = 'optimization_task_';

class SeoOptimizationController {
  /** Запускает аудит сайта — первый шаг оптимизации — и возвращает id задачи. */
  async startOptimization(
    url: string,
    crawlOptions: CrawlOptions,
    optimizationOptions: OptimizationOptions,
  ): Promise<string> {
    const { data, error } = await supabase.functions.invoke('audit-start', {
      body: {
        url,
        options: {
          maxPages: crawlOptions.maxPages ?? 100,
          type: 'deep',
        },
      },
    });

    if (error) throw new Error(error.message || 'Не удалось запустить аудит сайта');
    if (!data?.success || !data.task_id) {
      throw new Error(data?.error || 'Сервис аудита не вернул идентификатор задачи');
    }

    this.saveState(data.task_id, {
      url,
      options: {
        fixMeta: optimizationOptions.optimizeMetaTags ?? true,
        fixHeadings: optimizationOptions.optimizeHeadings ?? true,
        fixImages: optimizationOptions.optimizeImages ?? true,
        generateSitemap: true,
        optimizeContentSeo: optimizationOptions.optimizeContent ?? true,
      },
    });

    return data.task_id;
  }

  /**
   * Состояние задачи. Пока идёт аудит — отдаём его прогресс; как только аудит
   * закончен, запускаем оптимизацию и дальше следим уже за ней.
   */
  async getTaskStatus(taskId: string): Promise<OptimizationTaskStatus> {
    const state = this.loadState(taskId);

    try {
      if (state?.optimizationId) {
        return await this.optimizationStatus(taskId, state);
      }

      const { data, error } = await supabase.functions.invoke('audit-status', {
        body: { task_id: taskId },
      });
      if (error) throw new Error(error.message);

      const auditStatus = data?.status ?? 'unknown';

      if (auditStatus === 'failed') {
        return {
          id: taskId,
          url: state?.url ?? '',
          status: 'failed',
          progress: data?.progress ?? 0,
          error: data?.error || 'Аудит сайта завершился ошибкой',
        };
      }

      if (auditStatus !== 'completed') {
        return {
          id: taskId,
          url: state?.url ?? '',
          status: 'scanning',
          stage: data?.stage ?? 'scanning',
          // Аудит — первая половина работы, оптимизация — вторая.
          progress: Math.round((data?.progress ?? 0) / 2),
        };
      }

      // Аудит закончен — запускаем оптимизацию (один раз на задачу).
      const started = await optimizationService.startOptimization(
        taskId,
        state?.options ?? {
          fixMeta: true,
          fixHeadings: true,
          fixImages: true,
          generateSitemap: true,
          optimizeContentSeo: true,
        },
      );

      if (!started.success || !started.optimizationId) {
        return {
          id: taskId,
          url: state?.url ?? '',
          status: 'failed',
          progress: 50,
          error: started.message || 'Не удалось запустить оптимизацию',
        };
      }

      const updated: OptimizationTaskState = {
        url: state?.url ?? '',
        options: state?.options ?? {
          fixMeta: true,
          fixHeadings: true,
          fixImages: true,
          generateSitemap: true,
          optimizeContentSeo: true,
        },
        optimizationId: started.optimizationId,
      };
      this.saveState(taskId, updated);

      return await this.optimizationStatus(taskId, updated);
    } catch (error) {
      return {
        id: taskId,
        url: state?.url ?? '',
        status: 'failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Не удалось получить состояние задачи',
      };
    }
  }

  private async optimizationStatus(
    taskId: string,
    state: OptimizationTaskState,
  ): Promise<OptimizationTaskStatus> {
    const status = await optimizationService.getOptimizationStatus(state.optimizationId!);

    const failed = status.status === 'failed' || status.status === 'error';
    return {
      id: taskId,
      url: state.url,
      status: status.status === 'completed' ? 'completed' : (failed ? 'failed' : 'optimizing'),
      stage: status.message,
      progress: 50 + Math.round((status.progress ?? 0) / 2),
      error: failed ? (status.message || 'Оптимизация завершилась ошибкой') : undefined,
      result: status.result_data,
    };
  }

  /**
   * Выгрузка оптимизированной копии сайта.
   * Серверной сборки архива пока нет — молча отдавать заглушку нельзя.
   */
  async downloadOptimizedSite(_taskId: string): Promise<never> {
    throw new Error(
      'Выгрузка оптимизированной копии из интерфейса пока не реализована. ' +
      'Собрать копию можно скриптом scripts/pipeline.cjs (шаг clone + optimize).',
    );
  }

  /**
   * Публикация на хостинг клиента.
   * Бэкенда для этого нет: раньше метод возвращал выдуманный адрес и «успех»,
   * хотя никуда ничего не выкладывал. Публикация делается скриптом вручную.
   */
  async deploySite(_taskId: string, _deployOptions: unknown): Promise<never> {
    throw new Error(
      'Публикация на хостинг из интерфейса пока не реализована. ' +
      'Используйте scripts/publish-subdomain.sh — он выкладывает готовую копию по SSH.',
    );
  }

  private saveState(taskId: string, state: OptimizationTaskState): void {
    try {
      localStorage.setItem(`${STATE_PREFIX}${taskId}`, JSON.stringify(state));
    } catch (error) {
      console.warn('Не удалось сохранить параметры задачи оптимизации:', error);
    }
  }

  private loadState(taskId: string): OptimizationTaskState | null {
    try {
      const raw = localStorage.getItem(`${STATE_PREFIX}${taskId}`);
      return raw ? JSON.parse(raw) as OptimizationTaskState : null;
    } catch {
      return null;
    }
  }
}

export const seoOptimizationController = new SeoOptimizationController();
