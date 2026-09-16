import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Готовые отчёты пользователя.
 *
 * Раньше здесь были вписаны два отчёта — «SEO Отчет - example.com, 2.4 MB» и
 * «Анализ позиций - Декабрь 2024, 1.8 MB», — а кнопка «Скачать» ничего не
 * делала. Теперь список берётся из таблицы `pdf_reports`, а кнопка отдаёт файл
 * из хранилища.
 */

interface ReportRow {
  id: string;
  report_title: string | null;
  url: string | null;
  file_path: string | null;
  file_size: number | null;
  created_at: string;
}

const formatSize = (bytes: number | null): string => {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} МБ` : `${Math.round(bytes / 1024)} КБ`;
};

const ClientReports: React.FC = () => {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('pdf_reports')
      .select('id, report_title, url, file_path, file_size, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) setError(queryError.message);
        else setReports((data ?? []) as ReportRow[]);
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const handleDownload = async (report: ReportRow) => {
    if (!report.file_path) {
      toast({
        title: 'Файл недоступен',
        description: 'Отчёт ещё не сохранён в хранилище.',
        variant: 'destructive',
      });
      return;
    }

    const { data, error: downloadError } = await supabase.storage
      .from('reports')
      .createSignedUrl(report.file_path, 60);

    if (downloadError || !data?.signedUrl) {
      toast({
        title: 'Не удалось скачать отчёт',
        description: downloadError?.message ?? 'Файл не найден в хранилище.',
        variant: 'destructive',
      });
      return;
    }

    window.open(data.signedUrl, '_blank', 'noopener');
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
                  <Button size="sm" variant="outline" onClick={() => handleDownload(report)}>
                    <Download className="h-4 w-4 mr-2" />
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
