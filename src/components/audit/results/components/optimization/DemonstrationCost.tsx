
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CostSummary from './CostSummary';
import CostDetailsTable from './CostDetailsTable';
import PaymentDialog from './PaymentDialog';
import EstimateSelectors from './EstimateSelectors';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { v4 as uuidv4 } from 'uuid';

// Helper functions
const generateRandomPageCount = (): number => {
  return Math.floor(Math.random() * 100) + 10; // 10-110 pages
};

const calculateTotalCost = (items: OptimizationItem[]): number => {
  return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
};

const generateDemoOptimizationItems = (pageCount: number): OptimizationItem[] => {
  const items: OptimizationItem[] = [];
  
  items.push({
    id: "base-cost",
    page: "Весь сайт",
    tasks: ["Базовая настройка оптимизации"],
    cost: 5000,
    priority: "high",
    category: "base",
    name: "Базовая стоимость",
    description: "Базовые работы по настройке",
    count: 1,
    price: 5000,
    totalPrice: 5000,
    errorCount: 3
  });
  
  const pageCost = 300;
  items.push({
    id: "meta-tags",
    page: "Все страницы",
    tasks: ["Оптимизация мета-тегов"],
    cost: pageCost * pageCount,
    priority: "high",
    category: "meta",
    name: "Оптимизация мета-тегов",
    description: `Оптимизация для ${pageCount} страниц`,
    count: pageCount,
    price: pageCost,
    totalPrice: pageCost * pageCount,
    errorCount: Math.ceil(pageCount * 0.6)
  });
  
  return items;
};

const KEY_TO_ITEM_NAME: Record<string, string> = {
  'fix-code-errors': 'Исправление ошибок в коде',
  'optimize-meta': 'Оптимизация мета-тегов',
  'fix-broken-links': 'Исправление битых ссылок',
  'improve-speed': 'Улучшение скорости загрузки',
  'content-seo-texts': 'Оптимизация контента',
  'heading-structure': 'Улучшение структуры заголовков',
  'add-keywords': 'Добавление ключевых слов',
  'readability': 'Повышение читабельности',
  'result-rankings': 'Повышение позиций в поиске',
  'result-traffic': 'Увеличение посещаемости',
  'result-conversions': 'Рост конверсии',
  'result-ux': 'Улучшение пользовательского опыта',
};

type Priority = 'high' | 'medium' | 'low';

const createItem = (
  name: string,
  pageCount: number,
  price: number,
  count: number,
  category: string,
  priority: Priority,
  description?: string
): OptimizationItem => ({
  id: uuidv4(),
  name,
  description: description || name,
  count,
  price,
  totalPrice: count * price,
  category,
  priority,
  page: 'все страницы',
  tasks: [name],
  cost: count * price,
  errorCount: Math.ceil(count * 0.6),
});

const AVAILABLE_ITEMS: Record<string, (pageCount: number) => OptimizationItem> = {
  'fix-code-errors': (pc) =>
    createItem(
      KEY_TO_ITEM_NAME['fix-code-errors'],
      pc,
      400,
      Math.ceil(pc * 0.3),
      'technical',
      'high',
      'Поиск и исправление ошибок, влияющих на индексирование и стабильность'
    ),
  'optimize-meta': (pc) =>
    createItem(
      KEY_TO_ITEM_NAME['optimize-meta'],
      pc,
      150,
      Math.ceil(pc * 0.7),
      'meta',
      'high',
      'Улучшение заголовков, описаний и ключевых слов'
    ),
  'fix-broken-links': (pc) =>
    createItem(
      KEY_TO_ITEM_NAME['fix-broken-links'],
      pc,
      120,
      Math.ceil(pc * 0.2),
      'links',
      'medium',
      'Поиск и исправление битых внутренних и внешних ссылок'
    ),
  'improve-speed': (pc) =>
    createItem(
      KEY_TO_ITEM_NAME['improve-speed'],
      pc,
      800,
      Math.ceil(pc * 0.2),
      'performance',
      'high',
      'Оптимизация кода и ресурсов для ускорения загрузки'
    ),
  'content-seo-texts': (pc) =>
    createItem(
      KEY_TO_ITEM_NAME['content-seo-texts'],
      pc,
      500,
      Math.ceil(pc * 0.5),
      'content',
      'high',
      'Оптимизация текстов с учетом ключевых запросов'
    ),
  'heading-structure': (pc) =>
    createItem(
      KEY_TO_ITEM_NAME['heading-structure'],
      pc,
      200,
      Math.ceil(pc * 0.4),
      'structure',
      'medium',
      'Правильная иерархия H1–H3 для лучшей семантики'
    ),
  'add-keywords': (pc) =>
    createItem(
      KEY_TO_ITEM_NAME['add-keywords'],
      pc,
      100,
      Math.ceil(pc * 0.5),
      'content',
      'medium',
      'Добавление релевантных ключевых слов в контент'
    ),
  'readability': (pc) =>
    createItem(
      KEY_TO_ITEM_NAME['readability'],
      pc,
      150,
      Math.ceil(pc * 0.5),
      'content',
      'low',
      'Повышение удобочитаемости и структурирование текста'
    ),
  // Результаты работы (информационные, без стоимости)
  'result-rankings': () =>
    createItem(KEY_TO_ITEM_NAME['result-rankings'], 1, 0, 1, 'results', 'low', 'Ожидаемое улучшение видимости в поиске'),
  'result-traffic': () =>
    createItem(KEY_TO_ITEM_NAME['result-traffic'], 1, 0, 1, 'results', 'low', 'Ожидаемый рост органического трафика'),
  'result-conversions': () =>
    createItem(KEY_TO_ITEM_NAME['result-conversions'], 1, 0, 1, 'results', 'low', 'Положительное влияние на конверсию'),
  'result-ux': () =>
    createItem(KEY_TO_ITEM_NAME['result-ux'], 1, 0, 1, 'results', 'low', 'Лучшая навигация и взаимодействие'),
};


const DemonstrationCost: React.FC = () => {
  const { toast } = useToast();
  const [pageCount, setPageCount] = useState<number>(0);
  const [optimizationItems, setOptimizationItems] = useState<OptimizationItem[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Инициализация: количество страниц и выбор всех пунктов
    const randomPageCount = generateRandomPageCount();
    setPageCount(randomPageCount);
    setSelectedKeys(new Set(Object.keys(AVAILABLE_ITEMS)));
  }, []);

  // Пересчет сметы при изменении выбранных пунктов или количества страниц
  useEffect(() => {
    if (!pageCount) return;
    const items: OptimizationItem[] = Array.from(selectedKeys)
      .map((key) => AVAILABLE_ITEMS[key]?.(pageCount))
      .filter(Boolean) as OptimizationItem[];

    setOptimizationItems(items);
    const cost = items.filter(i => i.price > 0).reduce((sum, i) => sum + (i.totalPrice || 0), 0);
    setTotalCost(cost);
  }, [selectedKeys, pageCount]);

  const handleToggle = (key: string, selected: boolean) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (selected) next.add(key); else next.delete(key);
      return next;
    });
  };

  const groups = [
    {
      title: 'Технические улучшения',
      items: [
        { key: 'fix-code-errors', label: 'Исправление ошибок в коде', selected: selectedKeys.has('fix-code-errors') },
        { key: 'optimize-meta', label: 'Оптимизация мета-тегов', selected: selectedKeys.has('optimize-meta') },
        { key: 'fix-broken-links', label: 'Исправление битых ссылок', selected: selectedKeys.has('fix-broken-links') },
        { key: 'improve-speed', label: 'Улучшение скорости загрузки', selected: selectedKeys.has('improve-speed') },
      ],
    },
    {
      title: 'Контентные улучшения',
      items: [
        { key: 'content-seo-texts', label: 'Оптимизация текстов для SEO', selected: selectedKeys.has('content-seo-texts') },
        { key: 'heading-structure', label: 'Улучшение структуры заголовков', selected: selectedKeys.has('heading-structure') },
        { key: 'add-keywords', label: 'Добавление ключевых слов', selected: selectedKeys.has('add-keywords') },
        { key: 'readability', label: 'Повышение читабельности', selected: selectedKeys.has('readability') },
      ],
    },
    {
      title: 'Результаты работы',
      items: [
        { key: 'result-rankings', label: 'Повышение позиций в поиске', selected: selectedKeys.has('result-rankings') },
        { key: 'result-traffic', label: 'Увеличение посещаемости', selected: selectedKeys.has('result-traffic') },
        { key: 'result-conversions', label: 'Рост конверсии', selected: selectedKeys.has('result-conversions') },
        { key: 'result-ux', label: 'Улучшение пользовательского опыта', selected: selectedKeys.has('result-ux') },
      ],
    },
  ];

  const handlePayment = () => {
    toast({
      title: "Оплата прошла успешно",
      description: "Оптимизация сайта начнется в ближайшее время."
    });
    
    setIsOptimized(true);
    setIsDialogOpen(false);
  };

  const handleRegenerateData = () => {
    const randomPageCount = generateRandomPageCount();
    setPageCount(randomPageCount);
    
    const items = generateDemoOptimizationItems(randomPageCount);
    setOptimizationItems(items);
    
    const cost = calculateTotalCost(items);
    setTotalCost(cost);
    
    setIsOptimized(false);
    
    toast({
      title: "Данные обновлены",
      description: "Сгенерированы новые демонстрационные данные."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Смета работ по оптимизации</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerateData}
            >
              Сгенерировать новые данные
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CostSummary 
            pageCount={pageCount} 
            optimizationCost={totalCost}
            discount={pageCount > 50 ? (pageCount > 200 ? 15 : pageCount > 100 ? 10 : 5) : 0}
          />
          
          <EstimateSelectors groups={groups} onToggle={handleToggle} className="mt-6" />
          
          <CostDetailsTable items={optimizationItems} />
          
          <div className="flex justify-end mt-4">
            {!isOptimized ? (
              <PaymentDialog
                url="example.com"
                optimizationCost={totalCost}
                onPayment={handlePayment}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
              />
            ) : (
              <Button variant="outline" disabled>Оптимизация выполнена</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemonstrationCost;
