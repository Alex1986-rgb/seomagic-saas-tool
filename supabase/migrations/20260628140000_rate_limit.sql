-- Лёгкий счётчик запросов для защиты платных AI-функций (#2).
-- Атомарный инкремент по окну (identifier+endpoint+window), возвращает «можно ли».
create table if not exists public.api_rate_limits (
  identifier   text        not null,
  endpoint     text        not null,
  window_start timestamptz not null,
  count        int         not null default 0,
  primary key (identifier, endpoint, window_start)
);

alter table public.api_rate_limits enable row level security;
-- доступ только через SECURITY DEFINER функцию; напрямую таблица закрыта
grant all on public.api_rate_limits to service_role;

create or replace function public.check_rate_limit(
  p_identifier text,
  p_endpoint   text,
  p_limit      int,
  p_window_seconds int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_count  int;
begin
  insert into public.api_rate_limits (identifier, endpoint, window_start, count)
  values (p_identifier, p_endpoint, v_window, 1)
  on conflict (identifier, endpoint, window_start)
  do update set count = api_rate_limits.count + 1
  returning count into v_count;
  return v_count <= p_limit;
end;
$$;

grant execute on function public.check_rate_limit(text, text, int, int) to anon, authenticated, service_role;

-- индекс для очистки старых окон
create index if not exists idx_api_rate_limits_window on public.api_rate_limits (window_start);
