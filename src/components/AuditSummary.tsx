
import React from 'react';
import { ArrowDown, ArrowUp, Download, ExternalLink, Share, TrendingUp, TrendingDown, Minus, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ScoreGauge from './ScoreGauge';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { generateAuditPDF } from '@/utils/pdfExport';

interface AuditSummaryProps {
  url: string;
  score: number;
  date: string;
  issues: {
    critical: number;
    important: number;
    opportunities: number;
  };
  previousScore?: number;
  auditData?: any; // Full audit data if available
}

const AuditSummary: React.FC<AuditSummaryProps> = ({ 
  url, 
  score, 
  date, 
  issues, 
  previousScore,
  auditData 
}) => {
  const { toast } = useToast();
  const scoreDiff = previousScore !== undefined ? score - previousScore : undefined;
  const getTrendIcon = () => {
    if (scoreDiff === undefined) return null;
    if (scoreDiff > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (scoreDiff < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-amber-500" />;
  };

  const handleDownloadPDF = async () => {
    try {
      if (auditData) {
        await generateAuditPDF(auditData, url);
        toast({
          title: "Отчёт сохранён",
          description: "PDF-отчёт успешно сохранён на ваше устройство",
        });
      } else {
        toast({
          title: "Недостаточно данных",
          description: "Для экспорта в PDF необходимы полные данные аудита",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при создании PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="neo-card p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold mb-2">Результаты аудита</h2>
          <p className="text-muted-foreground mb-2">{url}</p>
          <p className="text-sm text-muted-foreground">
            Анализ завершен: {new Date(date).toLocaleString('ru-RU')}
          </p>
        </div>
        
        <div className="flex justify-center relative">
          <ScoreGauge score={score} size={140} />
          
          {scoreDiff !== undefined && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className={`absolute bottom-0 right-0 flex items-center gap-1 py-1 px-2 rounded-full ${
                scoreDiff > 0 ? 'bg-green-100 text-green-600' : 
                scoreDiff < 0 ? 'bg-red-100 text-red-600' : 
                'bg-amber-100 text-amber-600'
              }`}
            >
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {scoreDiff > 0 ? '+' : ''}{scoreDiff}
              </span>
            </motion.div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-red-500/10 rounded-lg">
            <span className="font-medium">Критические ошибки</span>
            <span className="font-bold flex items-center">
              {issues.critical} <ArrowUp className="h-4 w-4 ml-1 text-red-500" />
            </span>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-amber-500/10 rounded-lg">
            <span className="font-medium">Важные улучшения</span>
            <span className="font-bold flex items-center">
              {issues.important} <ArrowDown className="h-4 w-4 ml-1 text-amber-500" />
            </span>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-green-500/10 rounded-lg">
            <span className="font-medium">Возможности</span>
            <span className="font-bold">{issues.opportunities}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3 justify-center md:justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          className="hover-lift flex items-center gap-2"
          onClick={handleDownloadPDF}
        >
          <FileText className="h-4 w-4" />
          Скачать PDF
        </Button>
        <Button variant="outline" size="sm" className="hover-lift flex items-center gap-2">
          <Share className="h-4 w-4" />
          Поделиться
        </Button>
        <Button size="sm" className="hover-lift flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Оптимизировать сайт
        </Button>
      </div>
    </div>
  );
};

export default AuditSummary;
