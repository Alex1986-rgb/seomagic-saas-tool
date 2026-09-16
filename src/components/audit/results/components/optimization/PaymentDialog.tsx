import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/card';
import OptimizationPromptTemplates from './OptimizationPromptTemplates';
import { submitContactRequest, SUPPORT_EMAIL } from '@/services/contact/submitRequest';

/**
 * Счёт на оплату оптимизации.
 *
 * Раньше это окно просило номер карты, срок и CVV, ждало полторы секунды и
 * объявляло платёж прошедшим: приём карт не подключён, деньги никуда не шли, а
 * данные карты вводились в форму, которая с ними ничего не умеет. Собирать их
 * нельзя. Теперь окно честно говорит, что онлайн-оплата не подключена, и
 * оставляет заявку на счёт — её видит администратор.
 */

interface PaymentDialogProps {
  url: string;
  optimizationCost: number;
  /**
   * Вызывается после того, как заявка на счёт принята. Это не оплата: окно
   * остаётся открытым с экраном «Заявка принята», а запускать по этому
   * событию оптимизацию нельзя — счёт ещё даже не выставлен.
   */
  onPayment: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onSelectPrompt?: (prompt: string) => void;
  /** Аудит, по которому считалась смета: без него администратор не свяжет заявку с аудитом. */
  taskId?: string | null;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  url,
  optimizationCost,
  onPayment,
  isDialogOpen,
  setIsDialogOpen,
  onSelectPrompt,
  taskId,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [showPromptTemplates, setShowPromptTemplates] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
      setError('Укажите почту, на которую выставить счёт');
      return;
    }

    // Выбранный шаблон — это пожелание к составу работ, поэтому он уходит в
    // заявку вместе с комментарием: иначе администратор его не увидит.
    const message = [
      comment.trim(),
      selectedPrompt ? `Пожелания к оптимизации: ${selectedPrompt}` : '',
    ].filter(Boolean).join('\n\n');

    setSending(true);
    try {
      await submitContactRequest({
        kind: 'invoice',
        name: name || undefined,
        email,
        subject: `Счёт на оптимизацию ${url}`,
        message: message || undefined,
        siteUrl: url,
        amount: optimizationCost,
        taskId: taskId ?? null,
      });
      setSent(true);
      onPayment();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку');
    } finally {
      setSending(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Счёт на оптимизацию</DialogTitle>
          <DialogDescription>
            Оптимизация сайта {url}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/40">
              <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
              <div className="text-sm">
                <p className="font-medium">Заявка принята</p>
                <p className="text-muted-foreground">
                  Счёт на {optimizationCost.toLocaleString('ru-RU')} ₽ придёт на {email}.
                  {SUPPORT_EMAIL ? ` Вопросы — на ${SUPPORT_EMAIL}.` : ''}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Понятно</Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            {onSelectPrompt && (
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Пожелания к оптимизации</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPromptTemplates(!showPromptTemplates)}
                    className="h-8 px-2 text-xs flex items-center gap-1"
                  >
                    {showPromptTemplates ? (
                      <>
                        <ChevronUp className="h-3 w-3" /> Скрыть шаблоны
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" /> Выбрать шаблон оптимизации
                      </>
                    )}
                  </Button>
                </div>

                {showPromptTemplates && (
                  <OptimizationPromptTemplates
                    onSelectPrompt={handleSelectPrompt}
                    className="mb-4"
                  />
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-4 bg-muted/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Сумма по смете:</span>
                  <span className="font-bold">{optimizationCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Оплата картой на сайте пока не подключена. Оставьте почту — пришлём счёт
                  и согласуем состав работ.
                </p>
              </Card>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceEmail">Почта для счёта</Label>
                  <Input
                    id="invoiceEmail"
                    type="email"
                    placeholder="you@company.ru"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceName">Имя или организация</Label>
                  <Input
                    id="invoiceName"
                    placeholder="Необязательно"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceComment">Комментарий</Label>
                  <Input
                    id="invoiceComment"
                    placeholder="Например: нужен счёт на юрлицо"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center text-red-600 text-sm gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={sending}>
                  {sending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <Receipt className="mr-2 h-4 w-4" />
                      Запросить счёт
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
