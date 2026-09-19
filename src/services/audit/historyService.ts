import { supabase } from '@/integrations/supabase/client';
import { getBrowserTaskIdsForSite } from '@/modules/audit/utils/guestTasks';

export interface HistoricalTrend {
  date: string;
  globalScore: number;
  seoScore: number;
  technicalScore: number;
  contentScore: number;
  performanceScore: number;
  pageCount: number;
  auditId: string;
}

export interface ComparisonData {
  current: {
    id: string;
    globalScore: number;
    seoScore: number;
    technicalScore: number;
    contentScore: number;
    performanceScore: number;
    pageCount: number;
    pctMissingTitle: number;
    pctMissingH1: number;
    pctMissingDescription: number;
    pctSlowPages: number;
    pctThinContent: number;
  };
  previous: {
    id: string;
    globalScore: number;
    seoScore: number;
    technicalScore: number;
    contentScore: number;
    performanceScore: number;
    pageCount: number;
    pctMissingTitle: number;
    pctMissingH1: number;
    pctMissingDescription: number;
    pctSlowPages: number;
    pctThinContent: number;
  } | null;
  changes: {
    globalScore: number;
    seoScore: number;
    technicalScore: number;
    contentScore: number;
    performanceScore: number;
    pctMissingTitle: number;
    pctMissingH1: number;
    pctMissingDescription: number;
    pctSlowPages: number;
    pctThinContent: number;
  };
}

/**
 * Чьи проверки сайта можно брать в историю.
 *
 * Раньше задачи выбирались по адресу без владельца, а гостевые задачи
 * (user_id IS NULL) политика чтения отдаёт любому посетителю: в динамику и в
 * сравнение «с прошлой проверкой» попадали чужие гостевые аудиты того же сайта.
 * Фильтр тот же, что в auditService.findLatestCompletedTaskId: вошедшему — его
 * задачи, гостю — только задачи, запущенные из его браузера (localStorage).
 * null — своих задач нет, искать нечего.
 */
type TaskOwnerFilter =
  | { kind: 'user'; userId: string }
  | { kind: 'guest'; taskIds: string[] };

async function resolveOwnerFilter(url: string): Promise<TaskOwnerFilter | null> {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id ?? null;
  if (userId) return { kind: 'user', userId };

  const taskIds = getBrowserTaskIdsForSite(url);
  return taskIds.length > 0 ? { kind: 'guest', taskIds } : null;
}

/**
 * Fetches historical audit trends for a given URL
 */
export async function getHistoricalTrends(
  url: string,
  limit: number = 10
): Promise<HistoricalTrend[]> {
  try {
    const owner = await resolveOwnerFilter(url);
    if (!owner) return [];

    let tasksQuery = supabase
      .from('audit_tasks')
      .select('id, created_at, url')
      .eq('url', url)
      .eq('status', 'completed');

    tasksQuery = owner.kind === 'user'
      ? tasksQuery.eq('user_id', owner.userId)
      : tasksQuery.is('user_id', null).in('id', owner.taskIds);

    const { data: tasks, error: tasksError } = await tasksQuery
      .order('created_at', { ascending: false })
      .limit(limit);

    if (tasksError) throw tasksError;
    if (!tasks || tasks.length === 0) return [];

    const taskIds = tasks.map(t => t.id);

    const { data: results, error: resultsError } = await supabase
      .from('audit_results')
      .select('task_id, global_score, seo_score, technical_score, content_score, performance_score, page_count, created_at')
      .in('task_id', taskIds)
      .order('created_at', { ascending: true });

    if (resultsError) throw resultsError;
    if (!results) return [];

    const trends: HistoricalTrend[] = results.map(result => ({
      date: new Date(result.created_at || '').toLocaleDateString('ru-RU'),
      globalScore: result.global_score || 0,
      seoScore: result.seo_score || 0,
      technicalScore: result.technical_score || 0,
      contentScore: result.content_score || 0,
      performanceScore: result.performance_score || 0,
      pageCount: result.page_count || 0,
      auditId: result.task_id || ''
    }));

    return trends;
  } catch (error) {
    console.error('Error fetching historical trends:', error);
    return [];
  }
}

/**
 * Compares current audit with the previous one
 */
export async function compareWithPrevious(
  currentTaskId: string
): Promise<ComparisonData | null> {
  try {
    // Get current audit
    const { data: currentData, error: currentError } = await supabase
      .from('audit_results')
      .select('*')
      .eq('task_id', currentTaskId)
      .single();

    if (currentError) throw currentError;
    if (!currentData) return null;

    // Get task URL to find previous audits
    const { data: currentTask, error: taskError } = await supabase
      .from('audit_tasks')
      .select('url, created_at')
      .eq('id', currentTaskId)
      .single();

    if (taskError) throw taskError;
    if (!currentTask) return null;

    // Предыдущая завершённая проверка того же адреса — только своя (см.
    // resolveOwnerFilter). Чужой гостевой аудит для сравнения не годится.
    const owner = await resolveOwnerFilter(currentTask.url);
    let previousTasks: Array<{ id: string; created_at: string | null }> = [];

    if (owner) {
      let prevQuery = supabase
        .from('audit_tasks')
        .select('id, created_at')
        .eq('url', currentTask.url)
        .eq('status', 'completed')
        .lt('created_at', currentTask.created_at);

      prevQuery = owner.kind === 'user'
        ? prevQuery.eq('user_id', owner.userId)
        : prevQuery.is('user_id', null).in('id', owner.taskIds);

      const { data: prevTasks, error: prevTasksError } = await prevQuery
        .order('created_at', { ascending: false })
        .limit(1);

      if (prevTasksError) throw prevTasksError;
      previousTasks = prevTasks ?? [];
    }

    let previousData = null;
    if (previousTasks.length > 0) {
      const { data: prevData, error: prevError } = await supabase
        .from('audit_results')
        .select('*')
        .eq('task_id', previousTasks[0].id)
        .single();

      if (!prevError && prevData) {
        previousData = prevData;
      }
    }

    const current = {
      id: currentData.id,
      globalScore: currentData.global_score || 0,
      seoScore: currentData.seo_score || 0,
      technicalScore: currentData.technical_score || 0,
      contentScore: currentData.content_score || 0,
      performanceScore: currentData.performance_score || 0,
      pageCount: currentData.page_count || 0,
      pctMissingTitle: currentData.pct_missing_title || 0,
      pctMissingH1: currentData.pct_missing_h1 || 0,
      pctMissingDescription: currentData.pct_missing_description || 0,
      pctSlowPages: currentData.pct_slow_pages || 0,
      pctThinContent: currentData.pct_thin_content || 0,
    };

    const previous = previousData ? {
      id: previousData.id,
      globalScore: previousData.global_score || 0,
      seoScore: previousData.seo_score || 0,
      technicalScore: previousData.technical_score || 0,
      contentScore: previousData.content_score || 0,
      performanceScore: previousData.performance_score || 0,
      pageCount: previousData.page_count || 0,
      pctMissingTitle: previousData.pct_missing_title || 0,
      pctMissingH1: previousData.pct_missing_h1 || 0,
      pctMissingDescription: previousData.pct_missing_description || 0,
      pctSlowPages: previousData.pct_slow_pages || 0,
      pctThinContent: previousData.pct_thin_content || 0,
    } : null;

    const changes = {
      globalScore: previous ? current.globalScore - previous.globalScore : 0,
      seoScore: previous ? current.seoScore - previous.seoScore : 0,
      technicalScore: previous ? current.technicalScore - previous.technicalScore : 0,
      contentScore: previous ? current.contentScore - previous.contentScore : 0,
      performanceScore: previous ? current.performanceScore - previous.performanceScore : 0,
      pctMissingTitle: previous ? current.pctMissingTitle - previous.pctMissingTitle : 0,
      pctMissingH1: previous ? current.pctMissingH1 - previous.pctMissingH1 : 0,
      pctMissingDescription: previous ? current.pctMissingDescription - previous.pctMissingDescription : 0,
      pctSlowPages: previous ? current.pctSlowPages - previous.pctSlowPages : 0,
      pctThinContent: previous ? current.pctThinContent - previous.pctThinContent : 0,
    };

    return { current, previous, changes };
  } catch (error) {
    console.error('Error comparing audits:', error);
    return null;
  }
}
