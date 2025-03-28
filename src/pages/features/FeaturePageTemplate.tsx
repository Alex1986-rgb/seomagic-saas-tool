
import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { featuresData } from '@/components/features/featuresData';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FeaturePageTemplate: React.FC = () => {
  const { featureId } = useParams<{ featureId: string }>();
  const navigate = useNavigate();
  
  // Находим данные о функции по ID из URL
  const featureData = useMemo(() => {
    return featuresData.find(
      feature => feature.title.toLowerCase().replace(/\s+/g, '-') === featureId
    );
  }, [featureId]);
  
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
  const relatedFeatures = useMemo(() => {
    if (!featureData.category) return [];
    
    return featuresData
      .filter(feature => 
        feature.category === featureData.category && 
        feature.title !== featureData.title
      )
      .slice(0, 3);
  }, [featureData]);
  
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
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                <IconComponent className="h-16 w-16 opacity-20" />
              </div>
            </AspectRatio>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Как работает {featureData.title}</h2>
              <p className="text-muted-foreground">
                Детальное описание функции {featureData.title} будет добавлено в ближайшее время. 
                Эта функция предоставляет пользователям мощные инструменты для оптимизации и анализа их веб-сайтов, 
                помогая достичь лучших результатов в поисковых системах.
              </p>
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
                <li className="flex items-start">
                  <ChevronRight size={16} className="mt-1 mr-2 text-primary" />
                  <span>Улучшение позиций в поисковых системах</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={16} className="mt-1 mr-2 text-primary" />
                  <span>Экономия времени на ручной оптимизации</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={16} className="mt-1 mr-2 text-primary" />
                  <span>Автоматизация рутинных процессов</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight size={16} className="mt-1 mr-2 text-primary" />
                  <span>Профессиональная аналитика и отчеты</span>
                </li>
              </ul>
              
              <Button className="w-full mt-6">Попробовать бесплатно</Button>
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

export default FeaturePageTemplate;
