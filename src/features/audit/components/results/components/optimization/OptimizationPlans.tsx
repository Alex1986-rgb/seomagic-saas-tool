
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface OptimizationPlanProps {
  title: string;
  pagesLimit: string;
  discount: string | null;
  price: string | number;
  features: string[];
  popular?: boolean;
  onClick?: () => void;
}

const OptimizationPlan: React.FC<OptimizationPlanProps> = ({
  title,
  pagesLimit,
  discount,
  price,
  features,
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

const OptimizationPlans: React.FC = () => {
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
    <div className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Выберите подходящий тариф</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Мы предлагаем различные тарифы для оптимизации вашего сайта в зависимости от его размера.
          Чем больше страниц, тем выше скидка!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
        <OptimizationPlan
          title="Начальный"
          pagesLimit="до 3 страниц"
          discount={null}
          price={0}
          features={[
            'Базовые рекомендации по SEO',
            'Оптимизация мета-тегов',
            'Проверка заголовков',
            'PDF-отчет с рекомендациями',
          ]}
        />
        
        <OptimizationPlan
          title="Базовый"
          pagesLimit="до 50 страниц"
          discount={null}
          price={9900}
          features={[
            'Все функции начального тарифа',
            'Оптимизация структуры URL',
            'Исправление битых ссылок',
            'Оптимизация изображений',
            'Базовая оптимизация скорости',
          ]}
        />
        
        <OptimizationPlan
          title="Стандарт"
          pagesLimit="до 500 страниц"
          discount="30%"
          price={34900}
          popular={true}
          features={[
            'Все функции базового тарифа',
            'Полная оптимизация контента',
            'Улучшение внутренней перелинковки',
            'Создание карты сайта',
            'Оптимизация для мобильных устройств',
            'Расширенный PDF-отчет'
          ]}
        />
        
        <OptimizationPlan
          title="Бизнес"
          pagesLimit="до 1000 страниц"
          discount="50%"
          price={47500}
          features={[
            'Все функции стандартного тарифа',
            'Приоритетное обслуживание',
            'Исправление дублирующегося контента',
            'Расширенная микроразметка',
            'Оптимизация для локального поиска',
            'Ежемесячный мониторинг',
            'Консультация со специалистом'
          ]}
        />
        
        <OptimizationPlan
          title="Корпоративный"
          pagesLimit="от 1000 страниц"
          discount="80%"
          price={19900}
          features={[
            'Все функции бизнес-тарифа',
            'Персональный менеджер',
            'Индивидуальная стратегия SEO',
            'API доступ к отчетам',
            'Еженедельный мониторинг',
            'Оптимизация конверсии',
            'White label отчеты'
          ]}
        />
      </div>
      
      <div className="bg-muted/30 border rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Виды оптимизации, которые мы выполняем</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {optimizationTypes.map((type, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>{type}</span>
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
