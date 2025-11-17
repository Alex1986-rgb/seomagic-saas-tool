-- ====================================
-- ЭТАП 1: Базовая архитектура БД
-- ====================================

-- Таблица аудитов (основная таблица)
CREATE TABLE IF NOT EXISTS public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  pages_scanned INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  seo_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Таблица задач аудита (для отслеживания прогресса)
CREATE TABLE IF NOT EXISTS public.audit_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  task_type TEXT DEFAULT 'quick',
  status TEXT NOT NULL DEFAULT 'queued',
  stage TEXT DEFAULT 'initialization',
  progress INTEGER DEFAULT 0,
  pages_scanned INTEGER DEFAULT 0,
  estimated_pages INTEGER DEFAULT 0,
  current_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица результатов аудита
CREATE TABLE IF NOT EXISTS public.audit_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.audit_tasks(id) ON DELETE CASCADE,
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audit_data JSONB,
  score INTEGER,
  page_count INTEGER,
  issues_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица задач оптимизации
CREATE TABLE IF NOT EXISTS public.optimization_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.audit_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued',
  options JSONB,
  result_data JSONB,
  cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица логов API
CREATE TABLE IF NOT EXISTS public.api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  function_name TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  status_code INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Обновляем page_analysis для связи с audit_id
ALTER TABLE public.page_analysis
ADD COLUMN IF NOT EXISTS audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE;

-- ====================================
-- RLS ПОЛИТИКИ
-- ====================================

-- Включаем RLS для всех таблиц
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimization_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;

-- RLS для audits
CREATE POLICY "Users can view their own audits"
  ON public.audits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audits"
  ON public.audits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audits"
  ON public.audits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audits"
  ON public.audits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS для audit_tasks
CREATE POLICY "Users can view their own audit tasks"
  ON public.audit_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audit tasks"
  ON public.audit_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audit tasks"
  ON public.audit_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audit tasks"
  ON public.audit_tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS для audit_results
CREATE POLICY "Users can view their own audit results"
  ON public.audit_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audit results"
  ON public.audit_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audit results"
  ON public.audit_results FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audit results"
  ON public.audit_results FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS для optimization_jobs
CREATE POLICY "Users can view their own optimization jobs"
  ON public.optimization_jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own optimization jobs"
  ON public.optimization_jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own optimization jobs"
  ON public.optimization_jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own optimization jobs"
  ON public.optimization_jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS для api_logs (пользователь видит только свои логи)
CREATE POLICY "Users can view their own api logs"
  ON public.api_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ====================================
-- ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- ====================================

CREATE INDEX IF NOT EXISTS idx_audits_user_id ON public.audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON public.audits(status);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON public.audits(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_tasks_audit_id ON public.audit_tasks(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_tasks_user_id ON public.audit_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_tasks_status ON public.audit_tasks(status);

CREATE INDEX IF NOT EXISTS idx_audit_results_task_id ON public.audit_results(task_id);
CREATE INDEX IF NOT EXISTS idx_audit_results_audit_id ON public.audit_results(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_results_user_id ON public.audit_results(user_id);

CREATE INDEX IF NOT EXISTS idx_optimization_jobs_task_id ON public.optimization_jobs(task_id);
CREATE INDEX IF NOT EXISTS idx_optimization_jobs_user_id ON public.optimization_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_optimization_jobs_status ON public.optimization_jobs(status);

CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON public.api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_function_name ON public.api_logs(function_name);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON public.api_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_analysis_audit_id ON public.page_analysis(audit_id);

-- ====================================
-- ТРИГГЕРЫ ДЛЯ updated_at
-- ====================================

CREATE TRIGGER update_audit_tasks_updated_at
  BEFORE UPDATE ON public.audit_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_optimization_jobs_updated_at
  BEFORE UPDATE ON public.optimization_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================
-- КОММЕНТАРИИ К ТАБЛИЦАМ
-- ====================================

COMMENT ON TABLE public.audits IS 'Основная таблица аудитов сайтов';
COMMENT ON TABLE public.audit_tasks IS 'Задачи аудита для отслеживания прогресса';
COMMENT ON TABLE public.audit_results IS 'Результаты выполненных аудитов';
COMMENT ON TABLE public.optimization_jobs IS 'Задачи оптимизации контента';
COMMENT ON TABLE public.api_logs IS 'Логи вызовов Edge Functions';