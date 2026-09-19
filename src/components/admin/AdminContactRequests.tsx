import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Receipt } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Заявки с сайта.
 *
 * Форма обратной связи и запрос счёта пишут в таблицу `contact_requests`.
 * Без этого раздела обращения копились бы незамеченными — а именно так и
 * было раньше, когда форма просто писала сообщение в консоль браузера.
 */

interface RequestRow {
  id: string;
  kind: string;
  name: string | null;
  email: string;
  subject: string | null;
  message: string | null;
  site_url: string | null;
  amount: number | null;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Закрыта',
};

const AdminContactRequests: React.FC = () => {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase
      .from('contact_requests')
      .select('id, kind, name, email, subject, message, site_url, amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        else setRequests((data ?? []) as RequestRow[]);
        setIsLoading(false);
      });
  }, []);

  const changeStatus = async (id: string, status: string) => {
    const { error: updateError } = await supabase
      .from('contact_requests')
      .update({ status })
      .eq('id', id);

    if (updateError) {
      toast({
        title: 'Не удалось изменить статус',
        description: updateError.message,
        variant: 'destructive',
      });
      return;
    }

    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Загружаем заявки...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
        Не удалось получить заявки: {error}
        <p className="mt-2 text-muted-foreground">
          Если таблицы ещё нет — выполните миграции из <code>docs/sql</code>.
        </p>
      </div>
    );
  }

  const newCount = requests.filter((item) => item.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Заявки с сайта</h1>
          <p className="text-sm text-muted-foreground">
            Обращения из формы обратной связи и запросы счёта на оптимизацию
          </p>
        </div>
        {newCount > 0 && <Badge>{newCount} новых</Badge>}
      </div>

      {requests.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Заявок пока нет.
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {request.kind === 'invoice' ? (
                      <Receipt className="h-4 w-4 text-primary" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                    {request.kind === 'invoice' ? 'Запрос счёта' : 'Обращение'}
                    {request.subject ? `: ${request.subject}` : ''}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={request.status === 'new' ? 'default' : 'outline'}>
                      {STATUS_LABELS[request.status] ?? request.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleString('ru-RU')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid gap-1 sm:grid-cols-2">
                  <p>
                    <span className="text-muted-foreground">От кого: </span>
                    {request.name ? `${request.name}, ` : ''}
                    <a href={`mailto:${request.email}`} className="text-primary hover:underline">
                      {request.email}
                    </a>
                  </p>
                  {request.site_url && (
                    <p className="break-all">
                      <span className="text-muted-foreground">Сайт: </span>
                      {request.site_url}
                    </p>
                  )}
                  {request.amount !== null && (
                    <p>
                      <span className="text-muted-foreground">Сумма по смете: </span>
                      {Number(request.amount).toLocaleString('ru-RU')} ₽
                    </p>
                  )}
                </div>

                {request.message && (
                  <p className="whitespace-pre-wrap rounded-md bg-muted/40 p-3">{request.message}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {request.status !== 'in_progress' && (
                    <Button size="sm" variant="outline" onClick={() => changeStatus(request.id, 'in_progress')}>
                      Взять в работу
                    </Button>
                  )}
                  {request.status !== 'done' && (
                    <Button size="sm" variant="outline" onClick={() => changeStatus(request.id, 'done')}>
                      Закрыть
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContactRequests;
