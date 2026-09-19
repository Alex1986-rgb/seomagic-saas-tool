import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Готовые отчёты пользователя.
 *
 * Раньше здесь были вписаны два отчёта — «SEO Отчет - example.com, 2.4 MB» и
 * «Анализ позиций - Декабрь 2024, 1.8 MB», — а кнопка «Скачать» ничего не
 * делала. Теперь список берётся из таблицы `pdf_reports`, а кнопка отдаёт файл
 * из хранилища.
 *
 * Список фильтруем по user_id явно: политика чтения пропускает и записи без
 * владельца (гостевые аудиты), и без фильтра любой вошедший видел чужие отчёты.
 * Скачивание идёт через edge-функцию `report-download`: бакет с отчётами
 * закрытый, подписанную ссылку из браузера он не выдаёт — раньше кнопка всегда
 * заканчивалась ошибкой.
 */

interface ReportRow {
  id: string;
  report_title: string | null;
  url: string | null;
  file_path: string | null;
  file_size: number | null;
  created_at: string;
}

const CONTENT_TYPES: Record<string, string> = {
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  pdf: 'application/pdf',
};

const extensionOf = (filePath: string): string =>
  (filePath.split('.').pop() || 'html').toLowerCase();

/**
 * supabase.functions.invoke сам разбирает ответ по Content-Type: PDF приходит
 * Blob-ом, HTML и XML — строкой, JSON — уже разобранным объектом. Собираем из
 * любого варианта файл для скачивания.
 */
const toBlob = (data: unknown, extension: string): Blob | null => {
  const type = CONTENT_TYPES[extension] ?? 'application/octet-stream';
  if (data instanceof Blob) return data;
  if (typeof data === 'string') return new Blob([data], { type });
  if (data && typeof data === 'object') return new Blob([JSON.stringify(data, null, 2)], { type });
  return null;
};

/** Текст ошибки функции полезнее общего «Edge Function returned a non-2xx». */
const readFunctionError = async (err: unknown): Promise<string | null> => {
  const context = (err as { context?: Response } | null)?.context;
  if (!context || typeof context.json !== 'function') return null;
  try {
    const body = await context.json();
    return typeof body?.error === 'string' ? body.error : null;
  } catch {
    return null;
  }
};

const formatSize = (bytes: number | null): string => {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} МБ` : `${Math.round(bytes / 1024)} КБ`;
};

const ClientReports: React.FC = () => {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user.user?.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase
      .from('pdf_reports')
      .select('id, report_title, url, file_path, file_size, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) setError(queryError.message);
        else setReports((data ?? []) as ReportRow[]);
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  const handleDownload = async (report: ReportRow) => {
    if (!report.file_path) {
      toast({
        title: 'Файл недоступен',
        description: 'Отчёт ещё не сохранён в хранилище.',
        variant: 'destructive',
      });
      return;
    }

    setDownloadingId(report.id);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('report-download', {
        body: { report_id: report.id },
      });

      if (invokeError) {
        throw new Error((await readFunctionError(invokeError)) ?? invokeError.message);
      }

      const extension = extensionOf(report.file_path);
      const blob = toBlob(data, extension);
      if (!blob) throw new Error('Сервер вернул пустой файл.');

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `seo-report-${report.id}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Сразу отзывать ссылку нельзя: часть браузеров ещё не начала скачивание.
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      toast({
        title: 'Не удалось скачать отчёт',
        description: err instanceof Error ? err.message : 'Файл не найден в хранилище.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg md:text-xl font-semibold">Отчёты</h3>

      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Загружаем список отчётов...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          Не удалось получить отчёты: {error}
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-muted-foreground">Отчётов пока нет.</p>
          <Button asChild className="mt-4">
            <Link to="/audit">Проверить сайт</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-8 w-8 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">
                        {report.report_title || report.url || 'Отчёт по аудиту'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString('ru-RU')}
                        {report.file_size ? ` • ${formatSize(report.file_size)}` : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(report)}
                    disabled={downloadingId === report.id}
                  >
                    {downloadingId === report.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Скачать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientReports;
