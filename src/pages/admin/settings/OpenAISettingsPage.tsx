
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { openaiService } from '@/services/api/openaiService';
import { Sparkles, Key, Info, CheckCircle, AlertCircle } from 'lucide-react';

const OpenAISettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  // Загрузить сохраненный ключ при загрузке страницы
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      openaiService.setApiKey(savedKey);
      setIsKeyValid(true);
    }
  }, []);
  
  // Сохранить ключ API
  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите API ключ",
        variant: "destructive",
      });
      return;
    }
    
    // Сохранить в localStorage и в сервисе
    localStorage.setItem('openai_api_key', apiKey);
    openaiService.setApiKey(apiKey);
    
    toast({
      title: "Успешно",
      description: "API ключ OpenAI сохранен",
    });
    
    // Проверить валидность ключа
    verifyApiKey();
  };
  
  // Проверить валидность ключа
  const verifyApiKey = async () => {
    setIsVerifying(true);
    setIsKeyValid(null);
    
    try {
      // Используем сервис для проверки ключа
      const isValid = await openaiService.verifyApiKey();
      setIsKeyValid(isValid);
      
      if (isValid) {
        toast({
          title: "Успешно",
          description: "API ключ OpenAI верифицирован",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "API ключ OpenAI недействителен",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsKeyValid(false);
      toast({
        title: "Ошибка",
        description: "Ошибка при проверке API ключа",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Настройки OpenAI | Админ панель</title>
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl text-white">
        <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-[#222222] to-[#1a1a1a] text-white shadow-lg flex flex-col md:flex-row items-center gap-8 border border-white/10">
          <div className="flex-shrink-0 bg-primary/20 text-primary rounded-full p-6 shadow-inner border border-primary/20">
            <Sparkles className="h-12 w-12" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Настройки OpenAI
            </h1>
            <p className="text-gray-400 text-lg">
              Настройте интеграцию с OpenAI для автоматической оптимизации контента и генерации рекомендаций
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg">
              <CardHeader>
                <CardTitle>API ключ OpenAI</CardTitle>
                <CardDescription>
                  Введите ваш API ключ OpenAI для использования в инструментах оптимизации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-primary" />
                    <label htmlFor="apiKey" className="font-medium">API Ключ</label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="bg-black/20 border-white/10 flex-1"
                    />
                    <Button 
                      onClick={verifyApiKey} 
                      variant="outline" 
                      disabled={isVerifying || !apiKey.trim()}
                      className="border-white/10"
                    >
                      Проверить
                    </Button>
                  </div>
                  
                  {isKeyValid === true && (
                    <div className="flex items-center text-green-400 text-sm mt-2 gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>API ключ действителен</span>
                    </div>
                  )}
                  
                  {isKeyValid === false && (
                    <div className="flex items-center text-red-400 text-sm mt-2 gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>API ключ недействителен</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 items-center p-4 rounded-md bg-black/20 border border-white/10">
                  <Info className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm text-gray-300">
                    API ключ OpenAI необходим для функций автоматического анализа и оптимизации контента. 
                    Ключ хранится только в вашем браузере и никогда не передается на наши серверы.
                  </p>
                </div>
                
                <Button 
                  onClick={handleSaveKey} 
                  className="w-full"
                  disabled={isVerifying || !apiKey.trim()}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Сохранить API ключ
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg h-full">
              <CardHeader>
                <CardTitle>Модели OpenAI</CardTitle>
                <CardDescription>
                  Доступные модели и их возможности
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-md bg-black/20 border border-primary/20">
                  <h3 className="font-medium text-primary mb-2">GPT-4 Turbo</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Самая мощная модель для генерации контента и анализа. Рекомендуется для SEO оптимизации.
                  </p>
                  <div className="text-xs text-gray-400">Модель: gpt-4-turbo-preview</div>
                </div>
                
                <div className="p-4 rounded-md bg-black/20 border border-white/10">
                  <h3 className="font-medium mb-2">GPT-3.5 Turbo</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Оптимальный баланс между скоростью и качеством. Подходит для большинства задач.
                  </p>
                  <div className="text-xs text-gray-400">Модель: gpt-3.5-turbo</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenAISettingsPage;
