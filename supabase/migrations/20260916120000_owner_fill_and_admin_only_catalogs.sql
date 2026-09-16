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
