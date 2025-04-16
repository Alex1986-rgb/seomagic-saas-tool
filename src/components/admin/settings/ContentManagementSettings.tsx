
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, LayoutTemplate, Type, Link, User, Mail, Tag, Bell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  HomePageSettings,
  AuditPageSettings,
  ButtonsSettings,
  NavigationSettings,
  AboutPageSettings,
  ContactPageSettings,
  PricingSettings,
  NotificationSettings
} from './content';
import { 
  HomePageContent, 
  AuditPageContent, 
  AboutPageContent, 
  ContactPageContent,
  PricingPlanContent,
  NotificationSettings as NotificationSettingsType
} from './content/types';

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
  
  // Демо-данные для страницы О нас
  const [aboutPageContent, setAboutPageContent] = useState<AboutPageContent>({
    title: "О нашей компании",
    subtitle: "Мы помогаем бизнесу расти с помощью современных SEO-технологий",
    sections: [
      {
        title: "Наша миссия",
        content: "Наша миссия - сделать SEO-оптимизацию доступной для каждого. Мы создаем инновационные инструменты, которые помогают бизнесу любого размера повысить видимость в поисковых системах.",
        isVisible: true
      },
      {
        title: "История компании",
        content: "Компания SeoMarket была основана в 2020 году группой специалистов в области SEO и искусственного интеллекта. За короткое время мы стали одним из лидеров на рынке автоматической SEO-оптимизации.",
        isVisible: true
      }
    ],
    team: [
      {
        name: "Александр Петров",
        position: "Генеральный директор",
        photo: "/images/team/ceo.jpg",
        isVisible: true
      },
      {
        name: "Елена Смирнова",
        position: "Технический директор",
        photo: "/images/team/cto.jpg",
        isVisible: true
      }
    ]
  });
  
  // Демо-данные для страницы Контакты
  const [contactPageContent, setContactPageContent] = useState<ContactPageContent>({
    title: "Свяжитесь с нами",
    subtitle: "Мы всегда готовы ответить на ваши вопросы",
    address: "г. Москва, ул. Примерная, д. 123",
    phone: "+7 (999) 123-45-67",
    email: "info@seomarket.ru",
    mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.1144353506524!2d37.62051067680669!3d55.75375633337604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a50b315e573%3A0xa886bf5a3d9b2e68!2z0JzQvtGB0LrQvtCy0YHQutC40Lkg0JrRgNC10LzQu9GM!5e0!3m2!1sru!2sru!4v1649152758930!5m2!1sru!2sru" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
    formFields: [
      {
        name: "name",
        label: "Ваше имя",
        type: "text",
        required: true,
        isVisible: true
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        isVisible: true
      },
      {
        name: "message",
        label: "Сообщение",
        type: "textarea",
        required: true,
        isVisible: true
      }
    ]
  });
  
  // Демо-данные для ценовых планов
  const [pricingContent, setPricingContent] = useState<PricingPlanContent>({
    plans: [
      {
        name: "Базовый",
        price: 990,
        period: "месяц",
        features: [
          "1 сайт",
          "Базовый SEO-аудит",
          "10 запросов для проверки позиций",
          "PDF-отчет"
        ],
        isRecommended: false,
        buttonText: "Выбрать",
        isVisible: true
      },
      {
        name: "Стандарт",
        price: 2900,
        period: "месяц",
        features: [
          "До 5 сайтов",
          "Полный SEO-аудит",
          "100 запросов для проверки позиций",
          "Все форматы отчетов",
          "Приоритетная поддержка"
        ],
        isRecommended: true,
        buttonText: "Выбрать",
        isVisible: true
      },
      {
        name: "Премиум",
        price: 9900,
        period: "месяц",
        features: [
          "Неограниченное количество сайтов",
          "Расширенный SEO-аудит",
          "Неограниченные запросы для проверки позиций",
          "API доступ",
          "White label отчеты",
          "Выделенная поддержка"
        ],
        isRecommended: false,
        buttonText: "Выбрать",
        isVisible: true
      }
    ],
    comparisons: [
      {
        feature: "SEO аудит",
        basic: true,
        pro: true,
        enterprise: true
      },
      {
        feature: "Проверка позиций",
        basic: true,
        pro: true,
        enterprise: true
      },
      {
        feature: "PDF отчеты",
        basic: true,
        pro: true,
        enterprise: true
      },
      {
        feature: "API доступ",
        basic: false,
        pro: false,
        enterprise: true
      },
      {
        feature: "White Label",
        basic: false,
        pro: false,
        enterprise: true
      }
    ]
  });
  
  // Демо-данные для настроек уведомлений
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>({
    email: {
      enabled: true,
      templates: [
        {
          name: "Регистрация",
          subject: "Добро пожаловать в SeoMarket!",
          content: "Здравствуйте, {{имя}}! Мы рады приветствовать вас в нашем сервисе. Для подтверждения регистрации перейдите по ссылке: {{ссылка}}",
          isEnabled: true
        },
        {
          name: "Завершение аудита",
          subject: "Ваш SEO аудит готов",
          content: "Здравствуйте, {{имя}}! Мы завершили аудит вашего сайта {{сайт}}. Результаты доступны по ссылке: {{ссылка}}",
          isEnabled: true
        }
      ]
    },
    site: {
      enabled: true,
      notifications: [
        {
          title: "Добро пожаловать!",
          content: "Приветствуем в системе управления SEO. Начните с бесплатного аудита вашего сайта.",
          type: "info",
          isEnabled: true
        },
        {
          title: "Новые функции",
          content: "Мы добавили новые функции в систему отслеживания позиций. Проверьте их в своем личном кабинете.",
          type: "success",
          isEnabled: true
        }
      ]
    }
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
  
  // Обработчики изменений для страницы "О нас"
  const updateAboutField = (field: string, value: string) => {
    setAboutPageContent({
      ...aboutPageContent,
      [field]: value
    });
  };
  
  const updateSection = (index: number, field: string, value: string | boolean) => {
    const updatedSections = [...aboutPageContent.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    
    setAboutPageContent({
      ...aboutPageContent,
      sections: updatedSections
    });
  };
  
  const updateTeamMember = (index: number, field: string, value: string | boolean) => {
    const updatedTeam = [...aboutPageContent.team];
    updatedTeam[index] = {
      ...updatedTeam[index],
      [field]: value
    };
    
    setAboutPageContent({
      ...aboutPageContent,
      team: updatedTeam
    });
  };
  
  const addSection = () => {
    setAboutPageContent({
      ...aboutPageContent,
      sections: [
        ...aboutPageContent.sections,
        {
          title: "Новый раздел",
          content: "Содержание раздела",
          isVisible: true
        }
      ]
    });
  };
  
  const removeSection = (index: number) => {
    const updatedSections = [...aboutPageContent.sections];
    updatedSections.splice(index, 1);
    
    setAboutPageContent({
      ...aboutPageContent,
      sections: updatedSections
    });
  };
  
  const addTeamMember = () => {
    setAboutPageContent({
      ...aboutPageContent,
      team: [
        ...aboutPageContent.team,
        {
          name: "Новый сотрудник",
          position: "Должность",
          photo: "/images/team/default.jpg",
          isVisible: true
        }
      ]
    });
  };
  
  const removeTeamMember = (index: number) => {
    const updatedTeam = [...aboutPageContent.team];
    updatedTeam.splice(index, 1);
    
    setAboutPageContent({
      ...aboutPageContent,
      team: updatedTeam
    });
  };
  
  // Обработчики изменений для страницы "Контакты"
  const updateContactField = (field: string, value: string) => {
    setContactPageContent({
      ...contactPageContent,
      [field]: value
    });
  };
  
  const updateFormField = (index: number, field: string, value: string | boolean) => {
    const updatedFormFields = [...contactPageContent.formFields];
    updatedFormFields[index] = {
      ...updatedFormFields[index],
      [field]: value
    };
    
    setContactPageContent({
      ...contactPageContent,
      formFields: updatedFormFields
    });
  };
  
  const addFormField = () => {
    setContactPageContent({
      ...contactPageContent,
      formFields: [
        ...contactPageContent.formFields,
        {
          name: `field${contactPageContent.formFields.length + 1}`,
          label: "Новое поле",
          type: "text",
          required: false,
          isVisible: true
        }
      ]
    });
  };
  
  const removeFormField = (index: number) => {
    const updatedFormFields = [...contactPageContent.formFields];
    updatedFormFields.splice(index, 1);
    
    setContactPageContent({
      ...contactPageContent,
      formFields: updatedFormFields
    });
  };
  
  // Обработчики изменений для ценовых планов
  const updatePlan = (index: number, field: string, value: string | number | boolean) => {
    const updatedPlans = [...pricingContent.plans];
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: value
    };
    
    setPricingContent({
      ...pricingContent,
      plans: updatedPlans
    });
  };
  
  const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    const updatedPlans = [...pricingContent.plans];
    const updatedFeatures = [...updatedPlans[planIndex].features];
    updatedFeatures[featureIndex] = value;
    
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      features: updatedFeatures
    };
    
    setPricingContent({
      ...pricingContent,
      plans: updatedPlans
    });
  };
  
  const addPlanFeature = (planIndex: number) => {
    const updatedPlans = [...pricingContent.plans];
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      features: [...updatedPlans[planIndex].features, "Новая функция"]
    };
    
    setPricingContent({
      ...pricingContent,
      plans: updatedPlans
    });
  };
  
  const removePlanFeature = (planIndex: number, featureIndex: number) => {
    const updatedPlans = [...pricingContent.plans];
    const updatedFeatures = [...updatedPlans[planIndex].features];
    updatedFeatures.splice(featureIndex, 1);
    
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      features: updatedFeatures
    };
    
    setPricingContent({
      ...pricingContent,
      plans: updatedPlans
    });
  };
  
  const addPlan = () => {
    setPricingContent({
      ...pricingContent,
      plans: [
        ...pricingContent.plans,
        {
          name: "Новый план",
          price: 0,
          period: "месяц",
          features: ["Функция 1", "Функция 2"],
          isRecommended: false,
          buttonText: "Выбрать",
          isVisible: true
        }
      ]
    });
  };
  
  const removePlan = (index: number) => {
    const updatedPlans = [...pricingContent.plans];
    updatedPlans.splice(index, 1);
    
    setPricingContent({
      ...pricingContent,
      plans: updatedPlans
    });
  };
  
  const updateComparison = (index: number, field: string, value: boolean) => {
    const updatedComparisons = [...pricingContent.comparisons];
    updatedComparisons[index] = {
      ...updatedComparisons[index],
      [field]: value
    };
    
    setPricingContent({
      ...pricingContent,
      comparisons: updatedComparisons
    });
  };
  
  const addComparisonFeature = () => {
    setPricingContent({
      ...pricingContent,
      comparisons: [
        ...pricingContent.comparisons,
        {
          feature: "Новая функция",
          basic: false,
          pro: true,
          enterprise: true
        }
      ]
    });
  };
  
  const removeComparisonFeature = (index: number) => {
    const updatedComparisons = [...pricingContent.comparisons];
    updatedComparisons.splice(index, 1);
    
    setPricingContent({
      ...pricingContent,
      comparisons: updatedComparisons
    });
  };
  
  // Обработчики изменений для уведомлений
  const updateEmailSettings = (field: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      email: {
        ...notificationSettings.email,
        [field]: value
      }
    });
  };
  
  const updateEmailTemplate = (index: number, field: string, value: string | boolean) => {
    const updatedTemplates = [...notificationSettings.email.templates];
    updatedTemplates[index] = {
      ...updatedTemplates[index],
      [field]: value
    };
    
    setNotificationSettings({
      ...notificationSettings,
      email: {
        ...notificationSettings.email,
        templates: updatedTemplates
      }
    });
  };
  
  const addEmailTemplate = () => {
    setNotificationSettings({
      ...notificationSettings,
      email: {
        ...notificationSettings.email,
        templates: [
          ...notificationSettings.email.templates,
          {
            name: "Новый шаблон",
            subject: "Тема письма",
            content: "Содержание письма",
            isEnabled: true
          }
        ]
      }
    });
  };
  
  const removeEmailTemplate = (index: number) => {
    const updatedTemplates = [...notificationSettings.email.templates];
    updatedTemplates.splice(index, 1);
    
    setNotificationSettings({
      ...notificationSettings,
      email: {
        ...notificationSettings.email,
        templates: updatedTemplates
      }
    });
  };
  
  const updateSiteSettings = (field: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      site: {
        ...notificationSettings.site,
        [field]: value
      }
    });
  };
  
  const updateSiteNotification = (index: number, field: string, value: string | boolean) => {
    const updatedNotifications = [...notificationSettings.site.notifications];
    updatedNotifications[index] = {
      ...updatedNotifications[index],
      [field]: value
    };
    
    setNotificationSettings({
      ...notificationSettings,
      site: {
        ...notificationSettings.site,
        notifications: updatedNotifications
      }
    });
  };
  
  const addSiteNotification = () => {
    setNotificationSettings({
      ...notificationSettings,
      site: {
        ...notificationSettings.site,
        notifications: [
          ...notificationSettings.site.notifications,
          {
            title: "Новое уведомление",
            content: "Текст уведомления",
            type: "info",
            isEnabled: true
          }
        ]
      }
    });
  };
  
  const removeSiteNotification = (index: number) => {
    const updatedNotifications = [...notificationSettings.site.notifications];
    updatedNotifications.splice(index, 1);
    
    setNotificationSettings({
      ...notificationSettings,
      site: {
        ...notificationSettings.site,
        notifications: updatedNotifications
      }
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
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="homePage" className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4" />
            <span>Главная страница</span>
          </TabsTrigger>
          <TabsTrigger value="auditPage" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Страница аудита</span>
          </TabsTrigger>
          <TabsTrigger value="aboutPage" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>О нас</span>
          </TabsTrigger>
          <TabsTrigger value="contactPage" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Контакты</span>
          </TabsTrigger>
          <TabsTrigger value="pricingPage" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Цены</span>
          </TabsTrigger>
          <TabsTrigger value="buttons" className="flex items-center gap-2">
            <span className="i-lucide-button h-4 w-4"></span>
            <span>Глобальные кнопки</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            <span>Навигация</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Уведомления</span>
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
        
        <TabsContent value="aboutPage">
          <AboutPageSettings 
            aboutPageContent={aboutPageContent}
            updateAboutField={updateAboutField}
            updateSection={updateSection}
            updateTeamMember={updateTeamMember}
            addSection={addSection}
            removeSection={removeSection}
            addTeamMember={addTeamMember}
            removeTeamMember={removeTeamMember}
          />
        </TabsContent>
        
        <TabsContent value="contactPage">
          <ContactPageSettings 
            contactPageContent={contactPageContent}
            updateContactField={updateContactField}
            updateFormField={updateFormField}
            addFormField={addFormField}
            removeFormField={removeFormField}
          />
        </TabsContent>
        
        <TabsContent value="pricingPage">
          <PricingSettings 
            pricingContent={pricingContent}
            updatePlan={updatePlan}
            updatePlanFeature={updatePlanFeature}
            addPlanFeature={addPlanFeature}
            removePlanFeature={removePlanFeature}
            addPlan={addPlan}
            removePlan={removePlan}
            updateComparison={updateComparison}
            addComparisonFeature={addComparisonFeature}
            removeComparisonFeature={removeComparisonFeature}
          />
        </TabsContent>
        
        <TabsContent value="buttons">
          <ButtonsSettings />
        </TabsContent>
        
        <TabsContent value="navigation">
          <NavigationSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings 
            notificationSettings={notificationSettings}
            updateEmailSettings={updateEmailSettings}
            updateEmailTemplate={updateEmailTemplate}
            addEmailTemplate={addEmailTemplate}
            removeEmailTemplate={removeEmailTemplate}
            updateSiteSettings={updateSiteSettings}
            updateSiteNotification={updateSiteNotification}
            addSiteNotification={addSiteNotification}
            removeSiteNotification={removeSiteNotification}
          />
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
