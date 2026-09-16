-- Уборка по расписанию стучалась в чужой проект.
--
-- Задания cleanup-old-audit-data и cleanup-stuck-tasks вызывали функции по
-- адресу удалённого проекта (dllusofuxonaemrttmwl.supabase.co) — то есть не
-- работали вовсе: зависшие аудиты висели «в обработке» вечно, а старые данные
-- копились. Заодно наружу уходил заголовок с ключом, пусть и от мёртвого
-- проекта.
--
-- Обе задачи — обычные операции с базой, сеть для них не нужна. Переносим их
-- внутрь: теперь уборка не зависит ни от адреса проекта, ни от ключей.

-- Снятие зависших задач ------------------------------------------------------

CREATE OR REPLACE FUNCTION public.fail_stuck_audit_tasks()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected integer;
BEGIN
  UPDATE audit_tasks
     SET status = 'failed',
         error_message = 'Задача остановлена: обработчик молчит больше часа',
         updated_at = now()
   WHERE status = 'processing'
     AND updated_at < now() - interval '1 hour';

  GET DIAGNOSTICS affected = ROW_COUNT;

  UPDATE audits a
     SET status = 'failed',
         error_message = 'Задача остановлена: обработчик молчит больше часа'
    FROM audit_tasks t
   WHERE t.audit_id = a.id
     AND t.status = 'failed'
     AND a.status IN ('pending', 'processing');

  RETURN affected;
END;
$$;

-- Уборка старых данных -------------------------------------------------------

CREATE OR REPLACE FUNCTION public.cleanup_old_audit_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  removed jsonb := '{}'::jsonb;
  n integer;
  old_tasks uuid[];
BEGIN
  DELETE FROM crawled_pages WHERE crawled_at < now() - interval '30 days';
  GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('crawled_pages', n);

  DELETE FROM url_queue WHERE created_at < now() - interval '90 days';
  GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('url_queue', n);

  DELETE FROM notifications WHERE created_at < now() - interval '90 days';
  GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('notifications', n);

  DELETE FROM api_logs WHERE created_at < now() - interval '30 days';
  GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('api_logs', n);

  SELECT array_agg(id) INTO old_tasks
    FROM audit_tasks WHERE created_at < now() - interval '90 days';

  IF old_tasks IS NOT NULL THEN
    DELETE FROM page_analysis WHERE task_id = ANY(old_tasks);
    GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('page_analysis', n);

    DELETE FROM audit_results WHERE task_id = ANY(old_tasks);
    GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('audit_results', n);

    DELETE FROM audit_tasks WHERE id = ANY(old_tasks);
    GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('audit_tasks', n);
  END IF;

  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION public.fail_stuck_audit_tasks() FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.cleanup_old_audit_data() FROM public, anon, authenticated;

-- Переключаем расписание на них ----------------------------------------------

SELECT cron.unschedule('cleanup-stuck-tasks')
 WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-stuck-tasks');

SELECT cron.unschedule('cleanup-old-audit-data')
 WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-old-audit-data');

SELECT cron.schedule('cleanup-stuck-tasks', '0 * * * *', 'SELECT public.fail_stuck_audit_tasks()');
SELECT cron.schedule('cleanup-old-audit-data', '0 3 * * *', 'SELECT public.cleanup_old_audit_data()');
