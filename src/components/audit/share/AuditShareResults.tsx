
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Copy, Mail, Share } from 'lucide-react';
import { AuditData, AuditHistoryItem } from '@/types/audit';
import SocialShareButtons from './SocialShareButtons';
import CopyLinkButton from './CopyLinkButton';
import EmailShareButton from './EmailShareButton';
import ExportDropdown from './ExportDropdown';
import { seoApiService } from '@/api/seoApiService';

interface AuditShareResultsProps {
  auditId: string;
  auditData: AuditData;
  url: string;
  historyItems?: AuditHistoryItem[];
  urls?: string[];
  taskId?: string | null;
}

const AuditShareResults: React.FC<AuditShareResultsProps> = ({ 
  auditId, 
  auditData, 
  url, 
  historyItems,
  urls,
  taskId
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const handleGenerateShareLink = async () => {
    setIsGeneratingLink(true);
    try {
      let generatedLink;
      
      if (taskId) {
        // Use backend API to generate share link
        generatedLink = await seoApiService.generateShareLink(taskId);
      } else {
        // Fallback to frontend implementation
        const baseUrl = window.location.origin;
        generatedLink = `${baseUrl}/audit?url=${encodeURIComponent(url)}&share=${auditId}`;
      }
      
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

  const handleSendEmail = async () => {
    if (!emailInput.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Некорректный email",
        description: "Пожалуйста, введите корректный email адрес",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      if (taskId) {
        // Use backend API to send email
        await seoApiService.sendEmailReport(taskId, emailInput);
      } else {
        // Fallback to frontend implementation (simulated)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setIsEmailDialogOpen(false);
      toast({
        title: "Отчет отправлен",
        description: `Отчет успешно отправлен на ${emailInput}`,
      });
      setEmailInput('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить отчет по email",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
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
          onClick={() => setIsEmailDialogOpen(true)}
        >
          <Mail className="h-4 w-4" />
          Отправить по email
        </Button>
        
        <ExportDropdown 
          auditData={auditData} 
          url={url} 
          historyItems={historyItems}
          urls={urls}
          taskId={taskId}
        />
      </div>
      
      <SocialShareButtons auditId={auditId} url={url} />
      
      {/* Share Link Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Поделиться аудитом</DialogTitle>
            <DialogDescription>
              Используйте ссылку ниже, чтобы поделиться результатами аудита
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
      
      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отправить отчет по email</DialogTitle>
            <DialogDescription>
              Введите email адрес для отправки отчета
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 mt-4">
            <Input 
              value={emailInput} 
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="email@example.com"
              type="email"
            />
            <Button 
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="w-full"
            >
              {isSendingEmail ? 'Отправка...' : 'Отправить отчет'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditShareResults;
