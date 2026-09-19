-- Заявки с сайта: обратная связь и просьба выставить счёт.
--
-- Форма обратной связи писала сообщение в консоль браузера и отвечала
-- «Сообщение отправлено» — обращения не доходили никуда. Форма оплаты собирала
-- номер карты и CVV, хотя платёж не проводился. Обе теперь оставляют заявку
-- здесь: её видит администратор, и ни одно обращение не теряется.

CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'contact' CHECK (kind IN ('contact', 'invoice')),
  name text,
  email text NOT NULL,
  subject text,
  message text,
  -- Для просьбы о счёте: сайт и сумма из сметы.
  site_url text,
  amount numeric,
  task_id uuid,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON public.contact_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON public.contact_requests (status);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Написать может любой посетитель: это форма обратной связи.
DROP POLICY IF EXISTS "Заявку может оставить любой" ON public.contact_requests;
CREATE POLICY "Заявку может оставить любой" ON public.contact_requests
  FOR INSERT WITH CHECK (true);

-- А читать и разбирать — только администратор и сам автор, если он входил.
DROP POLICY IF EXISTS "Заявки читает администратор" ON public.contact_requests;
CREATE POLICY "Заявки читает администратор" ON public.contact_requests
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Заявки разбирает администратор" ON public.contact_requests;
CREATE POLICY "Заявки разбирает администратор" ON public.contact_requests
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
