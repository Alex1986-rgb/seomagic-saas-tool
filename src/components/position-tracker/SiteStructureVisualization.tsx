
import React, { useState, useEffect } from 'react';
import { FolderTree, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SiteStructureVisualizationProps {
  domain: string;
  className?: string;
}

export function SiteStructureVisualization({ domain, className }: SiteStructureVisualizationProps) {
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inputDomain, setInputDomain] = useState(domain);
  const { toast } = useToast();
  
  useEffect(() => {
    setInputDomain(domain);
  }, [domain]);

  const visualizeSiteStructure = async () => {
    if (!inputDomain) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите домен для визуализации",
        variant: "destructive",
      });
      return;
    }

    setIsVisualizing(true);
    setProgress(0);

    try {
      // Эмуляция процесса создания структуры
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      toast({
        title: "Визуализация завершена",
        description: "Структура сайта успешно создана",
      });
    } catch (error) {
      console.error('Ошибка при визуализации структуры сайта:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось визуализировать структуру сайта",
        variant: "destructive",
      });
    } finally {
      setIsVisualizing(false);
    }
  };

  return (
    <div className={className ? `space-y-4 ${className}` : "space-y-4"}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-blue-500" />
            Визуализация структуры сайта
          </CardTitle>
          <CardDescription>
            Создает интерактивную карту структуры вашего сайта для анализа и оптимизации навигации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-6">
            <div className="flex-1">
              <label htmlFor="structure-domain" className="block text-sm font-medium mb-1">Домен для визуализации</label>
              <Input
                id="structure-domain"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="Введите домен, например example.com"
                disabled={isVisualizing}
              />
            </div>
            <Button 
              onClick={visualizeSiteStructure} 
              disabled={isVisualizing || !inputDomain}
              className="gap-2"
            >
              {isVisualizing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FolderTree className="h-4 w-4" />
              )}
              {isVisualizing ? 'Создание...' : 'Создать карту'}
            </Button>
          </div>

          {isVisualizing ? (
            <div className="my-4">
              <div className="text-sm mb-1">Создание карты сайта: {progress}%</div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {progress === 100 ? (
                <div className="border rounded-lg p-4 relative min-h-[400px] bg-slate-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FolderTree className="h-16 w-16 mx-auto text-blue-500 opacity-50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Демонстрационная версия</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        В полной версии здесь отображается интерактивная карта структуры сайта с возможностью навигации и анализа
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <FolderTree className="h-16 w-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                  <p className="text-muted-foreground">
                    {inputDomain 
                      ? "Нажмите «Создать карту», чтобы начать визуализацию структуры сайта" 
                      : "Укажите домен для начала визуализации"}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
