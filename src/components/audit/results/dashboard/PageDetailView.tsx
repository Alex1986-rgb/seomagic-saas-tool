import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, AlertCircle, AlertTriangle, CheckCircle2, Clock, FileText, Image as ImageIcon, Heading1 } from 'lucide-react';
import { PageAnalysisRow } from './types';
import { toNumber } from '@/lib/numbers';

interface PageDetailViewProps {
  page: PageAnalysisRow | null;
  isOpen: boolean;
  onClose: () => void;
}

const PageDetailView: React.FC<PageDetailViewProps> = ({ page, isOpen, onClose }) => {
  if (!page) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="truncate">{page.title || 'Без названия'}</SheetTitle>
          <SheetDescription className="truncate">{page.url}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Page Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Метрики страницы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Время загрузки</div>
                    <div className="font-bold">{toNumber(page.loadTime).toFixed(2)}s</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Слов</div>
                    <div className="font-bold">{page.wordCount}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ImageIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Изображений</div>
                    <div className="font-bold">{page.imageCount}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Heading1 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Заголовков H1</div>
                    <div className="font-bold">{page.h1Count}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Общий score</span>
                  <Badge
                    className={
                      page.score >= 80 
                        ? 'bg-success/20 text-success hover:bg-success/30 border-success/30 text-lg px-3 py-1'
                        : page.score >= 60
                          ? 'bg-warning/20 text-warning hover:bg-warning/30 border-warning/30 text-lg px-3 py-1'
                          : 'text-lg px-3 py-1'
                    }
                    variant={page.score < 60 ? 'destructive' : 'outline'}
                  >
                    {page.score}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Проблемы
                <Badge>{page.issues.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {page.issues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success" />
                  <p>По проверкам обхода замечаний нет</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {page.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3 rounded-lg border border-border/50 bg-background/50"
                    >
                      <div className="flex items-start gap-2">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{issue.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {issue.description}
                          </div>
                          {issue.solution && (
                            <div className="text-xs text-primary mt-2 p-2 bg-primary/10 rounded">
                              💡 {issue.solution}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {issue.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/*
            Здесь была кнопка «Оптимизировать» без обработчика: нажатие ничего
            не делало. Оптимизация запускается на весь аудит из раздела
            «Оптимизация сайта», для одной страницы её нет — кнопку убрали.
          */}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => window.open(page.url, '_blank', 'noopener,noreferrer')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Открыть в браузере
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PageDetailView;
