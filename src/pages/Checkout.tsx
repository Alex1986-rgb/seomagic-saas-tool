import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, isDemoMode } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard, Check, Loader2, Copy, Wrench, FileArchive,
  Globe, RefreshCw, Send, Download, ShieldCheck, Sparkles,
} from 'lucide-react';

/**
 * Страница оформления исправления сайта «под ключ».
 * Демонстрирует полный пайплайн: оплата → копия → авто-исправление → ZIP →
 * демо на поддомене → повторный аудит → доставка клиенту.
 * Платёж пока в демо-режиме (реальный провайдер подключается отдельно).
 */

const STEPS = [
  { icon: Copy, title: 'Создание копии сайта', desc: 'Клонируем все страницы и ассеты' },
  { icon: Wrench, title: 'Оптимизация по всем параметрам', desc: 'Мета-теги, структура, скорость, ссылки' },
  { icon: Sparkles, title: 'Наполнение SEO-текстами', desc: 'SEO-блоки с таблицами на каждой странице' },
  { icon: FileArchive, title: 'Сборка ZIP-архива', desc: 'Упаковываем готовый сайт' },
  { icon: Globe, title: 'Деплой демо на поддомен', desc: 'Поднимаем превью для проверки' },
  { icon: RefreshCw, title: 'Повторный аудит', desc: 'Проверяем рост оценки' },
  { icon: Send, title: 'Отправка клиенту', desc: 'Письмо со ссылкой и архивом' },
];

const Checkout: React.FC = () => {
  const [params] = useSearchParams();
  const { toast } = useToast();

  const site = params.get('url') || 'zavod-red.ru';
  const pages = Number(params.get('pages') || 75);
  const isFull = params.get('service') === 'full'; // полная оптимизация: исправление + SEO-тексты
  // Цены синхронизированы с сервером (payment-create): опт. 120 ₽/стр, SEO-текст 250 ₽/стр.
  const perPage = isFull ? 370 : (params.get('service') === 'seo-text' ? 250 : 120);
  const totalParam = Number(params.get('total') || 0);
  const total = totalParam > 0 ? totalParam : pages * perPage;
  const scoreBefore = Number(params.get('score') || 98);
  const scoreAfter = 100;

  const [phase, setPhase] = useState<'order' | 'running' | 'done'>('order');
  const [activeStep, setActiveStep] = useState(-1);
  const [ordering, setOrdering] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(params.get('order'));

  // Возврат с провайдера оплаты (?order=<id>) — проверяем статус заказа.
  useEffect(() => {
    const oid = params.get('order');
    if (!oid || isDemoMode) return;
    (async () => {
      try {
        const { data } = await supabase.functions.invoke('order-status', { body: { orderId: oid } });
        if (data?.order?.status === 'paid') { setPhase('running'); runPipeline(); }
      } catch { /* заказ не найден — остаёмся на форме */ }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Создание заказа: в демо без бэкенда — сразу визуализация; иначе payment-create.
  const createOrder = async () => {
    if (isDemoMode) { runPipeline(); return; }
    setOrdering(true);
    try {
      const { data, error } = await supabase.functions.invoke('payment-create', {
        body: { url: site, service: isFull ? 'full' : 'fix', pages, score_before: scoreBefore, task_id: params.get('task_id') || undefined },
      });
      if (error || !data?.success) throw new Error(data?.error || error?.message || 'Ошибка создания заказа');
      setOrderId(data.orderId);
      if (data.confirmationUrl) { window.location.href = data.confirmationUrl; return; } // редирект на оплату
      // провайдер не подключён (демо-режим бэкенда): заказ создан, показываем пайплайн как превью
      toast({ title: `Заказ создан №${String(data.orderId).slice(0, 8)}`, description: 'Платёжный провайдер ещё не подключён — показываем демо результата.' });
      runPipeline();
    } catch (e) {
      toast({ title: 'Не удалось оформить', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setOrdering(false);
    }
  };

  const runPipeline = () => {
    setPhase('running');
    setActiveStep(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < STEPS.length) {
        setActiveStep(i);
        window.setTimeout(tick, 1100);
      } else {
        setActiveStep(STEPS.length);
        window.setTimeout(() => setPhase('done'), 900);
      }
    };
    window.setTimeout(tick, 1100);
  };

  const fmt = (n: number) => n.toLocaleString('ru-RU');

  return (
    <Layout>
      <SEO
        title="Оплата и исправление сайта под ключ | SeoMarket"
        description="Оплатите исправление найденных SEO-ошибок — система автоматически создаст копию сайта, исправит код, развернёт демо, проведёт повторный аудит и пришлёт готовый сайт."
        canonicalUrl="/checkout"
        keywords="исправление SEO ошибок, оптимизация сайта под ключ, заказать SEO"
      />
      <div className="container mx-auto px-4 pt-32 pb-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {isFull ? 'Полная оптимизация сайта «под ключ»' : 'Исправление сайта «под ключ»'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isFull
            ? 'Оптимизируем сайт по всем параметрам — технические ошибки, мета-теги, структура, скорость и SEO-тексты с таблицами на каждой странице, — чтобы ваш сайт вышел в топ Яндекса и Google.'
            : 'Оплатите — и система сама исправит найденные ошибки, развернёт демо, перепроверит и пришлёт готовый сайт.'}
        </p>

        {/* СВОДКА ЗАКАЗА */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Ваш заказ</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Сайт</span>
              <span className="font-medium">{site}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Услуга</span>
              <span className="font-medium">{isFull ? 'Оптимизация по всем параметрам + SEO-тексты' : 'Исправление SEO-ошибок'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Страниц в работе</span>
              <span className="font-medium">{pages}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-semibold">Итого</span>
              <span className="text-2xl font-bold text-primary">{fmt(total)} ₽</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Демо до оплаты · возврат, если позиции не вырастут
            </p>
          </CardContent>
        </Card>

        {/* ОПЛАТА */}
        {phase === 'order' && (
          <Card>
            <CardContent className="p-6 text-center">
              <Button size="lg" className="w-full md:w-auto gap-2" onClick={createOrder} disabled={ordering}>
                {ordering ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                {ordering ? 'Создаём заказ…' : `Оплатить ${fmt(total)} ₽ и исправить`}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Безопасная оплата. Сумма рассчитана по {pages} страницам. {orderId ? `Заказ №${orderId.slice(0, 8)}.` : ''}
              </p>
            </CardContent>
          </Card>
        )}

        {/* ПАЙПЛАЙН */}
        {(phase === 'running' || phase === 'done') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {phase === 'done'
                  ? <><Check className="h-5 w-5 text-green-500" /> Готово!</>
                  : <><Loader2 className="h-5 w-5 animate-spin text-primary" /> Исправляем сайт…</>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={Math.min(100, ((activeStep + 1) / STEPS.length) * 100)} />
              <div className="space-y-3">
                {STEPS.map((s, idx) => {
                  const StepIcon = s.icon;
                  const state = idx < activeStep ? 'done' : idx === activeStep ? 'active' : 'pending';
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full flex-none ${
                        state === 'done' ? 'bg-green-500/15 text-green-500'
                          : state === 'active' ? 'bg-primary/15 text-primary'
                          : 'bg-muted text-muted-foreground'}`}>
                        {state === 'done' ? <Check className="h-4 w-4" />
                          : state === 'active' ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <StepIcon className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${state === 'pending' ? 'text-muted-foreground' : ''}`}>{s.title}</div>
                        <div className="text-xs text-muted-foreground">{s.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {phase === 'done' && (
                <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                  <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-muted-foreground line-through">{scoreBefore}</div>
                      <div className="text-xs text-muted-foreground">было</div>
                    </div>
                    <div className="text-2xl">→</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500">{scoreAfter}</div>
                      <div className="text-xs text-muted-foreground">стало</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" className="gap-2"
                      onClick={() => toast({ title: 'Демо', description: 'В боевом режиме здесь скачивается ZIP исправленного сайта.' })}>
                      <Download className="h-4 w-4" /> Скачать сайт (ZIP)
                    </Button>
                    <Button variant="outline" className="gap-2"
                      onClick={() => toast({ title: 'Демо', description: 'В боевом режиме здесь открывается демо на поддомене.' })}>
                      <Globe className="h-4 w-4" /> Открыть демо
                    </Button>
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Готовый сайт и отчёт отправлены на вашу почту.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Checkout;
