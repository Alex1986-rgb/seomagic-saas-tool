-- Один адрес — одна запись в обходе.
--
-- Краулер добавлял каждую найденную ссылку обычной вставкой, надеясь на
-- «ошибку дубля», которой не было: уникальности в таблицах не существовало, а
-- клиент базы исключений не бросает. Сквозные ссылки (меню, подвал) попадали в
-- очередь заново с каждой страницы, сайт обходился по кругу, и в отчёте
-- получалось втрое больше страниц, чем есть на самом деле.

-- Сначала убираем накопленные повторы, оставляя самую раннюю запись.
DELETE FROM public.url_queue q
USING public.url_queue keep
WHERE q.task_id = keep.task_id
  AND q.url = keep.url
  AND q.ctid > keep.ctid;

DELETE FROM public.page_analysis p
USING public.page_analysis keep
WHERE p.task_id = keep.task_id
  AND p.url = keep.url
  AND p.ctid > keep.ctid;

CREATE UNIQUE INDEX IF NOT EXISTS url_queue_task_url_unique
  ON public.url_queue (task_id, url);

CREATE UNIQUE INDEX IF NOT EXISTS page_analysis_task_url_unique
  ON public.page_analysis (task_id, url);

-- «Сжатия нет» и «про сжатие ничего не известно» — разные вещи. Значение по
-- умолчанию превращало непроверенное в замечание, за которое выставлялся счёт.
ALTER TABLE public.page_analysis ALTER COLUMN is_compressed DROP DEFAULT;
