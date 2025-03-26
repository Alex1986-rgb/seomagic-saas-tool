
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Globe 
} from 'lucide-react';

// Mock data for demonstration
const mockAuditData = {
  score: 67,
  url: 'https://example.com',
  timestamp: new Date().toISOString(),
  categories: [
    {
      name: 'Мета-теги',
      score: 72,
      items: [
        { name: 'Title тег', status: 'warning', message: 'Заголовок слишком короткий (32 символа)' },
        { name: 'Meta Description', status: 'error', message: 'Отсутствует мета-описание' },
        { name: 'Canonical тег', status: 'success', message: 'Канонический тег правильно установлен' },
        { name: 'Robots Meta', status: 'success', message: 'Мета-тег robots правильно установлен' },
      ]
    },
    {
      name: 'Заголовки',
      score: 85,
      items: [
        { name: 'H1 тег', status: 'success', message: 'H1 тег присутствует и оптимизирован' },
        { name: 'Структура заголовков', status: 'warning', message: 'Некоторые заголовки не по порядку (H2 перед H1)' },
        { name: 'Содержание заголовков', status: 'success', message: 'Заголовки содержат релевантные ключевые слова' },
      ]
    },
    {
      name: 'Изображения',
      score: 40,
      items: [
        { name: 'Alt теги', status: 'error', message: 'У 8 изображений отсутствуют alt-теги' },
        { name: 'Размер изображений', status: 'warning', message: '3 изображения не оптимизированы для веба' },
        { name: 'Имена изображений', status: 'error', message: 'Большинство имен файлов изображений не являются описательными' },
      ]
    },
    {
      name: 'Производительность',
      score: 62,
      items: [
        { name: 'Скорость страницы', status: 'warning', message: 'Время загрузки страницы 3.2с (рекомендуется < 2с)' },
        { name: 'Мобильная адаптация', status: 'success', message: 'Страница адаптирована для мобильных устройств' },
        { name: 'HTTPS', status: 'success', message: 'Сайт использует HTTPS' },
      ]
    },
    {
      name: 'Контент',
      score: 78,
      items: [
        { name: 'Количество слов', status: 'success', message: 'На странице достаточно контента (1 250 слов)' },
        { name: 'Плотность ключевых слов', status: 'warning', message: 'Плотность основного ключевого слова слишком высокая (5.2%)' },
        { name: 'Читабельность', status: 'success', message: 'Контент имеет хороший показатель читабельности' },
      ]
    },
  ],
  recommendations: [
    'Добавьте мета-описание для улучшения показателя кликов из результатов поиска',
    'Оптимизируйте 8 изображений с помощью описательных alt-тегов',
    'Улучшите скорость страницы, оптимизируя изображения и минимизируя CSS/JS',
    'Исправьте структуру заголовков, чтобы следовать правильной иерархии',
    'Уменьшите плотность ключевых слов, чтобы избежать штрафов за переоптимизацию',
  ]
};

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [auditData, setAuditData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate API call to get audit results
    const timer = setTimeout(() => {
      setAuditData(mockAuditData);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Анализируем ваш сайт</h2>
        <p className="text-muted-foreground mb-8">Это может занять минуту...</p>
        
        <div className="w-full max-w-md bg-secondary/30 rounded-full h-3 mb-2">
          <div className="h-3 bg-primary rounded-full animate-pulse-slow" style={{ width: '70%' }}></div>
        </div>
        <p className="text-sm text-muted-foreground">Проверяем мета-теги, заголовки, изображения и многое другое</p>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle className="h-16 w-16 text-destructive mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Анализ не удался</h2>
        <p className="text-muted-foreground mb-8">Мы не смогли проанализировать этот сайт. Пожалуйста, попробуйте снова.</p>
        <button 
          className="bg-primary text-white px-6 py-3 rounded-full flex items-center"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Score Overview */}
      <div className="glass-panel p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">SEO оценка: {auditData.score}/100</h2>
            <p className="text-muted-foreground mb-4">{url}</p>
            
            {/* Score gauge */}
            <div className="w-full bg-secondary/30 rounded-full h-3 mb-2 max-w-md">
              <div 
                className={`h-3 rounded-full ${
                  auditData.score >= 80 ? 'bg-green-500' : 
                  auditData.score >= 60 ? 'bg-amber-500' : 'bg-destructive'
                }`} 
                style={{ width: `${auditData.score}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Проанализировано {new Date(auditData.timestamp).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="bg-primary text-white px-6 py-3 rounded-full flex items-center justify-center"
              onClick={() => {/* Download PDF logic */}}
            >
              <Download className="mr-2 h-5 w-5" />
              Скачать отчет
            </button>
            <button 
              className="bg-secondary text-foreground px-6 py-3 rounded-full flex items-center justify-center"
              onClick={() => {/* Generate optimized site */}}
            >
              <Globe className="mr-2 h-5 w-5" />
              Сгенерировать оптимизированный сайт
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-border mb-8">
        <TabButton 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Обзор
        </TabButton>
        <TabButton 
          active={activeTab === 'issues'} 
          onClick={() => setActiveTab('issues')}
        >
          Проблемы
        </TabButton>
        <TabButton 
          active={activeTab === 'recommendations'} 
          onClick={() => setActiveTab('recommendations')}
        >
          Рекомендации
        </TabButton>
      </div>
      
      {/* Tab Content */}
      <div className="mb-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auditData.categories.map((category: any) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        )}
        
        {activeTab === 'issues' && (
          <div className="space-y-6">
            {auditData.categories.map((category: any) => (
              <IssuesSection key={category.name} category={category} />
            ))}
          </div>
        )}
        
        {activeTab === 'recommendations' && (
          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold mb-4">Рекомендации по улучшению вашего SEO</h3>
            <ul className="space-y-4">
              {auditData.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const TabButton: React.FC<{
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}> = ({ children, active, onClick }) => (
  <button
    className={`px-6 py-3 font-medium border-b-2 transition-colors ${
      active 
        ? 'border-primary text-primary' 
        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const CategoryCard: React.FC<{ category: any }> = ({ category }) => (
  <div className="neo-card p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold">{category.name}</h3>
      <div className="flex items-center">
        <span className={`text-sm font-medium ${
          category.score >= 80 ? 'text-green-500' : 
          category.score >= 60 ? 'text-amber-500' : 'text-destructive'
        }`}>
          {category.score}/100
        </span>
      </div>
    </div>
    
    <div className="space-y-3">
      {category.items.map((item: any, index: number) => (
        <div key={index} className="flex items-start">
          <StatusIcon status={item.status} />
          <div className="ml-3">
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.message}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const IssuesSection: React.FC<{ category: any }> = ({ category }) => {
  const hasIssues = category.items.some((item: any) => item.status !== 'success');
  
  if (!hasIssues) {
    return null;
  }
  
  return (
    <div className="neo-card p-6">
      <h3 className="font-semibold mb-4">{category.name}</h3>
      
      <div className="space-y-4">
        {category.items
          .filter((item: any) => item.status !== 'success')
          .map((item: any, index: number) => (
            <div key={index} className="flex items-start">
              <StatusIcon status={item.status} />
              <div className="ml-3">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.message}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />;
    default:
      return null;
  }
};

export default SeoAuditResults;
