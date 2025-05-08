
import React, { useState } from 'react';
import { OptimizationCost } from './optimization';
import ContentOptimizationPrompt from './ContentOptimizationPrompt';
import { OptimizationItem } from './optimization/CostDetailsTable';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText, Check, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuditOptimizationProps {
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
  isOptimized: boolean;
  contentPrompt: string;
  url: string;
  pageCount: number;
  showPrompt: boolean;
  onTogglePrompt: () => void;
  onOptimize: () => void;
  onDownloadOptimizedSite: () => void;
  onGeneratePdfReport: () => void;
  setContentOptimizationPrompt: (prompt: string) => void;
  paymentStatus?: 'pending' | 'approved' | 'rejected';
}

const AuditOptimization: React.FC<AuditOptimizationProps> = ({
  optimizationCost,
  optimizationItems,
  isOptimized,
  contentPrompt,
  url,
  pageCount,
  showPrompt,
  onTogglePrompt,
  onOptimize,
  onDownloadOptimizedSite,
  onGeneratePdfReport,
  setContentOptimizationPrompt,
  paymentStatus = 'pending'
}) => {
  const [showMetaEditor, setShowMetaEditor] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  if (!optimizationCost && !showPrompt) return null;
  
  const isPaid = paymentStatus === 'approved';
  const canOptimize = isPaid || process.env.NODE_ENV === 'development';
  
  return (
    <div className="space-y-6">
      {!isOptimized && isPaid && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-5 w-5 text-green-600" />
          <AlertTitle>Оплата подтверждена</AlertTitle>
          <AlertDescription>
            Теперь вы можете настроить оптимизацию контента и метаданных для вашего сайта
          </AlertDescription>
        </Alert>
      )}
      
      {isOptimized && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-5 w-5 text-green-600" />
          <AlertTitle>Оптимизация завершена</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Ваш сайт был успешно оптимизирован и готов к скачиванию</span>
            <Button onClick={onDownloadOptimizedSite} variant="outline" className="gap-2 bg-white">
              <Download className="h-4 w-4" />
              Скачать оптимизированный сайт
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onTogglePrompt} 
          variant={showPrompt ? "default" : "outline"}
          className="gap-2 flex-1"
        >
          {showPrompt ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Скрыть настройки оптимизации
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Показать настройки оптимизации
            </>
          )}
        </Button>
        
        <Button 
          onClick={onGeneratePdfReport}
          variant="outline"
          className="gap-2 flex-1"
        >
          <FileText className="h-4 w-4" />
          Скачать PDF-отчет
        </Button>
      </div>
      
      {showPrompt && (
        <>
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Оптимизация мета-тегов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Оптимизировать мета-теги title и description</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowMetaEditor(!showMetaEditor)}
                >
                  {showMetaEditor ? 'Скрыть редактор' : 'Редактировать мета-теги'}
                </Button>
              </div>
              
              {showMetaEditor && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <label htmlFor="meta-title" className="text-sm font-medium">
                      Мета-заголовок (title)
                      <span className="text-xs text-muted-foreground ml-2">Рекомендуется 50-60 символов</span>
                    </label>
                    <input
                      id="meta-title"
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Введите оптимизированный мета-заголовок"
                      className="w-full px-3 py-1.5 text-sm border rounded-md"
                      maxLength={60}
                    />
                    <div className="text-xs text-right text-muted-foreground">
                      {metaTitle.length}/60 символов
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="meta-description" className="text-sm font-medium">
                      Мета-описание (description)
                      <span className="text-xs text-muted-foreground ml-2">Рекомендуется 150-160 символов</span>
                    </label>
                    <textarea
                      id="meta-description"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Введите оптимизированное мета-описание"
                      className="w-full px-3 py-1.5 text-sm border rounded-md min-h-[80px]"
                      maxLength={160}
                    />
                    <div className="text-xs text-right text-muted-foreground">
                      {metaDescription.length}/160 символов
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    disabled={!canOptimize}
                  >
                    Применить мета-теги ко всем страницам
                  </Button>
                  
                  {!canOptimize && (
                    <p className="text-xs text-amber-500 text-center">
                      Для редактирования мета-тегов необходимо подтвердить оплату
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <ContentOptimizationPrompt 
            prompt={contentPrompt} 
            setPrompt={setContentOptimizationPrompt}
            onOptimize={canOptimize ? onOptimize : undefined}
          />
          
          {!canOptimize && (
            <p className="text-sm text-amber-500 text-center">
              Для запуска оптимизации контента необходимо подтвердить оплату
            </p>
          )}
        </>
      )}
      
      {optimizationCost && (
        <OptimizationCost 
          optimizationCost={optimizationCost}
          pageCount={pageCount}
          url={url}
          onDownloadOptimized={onDownloadOptimizedSite}
          isOptimized={isOptimized}
          optimizationItems={optimizationItems}
          onGeneratePdfReport={onGeneratePdfReport}
        />
      )}
    </div>
  );
};

export default AuditOptimization;
