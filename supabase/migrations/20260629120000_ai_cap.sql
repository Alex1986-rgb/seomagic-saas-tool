-- Жёсткий дневной cap на платные AI-функции (#2, усиление rate_limit).
-- Дополняет 20260628140000_rate_limit.sql: per-IP оконный лимит остаётся в check_rate_limit(),
-- а здесь — отдельная атомарная функция глобального дневного потолка, которая
-- возвращает СТРУКТУРУ (allowed + count + limit), чтобы edge-функция могла
-- отличать «превышен лимит» от «ошибка лимитера» и логировать остаток бюджета.
-- Аддитивно: ничего не ломает, переиспользует существующую таблицу api_rate_limits.

-- Гарантируем наличие таблицы (если миграция применяется отдельно).
create table if not exists public.api_rate_limits (
  identifier   text        not null,
  endpoint     text        not null,
  window_start timestamptz not null,
  count        int         not null default 0,
  primary key (identifier, endpoint, window_start)
);

alter table public.api_rate_limits enable row level security;
grant all on public.api_rate_limits to service_role;

-- Атомарный инкремент дневного окна с возвратом текущего значения.
-- Окно жёстко суточное (86400с). Инкремент происходит только если лимит ещё не достигнут,
-- т.е. отклонённые запросы НЕ раздувают счётчик и не сдвигают потолок (детерминированный cap).
create or replace function public.check_global_cap(
  p_endpoint text,
  p_limit    int
) returns table (allowed boolean, used int, cap int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / 86400) * 86400);
  v_count  int;
begin
  -- Атомарно: пытаемся занять слот только если текущее значение < лимита.
  insert into public.api_rate_limits (identifier, endpoint, window_start, count)
  values ('global', p_endpoint, v_window, 1)
  on conflict (identifier, endpoint, window_start)
  do update set count = api_rate_limits.count + 1
    where api_rate_limits.count < p_limit
  returning count into v_count;

  if v_count is null then
    -- conflict был, но WHERE не пропустил инкремент => уже на потолке.
    select count into v_count
      from public.api_rate_limits
     where identifier = 'global' and endpoint = p_endpoint and window_start = v_window;
    return query select false, coalesce(v_count, p_limit), p_limit;
    return;
  end if;

  return query select (v_count <= p_limit), v_count, p_limit;
end;
$$;

grant execute on function public.check_global_cap(text, int) to anon, authenticated, service_role;
