
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OptimizationPlanProps {
  title: string;
  pagesLimit: string;
  discount: string | null;
  price: string | number;
  features: string[];
  workItems: Array<{ name: string; price: number; unit: string }>;
  popular?: boolean;
  onClick?: () => void;
}

const OptimizationPlan: React.FC<OptimizationPlanProps> = ({
  title,
  pagesLimit,
  discount,
  price,
  features,
  workItems,
  popular,
  onClick
}) => {
  return (
    <motion.div 
      className={`relative rounded-xl p-6 ${
        popular ? 'border-2 border-primary' : 'border border-muted'
      } bg-card h-full flex flex-col`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)' }}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Популярный выбор
          </Badge>
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{pagesLimit}</p>
      
      {discount && (
        <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-md text-sm font-medium mb-4 inline-block">
          Скидка {discount}
        </div>
      )}
      
      <div className="text-3xl font-bold mb-6">
        {price === 0 ? 'Бесплатно' : `${price} ₽`}
      </div>
      
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="pricing">
          <AccordionTrigger className="text-sm">Стоимость работ</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 text-xs">
              {workItems.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.price} ₽/{item.unit}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button 
        variant={popular ? "default" : "outline"} 
        className="mt-auto w-full"
        onClick={onClick}
      >
        Выбрать тариф
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
};

interface OptimizationPlansProps {
  onSelectPlan?: (plan: string) => void;
}

const OptimizationPlans: React.FC<OptimizationPlansProps> = ({ onSelectPlan }) => {
  // Handle plan selection
  const handleSelectPlan = (planTitle: string) => {
    if (onSelectPlan) {
      onSelectPlan(planTitle);
    } else {
      // Default behavior if no handler is provided
      window.location.href = `/audit?plan=${planTitle}`;
    }
  };

  // Список тарифных планов с обновленной логикой
  const plans = [
    {
      title: 'Начальный',
      pagesLimit: 'до 3 страниц',
      discount: null,
      price: 9900,
      features: [
        'Технический SEO-аудит',
        'Оптимизация мета-тегов',
        'Базовые рекомендации',
        'Отчет в PDF'
      ],
      workItems: [
        { name: 'Технический аудит', price: 5000, unit: 'проект' },
        { name: 'Оптимизация мета-тегов', price: 300, unit: 'страница' },
        { name: 'Оптимизация изображений', price: 100, unit: 'изображение' },
        { name: 'Оптимизация контента', price: 500, unit: 'страница' },
      ],
      popular: false
    },
    {
      title: 'Базовый',
      pagesLimit: 'до 50 страниц',
      discount: '20%',
      price: 29900,
      features: [
        'Все из начального плана',
        'Оптимизация структуры URL',
        'Исправление битых ссылок',
        'Оптимизация изображений',
        'Техническая поддержка'
      ],
      workItems: [
        { name: 'Технический аудит', price: 5000, unit: 'проект' },
        { name: 'Оптимизация мета-тегов', price: 240, unit: 'страница' }, // 20% скидка
        { name: 'Оптимизация структуры URL', price: 160, unit: 'страница' }, // 20% скидка
        { name: 'Исправление ссылок', price: 160, unit: 'ссылка' }, // 20% скидка
        { name: 'Улучшение контента', price: 400, unit: 'страница' }, // 20% скидка
      ],
      popular: false
    },
    {
      title: 'Стандарт',
      pagesLimit: 'до 500 страниц',
      discount: '50%',
      price: 59900,
      features: [
        'Все из базового плана',
        'Оптимизация контента',
        'Структурирование данных',
        'Улучшение изображений',
        'Постоянная поддержка'
      ],
      workItems: [
        { name: 'Технический аудит', price: 5000, unit: 'проект' },
        { name: 'Оптимизация мета-тегов', price: 150, unit: 'страница' }, // 50% скидка
        { name: 'Оптимизация структуры URL', price: 100, unit: 'страница' }, // 50% скидка
        { name: 'Исправление ссылок', price: 100, unit: 'ссылка' }, // 50% скидка
        { name: 'Улучшение контента', price: 250, unit: 'страница' }, // 50% скидка
        { name: 'Внедрение микроразметки', price: 150, unit: 'шаблон' }, // 50% скидка
      ],
      popular: true
    },
    {
      title: 'Корпоративный',
      pagesLimit: 'от 1000 страниц',
      discount: '80%',
      price: 99900,
      features: [
        'Все из плана Стандарт',
        'Полная оптимизация сайта',
        'Контент-маркетинг',
        'Анализ конкурентов',
        'Техническая поддержка 24/7',
        'Ежемесячные отчеты'
      ],
      workItems: [
        { name: 'Технический аудит', price: 5000, unit: 'проект' },
        { name: 'Оптимизация мета-тегов', price: 60, unit: 'страница' }, // 80% скидка
        { name: 'Оптимизация структуры URL', price: 40, unit: 'страница' }, // 80% скидка
        { name: 'Исправление ссылок', price: 40, unit: 'ссылка' }, // 80% скидка
        { name: 'Улучшение контента', price: 100, unit: 'страница' }, // 80% скидка
        { name: 'Внедрение микроразметки', price: 60, unit: 'шаблон' }, // 80% скидка
        { name: 'Индивидуальная настройка', price: 20000, unit: 'месяц' },
      ],
      popular: false
    },
  ];

  const optimizationTypes = [
    'Оптимизация мета-тегов (title, description)',
    'Оптимизация заголовков (H1-H6)',
    'Исправление битых ссылок',
    'Оптимизация структуры URL',
    'Оптимизация изображений (alt-теги, сжатие)',
    'Оптимизация скорости загрузки страниц',
    'Оптимизация для мобильных устройств',
    'Исправление дублирующегося контента',
    'Улучшение текстового контента',
    'Оптимизация внутренней перелинковки',
    'Создание и оптимизация sitemap.xml',
    'Настройка robots.txt',
    'Исправление ошибок канонизации URL',
    'Оптимизация микроразметки (Schema.org)',
    'Оптимизация для локального поиска',
    'Исправление проблем индексации',
  ];

  return (
    <div className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Выберите подходящий тариф</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Мы предлагаем различные тарифы для оптимизации вашего сайта в зависимости от его размера.
          Чем больше страниц, тем выше скидка!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {plans.map((plan, index) => (
          <OptimizationPlan
            key={index}
            title={plan.title}
            pagesLimit={plan.pagesLimit}
            discount={plan.discount}
            price={plan.price}
            features={plan.features}
            workItems={plan.workItems}
            popular={plan.popular}
            onClick={() => handleSelectPlan(plan.title)}
          />
        ))}
      </div>
      
      <div className="bg-muted/30 border rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Виды оптимизации, которые мы выполняем</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {optimizationTypes.map((type, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span className="text-sm">{type}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-primary/5 border-primary/10 border rounded-xl p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Нужен индивидуальный подход?</h3>
        <p className="text-muted-foreground mb-4">
          Свяжитесь с нами для получения персонального предложения по оптимизации вашего сайта
        </p>
        <Button asChild>
          <Link to="/contact">
            Получить персональное предложение
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OptimizationPlans;
