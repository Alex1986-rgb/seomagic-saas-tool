-- Возврат защиты данных после «режима тестирования».
--
-- Миграция 20251118110128 заменила политики двенадцати таблиц на
-- allow_all ... USING (true) с пометкой «MUST BE REVERTED BEFORE PRODUCTION».
-- Откат так и не сделали: до сих пор любой пользователь — включая анонимного —
-- мог читать, менять и удалять чужие аудиты и профили, а через user_roles
-- выдать себе роль администратора.
--
-- Правила, к которым возвращаемся:
--   * пользователь видит и удаляет своё;
--   * записи без владельца (user_id IS NULL) — быстрый аудит с главной
--     страницы, запущенный без входа: остаются общедоступными, как было
--     задумано до режима тестирования;
--   * таблицы обхода сайта наполняет edge-функция под service-role, которую
--     RLS не ограничивает, поэтому политик на запись у них нет;
--   * роли выдаёт только администратор.

-- 1. Снимаем все оставшиеся allow_all-политики.
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND policyname LIKE 'allow_all%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;


-- 2. Аудиты и задачи обхода: полный набор прав владельца.

DROP POLICY IF EXISTS "Владелец видит свои записи" ON public.audits;
CREATE POLICY "Владелец видит свои записи"
  ON public.audits FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Создать можно только от своего имени" ON public.audits;
CREATE POLICY "Создать можно только от своего имени"
  ON public.audits FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Менять можно только своё" ON public.audits;
CREATE POLICY "Менять можно только своё"
  ON public.audits FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Удалять можно только своё" ON public.audits;
CREATE POLICY "Удалять можно только своё"
  ON public.audits FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Владелец видит свои записи" ON public.audit_tasks;
CREATE POLICY "Владелец видит свои записи"
  ON public.audit_tasks FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Создать можно только от своего имени" ON public.audit_tasks;
CREATE POLICY "Создать можно только от своего имени"
  ON public.audit_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Менять можно только своё" ON public.audit_tasks;
CREATE POLICY "Менять можно только своё"
  ON public.audit_tasks FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Удалять можно только своё" ON public.audit_tasks;
CREATE POLICY "Удалять можно только своё"
  ON public.audit_tasks FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 3. Результаты и данные обхода: владельцу только чтение и удаление,
--    наполняет их service-role.

DROP POLICY IF EXISTS "Владелец видит свои записи" ON public.audit_results;
CREATE POLICY "Владелец видит свои записи"
  ON public.audit_results FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Удалять можно только своё" ON public.audit_results;
CREATE POLICY "Удалять можно только своё"
  ON public.audit_results FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Владелец видит свои записи" ON public.audit_files;
CREATE POLICY "Владелец видит свои записи"
  ON public.audit_files FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Удалять можно только своё" ON public.audit_files;
CREATE POLICY "Удалять можно только своё"
  ON public.audit_files FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Владелец видит свои записи" ON public.crawled_pages;
CREATE POLICY "Владелец видит свои записи"
  ON public.crawled_pages FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Удалять можно только своё" ON public.crawled_pages;
CREATE POLICY "Удалять можно только своё"
  ON public.crawled_pages FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Владелец видит свои записи" ON public.issues;
CREATE POLICY "Владелец видит свои записи"
  ON public.issues FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Удалять можно только своё" ON public.issues;
CREATE POLICY "Удалять можно только своё"
  ON public.issues FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Владелец видит свои записи" ON public.fixed_pages;
CREATE POLICY "Владелец видит свои записи"
  ON public.fixed_pages FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Удалять можно только своё" ON public.fixed_pages;
CREATE POLICY "Удалять можно только своё"
  ON public.fixed_pages FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 4. Задания оптимизации.
DROP POLICY IF EXISTS "Владелец видит свои задания" ON public.optimization_jobs;
CREATE POLICY "Владелец видит свои задания"
  ON public.optimization_jobs FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Удалять можно только свои задания" ON public.optimization_jobs;
CREATE POLICY "Удалять можно только свои задания"
  ON public.optimization_jobs FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 5. url_queue — служебная очередь обхода без владельца строки.
--    Пользователю она не нужна: работает только service-role. Политик нет,
--    то есть при включённом RLS таблица для пользователей закрыта.

-- 6. Профили.
DROP POLICY IF EXISTS "Свой профиль виден владельцу" ON public.profiles;
CREATE POLICY "Свой профиль виден владельцу"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Свой профиль создаёт сам пользователь" ON public.profiles;
CREATE POLICY "Свой профиль создаёт сам пользователь"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Свой профиль меняет владелец" ON public.profiles;
CREATE POLICY "Свой профиль меняет владелец"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- 7. Роли — самое опасное место: без этого ограничения любой желающий
--    делает себя администратором одной строкой.
DROP POLICY IF EXISTS "Своя роль видна пользователю" ON public.user_roles;
CREATE POLICY "Своя роль видна пользователю"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Роли выдаёт только администратор" ON public.user_roles;
CREATE POLICY "Роли выдаёт только администратор"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Роли меняет только администратор" ON public.user_roles;
CREATE POLICY "Роли меняет только администратор"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Роли снимает только администратор" ON public.user_roles;
CREATE POLICY "Роли снимает только администратор"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. Журнал вызовов — для администратора.
DROP POLICY IF EXISTS "Журнал вызовов виден администратору" ON public.api_logs;
CREATE POLICY "Журнал вызовов виден администратору"
  ON public.api_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- 9. Таблицы, которых может не быть в этом проекте (создавались отдельными
--    ветками истории): закрываем их тем же правилом, если они существуют.
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['pdf_reports', 'page_analysis'] LOOP
    IF to_regclass('public.' || t) IS NULL THEN
      CONTINUE;
    END IF;
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Владелец видит свои записи', t);
    EXECUTE format(
      'CREATE POLICY "Владелец видит свои записи" ON public.%I FOR SELECT '
      'USING (auth.uid() = user_id OR user_id IS NULL OR public.has_role(auth.uid(), ''admin''))',
      t
    );
  END LOOP;
END $$;

COMMENT ON DATABASE postgres IS 'Доступ к данным ограничен владельцем записи (RLS восстановлен 14.09.2026)';

