import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send } from "lucide-react";
import NotCollectedNotice from "@/components/admin/NotCollectedNotice";
import { supabase } from "@/integrations/supabase/client";
import PageSeo from '@/components/seo/PageSeo';

/** Текст ошибки из ответа функции полезнее общего «non-2xx status code». */
async function readFunctionError(error: unknown): Promise<string | null> {
  const context = (error as { context?: Response } | null)?.context;
  if (!context || typeof context.json !== 'function') return null;
  try {
    const body = await context.json();
    return typeof body?.error === 'string' ? body.error : null;
  } catch {
    return null;
  }
}

/**
 * Настройки почты.
 *
 * Раньше здесь были поля SMTP-сервера и пароля, выбор SendGrid/Mailgun, кнопка
 * «Сохранить настройки» без обработчика, список шаблонов со статусами «Активен»
 * и кнопка «Отправить тест», которая через две секунды таймера отвечала
 * «Тестовое письмо успешно отправлено», ничего не отправляя. Неработающая почта
 * так и оставалась незамеченной.
 *
 * Письма сервис отправляет edge-функцией send-email через Resend, ключ
 * RESEND_API_KEY лежит в секретах проекта. Проверка теперь вызывает эту
 * функцию и шлёт письмо на адрес, под которым вошёл администратор; успех
 * показываем только по ответу функции.
 */
type TestStatus =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'success'; to: string }
  | { state: 'error'; message: string };

const EmailSettingsPage = () => {
  const [status, setStatus] = React.useState<TestStatus>({ state: 'idle' });

  const handleTestEmail = async () => {
    setStatus({ state: 'sending' });
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const to = userData?.user?.email;
      if (userError || !to) {
        setStatus({ state: 'error', message: 'Не удалось узнать адрес: войдите в аккаунт с почтой.' });
        return;
      }

      // Текст письма собирает сервер: готовые html и text функция больше не
      // принимает, без задачи она шлёт фиксированное тестовое письмо — и только
      // по запросу пользователя с ролью admin.
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject: 'Проверка отправки писем SeoMarket',
        },
      });

      if (error) {
        const serverMessage = await readFunctionError(error);
        setStatus({ state: 'error', message: serverMessage || error.message || 'Функция отправки вернула ошибку' });
        return;
      }
      if (!data?.success) {
        setStatus({ state: 'error', message: data?.error || 'Функция отправки не подтвердила отправку' });
        return;
      }
      setStatus({ state: 'success', to });
    } catch (err) {
      setStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'Не удалось вызвать функцию отправки',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <PageSeo
        title="Настройки почты: как отправляются письма и проверка доставки"
        description="Письма сервиса уходят через серверную функцию и почтовый сервис Resend; здесь можно отправить себе тестовое письмо и проверить, что отправка работает."
        noindex
      />
      <h2 className="text-2xl font-bold mb-3">Настройки почты</h2>

      <NotCollectedNotice
        className="mb-6"
        title="Почта настраивается не здесь"
        description="Поля SMTP, выбор провайдера и шаблоны писем на этой странице ничего не сохраняли и убраны. Как устроено на самом деле:"
        items={[
          "письма сервиса отправляет серверная функция send-email через почтовый сервис Resend",
          "ключ Resend (RESEND_API_KEY) хранится в секретах проекта Supabase, в браузер не вводится",
          "письма входа, подтверждения почты и сброса пароля шлёт Supabase Auth — их шаблоны в панели Supabase, раздел Authentication",
        ]}
      />

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-medium">Проверка отправки</h3>
            <p className="text-sm text-muted-foreground">
              Отправит настоящее письмо на адрес, под которым вы вошли. Успех покажется, только
              если функция отправки его подтвердит. Проверка работает только у пользователя с
              ролью admin — остальным функция откажет.
            </p>
          </div>

          {status.state === 'success' && (
            <Alert className="bg-green-500/10 border-green-500/20">
              <AlertDescription className="text-green-600">
                Функция отправки приняла письмо для {status.to}. Проверьте ящик, в том числе папку «Спам».
              </AlertDescription>
            </Alert>
          )}
          {status.state === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>Письмо не отправлено: {status.message}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleTestEmail}
            variant="outline"
            disabled={status.state === 'sending'}
            className="flex gap-2"
          >
            {status.state === 'sending' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {status.state === 'sending' ? 'Отправка...' : 'Отправить тестовое письмо себе'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSettingsPage;
