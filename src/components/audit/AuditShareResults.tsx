import React, { useState } from 'react';
import { Share2, Copy, Mail, Download, FileJson, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface AuditShareResultsProps {
  auditId?: string;
}

const AuditShareResults: React.FC<AuditShareResultsProps> = ({ auditId }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на результаты аудита скопирована в буфер обмена",
    });
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent("Результаты SEO аудита");
    const body = encodeURIComponent(`Посмотрите результаты SEO аудита: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  const handleDownloadPDF = () => {
    setIsExporting(true);
    
    // Имитация загрузки PDF (в реальном проекте здесь будет API вызов)
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Отчёт сохранён",
        description: "PDF-отчёт успешно сохранён на ваше устройство",
      });
    }, 2000);
  };
  
  const handleExportJSON = () => {
    setIsExporting(true);
    
    // Имитация экспорта JSON (в реальном проекте здесь будет API вызов)
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Данные экспортированы",
        description: "JSON-файл с данными аудита успешно сохранён",
      });
    }, 1500);
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center gap-2 mt-8 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-muted-foreground text-sm mb-2">Поделиться результатами аудита {auditId ? `#${auditId}` : ''}</p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleCopyLink}
        >
          <Copy className="h-4 w-4" />
          <span>Копировать ссылку</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleEmailShare}
        >
          <Mail className="h-4 w-4" />
          <span>Отправить на почту</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              <span>Экспортировать</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg">
            <DropdownMenuItem onClick={handleDownloadPDF} className="cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              Скачать PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer">
              <FileJson className="h-4 w-4 mr-2" />
              Экспортировать JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default AuditShareResults;
