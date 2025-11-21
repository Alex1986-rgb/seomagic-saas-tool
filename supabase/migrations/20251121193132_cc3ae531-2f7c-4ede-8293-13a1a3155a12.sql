-- Create enum types
CREATE TYPE public.issue_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE public.issue_category AS ENUM ('seo', 'content', 'technical', 'performance', 'accessibility', 'security');
CREATE TYPE public.estimate_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'paid', 'cancelled');
CREATE TYPE public.fixed_page_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Table: issues
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
  page_id UUID REFERENCES public.page_analysis(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.audit_tasks(id) ON DELETE CASCADE,
  user_id UUID,
  issue_type TEXT NOT NULL,
  severity issue_severity NOT NULL DEFAULT 'medium',
  category issue_category NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT,
  can_auto_fix BOOLEAN DEFAULT false,
  fix_cost NUMERIC(10,2),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: pricing_rules
CREATE TABLE public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  category issue_category NOT NULL,
  price_per_item NUMERIC(10,2) NOT NULL,
  is_bundle BOOLEAN DEFAULT false,
  bundle_includes JSONB,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: job_estimates
CREATE TABLE public.job_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.audit_tasks(id) ON DELETE CASCADE,
  user_id UUID,
  total_issues INTEGER DEFAULT 0,
  total_cost NUMERIC(10,2) DEFAULT 0,
  discount_applied NUMERIC(10,2) DEFAULT 0,
  final_cost NUMERIC(10,2) DEFAULT 0,
  cost_breakdown JSONB,
  status estimate_status DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: llm_providers
CREATE TABLE public.llm_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  role TEXT NOT NULL,
  model_name TEXT NOT NULL,
  api_config JSONB,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: fixed_pages
CREATE TABLE public.fixed_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
  page_id UUID REFERENCES public.page_analysis(id) ON DELETE CASCADE,
  user_id UUID,
  original_html TEXT,
  fixed_html TEXT,
  fixes_applied JSONB,
  llm_provider_used UUID REFERENCES public.llm_providers(id),
  processing_time_ms INTEGER,
  status fixed_page_status DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for issues
CREATE POLICY "Users can view their own issues"
  ON public.issues FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own issues"
  ON public.issues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issues"
  ON public.issues FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own issues"
  ON public.issues FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for pricing_rules
CREATE POLICY "Everyone can view active pricing rules"
  ON public.pricing_rules FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow all insert on pricing_rules"
  ON public.pricing_rules FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update on pricing_rules"
  ON public.pricing_rules FOR UPDATE
  USING (true);

CREATE POLICY "Allow all delete on pricing_rules"
  ON public.pricing_rules FOR DELETE
  USING (true);

-- RLS Policies for job_estimates
CREATE POLICY "Users can view their own estimates"
  ON public.job_estimates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own estimates"
  ON public.job_estimates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own estimates"
  ON public.job_estimates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own estimates"
  ON public.job_estimates FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for llm_providers
CREATE POLICY "Everyone can view active providers"
  ON public.llm_providers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow all insert on llm_providers"
  ON public.llm_providers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update on llm_providers"
  ON public.llm_providers FOR UPDATE
  USING (true);

CREATE POLICY "Allow all delete on llm_providers"
  ON public.llm_providers FOR DELETE
  USING (true);

-- RLS Policies for fixed_pages
CREATE POLICY "Users can view their own fixed pages"
  ON public.fixed_pages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fixed pages"
  ON public.fixed_pages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fixed pages"
  ON public.fixed_pages FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_issues_audit_id ON public.issues(audit_id);
CREATE INDEX idx_issues_severity ON public.issues(severity);
CREATE INDEX idx_issues_issue_type ON public.issues(issue_type);
CREATE INDEX idx_issues_category ON public.issues(category);
CREATE INDEX idx_issues_user_id ON public.issues(user_id);

CREATE INDEX idx_pricing_rules_issue_type ON public.pricing_rules(issue_type);
CREATE INDEX idx_pricing_rules_category ON public.pricing_rules(category);
CREATE INDEX idx_pricing_rules_active ON public.pricing_rules(is_active);

CREATE INDEX idx_job_estimates_audit_id ON public.job_estimates(audit_id);
CREATE INDEX idx_job_estimates_user_id ON public.job_estimates(user_id);
CREATE INDEX idx_job_estimates_status ON public.job_estimates(status);

CREATE INDEX idx_fixed_pages_audit_id ON public.fixed_pages(audit_id);
CREATE INDEX idx_fixed_pages_page_id ON public.fixed_pages(page_id);
CREATE INDEX idx_fixed_pages_status ON public.fixed_pages(status);
CREATE INDEX idx_fixed_pages_user_id ON public.fixed_pages(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at
  BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_estimates_updated_at
  BEFORE UPDATE ON public.job_estimates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_llm_providers_updated_at
  BEFORE UPDATE ON public.llm_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fixed_pages_updated_at
  BEFORE UPDATE ON public.fixed_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data for pricing_rules (обычные правила)
INSERT INTO public.pricing_rules (rule_name, issue_type, category, price_per_item, sort_order) VALUES
('Отсутствует Title', 'missing_title', 'seo', 20.00, 1),
('Дублирующийся Title', 'duplicate_title', 'seo', 25.00, 2),
('Короткий Title', 'short_title', 'seo', 20.00, 3),
('Длинный Title', 'long_title', 'seo', 20.00, 4),
('Отсутствует H1', 'missing_h1', 'seo', 30.00, 5),
('Несколько H1', 'multiple_h1', 'seo', 25.00, 6),
('Отсутствует Meta Description', 'missing_description', 'seo', 30.00, 7),
('Дублирующееся Meta Description', 'duplicate_description', 'seo', 35.00, 8),
('Короткое Meta Description', 'short_description', 'seo', 30.00, 9),
('Длинное Meta Description', 'long_description', 'seo', 30.00, 10),
('Тонкий контент', 'thin_content', 'content', 150.00, 11),
('Отсутствует Alt у изображения', 'missing_image_alt', 'content', 20.00, 12),
('Пустой Alt у изображения', 'empty_image_alt', 'content', 20.00, 13),
('Нет внутренних ссылок', 'no_internal_links', 'content', 50.00, 14),
('Слишком много внешних ссылок', 'too_many_external_links', 'content', 40.00, 15),
('Отсутствует Canonical', 'missing_canonical', 'technical', 25.00, 16),
('Неправильный Canonical', 'wrong_canonical', 'technical', 30.00, 17),
('Страница не индексируется', 'not_indexable', 'technical', 20.00, 18),
('Редирект 301', 'redirect_301', 'technical', 15.00, 19),
('Редирект 302', 'redirect_302', 'technical', 15.00, 20),
('Цепочка редиректов', 'redirect_chain', 'technical', 50.00, 21),
('Битая ссылка (404)', 'broken_link', 'technical', 10.00, 22),
('Ошибка сервера (5xx)', 'server_error', 'technical', 80.00, 23),
('Медленная загрузка страницы', 'slow_page', 'performance', 100.00, 24),
('Большой размер HTML', 'large_html', 'performance', 60.00, 25),
('Нет сжатия', 'no_compression', 'performance', 40.00, 26),
('Высокий TTFB', 'high_ttfb', 'performance', 80.00, 27),
('Отсутствует Schema.org разметка', 'missing_schema', 'seo', 100.00, 28),
('Неправильная Schema.org', 'invalid_schema', 'seo', 80.00, 29),
('Добавить LocalBusiness Schema', 'add_local_business', 'seo', 60.00, 30);

-- Seed data for pricing_rules (пакеты)
INSERT INTO public.pricing_rules (rule_name, issue_type, category, price_per_item, is_bundle, bundle_includes, sort_order) VALUES
('Базовый SEO пакет', 'basic_seo_package', 'seo', 5000.00, true, '["missing_title", "missing_h1", "missing_description"]', 100),
('Продвинутый SEO пакет', 'advanced_seo_package', 'seo', 10000.00, true, '["missing_title", "missing_h1", "missing_description", "missing_canonical", "not_indexable", "missing_schema"]', 101),
('Технический аудит', 'technical_package', 'technical', 15000.00, true, '["redirect_chain", "broken_link", "server_error", "wrong_canonical", "no_compression"]', 102),
('Полный пакет', 'complete_package', 'seo', 20000.00, true, '["missing_title", "missing_h1", "missing_description", "thin_content", "missing_image_alt", "missing_canonical", "slow_page", "missing_schema"]', 103);

-- Seed data for llm_providers
INSERT INTO public.llm_providers (provider_name, role, model_name, api_config, is_active, is_default) VALUES
('Lovable AI', 'seo_text_fixer', 'google/gemini-2.5-flash', '{"temperature": 0.7, "max_tokens": 2000}', true, true),
('Lovable AI', 'schema_fixer', 'google/gemini-2.5-flash', '{"temperature": 0.3, "max_tokens": 1500}', true, true);