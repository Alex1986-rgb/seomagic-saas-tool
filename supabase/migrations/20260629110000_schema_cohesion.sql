-- Сшивка разрозненной схемы. Только аддитивные изменения: ничего не удаляем и не меняем.
-- Связываем page_analysis -> audits и обогащаем fixed_pages (url, task_id) для трекинга.

-- page_analysis: связь с аудитом
alter table public.page_analysis
  add column if not exists audit_id uuid;

create index if not exists idx_page_analysis_audit_id
  on public.page_analysis (audit_id);

-- fixed_pages: исходный URL страницы
alter table public.fixed_pages
  add column if not exists url text;

create index if not exists idx_fixed_pages_url
  on public.fixed_pages (url);

-- fixed_pages: id фоновой задачи оптимизации
alter table public.fixed_pages
  add column if not exists task_id text;
