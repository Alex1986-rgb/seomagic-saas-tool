
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, ArrowRight, CheckCircle, 
  XCircle, AlertCircle, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

/** Постоянный пример отчёта для витрины: числа условные, это видно и в подписи. */
const EXAMPLE_REPORT = {
  score: 62,
  issues: { critical: 3, important: 7, minor: 14 },
  details: [
    {
      type: 'error' as const,
      title: 'Отсутствуют мета-описания',
      description: 'На части страниц нет описания — в выдаче поисковик подставит случайный кусок текста.',
    },
    {
      type: 'error' as const,
      title: 'Медленная загрузка',
      description: 'Страницы открываются дольше трёх секунд: часть посетителей уходит, не дождавшись.',
    },
    {
      type: 'warning' as const,
      title: 'Повторяющиеся заголовки',
      description: 'Несколько страниц с одинаковым title — поиск считает такие страницы дублями.',
    },
    {
      type: 'warning' as const,
      title: 'Заголовки H1',
      description: 'На части страниц заголовок H1 отсутствует или используется несколько раз.',
    },
    {
      type: 'info' as const,
      title: 'Картинки без описания',
      description: 'У изображений не заполнен alt — теряется трафик из поиска по картинкам.',
    },
  ],
};

const DemoInteractiveExample: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  // Состояний «идёт проверка» здесь больше нет: проверку выполняет настоящий
  // аудит на своей странице, а ниже показан постоянный пример отчёта.
  const results = EXAMPLE_REPORT;

  /**
   * Раньше форма принимала адрес настоящего сайта, показывала десять
   * придуманных этапов проверки и выдавала случайную оценку от 40 до 79 с
   * сообщением «Анализ сайта завершён!». Введя свой домен, человек принимал эти
   * числа за результат проверки своего сайта. Теперь форма ведёт на настоящий
   * аудит, а пример отчёта ниже прямо помечен примером.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error('Пожалуйста, введите URL сайта');
      return;
    }

    const formattedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    navigate(`/site-audit?url=${encodeURIComponent(formattedUrl)}`);
  };

  const resetDemo = () => {
    setUrl('');
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
              />
            </div>
            <Button type="submit" className="gap-2">
              Проверить сайт <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
          
        </CardContent>
      </Card>
      
      {(
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Так выглядит отчёт</h3>
            <p className="text-muted-foreground">
              Пример: числа условные. Ваш отчёт появится после проверки сайта.
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
