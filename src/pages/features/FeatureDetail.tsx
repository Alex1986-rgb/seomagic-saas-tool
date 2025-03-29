
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { featuresData } from '@/components/features/featuresData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FeatureDetail: React.FC = () => {
  const { featureId } = useParams<{ featureId: string }>();
  const navigate = useNavigate();
  
  // Находим данные о функции по ID из URL
  const featureData = featuresData.find(
    feature => feature.title.toLowerCase().replace(/\s+/g, '-') === featureId
  );
  
  // Если функция не найдена, показываем сообщение и ссылку на страницу со всеми функциями
  if (!featureData) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Alert variant="destructive" className="mb-8">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>
            Запрашиваемая функция не найдена. Возможно, URL введен неверно или функция была перемещена.
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Функция не найдена</h1>
          <Button onClick={() => navigate('/features')}>
            Вернуться к списку функций
          </Button>
        </div>
      </div>
    );
  }
  
  // Получаем компонент иконки из данных о функции
  const IconComponent = featureData.icon;
  
  // Находим связанные функции из той же категории
  const relatedFeatures = featuresData
    .filter(feature => 
      feature.category === featureData.category && 
      feature.title !== featureData.title
    )
    .slice(0, 3);

  // Стандартный набор преимуществ, если не указаны конкретные
  const defaultBenefits = [
    'Повышение позиций в поисковых системах',
    'Улучшение пользовательского опыта',
    'Экономия времени на ручной оптимизации',
    'Выявление скрытых проблем на сайте',
    'Получение конкурентного преимущества'
  ];
  
  const benefits = featureData.benefits || defaultBenefits;
  
  // Контент для детальной страницы
  const defaultContent = `
### Что такое ${featureData.title}?

${featureData.description}

### Как это работает?

Наш сервис использует продвинутые алгоритмы для анализа вашего сайта, выявления проблем и предоставления рекомендаций по улучшению. Мы непрерывно обновляем наши методы, чтобы соответствовать последним требованиям поисковых систем.

### Преимущества ${featureData.title}

Использование этой функции поможет вам значительно улучшить SEO-показатели вашего сайта, увеличить органический трафик и обойти конкурентов. Наши клиенты отмечают в среднем рост позиций на 37% после внедрения рекомендаций системы.

### Кому это подходит?

Эта функция идеально подойдет для владельцев сайтов, SEO-специалистов, маркетологов и всех, кто заинтересован в увеличении видимости своего сайта в поисковых системах.
  `;

  const content = featureData.content || defaultContent;
  
  // Генерация параграфов из контента (простая обработка текста)
  const paragraphs = content.split('\n\n').map((paragraph, index) => {
    if (paragraph.startsWith('###')) {
      const title = paragraph.replace('###', '').trim();
      return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{title}</h3>;
    }
    return <p key={index} className="mb-4 text-muted-foreground">{paragraph}</p>;
  });

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {/* Навигация */}
      <div className="mb-8">
        <Link to="/features" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          <span>Все функции</span>
        </Link>
      </div>
      
      {/* Шапка функции */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
          {featureData.category && (
            <Badge variant="secondary" className="text-xs">
              {featureData.category}
            </Badge>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{featureData.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {featureData.description}
        </p>
      </motion.div>
      
      {/* Основное содержимое */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            {featureData.imageUrl ? (
              <AspectRatio ratio={16 / 9}>
                <img 
                  src={featureData.imageUrl} 
                  alt={featureData.title} 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            ) : (
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                  <IconComponent className="h-16 w-16 opacity-20" />
                </div>
              </AspectRatio>
            )}
            
            <CardContent className="p-6">
              <div className="prose max-w-none">
                {paragraphs}
              </div>
              
              <Accordion type="single" collapsible className="mt-8">
                <AccordionItem value="faq-1">
                  <AccordionTrigger>Как начать использовать {featureData.title}?</AccordionTrigger>
                  <AccordionContent>
                    Чтобы начать использовать эту функцию, просто зарегистрируйтесь на нашей платформе, 
                    добавьте свой сайт в систему и выберите соответствующую опцию в панели управления.
                    Наша система автоматически проведет анализ и предоставит вам результаты.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>Какие результаты можно ожидать?</AccordionTrigger>
                  <AccordionContent>
                    Большинство наших клиентов отмечают значительное улучшение позиций в поисковой 
                    выдаче уже через 2-4 недели после внедрения рекомендаций системы. В среднем, 
                    органический трафик вырастает на 35-50% в течение первых трех месяцев.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Преимущества</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={16} className="mt-1 mr-2 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full mt-8">Попробовать бесплатно</Button>
            </CardContent>
          </Card>
          
          {/* Детальная информация о функции */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Характеристики</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Скорость работы</span>
                  <span className="font-medium">Мгновенно</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Частота проверок</span>
                  <span className="font-medium">Ежедневно</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Доступ к данным</span>
                  <span className="font-medium">В реальном времени</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Экспорт отчетов</span>
                  <span className="font-medium">PDF, HTML, CSV</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Связанные функции */}
      {relatedFeatures.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Похожие функции</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <Link to={feature.link || `/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Подробнее
                      <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FeatureDetail;
