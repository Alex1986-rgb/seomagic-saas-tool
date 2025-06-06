
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import Layout from '@/components/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { featuresData } from '@/components/features/featuresData';
import FeatureHeader from './components/FeatureHeader';
import FeatureContent from './components/FeatureContent';
import FeatureSidebar from './components/FeatureSidebar';
import RelatedFeatures from './components/RelatedFeatures';

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
  
  const featureData = featuresData.find(
    feature => feature.title.toLowerCase().replace(/\s+/g, '-') === featureId
  );
  
  if (!featureData) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  const defaultContent = `
### Что такое ${featureData.title}?

${featureData.description}

### Как это работает?

Наш сервис использует продвинутые алгоритмы для анализа вашего сайта, выявления проблем и предоставления рекомендаций по улучшению. Мы непрерывно обновляем наши методы, чтобы соответствовать последним требованиям поисковых систем.

### Преимущества ${featureData.title}

Использование этой функции поможет вам значительно улучшить SEO-показатели вашего сайта, увеличить органический трафик и обойти конкурентов. Наши клиенты отмечают в среднем рост позиций на 37% после внедрения рекомендаций системы.

### Кому это подходит?

Эта функция идеально подойдет для владельцев сайтов, SEO-специалистов, маркетологов и всех, кто заинтересован в увеличении видимости своего сайта в поисковых системах.`;

  const relatedFeatures = featuresData
    .filter(feature => 
      feature.category === featureData.category && 
      feature.title !== featureData.title
    )
    .slice(0, 3);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <FeatureHeader 
          icon={featureData.icon}
          title={featureData.title}
          description={featureData.description}
          category={featureData.category}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <FeatureContent 
            icon={featureData.icon}
            title={featureData.title}
            content={featureData.content || defaultContent}
          />
          <FeatureSidebar 
            benefits={featureData.benefits || defaultBenefits}
          />
        </div>
        
        <RelatedFeatures features={relatedFeatures} />
      </div>
    </Layout>
  );
};

export default FeatureDetail;
