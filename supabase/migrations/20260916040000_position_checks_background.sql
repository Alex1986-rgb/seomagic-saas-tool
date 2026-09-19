-- Фоновая проверка позиций.
--
-- Раньше проверка шла одним вызовом: пользователь ждал ответа, а edge-функция
-- жила не дольше двух с половиной минут. Тридцать запросов на глубину 100 — это
-- триста обращений к поставщику выдачи, минут двадцать работы, и проверка
-- обрывалась, не записав ничего. Теперь запросы становятся в очередь, а
-- обработчик разбирает её пачками, сохраняя каждую по ходу.

CREATE TABLE IF NOT EXISTS public.position_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_id UUID NOT NULL REFERENCES public.position_checks(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  search_engine TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Очередь служебная: наполняет и разбирает её только edge-функция под
-- service-role, пользователю она не нужна. RLS включён, политик нет —
-- значит для обычных клиентов таблица закрыта.
ALTER TABLE public.position_queue ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS position_queue_check_status_idx
  ON public.position_queue(check_id, status);

-- Сколько всего обращений к поставщику потребует проверка: по этому числу
-- видно и время работы, и расход у поставщика.
ALTER TABLE public.position_checks
  ADD COLUMN IF NOT EXISTS provider_requests INTEGER,
  ADD COLUMN IF NOT EXISTS heartbeat_at TIMESTAMPTZ;

COMMENT ON COLUMN public.position_checks.provider_requests IS
  'Ожидаемое число обращений к поставщику выдачи (запросы × страницы выдачи)';
COMMENT ON COLUMN public.position_checks.heartbeat_at IS
  'Когда обработчик последний раз подавал признаки жизни';

/**
 * Снятие зависших проверок.
 *
 * Обработчик может умереть посреди работы — например, если его прервут на
 * стороне платформы. Тогда проверка навсегда осталась бы «выполняется».
 * Считаем брошенной ту, от которой нет вестей десять минут.
 */
CREATE OR REPLACE FUNCTION public.fail_stale_position_checks()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  affected integer;
BEGIN
  UPDATE public.position_checks
     SET status = 'failed',
         error = COALESCE(error, 'Проверка прервана: обработчик не отвечает'),
         completed_at = now()
   WHERE status = 'running'
     AND COALESCE(heartbeat_at, created_at) < now() - interval '10 minutes';
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END $$;

-- Раз в десять минут подчищаем брошенные проверки.
SELECT cron.schedule(
  'fail-stale-position-checks',
  '*/10 * * * *',
  $$SELECT public.fail_stale_position_checks()$$
);
