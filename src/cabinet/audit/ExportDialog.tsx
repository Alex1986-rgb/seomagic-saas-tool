import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, MUTED, Tag } from '../ui';
import { dateShort } from '../format';
import { toCsv, type IssueGroup } from './groups';

/**
 * «Сформировать документ» (макет, строки 2755–2786) для экрана Результатов.
 *
 * Что работает на самом деле:
 *   * CSV — собирается в браузере из тех же данных, что на экране (сводка и/или проблемы с адресами);
 *   * «PDF» — готовый отчёт, который сервер пишет после расчёта сметы (pdf-report-generate).
 *     Файл на самом деле HTML: его открывают и печатают в PDF из браузера — так и подписано.
 * XLSX, смета в документе, логотип клиента и кнопка оплаты в документе в бэкенде не сделаны —
 * пункты видны выключенными, чтобы не обещать и не прятать будущую возможность.
 */

type Format = 'pdf' | 'xlsx' | 'csv';

function download(blob: Blob, name: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export const ExportDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  userId: string | null;
  taskId: string | null;
  host: string;
  date: string | null;
  score: number | null;
  categories: { label: string; score: number | null }[];
  groups: IssueGroup[];
}> = ({ open, onClose, userId, taskId, host, date, score, categories, groups }) => {
  const [format, setFormat] = useState<Format>('csv');
  const [withSummary, setWithSummary] = useState(true);
  const [withIssues, setWithIssues] = useState(true);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Есть ли у аудита готовый серверный отчёт. Только свой: pdf_reports фильтруем по user_id.
  useEffect(() => {
    if (!open || !userId || !taskId) return;
    let alive = true;
    setError(null);
    void supabase
      .from('pdf_reports')
      .select('file_path, created_at')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (alive) setPdfPath(data?.file_path ?? null);
      });
    return () => {
      alive = false;
    };
  }, [open, userId, taskId]);

  const make = async () => {
    setError(null);
    const day = date ? new Date(date).toISOString().slice(0, 10) : 'audit';
    if (format === 'csv') {
      if (!withSummary && !withIssues) {
        setError('Отметьте хотя бы один раздел.');
        return;
      }
      const csv = toCsv({
        host,
        date: dateShort(date),
        score,
        categories: withSummary ? categories : undefined,
        groups: withIssues ? groups : undefined,
      });
      download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `seomarket-${host}-${day}.csv`);
      onClose();
      return;
    }
    if (format === 'pdf' && pdfPath) {
      setBusy(true);
      try {
        const { data, error: dlError } = await supabase.storage.from('pdf-reports').download(pdfPath);
        if (dlError || !data) throw new Error(dlError?.message || 'Файл отчёта не найден');
        const isHtml = pdfPath.endsWith('.html');
        download(new Blob([data], { type: isHtml ? 'text/html' : 'application/pdf' }), `seomarket-${host}-${day}.${isHtml ? 'html' : 'pdf'}`);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось скачать отчёт');
      } finally {
        setBusy(false);
      }
    }
  };

  const off: React.CSSProperties = { opacity: 0.6, cursor: 'not-allowed' };
  const canMake = format === 'csv' || (format === 'pdf' && !!pdfPath);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Сформировать документ"
      actions={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button type="button" className="btn btn-primary" onClick={() => void make()} disabled={!canMake || busy}>
            {busy ? 'Скачиваем…' : 'Сформировать'}
          </button>
        </>
      }
    >
      <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
        <label>Формат</label>
        <div className="seg" role="radiogroup">
          <label className="seg-opt" style={pdfPath ? undefined : off}>
            <input type="radio" name="export-format" checked={format === 'pdf'} disabled={!pdfPath} onChange={() => setFormat('pdf')} /> PDF
          </label>
          <label className="seg-opt" style={off}>
            <input type="radio" name="export-format" checked={false} disabled readOnly /> XLSX
          </label>
          <label className="seg-opt">
            <input type="radio" name="export-format" checked={format === 'csv'} onChange={() => setFormat('csv')} /> CSV
          </label>
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>
          {pdfPath
            ? 'Отчёт сервера сохраняется как HTML-страница: откройте её и сохраните в PDF через печать.'
            : 'Отчёта сервера для этого аудита нет — он собирается после расчёта сметы. XLSX не подключён.'}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        {format === 'csv' ? (
          <>
            <label className="radio">
              <input type="checkbox" checked={withSummary} onChange={(e) => setWithSummary(e.target.checked)} />
              <span className="dot" />
              Сводка и баллы по категориям
            </label>
            <label className="radio">
              <input type="checkbox" checked={withIssues} onChange={(e) => setWithIssues(e.target.checked)} />
              <span className="dot" />
              Список проблем по страницам
            </label>
          </>
        ) : (
          <div style={{ fontSize: 13, color: MUTED }}>Состав отчёта сервера фиксирован: баллы, проблемы и смета, если она посчитана.</div>
        )}
        {[
          'Смета с разбивкой по работам',
          'Логотип клиента вместо нашего',
          'Кнопка «Оплатить» на смете в документе',
        ].map((t) => (
          <label key={t} className="radio" style={{ ...off, flexWrap: 'wrap' }}>
            <input type="checkbox" checked={false} disabled readOnly />
            <span className="dot" />
            {t}
            <Tag tone="outline" style={{ marginLeft: 6 }}>
              не подключено
            </Tag>
          </label>
        ))}
        {error && <div style={{ fontSize: 12.5, color: 'var(--color-critical)' }}>{error}</div>}
      </div>
    </Dialog>
  );
};
