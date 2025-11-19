import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DataCleanupSettings() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<any>(null);

  const runCleanup = async () => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-old-data', {
        body: { scheduled: false }
      });

      if (error) throw error;

      setLastCleanup(data);
      
      toast({
        title: "Очистка выполнена",
        description: `Удалено записей: ${data.stats.total}`,
      });
    } catch (error) {
      console.error('Cleanup error:', error);
      toast({
        title: "Ошибка очистки",
        description: error instanceof Error ? error.message : "Не удалось выполнить очистку",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Автоочистка данных
          </CardTitle>
          <CardDescription>
            Управление хранением старых данных аудитов и системных логов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Автоматическая очистка запускается ежедневно в 3:00. Удаляются:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Сырые данные страниц (30 дней)</li>
                <li>Очередь URL (7 дней)</li>
                <li>Задачи аудита с результатами (90 дней)</li>
                <li>Уведомления (90 дней)</li>
                <li>Логи API (30 дней)</li>
                <li>PDF отчеты (90 дней)</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="pt-4">
            <Button 
              onClick={runCleanup} 
              disabled={isRunning}
              variant="destructive"
              className="w-full gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Выполняется очистка...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Запустить очистку вручную
                </>
              )}
            </Button>
          </div>

          {lastCleanup && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Последняя очистка:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Сырые страницы:</div>
                <div className="font-mono">{lastCleanup.stats.crawled_pages}</div>
                
                <div>Очередь URL:</div>
                <div className="font-mono">{lastCleanup.stats.url_queue}</div>
                
                <div>Анализ страниц:</div>
                <div className="font-mono">{lastCleanup.stats.page_analysis}</div>
                
                <div>Результаты:</div>
                <div className="font-mono">{lastCleanup.stats.audit_results}</div>
                
                <div>Задачи:</div>
                <div className="font-mono">{lastCleanup.stats.audit_tasks}</div>
                
                <div>Уведомления:</div>
                <div className="font-mono">{lastCleanup.stats.notifications}</div>
                
                <div>Логи API:</div>
                <div className="font-mono">{lastCleanup.stats.api_logs}</div>
                
                <div className="font-bold">Всего:</div>
                <div className="font-mono font-bold">{lastCleanup.stats.total}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {new Date(lastCleanup.timestamp).toLocaleString('ru-RU')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
