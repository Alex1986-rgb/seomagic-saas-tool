-- Хранилище проверок позиций.
-- До этой миграции позиции нигде не хранились: «история» жила в localStorage
-- браузера и состояла из сгенерированных чисел. Теперь проверка — запись в БД,
-- принадлежащая пользователю, с реальными данными поставщика выдачи.

CREATE TABLE IF NOT EXISTS public.position_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  search_engine TEXT NOT NULL,
  region TEXT,
  depth INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'running',
  provider TEXT,
  keywords_total INTEGER NOT NULL DEFAULT 0,
  keywords_checked INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.position_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_id UUID NOT NULL REFERENCES public.position_checks(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  search_engine TEXT NOT NULL,
  -- 0 означает «в просмотренной выдаче домена нет», а не «первое место».
  position INTEGER NOT NULL,
  previous_position INTEGER,
  url TEXT,
  search_url TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.position_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.position_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own position checks"
ON public.position_checks FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own position checks"
ON public.position_checks FOR DELETE
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Записи создаёт только edge-функция под service-role, поэтому INSERT/UPDATE
-- политик для обычного пользователя нет: подделать результат проверки нельзя.

CREATE POLICY "Users can view results of their own checks"
ON public.position_results FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.position_checks c
    WHERE c.id = position_results.check_id
      AND (c.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE INDEX IF NOT EXISTS position_checks_user_domain_idx
  ON public.position_checks(user_id, domain, created_at DESC);
CREATE INDEX IF NOT EXISTS position_results_check_idx
  ON public.position_results(check_id);
CREATE INDEX IF NOT EXISTS position_results_keyword_idx
  ON public.position_results(keyword, search_engine, checked_at DESC);
