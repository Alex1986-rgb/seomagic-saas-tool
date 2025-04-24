
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Save } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { openaiService } from '@/services/api/openaiService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const AISettings = () => {
  const [hasApiKey, setHasApiKey] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('gpt-4o-mini');
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    const storedApiKey = openaiService.getApiKey();
    const storedModel = openaiService.getModel();
    setHasApiKey(!!storedApiKey);
    setSelectedModel(storedModel || 'gpt-4o-mini');
  }, []);

  const handleSave = () => {
    if (apiKey) {
      openaiService.setApiKey(apiKey);
      setHasApiKey(true);
    }
    openaiService.setModel(selectedModel);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Настройки искусственного интеллекта</h2>
      </div>

      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">OpenAI API Ключ</h3>
              <p className="text-sm text-muted-foreground">
                API ключ используется для автоматической оптимизации контента, мета-тегов и заголовков с помощью ИИ.
              </p>
              <Input
                type="password"
                placeholder="Введите ваш OpenAI API ключ"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Модель OpenAI</h3>
              <p className="text-sm text-muted-foreground">
                Выберите модель OpenAI для оптимизации контента.
              </p>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Выберите модель" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4O Mini (Быстрая и экономичная)</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4O (Мощная)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} className="flex gap-2">
              <Save className="h-4 w-4" />
              Сохранить настройки
            </Button>
          </div>

          {isSaved && (
            <Alert className="bg-green-500/10 border border-green-500/20">
              <AlertDescription className="text-green-600">
                Настройки успешно сохранены
              </AlertDescription>
            </Alert>
          )}

          {hasApiKey && !isSaved && (
            <Alert className="bg-green-500/10 border border-green-500/20">
              <AlertDescription className="text-green-600">
                OpenAI API ключ успешно настроен
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettings;
