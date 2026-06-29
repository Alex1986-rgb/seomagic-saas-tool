-- Заказы на оптимизацию «под ключ». Создаются ТОЛЬКО через edge-функции (service_role):
-- сумма считается на сервере, клиент её не задаёт. Провайдер подключается позже (ЮKassa/Stripe).
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  service text not null default 'full',          -- full | fix | seo-text
  pages integer not null default 0,
  amount integer not null default 0,             -- сумма к оплате, в рублях (целое)
  currency text not null default 'RUB',
  status text not null default 'pending',        -- pending | paid | failed | canceled | refunded
  provider text not null default 'none',         -- none | yookassa | stripe | cloudpayments
  provider_payment_id text,                      -- id платежа у провайдера
  confirmation_url text,                         -- куда редиректить на оплату
  customer_email text,
  audit_id uuid,
  optimization_id uuid,
  score_before integer,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.orders enable row level security;

-- Прямого доступа anon/authenticated НЕТ: всё через edge-функции с service_role.
-- (RLS включён, политик для anon нет → прямые запросы из браузера запрещены.)
grant all on public.orders to service_role;

create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_provider_payment on public.orders (provider_payment_id);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_email on public.orders (customer_email);
