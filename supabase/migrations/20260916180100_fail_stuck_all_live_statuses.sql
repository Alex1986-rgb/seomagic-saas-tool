-- Уборка зависших аудитов видит все «живые» статусы.
--
-- fail_stuck_audit_tasks (миграция 20260916150000) снимала только задачи в
-- 'processing', а запись в audits переводила в failed только из 'pending' и
-- 'processing'. Но audit-resume ставит в audits статус 'scanning', а статус
-- 'processing' в audits не пишет ни одна функция. Возобновлённый и снова
-- зависший аудит получал failed в задаче, а в audits навсегда оставался
-- «сканируется».
--
-- Какие статусы реально пишут функции:
--   audit_tasks: queued (audit-start) → processing (audit-processor,
--                audit-resume) → completed | failed | cancelled;
--                'pending' и 'scanning' — старые значения, могут остаться в базе.
--   audits:      pending (audit-start), scanning (audit-resume) →
--                completed | partial | failed.
-- Задача в 'queued' дольше часа — тоже зависшая: обработчик запускается сразу
-- после создания задачи и первым делом переводит её в 'processing'.

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
   WHERE status IN ('queued', 'pending', 'processing', 'scanning')
     AND updated_at < now() - interval '1 hour';

  GET DIAGNOSTICS affected = ROW_COUNT;

  UPDATE audits a
     SET status = 'failed',
         error_message = COALESCE(t.error_message, 'Задача остановлена: обработчик молчит больше часа')
    FROM audit_tasks t
   WHERE t.audit_id = a.id
     AND t.status = 'failed'
     AND a.status IN ('pending', 'processing', 'scanning');

  RETURN affected;
END;
$$;

REVOKE ALL ON FUNCTION public.fail_stuck_audit_tasks() FROM public, anon, authenticated;
-- Функция cleanup-stuck-tasks вызывает эту же уборку служебным ключом.
GRANT EXECUTE ON FUNCTION public.fail_stuck_audit_tasks() TO service_role;
