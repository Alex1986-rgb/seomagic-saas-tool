import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetProject } from '../project';
import { Dialog, Empty, ErrorNote, Loading, MUTED, NotConnected, Screen, Seg, TableFrame, Tag } from '../ui';
import { dateShort, hostOf } from '../format';
import { extensionOf, formatBytes, readFunctionError, saveBlob, toBlob } from '../analytics/files';

/**
 * «Отчёты» — макет, строки 1496–1530.
 *
 * Список — таблица pdf_reports (свои записи, отфильтрованные по хосту проекта). Пишут её две
 * функции: pdf-report-generate (HTML-отчёт аудита со сметой, запускается сервером после расчёта
 * сметы — пользователь вызвать её не может) и report-generate (JSON/XML по запросу). Скачивание —
 * через report-download: бакеты закрытые, прямую ссылку браузер не получит.
 *
 * Формат в таблице — настоящее расширение файла. Макет подписывает отчёт «PDF», но сервер
 * сохраняет HTML для печати; назвать его PDF — пообещать то, чего нет. XLSX («список проблем»,
 * «позиции за месяц») не генерирует ни одна функция — в форме это «не подключено».
 *
 * Срок хранения в подзаголовок не выносим: функция очистки (90 дней) в базе есть, но по
 * расписанию не запускается, а «12 месяцев» макета ничем не обеспечены.
 *
 * Фильтр user_id обязателен: в истории политик pdf_reports был доступ на чтение всем.
 */

interface ReportRow {
  id: string;
  report_title: string | null;
  url: string;
  file_path: string;
  file_size: number | null;
  created_at: string | null;
}

type GenFormat = 'json' | 'xml' | 'sitemap';

function titleOf(r: ReportRow): { title: string; forClient: boolean } {
  const ext = extensionOf(r.file_path);
  if (ext === 'html') return { title: 'Аудит со сметой', forClient: true };
  if (ext === 'json') return { title: `Данные аудита ${hostOf(r.url)}`, forClient: false };
  if (ext === 'xml') return { title: 'Сводка аудита для разработчиков', forClient: false };
  return { title: r.report_title || 'Отчёт', forClient: false };
}

const Reports: React.FC = () => {
  const { userId, host, project, loading: projectLoading, error: projectError } = useCabinetProject();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<GenFormat>('json');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [sitemapUrl, setSitemapUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId || !host) {
      setReports([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: qErr } = await supabase
      .from('pdf_reports')
      .select('id, report_title, url, file_path, file_size, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(200);
    if (qErr) setError(qErr.message);
    // Проекта-таблицы нет: отчёты к проекту относим по хосту адреса аудита.
    else setReports(((data ?? []) as ReportRow[]).filter((r) => hostOf(r.url) === host));
    setLoading(false);
  }, [userId, host]);

  useEffect(() => {
    void load();
  }, [load]);

  const download = async (r: ReportRow) => {
    setDownloading(r.id);
    setDownloadError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('report-download', { body: { report_id: r.id } });
      if (invokeError) throw new Error((await readFunctionError(invokeError)) ?? invokeError.message);
      const ext = extensionOf(r.file_path) || 'html';
      const blob = toBlob(data, ext);
      if (!blob) throw new Error('Сервер вернул пустой файл');
      saveBlob(blob, `seomarket-${hostOf(r.url)}-${r.id.slice(0, 8)}.${ext}`);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Не удалось скачать отчёт');
    } finally {
      setDownloading(null);
    }
  };

  // Функции отчётов принимают id задачи обхода (audit_tasks), а проект знает id аудита — ищем
  // задачу последнего завершённого аудита. Фильтр по user_id — из-за гостевых задач в RLS.
  const generate = async () => {
    const audit = project?.lastCompleted;
    if (!audit || !userId) return;
    setGenerating(true);
    setGenError(null);
    setSitemapUrl(null);
    try {
      const { data: task, error: tErr } = await supabase
        .from('audit_tasks')
        .select('id')
        .eq('audit_id', audit.id)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (tErr) throw new Error(tErr.message);
      if (!task) throw new Error('Не нашли задачу обхода для последнего аудита');

      if (format === 'sitemap') {
        const { data, error: invokeError } = await supabase.functions.invoke('sitemap-export', {
          body: { task_id: task.id, format: 'xml' },
        });
        if (invokeError) throw new Error((await readFunctionError(invokeError)) ?? invokeError.message);
        if (!data?.success || !data?.url) throw new Error(data?.error ?? 'Карта сайта не сформирована');
        // Карта лежит в публичном бакете и в pdf_reports не записывается — отдаём ссылку здесь же.
        setSitemapUrl(data.url as string);
      } else {
        const { data, error: invokeError } = await supabase.functions.invoke('report-generate', {
          body: { task_id: task.id, format },
        });
        if (invokeError) throw new Error((await readFunctionError(invokeError)) ?? invokeError.message);
        if (!data?.success) throw new Error(data?.error ?? 'Отчёт не сформирован');
        setOpen(false);
        await load();
      }
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Не удалось сформировать отчёт');
    } finally {
      setGenerating(false);
    }
  };

  if (projectLoading) return <Screen maxWidth={1000}><Loading /></Screen>;
  if (projectError) return <Screen maxWidth={1000}><ErrorNote>{projectError}</ErrorNote></Screen>;

  const canGenerate = !!project?.lastCompleted;

  return (
    <Screen maxWidth={1000}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 style={{ fontSize: 36, margin: '0 0 4px' }}>Отчёты</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
            Выгрузки для заказчика и для разработчиков{host ? ` по ${host}` : ''}.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canGenerate}
          title={canGenerate ? undefined : 'Нужен завершённый аудит'}
          onClick={() => {
            setGenError(null);
            setSitemapUrl(null);
            setOpen(true);
          }}
        >
          Сформировать отчёт
        </button>
      </div>

      {!host ? (
        <Empty title="Отчётов пока нет" action={<Link to="/app/audit" className="btn btn-primary">Запустить аудит</Link>}>
          Отчёты появляются после первого завершённого аудита.
        </Empty>
      ) : loading ? (
        <Loading label="Загружаем отчёты…" />
      ) : error ? (
        <ErrorNote>Не удалось загрузить отчёты: {error}</ErrorNote>
      ) : reports.length === 0 ? (
        <Empty title="Отчётов пока нет">
          Отчёт аудита со сметой сохраняется автоматически после расчёта сметы. Данные аудита в JSON или XML можно
          сформировать кнопкой выше.
        </Empty>
      ) : (
        <TableFrame minWidth={700}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Название</th>
              <th>Формат</th>
              <th>Размер</th>
              <th>Создан</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => {
              const { title, forClient } = titleOf(r);
              return (
                <tr key={r.id} data-row>
                  <td style={{ fontSize: 14 }}>
                    {title}
                    {forClient && (
                      <Tag tone="outline" style={{ marginLeft: 6 }}>
                        для заказчика
                      </Tag>
                    )}
                  </td>
                  <td>
                    <Tag>{(extensionOf(r.file_path) || '—').toUpperCase()}</Tag>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatBytes(r.file_size)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{dateShort(r.created_at)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ fontSize: 13 }}
                      disabled={downloading === r.id}
                      onClick={() => void download(r)}
                    >
                      {downloading === r.id ? 'Скачиваем…' : 'Скачать'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableFrame>
      )}
      {downloadError && <ErrorNote>Не удалось скачать отчёт: {downloadError}</ErrorNote>}

      <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)', minWidth: 0 }}>
        <h2 style={{ fontSize: 18, margin: '0 0 var(--space-3)' }}>Регулярная отправка</h2>
        {/* Кнопки «Изменить расписание / Отключить» макета управлять нечем: расписания отчётов,
            списка получателей и планировщика рассылки в базе нет. */}
        <NotConnected
          title="Ежемесячная рассылка отчёта не подключена"
          needs={[
            'Таблица расписаний: проект, получатели, день отправки, включено ли.',
            'Задание по расписанию (pg_cron), которое собирает сводку и отправляет её через send-email.',
            'Сводный отчёт за месяц (позиции + аудит) — сейчас такой функции нет.',
          ]}
        >
          Сейчас отчёты формируются и скачиваются вручную.
        </NotConnected>
      </section>

      <Dialog
        open={open}
        title="Сформировать отчёт"
        onClose={() => !generating && setOpen(false)}
        width={520}
        actions={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} disabled={generating}>
              Закрыть
            </button>
            <button type="button" className="btn btn-primary" onClick={() => void generate()} disabled={generating || !canGenerate}>
              {generating ? 'Формируем…' : 'Сформировать'}
            </button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>
            По последнему завершённому аудиту{project?.lastCompleted ? ` от ${dateShort(project.lastCompleted.createdAt)}` : ''}.
          </p>
          <div className="field">
            <label>Что выгрузить</label>
            <Seg<GenFormat>
              name="report-format"
              value={format}
              onChange={setFormat}
              options={[
                { value: 'json', label: 'Данные, JSON' },
                { value: 'xml', label: 'Сводка, XML' },
                { value: 'sitemap', label: 'Карта сайта, XML' },
              ]}
            />
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: MUTED, display: 'grid', gap: 4 }}>
            <li>Отчёт для заказчика со сметой (HTML для печати в PDF) сохраняется автоматически после расчёта сметы.</li>
            <li>Карта сайта — страницы с ответом 200 без запрета индексации; открывается по ссылке, в список не попадает.</li>
            <li>XLSX со списком проблем и позициями не подключён.</li>
          </ul>
          {sitemapUrl && (
            <a href={sitemapUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13.5 }}>
              Открыть карту сайта
            </a>
          )}
          {genError && <ErrorNote>{genError}</ErrorNote>}
        </div>
      </Dialog>
    </Screen>
  );
};

export default Reports;
