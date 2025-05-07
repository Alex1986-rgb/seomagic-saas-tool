
import React from 'react';
import { AlertTriangle, FileBarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AuditSectionProps {
  url: string;
  hasAuditResults: boolean;
  isScanning: boolean;
  startFullScan: () => void;
}

const AuditSection: React.FC<AuditSectionProps> = ({
  url,
  hasAuditResults,
  isScanning,
  startFullScan
}) => {
  if (!url) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
        <h4 className="text-lg font-medium mb-2">URL не указан</h4>
        <p className="text-muted-foreground mb-4">
          Введите URL сайта для выполнения аудита
        </p>
      </div>
    );
  }
  
  if (isScanning) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"></div>
        <h4 className="text-lg font-medium mb-2">Выполняется сканирование</h4>
        <p className="text-muted-foreground">
          Это может занять некоторое время
        </p>
      </div>
    );
  }
  
  if (!hasAuditResults) {
    return (
      <div className="text-center py-12">
        <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h4 className="text-lg font-medium mb-2">Аудит не выполнен</h4>
        <p className="text-muted-foreground mb-6">
          Запустите сканирование для выполнения аудита сайта
        </p>
        <Button onClick={startFullScan}>
          Запустить аудит
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Результаты аудита</h3>
      
      <div className="space-y-6">
        {/* SEO Score */}
        <div className="flex items-center justify-center py-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted-foreground/20" strokeWidth="2"></circle>
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeDasharray="88 100" strokeLinecap="round" strokeWidth="2" transform="rotate(-90 18 18)"></circle>
              <text x="18" y="18" dy=".3em" textAnchor="middle" className="fill-foreground text-xl font-bold">84%</text>
            </svg>
          </div>
        </div>
        
        {/* Audit Categories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>SEO оптимизация</span>
            <div className="w-1/2 bg-muted rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{width: '76%'}}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Производительность</span>
            <div className="w-1/2 bg-muted rounded-full h-2.5">
              <div className="bg-amber-500 h-2.5 rounded-full" style={{width: '68%'}}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Доступность</span>
            <div className="w-1/2 bg-muted rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '92%'}}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Лучшие практики</span>
            <div className="w-1/2 bg-muted rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{width: '88%'}}></div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-6">
          <Button variant="outline" className="w-full sm:w-auto">
            Подробный отчет
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditSection;
