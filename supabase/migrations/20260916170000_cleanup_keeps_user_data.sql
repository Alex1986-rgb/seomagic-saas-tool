-- Уборка не трогает работу зарегистрированных пользователей.
--
-- Функция cleanup_old_audit_data (миграция 20260916150000) удаляла задачи
-- аудита старше 90 дней. На audit_tasks ссылаются optimization_jobs,
-- job_estimates и issues с ON DELETE CASCADE, поэтому вместе с задачей
-- безвозвратно пропадали бы тексты, переписанные моделью, сметы и замечания, а
-- запись в audits оставалась бы «завершённой» без результатов. Прежняя версия
-- этого задания стучалась в удалённый проект и не работала, так что удаление
-- включилось бы впервые.
--
-- Теперь чистим только то, что можно потерять без ущерба:
--   * технические следы обхода (очередь адресов, сырые страницы, журнал вызовов);
--   * прочитанные уведомления;
--   * гостевые аудиты без хозяина — их никто не сможет открыть из кабинета.
-- Задачи, результаты и оптимизации вошедших пользователей не удаляются.

CREATE OR REPLACE FUNCTION public.cleanup_old_audit_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  removed jsonb := '{}'::jsonb;
  n integer;
  guest_tasks uuid[];
BEGIN
  DELETE FROM crawled_pages WHERE crawled_at < now() - interval '30 days';
  GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('crawled_pages', n);

  -- Очередь обхода нужна только пока аудит идёт.
  DELETE FROM url_queue WHERE created_at < now() - interval '30 days';
  GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('url_queue', n);

  DELETE FROM notifications WHERE read = true AND created_at < now() - interval '90 days';
  GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('notifications', n);

  DELETE FROM api_logs WHERE created_at < now() - interval '30 days';
  GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('api_logs', n);

  -- Только гостевые задачи: у них нет хозяина, в кабинете их не открыть.
  SELECT array_agg(id) INTO guest_tasks
    FROM audit_tasks
   WHERE user_id IS NULL
     AND created_at < now() - interval '90 days';

  IF guest_tasks IS NOT NULL THEN
    DELETE FROM page_analysis WHERE task_id = ANY(guest_tasks);
    GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('page_analysis', n);

    DELETE FROM audit_results WHERE task_id = ANY(guest_tasks);
    GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('audit_results', n);

    DELETE FROM audit_tasks WHERE id = ANY(guest_tasks);
    GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('audit_tasks', n);

    DELETE FROM audits a
     WHERE a.user_id IS NULL
       AND a.created_at < now() - interval '90 days'
       AND NOT EXISTS (SELECT 1 FROM audit_tasks t WHERE t.audit_id = a.id);
    GET DIAGNOSTICS n = ROW_COUNT; removed := removed || jsonb_build_object('audits', n);
  END IF;

  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_old_audit_data() FROM public, anon, authenticated;
