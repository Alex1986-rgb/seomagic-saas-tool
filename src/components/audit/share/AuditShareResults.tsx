
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Copy, Mail, Share } from 'lucide-react';
import { AuditData, AuditHistoryItem } from '@/types/audit';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import SocialShareButtons from './SocialShareButtons';
import CopyLinkButton from './CopyLinkButton';
import EmailShareButton from './EmailShareButton';
import ExportDropdown from './ExportDropdown';
import { seoApiService } from '@/api/seoApiService';
import { absoluteAuditPageUrl } from '@/modules/audit/utils/auditLinks';

interface AuditShareResultsProps {
  auditId: string;
  auditData: AuditData;
  url: string;
  historyItems?: AuditHistoryItem[];
  urls?: string[];
  taskId?: string | null;
  optimizationItems?: OptimizationItem[];
  optimizationCost?: number;
  pageStats?: any;
}

const AuditShareResults: React.FC<AuditShareResultsProps> = ({ 
  auditId, 
  auditData, 
  url, 
  historyItems,
  urls,
  taskId,
  optimizationItems,
  optimizationCost,
  pageStats
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const { toast } = useToast();

  /**
   * Без задачи аудита ссылку дать не на что. Раньше в этом случае собиралась
   * ссылка от корня домена (на подпути сайта — 404), а если бы и открылась,
   * страница по ней запускала новую проверку вместо показа результатов.
   */
  const buildShareLink = async (): Promise<string | null> => {
    if (!taskId) {
      toast({
        title: "Ссылка пока недоступна",
        description: "Дождитесь окончания аудита — тогда появится ссылка на результаты.",
        variant: "destructive",
      });
      return null;
    }
    return seoApiService.generateShareLink(taskId, url);
  };

  const handleGenerateShareLink = async () => {
    setIsGeneratingLink(true);
    try {
      const generatedLink = await buildShareLink();
      if (!generatedLink) return;

      setShareUrl(generatedLink);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Ошибка генерации ссылки",
        description: "Не удалось сгенерировать ссылку для обмена",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка скопирована в буфер обмена",
    });
  };

  /**
   * Ссылка на результаты — в письме из почтовой программы человека.
   *
   * Раньше здесь было окно «Отправить отчёт по email»: сервис ждал секунду и
   * писал «Отчёт успешно отправлен», а письмо никуда не уходило — отправки
   * отчётов у сервиса нет. Теперь письмо пишет и отправляет сам человек,
   * а мы только подставляем в него ссылку.
   */
  const handleEmailLink = async () => {
    try {
      const link = await buildShareLink();
      if (!link) return;

      const subject = `SEO-аудит сайта ${url}`;
      const body = `Результаты SEO-аудита сайта ${url}:\n${link}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (error) {
      console.error('Error preparing email link:', error);
      toast({
        title: "Не удалось подготовить письмо",
        description: "Скопируйте ссылку через «Создать ссылку» и отправьте её сами",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-8 mb-10">
      <div className="border-t border-border pt-4 mb-4"></div>
      <h2 className="text-xl font-semibold mb-4">Поделиться результатами аудита</h2>
      
      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleGenerateShareLink}
          disabled={isGeneratingLink}
        >
          <Share className="h-4 w-4" />
          {isGeneratingLink ? 'Генерация ссылки...' : 'Создать ссылку'}
        </Button>
        
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleEmailLink}
        >
          <Mail className="h-4 w-4" />
          Отправить ссылку по почте
        </Button>
        
        <ExportDropdown 
          auditData={auditData} 
          url={url} 
          historyItems={historyItems}
          urls={urls}
          taskId={taskId}
          auditId={auditId}
          optimizationItems={optimizationItems}
          optimizationCost={optimizationCost}
          pageStats={pageStats}
        />
      </div>
      
      {/*
        Без shareUrl кнопки соцсетей делились адресом самого сайта, а не
        результатами. Ссылка на результаты есть только у проверки с задачей.
      */}
      {taskId && (
        <SocialShareButtons auditId={auditId} url={url} shareUrl={absoluteAuditPageUrl(url, taskId)} />
      )}
      
      {/* Share Link Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Поделиться аудитом</DialogTitle>
            <DialogDescription>
              Ссылка ведёт на результаты этого аудита. Если аудит запускался из
              аккаунта, открыть результаты сможет только владелец аккаунта.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 mt-4">
            <Input 
              value={shareUrl} 
              readOnly 
              className="flex-1" 
            />
            <Button 
              size="icon" 
              variant="outline" 
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4">
            <SocialShareButtons auditId={auditId} url={url} shareUrl={shareUrl} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditShareResults;
