-- Обращения с публичной формы «Контакты»
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  source text default 'contact_form',
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Любой посетitель может оставить обращение (вставка), но не читать чужие
drop policy if exists "public can submit contact" on public.contact_messages;
create policy "public can submit contact"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

grant insert on public.contact_messages to anon, authenticated;
grant all on public.contact_messages to service_role;

create index if not exists idx_contact_messages_created_at on public.contact_messages (created_at desc);
create index if not exists idx_contact_messages_status on public.contact_messages (status);
