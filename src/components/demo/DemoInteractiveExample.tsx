
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ArrowRight, CheckCircle, 
  XCircle, AlertCircle, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const DemoInteractiveExample: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [results, setResults] = useState<null | {
    score: number;
    issues: { critical: number; important: number; minor: number };
    details: Array<{ type: 'error' | 'warning' | 'info'; title: string; description: string }>;
  }>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Пожалуйста, введите URL сайта');
      return;
    }
    
    // Добавляем http:// если отсутствует
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
      setUrl(formattedUrl);
    }
    
    setIsScanning(true);
    setProgress(0);
    setScanStage('Инициализация...');
    setResults(null);
    
    // Имитация процесса сканирования
    const stages = [
      'Проверка доступности сайта...',
      'Анализ HTML-структуры...',
      'Проверка мета-тегов...',
      'Анализ контента...',
      'Проверка скорости загрузки...',
      'Анализ ссылочной структуры...',
      'Поиск технических проблем...',
      'Проверка адаптивности...',
      'Проверка SEO-оптимизации...',
      'Формирование отчета...'
    ];
    
    let currentStage = 0;
    
    const intervalId = setInterval(() => {
      if (currentStage < stages.length) {
        setScanStage(stages[currentStage]);
        setProgress((currentStage + 1) * (100 / stages.length));
        currentStage++;
      } else {
        clearInterval(intervalId);
        
        // Финальные результаты
        setResults({
          score: Math.floor(Math.random() * 40) + 40, // Случайная оценка от 40 до 79
          issues: {
            critical: Math.floor(Math.random() * 5) + 2, // 2-6 критичных проблем
            important: Math.floor(Math.random() * 8) + 5, // 5-12 важных проблем
            minor: Math.floor(Math.random() * 10) + 10 // 10-19 незначительных проблем
          },
          details: [
            { 
              type: 'error', 
              title: 'Отсутствуют мета-описания', 
              description: 'На 6 страницах отсутствуют мета-описания, что негативно влияет на отображение в поисковой выдаче.' 
            },
            { 
              type: 'error', 
              title: 'Низкая скорость загрузки', 
              description: 'Скорость загрузки мобильной версии составляет 8.2 секунды, что превышает рекомендуемый порог в 3 секунды.' 
            },
            { 
              type: 'warning', 
              title: 'Дублирующийся контент', 
              description: 'Обнаружено 3 страницы с похожим или дублирующимся содержимым.' 
            },
            { 
              type: 'warning', 
              title: 'Некорректные заголовки H1', 
              description: 'На 4 страницах отсутствуют заголовки H1 или используются некорректно.' 
            },
            { 
              type: 'info', 
              title: 'Оптимизация изображений', 
              description: '12 изображений можно оптимизировать для ускорения загрузки страниц.' 
            }
          ]
        });
        
        setIsScanning(false);
        toast.success('Анализ сайта завершен!');
      }
    }, 800);
    
    return () => clearInterval(intervalId);
  };

  const resetDemo = () => {
    setUrl('');
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Интерактивный пример</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Попробуйте демонстрационную версию аудита сайта прямо сейчас. Введите URL любого сайта для анализа.
        </p>
      </div>
      
      <Card className="mb-8 shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Введите URL сайта (например, example.com)"
                className="pl-10"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isScanning} 
              className="gap-2"
            >
              {isScanning ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  <span>Анализ...</span>
                </>
              ) : (
                <>Проверить сайт <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>
          
          {isScanning && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>{scanStage}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
      
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Результаты аудита</h3>
            <p className="text-muted-foreground">
              Общая оценка SEO для сайта <span className="font-medium">{url}</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${
                    results.score >= 80 ? 'text-green-500' : 
                    results.score >= 60 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {results.score}/100
                  </div>
                  <p className="text-sm text-muted-foreground">Общая оценка</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1 text-red-500">
                    {results.issues.critical}
                  </div>
                  <p className="text-sm text-muted-foreground">Критичные проблемы</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1 text-amber-500">
                    {results.issues.important}
                  </div>
                  <p className="text-sm text-muted-foreground">Важные проблемы</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1 text-blue-500">
                    {results.issues.minor}
                  </div>
                  <p className="text-sm text-muted-foreground">Незначительные проблемы</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <h4 className="text-xl font-semibold mb-4">Обнаруженные проблемы</h4>
            
            <div className="space-y-4">
              {results.details.map((issue, index) => (
                <Card key={index} className="shadow-sm overflow-hidden">
                  <div className={`h-1 ${
                    issue.type === 'error' ? 'bg-red-500' : 
                    issue.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <CardContent className="pt-6 flex gap-4">
                    <div className="mt-1">
                      {issue.type === 'error' ? (
                        <XCircle className="w-6 h-6 text-red-500" />
                      ) : issue.type === 'warning' ? (
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">{issue.title}</h5>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={resetDemo}>Начать заново</Button>
            <Button className="gap-2">
              <Settings className="w-4 h-4" />
              Оптимизировать сайт
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DemoInteractiveExample;
