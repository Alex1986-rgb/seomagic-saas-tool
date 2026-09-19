import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuditList } from '@/modules/audit/hooks/useAuditList';
import { auditPagePath } from '@/modules/audit/utils/auditLinks';

/**
 * История аудитов пользователя.
 *
 * Раньше здесь был вписанный в код список: example.com — 87 баллов и 12 ошибок,
 * shop.example.com — 72, blog.example.com — 94. Человек открывал свой кабинет и
 * видел три чужих сайта, выданных за свои проверки. Теперь список берётся из
 * таблицы `audits` — только записи текущего пользователя (фильтр в
 * auditService.getUserAudits), а когда проверок нет — так и написано.
 *
 * «Открыть» ведёт на конкретную задачу аудита. Раньше ссылка была
 * `/audit?url=...` без номера: открывалась последняя проверка сайта или экран
 * запуска, а нужный аудит, если он был не последним, показать было нельзя.
 */

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  completed: { text: 'Завершён', className: 'bg-green-500/10 text-green-600' },
  partial: { text: 'Частично', className: 'bg-amber-500/10 text-amber-600' },
  failed: { text: 'Ошибка', className: 'bg-red-500/10 text-red-600' },
  pending: { text: 'В очереди', className: 'bg-muted text-muted-foreground' },
  scanning: { text: 'Идёт обход', className: 'bg-blue-500/10 text-blue-600' },
  analyzing: { text: 'Подсчёт оценок', className: 'bg-blue-500/10 text-blue-600' },
};

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const ClientAudits: React.FC = () => {
  const { audits, isLoading, error } = useAuditList();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Загружаем историю проверок...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
        Не удалось получить историю проверок: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg md:text-xl font-semibold">История SEO аудитов</h3>

      {audits.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-muted-foreground">Проверок пока не было.</p>
          <Button asChild className="mt-4">
            <Link to="/audit">Проверить сайт</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {audits.map((audit) => {
            const status = STATUS_LABELS[audit.status] ?? {
              text: audit.status,
              className: 'bg-muted text-muted-foreground',
            };

            return (
              <Card key={audit.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base md:text-lg break-all">{audit.url}</CardTitle>
                    <Badge variant="outline" className={status.className}>{status.text}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Дата</p>
                      <p className="font-medium text-sm md:text-base">{formatDate(audit.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Оценка</p>
                      <p className="font-bold text-lg text-primary">
                        {typeof audit.seo_score === 'number' ? `${audit.seo_score}/100` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Страниц проверено</p>
                      <p className="font-medium text-sm md:text-base">{audit.pages_scanned ?? 0}</p>
                    </div>
                    <div className="flex items-end">
                      <Button asChild size="sm" variant="outline" className="w-full text-xs md:text-sm">
                        <Link to={auditPagePath(audit.url, audit.task_id)}>
                          <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          Открыть
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {audit.error_message && (
                    <p className="mt-3 text-sm text-destructive">{audit.error_message}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientAudits;
