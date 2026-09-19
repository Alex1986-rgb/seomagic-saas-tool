-- Накопленные правки базы SeoMarket от 16.09.2026.
-- Выполнять целиком в SQL Editor проекта rbkwhejnhiwmktqwkakz.
-- Порядок важен: сначала владельцы записей, потом заявки, потом обход, потом расписание.

-- ======================================================================
-- 20260916120000_owner_fill_and_admin_only_catalogs.sql
-- ======================================================================
-- Хозяин записей аудита, закрытый прайс и вторая строка оптимизации.
--
-- 1. Обработчики аудита пишут результаты служебным ключом и не проставляют
--    user_id. Поэтому все результаты, разборы страниц и отчёты лежали «без
--    хозяина» — и политика `user_id IS NULL` показывала их любому посетителю,
--    в том числе аудиты вошедших пользователей. Вместо правки каждого
--    обработчика хозяин берётся из задачи аудита триггером: новый обработчик
--    не сможет снова забыть поле.
-- 2. Прайс-лист и список моделей были открыты на запись кому угодно
--    (`Allow all ... true`) — любой мог обнулить цены в смете.
-- 3. На task_id в optimization_jobs стоял уникальный индекс. Смета занимает
--    эту строку, и запуск оптимизации по той же задаче падал с «Failed to
--    create optimization job». Единственной остаётся только смета.

-- 1. Хозяин из задачи аудита ------------------------------------------------

CREATE OR REPLACE FUNCTION public.fill_owner_from_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_json jsonb := to_jsonb(NEW);
  owner uuid;
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  IF row_json ? 'task_id' AND row_json->>'task_id' IS NOT NULL THEN
    SELECT user_id INTO owner FROM audit_tasks WHERE id = (row_json->>'task_id')::uuid;
  END IF;

  IF owner IS NULL AND row_json ? 'audit_id' AND row_json->>'audit_id' IS NOT NULL THEN
    SELECT user_id INTO owner FROM audits WHERE id = (row_json->>'audit_id')::uuid;
  END IF;

  NEW.user_id := owner;
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'audit_results', 'page_analysis', 'issues', 'pdf_reports',
    'fixed_pages', 'crawled_pages', 'audit_files', 'job_estimates', 'optimization_jobs'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS fill_owner_from_audit ON public.%I', t);
    EXECUTE format(
      'CREATE TRIGGER fill_owner_from_audit BEFORE INSERT OR UPDATE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.fill_owner_from_audit()', t);
  END LOOP;
END $$;

-- Проставляем хозяина уже накопленным записям.
UPDATE audit_results r SET user_id = t.user_id FROM audit_tasks t
  WHERE r.user_id IS NULL AND r.task_id = t.id AND t.user_id IS NOT NULL;
UPDATE page_analysis r SET user_id = t.user_id FROM audit_tasks t
  WHERE r.user_id IS NULL AND r.task_id = t.id AND t.user_id IS NOT NULL;
UPDATE issues r SET user_id = t.user_id FROM audit_tasks t
  WHERE r.user_id IS NULL AND r.task_id = t.id AND t.user_id IS NOT NULL;
UPDATE pdf_reports r SET user_id = t.user_id FROM audit_tasks t
  WHERE r.user_id IS NULL AND r.task_id = t.id AND t.user_id IS NOT NULL;
UPDATE job_estimates r SET user_id = t.user_id FROM audit_tasks t
  WHERE r.user_id IS NULL AND r.task_id = t.id AND t.user_id IS NOT NULL;
UPDATE optimization_jobs r SET user_id = t.user_id FROM audit_tasks t
  WHERE r.user_id IS NULL AND r.task_id = t.id AND t.user_id IS NOT NULL;
UPDATE fixed_pages r SET user_id = a.user_id FROM audits a
  WHERE r.user_id IS NULL AND r.audit_id = a.id AND a.user_id IS NOT NULL;
UPDATE crawled_pages r SET user_id = a.user_id FROM audits a
  WHERE r.user_id IS NULL AND r.audit_id = a.id AND a.user_id IS NOT NULL;
UPDATE audit_files r SET user_id = a.user_id FROM audits a
  WHERE r.user_id IS NULL AND r.audit_id = a.id AND a.user_id IS NOT NULL;

-- 2. Прайс и модели меняет только администратор ------------------------------

DROP POLICY IF EXISTS "Allow all insert on pricing_rules" ON public.pricing_rules;
DROP POLICY IF EXISTS "Allow all update on pricing_rules" ON public.pricing_rules;
DROP POLICY IF EXISTS "Allow all delete on pricing_rules" ON public.pricing_rules;
DROP POLICY IF EXISTS "Allow all insert on llm_providers" ON public.llm_providers;
DROP POLICY IF EXISTS "Allow all update on llm_providers" ON public.llm_providers;
DROP POLICY IF EXISTS "Allow all delete on llm_providers" ON public.llm_providers;

CREATE POLICY "Прайс меняет администратор" ON public.pricing_rules
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Модели меняет администратор" ON public.llm_providers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. Смета — одна на задачу, запусков оптимизации — сколько угодно -----------

DROP INDEX IF EXISTS public.optimization_jobs_task_id_unique;
CREATE UNIQUE INDEX IF NOT EXISTS optimization_jobs_one_estimate_per_task
  ON public.optimization_jobs (task_id) WHERE status = 'estimated';

-- ======================================================================
-- 20260916130000_contact_requests.sql
-- ======================================================================
-- Заявки с сайта: обратная связь и просьба выставить счёт.
--
-- Форма обратной связи писала сообщение в консоль браузера и отвечала
-- «Сообщение отправлено» — обращения не доходили никуда. Форма оплаты собирала
-- номер карты и CVV, хотя платёж не проводился. Обе теперь оставляют заявку
-- здесь: её видит администратор, и ни одно обращение не теряется.

CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'contact' CHECK (kind IN ('contact', 'invoice')),
  name text,
  email text NOT NULL,
  subject text,
  message text,
  -- Для просьбы о счёте: сайт и сумма из сметы.
  site_url text,
  amount numeric,
  task_id uuid,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON public.contact_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON public.contact_requests (status);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Написать может любой посетитель: это форма обратной связи.
DROP POLICY IF EXISTS "Заявку может оставить любой" ON public.contact_requests;
CREATE POLICY "Заявку может оставить любой" ON public.contact_requests
  FOR INSERT WITH CHECK (true);

-- А читать и разбирать — только администратор и сам автор, если он входил.
DROP POLICY IF EXISTS "Заявки читает администратор" ON public.contact_requests;
CREATE POLICY "Заявки читает администратор" ON public.contact_requests
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Заявки разбирает администратор" ON public.contact_requests;
CREATE POLICY "Заявки разбирает администратор" ON public.contact_requests
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ======================================================================
-- 20260916140000_crawl_dedup.sql
-- ======================================================================
-- Один адрес — одна запись в обходе.
--
-- Краулер добавлял каждую найденную ссылку обычной вставкой, надеясь на
-- «ошибку дубля», которой не было: уникальности в таблицах не существовало, а
-- клиент базы исключений не бросает. Сквозные ссылки (меню, подвал) попадали в
-- очередь заново с каждой страницы, сайт обходился по кругу, и в отчёте
-- получалось втрое больше страниц, чем есть на самом деле.

-- Сначала убираем накопленные повторы, оставляя самую раннюю запись.
DELETE FROM public.url_queue q
USING public.url_queue keep
WHERE q.task_id = keep.task_id
  AND q.url = keep.url
  AND q.ctid > keep.ctid;

DELETE FROM public.page_analysis p
USING public.page_analysis keep
WHERE p.task_id = keep.task_id
  AND p.url = keep.url
  AND p.ctid > keep.ctid;

CREATE UNIQUE INDEX IF NOT EXISTS url_queue_task_url_unique
  ON public.url_queue (task_id, url);

CREATE UNIQUE INDEX IF NOT EXISTS page_analysis_task_url_unique
  ON public.page_analysis (task_id, url);

-- «Сжатия нет» и «про сжатие ничего не известно» — разные вещи. Значение по
-- умолчанию превращало непроверенное в замечание, за которое выставлялся счёт.
ALTER TABLE public.page_analysis ALTER COLUMN is_compressed DROP DEFAULT;

-- ======================================================================
-- 20260916150000_cron_points_to_this_project.sql
-- ======================================================================
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

