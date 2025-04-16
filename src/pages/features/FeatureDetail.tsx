
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { featuresData } from '@/components/features/featuresData';
import FeatureHeader from '@/components/features/detail/FeatureHeader';
import FeatureBenefits from '@/components/features/detail/FeatureBenefits';
import RelatedFeatures from '@/components/features/detail/RelatedFeatures';

const defaultBenefits = [
  'Повышение позиций в поисковых системах',
  'Улучшение пользовательского опыта',
  'Экономия времени на ручной оптимизации',
  'Выявление скрытых проблем на сайте',
  'Получение конкурентного преимущества'
];

const FeatureDetail: React.FC = () => {
  const { featureId } = useParams<{ featureId: string }>();
  const navigate = useNavigate();
  
  const featureData = useMemo(() => {
    return featuresData.find(
      feature => feature.title.toLowerCase().replace(/\s+/g, '-') === featureId
    );
  }, [featureId]);

  const relatedFeatures = useMemo(() => {
    if (!featureData?.category) return [];
    
    return featuresData
      .filter(feature => 
        feature.category === featureData.category && 
        feature.title !== featureData.title
      )
      .slice(0, 3);
  }, [featureData]);
  
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

  const IconComponent = featureData.icon;
  const benefits = featureData.benefits || defaultBenefits;

  return (
    <div className="container mx-auto px-4 py-16">
      <FeatureHeader 
        icon={IconComponent}
        title={featureData.title}
        description={featureData.description}
        category={featureData.category}
      />
      
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
                {featureData.content || `Детальное описание функции ${featureData.title} будет добавлено в ближайшее время. 
                Эта функция предоставляет пользователям мощные инструменты для оптимизации и анализа их веб-сайтов, 
                помогая достичь лучших результатов в поисковых системах.`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FeatureBenefits benefits={benefits} />
        </motion.div>
      </div>
      
      <RelatedFeatures features={relatedFeatures} />
    </div>
  );
};

export default FeatureDetail;
