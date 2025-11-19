import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Loader2, X } from 'lucide-react';
import { OptimizationItem } from '@/types/audit/optimization-types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailEstimateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: OptimizationItem[];
  totals: {
    subtotal: number;
    discount: number;
    final: number;
  };
  url: string;
}

const EmailEstimateDialog: React.FC<EmailEstimateDialogProps> = ({
  isOpen,
  onOpenChange,
  items,
  totals,
  url
}) => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [emails, setEmails] = useState<string[]>(['']);
  const [message, setMessage] = useState('');
  const [attachPdf, setAttachPdf] = useState(true);
  const [attachExcel, setAttachExcel] = useState(false);
  const [createPublicLink, setCreatePublicLink] = useState(true);

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSend = async () => {
    const validEmails = emails.filter(e => e.trim() && e.includes('@'));
    
    if (validEmails.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Добавьте хотя бы один email',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-estimate-email', {
        body: {
          to_emails: validEmails,
          estimate_data: items,
          totals,
          url,
          message: message || undefined,
          attach_pdf: attachPdf,
          attach_excel: attachExcel,
          create_public_link: createPublicLink
        }
      });

      if (error) throw error;

      toast({
        title: 'Отправлено',
        description: `Смета отправлена на ${validEmails.length} ${validEmails.length === 1 ? 'адрес' : 'адресов'}`
      });

      onOpenChange(false);
      setEmails(['']);
      setMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Ошибка отправки',
        description: 'Не удалось отправить смету по email',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Отправить смету по email
          </DialogTitle>
          <DialogDescription>
            Отправьте смету клиентам или коллегам
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Email получателей</Label>
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="client@example.com"
                />
                {emails.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveEmail(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddEmail}
              className="w-full"
            >
              + Добавить email
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Личное сообщение (опционально)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Здравствуйте! Отправляю смету на SEO-оптимизацию вашего сайта..."
              rows={3}
            />
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <Label className="text-sm font-medium">Вложения</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attach-pdf"
                checked={attachPdf}
                onCheckedChange={(checked) => setAttachPdf(checked as boolean)}
              />
              <label
                htmlFor="attach-pdf"
                className="text-sm cursor-pointer"
              >
                Прикрепить PDF отчет
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="attach-excel"
                checked={attachExcel}
                onCheckedChange={(checked) => setAttachExcel(checked as boolean)}
              />
              <label
                htmlFor="attach-excel"
                className="text-sm cursor-pointer"
              >
                Прикрепить Excel файл
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="create-link"
                checked={createPublicLink}
                onCheckedChange={(checked) => setCreatePublicLink(checked as boolean)}
              />
              <label
                htmlFor="create-link"
                className="text-sm cursor-pointer"
              >
                Включить ссылку на онлайн-просмотр
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending}
              className="flex-1"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Отправить
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailEstimateDialog;