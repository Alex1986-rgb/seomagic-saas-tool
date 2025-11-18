import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  BarChart3, 
  AlertTriangle, 
  FileSearch, 
  Lightbulb, 
  List,
  Download,
  Eye
} from 'lucide-react';
import { AuditData } from '@/types/audit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface PdfSection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  required?: boolean;
  estimatedPages: number;
}

interface PdfPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditData: AuditData | null;
  onGenerate: (selectedSections: string[]) => Promise<void>;
}

const defaultSections: PdfSection[] = [
  {
    id: 'summary',
    name: 'Обзор аудита',
    description: 'Общая информация, URL, дата, основные метрики',
    icon: <FileText className="h-4 w-4" />,
    enabled: true,
    required: true,
    estimatedPages: 1
  },
  {
    id: 'score',
    name: 'SEO оценка и метрики',
    description: 'Детальная оценка, график, ключевые показатели',
    icon: <BarChart3 className="h-4 w-4" />,
    enabled: true,
    estimatedPages: 2
  },
  {
    id: 'issues',
    name: 'Технические проблемы',
    description: 'Критические ошибки, предупреждения, рекомендации по исправлению',
    icon: <AlertTriangle className="h-4 w-4" />,
    enabled: true,
    estimatedPages: 3
  },
  {
    id: 'pages',
    name: 'Анализ страниц',
    description: 'Детальная информация по каждой проверенной странице',
    icon: <FileSearch className="h-4 w-4" />,
    enabled: true,
    estimatedPages: 5
  },
  {
    id: 'content',
    name: 'Анализ контента',
    description: 'Качество контента, уникальность, структура',
    icon: <FileText className="h-4 w-4" />,
    enabled: false,
    estimatedPages: 2
  },
  {
    id: 'recommendations',
    name: 'Рекомендации',
    description: 'Приоритизированный список улучшений с инструкциями',
    icon: <Lightbulb className="h-4 w-4" />,
    enabled: true,
    estimatedPages: 4
  },
  {
    id: 'pagelist',
    name: 'Список всех страниц',
    description: 'Таблица со всеми найденными URL и их статусами',
    icon: <List className="h-4 w-4" />,
    enabled: false,
    estimatedPages: 10
  }
];

export const PdfPreviewDialog = ({
  open,
  onOpenChange,
  auditData,
  onGenerate
}: PdfPreviewDialogProps) => {
  const [sections, setSections] = useState<PdfSection[]>(defaultSections);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('sections');

  const handleToggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId && !section.required
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const selectedSections = sections
        .filter(s => s.enabled)
        .map(s => s.id);
      
      await onGenerate(selectedSections);
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalPages = sections
    .filter(s => s.enabled)
    .reduce((sum, s) => sum + s.estimatedPages, 0);

  const enabledCount = sections.filter(s => s.enabled).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Создание PDF отчета
          </DialogTitle>
          <DialogDescription>
            Выберите секции для включения в отчет. Примерный размер: {totalPages} страниц
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sections">
              <Eye className="h-4 w-4 mr-2" />
              Выбор секций
            </TabsTrigger>
            <TabsTrigger value="preview">
              <FileText className="h-4 w-4 mr-2" />
              Предпросмотр
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {sections.map((section) => (
                  <Card
                    key={section.id}
                    className={`transition-all ${
                      section.enabled
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/50'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            id={section.id}
                            checked={section.enabled}
                            onCheckedChange={() => handleToggleSection(section.id)}
                            disabled={section.required}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={section.id}
                              className="flex items-center gap-2 text-base font-semibold cursor-pointer"
                            >
                              {section.icon}
                              {section.name}
                              {section.required && (
                                <Badge variant="secondary" className="text-xs">
                                  Обязательно
                                </Badge>
                              )}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {section.description}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          ~{section.estimatedPages} стр.
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Структура отчета</CardTitle>
                    <CardDescription>
                      Выбрано секций: {enabledCount} из {sections.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sections
                        .filter(s => s.enabled)
                        .map((section, index) => (
                          <div
                            key={section.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              {section.icon}
                              <span className="font-medium">{section.name}</span>
                            </div>
                            <Badge variant="secondary">
                              {section.estimatedPages} стр.
                            </Badge>
                          </div>
                        ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Примерный размер отчета
                      </span>
                      <span className="font-semibold text-lg">
                        {totalPages} страниц
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {auditData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Информация об аудите</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">URL:</span>
                        <span className="font-mono text-xs">{auditData.url}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SEO оценка:</span>
                        <span className="font-semibold">{auditData.score}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Проверено страниц:</span>
                        <span>{auditData.pageCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Всего проблем:</span>
                        <span>
                          {Array.isArray(auditData.issues?.critical) ? auditData.issues.critical.length : 0} критических,{' '}
                          {Array.isArray(auditData.issues?.important) ? auditData.issues.important.length : 0} важных
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Секций: {enabledCount} • ~{totalPages} страниц
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isGenerating}
            >
              Отмена
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || enabledCount === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Генерация...' : 'Скачать PDF'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
