
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { openaiService } from '@/services/api/openaiService';

const AISettings = () => {
  const [hasApiKey, setHasApiKey] = React.useState(false);

  React.useEffect(() => {
    const apiKey = openaiService.getApiKey();
    setHasApiKey(!!apiKey);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Настройки искусственного интеллекта</h2>
      </div>

      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">OpenAI API Ключ</h3>
            <p className="text-sm text-muted-foreground">
              API ключ используется для автоматической оптимизации контента, мета-тегов и заголовков с помощью ИИ.
            </p>
          </div>

          {hasApiKey ? (
            <Alert className="bg-green-500/10 border border-green-500/20">
              <AlertDescription className="text-green-600">
                OpenAI API ключ успешно настроен
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-yellow-500/10 border border-yellow-500/20">
              <AlertDescription className="text-yellow-600">
                OpenAI API ключ не настроен. Добавьте ключ для использования функций ИИ.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettings;
