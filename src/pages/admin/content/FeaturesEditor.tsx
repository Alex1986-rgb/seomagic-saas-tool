
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BaseContentEditor from '@/components/admin/content/BaseContentEditor';
import { useToast } from '@/hooks/use-toast';
import { Feature, PageSettings } from './features/types';
import PageSettingsForm from './features/PageSettingsForm';
import FeaturesList from './features/FeaturesList';

const FeaturesEditor: React.FC = () => {
  const { toast } = useToast();
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: 'Возможности платформы',
    subtitle: 'Исчерпывающий набор инструментов для анализа и оптимизации',
    layout: 'grid',
    showIcons: true
  });
  
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: '1',
      name: 'SEO Аудит',
      description: 'Полный технический и SEO анализ сайта с рекомендациями по оптимизации',
      icon: 'search',
      enabled: true,
      order: 1,
      highlight: true
    },
    {
      id: '2',
      name: 'Мониторинг позиций',
      description: 'Отслеживание позиций сайта по ключевым запросам в поисковых системах',
      icon: 'bar-chart',
      enabled: true,
      order: 2,
      highlight: false
    }
  ]);

  const handleSave = (data: any) => {
    console.log('Saving features page data:', data);
    toast({
      title: "Изменения сохранены",
      description: "Контент страницы возможностей обновлен"
    });
  };
  
  const addFeature = () => {
    const newFeature: Feature = {
      id: Date.now().toString(),
      name: 'Новая возможность',
      description: 'Описание новой возможности',
      icon: 'settings',
      enabled: true,
      order: features.length + 1,
      highlight: false
    };
    
    setFeatures([...features, newFeature]);
    
    toast({
      title: "Возможность добавлена",
      description: "Новая возможность успешно добавлена"
    });
  };
  
  const removeFeature = (id: string) => {
    setFeatures(features.filter(feature => feature.id !== id));
    
    toast({
      title: "Возможность удалена",
      description: "Возможность успешно удалена"
    });
  };
  
  const updateFeature = (id: string, field: string, value: string | boolean) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, [field]: value } : feature
    ));
  };

  const handleFeaturesReorder = (reorderedFeatures: Feature[]) => {
    setFeatures(reorderedFeatures);
    
    toast({
      title: "Порядок обновлен",
      description: "Новый порядок возможностей сохранен"
    });
  };

  return (
    <>
      <Helmet>
        <title>Редактирование возможностей | Админ панель</title>
      </Helmet>
      
      <BaseContentEditor
        title="Редактирование возможностей"
        description="Управление списком функций и возможностей платформы"
        onSave={handleSave}
      >
        <div className="space-y-6">
          <PageSettingsForm 
            settings={pageSettings}
            onSettingsChange={setPageSettings}
          />
          
          <FeaturesList
            features={features}
            onFeatureUpdate={updateFeature}
            onFeatureRemove={removeFeature}
            onFeatureAdd={addFeature}
            onFeaturesReorder={handleFeaturesReorder}
          />
        </div>
      </BaseContentEditor>
    </>
  );
};

export default FeaturesEditor;
