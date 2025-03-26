
import React, { useState, useEffect } from 'react';
import { Loader2, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditSummary from './AuditSummary';
import { useToast } from "@/hooks/use-toast";

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [auditData, setAuditData] = useState<any>(null);
  const { toast } = useToast();

  // Симуляция загрузки данных аудита
  useEffect(() => {
    const fetchAuditData = async () => {
      setIsLoading(true);
      
      // Имитация задержки API
      setTimeout(() => {
        // Мок-данные результатов аудита
        const mockAuditData = {
          score: 67,
          date: new Date().toISOString(),
          issues: {
            critical: 3,
            important: 8,
            opportunities: 12,
          },
          details: {
            performance: {
              score: 72,
              items: [
                { id: 'p1', title: 'Время до интерактивности', value: '3.2s', status: 'warning' },
                { id: 'p2', title: 'Скорость загрузки первого контента', value: '1.8s', status: 'good' },
                { id: 'p3', title: 'Общий размер страницы', value: '2.4MB', status: 'warning' },
                { id: 'p4', title: 'Количество запросов', value: '45', status: 'warning' },
              ],
            },
            seo: {
              score: 58,
              items: [
                { id: 's1', title: 'Отсутствуют meta-теги', description: 'Отсутствуют важные meta-теги на странице', status: 'error' },
                { id: 's2', title: 'Дублирующийся контент', description: 'Обнаружены страницы с дублирующимся контентом', status: 'error' },
                { id: 's3', title: 'Заголовки H1-H6', description: 'Структура заголовков нуждается в оптимизации', status: 'warning' },
                { id: 's4', title: 'Alt-теги изображений', description: 'Некоторые изображения не имеют alt-тегов', status: 'warning' },
                { id: 's5', title: 'Оптимизация мобильной версии', description: 'Сайт адаптирован для мобильных устройств', status: 'good' },
              ],
            },
            content: {
              score: 75,
              items: [
                { id: 'c1', title: 'Плотность ключевых слов', description: 'Хорошая плотность ключевых слов', status: 'good' },
                { id: 'c2', title: 'Длина контента', description: 'Контент достаточной длины', status: 'good' },
                { id: 'c3', title: 'Читабельность', description: 'Контент имеет хорошую читабельность', status: 'good' },
                { id: 'c4', title: 'Внутренние ссылки', description: 'Недостаточно внутренних ссылок', status: 'warning' },
              ],
            },
            technical: {
              score: 62,
              items: [
                { id: 't1', title: 'Robots.txt', description: 'Файл robots.txt отсутствует или неправильно настроен', status: 'error' },
                { id: 't2', title: 'Sitemap.xml', description: 'Файл sitemap.xml присутствует', status: 'good' },
                { id: 't3', title: 'SSL сертификат', description: 'SSL сертификат активен и корректен', status: 'good' },
                { id: 't4', title: 'Редиректы', description: 'Обнаружены проблемы с редиректами', status: 'warning' },
                { id: 't5', title: 'Ошибки сервера', description: 'Обнаружены ошибки 404', status: 'warning' },
              ],
            },
          },
        };
        
        setAuditData(mockAuditData);
        setIsLoading(false);
        
        toast({
          title: "Аудит завершен",
          description: "SEO аудит сайта успешно завершен",
        });
      }, 3000);
    };
    
    fetchAuditData();
  }, [url, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-xl font-medium mb-2">Анализируем сайт</h3>
        <p className="text-muted-foreground">
          Пожалуйста, подождите. Это может занять несколько минут.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AuditSummary 
        url={url} 
        score={auditData.score}
        date={auditData.date}
        issues={auditData.issues}
      />
      
      <div className="neo-card p-6 mb-8">
        <Tabs defaultValue="seo">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="performance">Производительность</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="technical">Технические аспекты</TabsTrigger>
          </TabsList>
          
          <TabsContent value="seo">
            <AuditCategorySection 
              title="SEO оптимизация"
              score={auditData.details.seo.score}
              items={auditData.details.seo.items}
              description="Анализ SEO-факторов, которые влияют на ранжирование вашего сайта в поисковых системах."
            />
          </TabsContent>
          
          <TabsContent value="performance">
            <AuditCategorySection 
              title="Производительность"
              score={auditData.details.performance.score}
              items={auditData.details.performance.items}
              description="Анализ скорости и производительности вашего сайта, которые влияют на удобство использования и SEO."
            />
          </TabsContent>
          
          <TabsContent value="content">
            <AuditCategorySection 
              title="Контент"
              score={auditData.details.content.score}
              items={auditData.details.content.items}
              description="Анализ содержимого страниц, включая тексты, заголовки, ключевые слова и медиафайлы."
            />
          </TabsContent>
          
          <TabsContent value="technical">
            <AuditCategorySection 
              title="Технические аспекты"
              score={auditData.details.technical.score}
              items={auditData.details.technical.items}
              description="Анализ технических аспектов сайта, влияющих на индексацию и работу поисковых систем."
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="neo-card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Рекомендации по оптимизации</h2>
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
            <h3 className="font-medium">Критические ошибки</h3>
            <ul className="mt-2 space-y-2">
              <li>Добавьте мета-теги title и description на все страницы сайта</li>
              <li>Устраните дублирующийся контент с использованием canonical тегов</li>
              <li>Создайте и настройте файл robots.txt</li>
            </ul>
          </div>
          
          <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded">
            <h3 className="font-medium">Важные улучшения</h3>
            <ul className="mt-2 space-y-2">
              <li>Оптимизируйте структуру заголовков H1-H6</li>
              <li>Добавьте alt-теги ко всем изображениям</li>
              <li>Исправьте проблемы с редиректами</li>
              <li>Оптимизируйте размер страницы для ускорения загрузки</li>
            </ul>
          </div>
          
          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
            <h3 className="font-medium">Возможности для улучшения</h3>
            <ul className="mt-2 space-y-2">
              <li>Увеличьте количество внутренних ссылок для улучшения структуры сайта</li>
              <li>Оптимизируйте изображения для ускорения загрузки</li>
              <li>Добавьте структурированные данные (schema.org)</li>
              <li>Используйте более длинные и информативные описания для страниц</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button 
          className="inline-flex items-center gap-2 text-primary hover:underline"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Ссылка скопирована",
              description: "Ссылка на результаты аудита скопирована в буфер обмена",
            });
          }}
        >
          <Share2 className="h-4 w-4" />
          <span>Поделиться результатами</span>
        </button>
      </div>
    </div>
  );
};

interface AuditCategorySectionProps {
  title: string;
  score: number;
  items: Array<{
    id: string;
    title: string;
    description?: string;
    value?: string;
    status: 'good' | 'warning' | 'error';
  }>;
  description?: string;
}

const AuditCategorySection: React.FC<AuditCategorySectionProps> = ({
  title,
  score,
  items,
  description,
}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'text-green-500 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'good': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return '•';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="text-2xl font-bold">
          <span className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'}>
            {score}
          </span>
          <span className="text-muted-foreground">/100</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`p-4 border rounded-lg ${getStatusColor(item.status)}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="inline-block w-6 h-6 text-center mr-3">
                  {getStatusIcon(item.status)}
                </span>
                <h3 className="font-medium">{item.title}</h3>
              </div>
              {item.value && <div className="font-mono">{item.value}</div>}
            </div>
            {item.description && (
              <p className="mt-2 ml-9">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeoAuditResults;
