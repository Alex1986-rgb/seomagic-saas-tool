
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, LayoutTemplate, Type, Link } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  HomePageSettings,
  AuditPageSettings,
  ButtonsSettings,
  NavigationSettings 
} from './content';
import { HomePageContent, AuditPageContent } from './content/types';

const ContentManagementSettings: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Демо-данные для главной страницы
  const [homePageContent, setHomePageContent] = useState<HomePageContent>({
    hero: {
      title: "Оптимизируйте ваш сайт с помощью искусственного интеллекта",
      subtitle: "Автоматический SEO аудит и оптимизация для улучшения видимости вашего сайта в поисковых системах",
      buttonText: "Бесплатный аудит",
      buttonUrl: "/audit"
    },
    features: [
      {
        title: "Глубокий аудит",
        description: "Анализ более 100 SEO факторов на вашем сайте",
        isVisible: true
      },
      {
        title: "Автоматическая оптимизация",
        description: "ИИ автоматически исправляет найденные проблемы",
        isVisible: true
      },
      {
        title: "Отслеживание позиций",
        description: "Мониторинг позиций вашего сайта в поисковых системах",
        isVisible: true
      }
    ],
    cta: {
      title: "Попробуйте SEO аудит бесплатно",
      description: "Получите полный отчет о состоянии вашего сайта и рекомендации по улучшению",
      buttonText: "Начать сейчас",
      buttonUrl: "/register",
      isVisible: true
    }
  });
  
  // Демо-данные для страницы аудита
  const [auditPageContent, setAuditPageContent] = useState<AuditPageContent>({
    title: "SEO Аудит вашего сайта",
    description: "Введите URL вашего сайта для получения полного SEO анализа",
    placeholderText: "Введите URL сайта...",
    buttonText: "Проверить сайт",
    tips: [
      {
        text: "Аудит занимает 1-2 минуты в зависимости от размера сайта",
        isVisible: true
      },
      {
        text: "Результаты можно скачать в PDF формате",
        isVisible: true
      },
      {
        text: "Проверяются все основные SEO факторы и ошибки",
        isVisible: true
      }
    ]
  });
  
  // Обработчики изменений для главной страницы
  const updateHeroField = (field: string, value: string) => {
    setHomePageContent({
      ...homePageContent,
      hero: {
        ...homePageContent.hero,
        [field]: value
      }
    });
  };
  
  const updateFeature = (index: number, field: string, value: string | boolean) => {
    const updatedFeatures = [...homePageContent.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    
    setHomePageContent({
      ...homePageContent,
      features: updatedFeatures
    });
  };
  
  const updateCtaField = (field: string, value: string | boolean) => {
    setHomePageContent({
      ...homePageContent,
      cta: {
        ...homePageContent.cta,
        [field]: value
      }
    });
  };
  
  // Обработчики изменений для страницы аудита
  const updateAuditField = (field: string, value: string) => {
    setAuditPageContent({
      ...auditPageContent,
      [field]: value
    });
  };
  
  const updateAuditTip = (index: number, field: string, value: string | boolean) => {
    const updatedTips = [...auditPageContent.tips];
    updatedTips[index] = {
      ...updatedTips[index],
      [field]: value
    };
    
    setAuditPageContent({
      ...auditPageContent,
      tips: updatedTips
    });
  };
  
  // Сохранение изменений
  const handleSave = () => {
    setIsSaving(true);
    
    // Имитация сохранения на сервере
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Настройки сохранены",
        description: "Изменения содержимого сайта успешно сохранены",
        variant: "default",
      });
    }, 800);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="homePage">
        <TabsList className="mb-6">
          <TabsTrigger value="homePage" className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4" />
            <span>Главная страница</span>
          </TabsTrigger>
          <TabsTrigger value="auditPage" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Страница аудита</span>
          </TabsTrigger>
          <TabsTrigger value="buttons" className="flex items-center gap-2">
            <span className="i-lucide-button h-4 w-4"></span>
            <span>Глобальные кнопки</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            <span>Навигация</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="homePage">
          <HomePageSettings 
            homePageContent={homePageContent}
            updateHeroField={updateHeroField}
            updateFeature={updateFeature}
            updateCtaField={updateCtaField}
          />
        </TabsContent>
        
        <TabsContent value="auditPage">
          <AuditPageSettings 
            auditPageContent={auditPageContent}
            updateAuditField={updateAuditField}
            updateAuditTip={updateAuditTip}
          />
        </TabsContent>
        
        <TabsContent value="buttons">
          <ButtonsSettings />
        </TabsContent>
        
        <TabsContent value="navigation">
          <NavigationSettings />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              <span>Сохранение...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Сохранить настройки контента</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContentManagementSettings;
