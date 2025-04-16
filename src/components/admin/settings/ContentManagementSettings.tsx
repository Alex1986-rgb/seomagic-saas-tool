
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Edit, LayoutTemplate, Type, Button as ButtonIcon, Link } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ContentManagementSettings: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Демо-данные для главной страницы
  const [homePageContent, setHomePageContent] = useState({
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
  const [auditPageContent, setAuditPageContent] = useState({
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
  const updateHeroField = (field, value) => {
    setHomePageContent({
      ...homePageContent,
      hero: {
        ...homePageContent.hero,
        [field]: value
      }
    });
  };
  
  const updateFeature = (index, field, value) => {
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
  
  const updateCtaField = (field, value) => {
    setHomePageContent({
      ...homePageContent,
      cta: {
        ...homePageContent.cta,
        [field]: value
      }
    });
  };
  
  // Обработчики изменений для страницы аудита
  const updateAuditField = (field, value) => {
    setAuditPageContent({
      ...auditPageContent,
      [field]: value
    });
  };
  
  const updateAuditTip = (index, field, value) => {
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
            <ButtonIcon className="h-4 w-4" />
            <span>Глобальные кнопки</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            <span>Навигация</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="homePage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки Hero секции</CardTitle>
              <CardDescription>Редактирование главного блока на главной странице</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Заголовок</Label>
                <Input 
                  id="hero-title" 
                  value={homePageContent.hero.title}
                  onChange={(e) => updateHeroField('title', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Подзаголовок</Label>
                <Textarea 
                  id="hero-subtitle" 
                  rows={3}
                  value={homePageContent.hero.subtitle}
                  onChange={(e) => updateHeroField('subtitle', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-button-text">Текст кнопки</Label>
                  <Input 
                    id="hero-button-text" 
                    value={homePageContent.hero.buttonText}
                    onChange={(e) => updateHeroField('buttonText', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hero-button-url">URL кнопки</Label>
                  <Input 
                    id="hero-button-url" 
                    value={homePageContent.hero.buttonUrl}
                    onChange={(e) => updateHeroField('buttonUrl', e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Особенности сервиса</CardTitle>
              <CardDescription>Настройка блоков с преимуществами сервиса</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {homePageContent.features.map((feature, index) => (
                <div key={index} className="p-4 border rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Особенность #{index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <Switch 
                        id={`feature-visible-${index}`} 
                        checked={feature.isVisible}
                        onCheckedChange={(checked) => updateFeature(index, 'isVisible', checked)}
                      />
                      <Label htmlFor={`feature-visible-${index}`}>Видимость</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`feature-title-${index}`}>Заголовок</Label>
                    <Input 
                      id={`feature-title-${index}`} 
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`feature-desc-${index}`}>Описание</Label>
                    <Textarea 
                      id={`feature-desc-${index}`} 
                      rows={2}
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Призыв к действию (CTA)</CardTitle>
              <CardDescription>Настройка блока в конце страницы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-end gap-2 mb-4">
                <Switch 
                  id="cta-visible" 
                  checked={homePageContent.cta.isVisible}
                  onCheckedChange={(checked) => updateCtaField('isVisible', checked)}
                />
                <Label htmlFor="cta-visible">Показывать блок</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cta-title">Заголовок</Label>
                <Input 
                  id="cta-title" 
                  value={homePageContent.cta.title}
                  onChange={(e) => updateCtaField('title', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cta-description">Описание</Label>
                <Textarea 
                  id="cta-description" 
                  rows={3}
                  value={homePageContent.cta.description}
                  onChange={(e) => updateCtaField('description', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-button-text">Текст кнопки</Label>
                  <Input 
                    id="cta-button-text" 
                    value={homePageContent.cta.buttonText}
                    onChange={(e) => updateCtaField('buttonText', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cta-button-url">URL кнопки</Label>
                  <Input 
                    id="cta-button-url" 
                    value={homePageContent.cta.buttonUrl}
                    onChange={(e) => updateCtaField('buttonUrl', e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="auditPage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки страницы аудита</CardTitle>
              <CardDescription>Редактирование текстов на странице аудита</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audit-title">Заголовок страницы</Label>
                <Input 
                  id="audit-title" 
                  value={auditPageContent.title}
                  onChange={(e) => updateAuditField('title', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audit-description">Описание</Label>
                <Textarea 
                  id="audit-description" 
                  rows={3}
                  value={auditPageContent.description}
                  onChange={(e) => updateAuditField('description', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="audit-placeholder">Текст placeholder</Label>
                  <Input 
                    id="audit-placeholder" 
                    value={auditPageContent.placeholderText}
                    onChange={(e) => updateAuditField('placeholderText', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="audit-button-text">Текст кнопки</Label>
                  <Input 
                    id="audit-button-text" 
                    value={auditPageContent.buttonText}
                    onChange={(e) => updateAuditField('buttonText', e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Подсказки для пользователей</CardTitle>
              <CardDescription>Настройка подсказок на странице аудита</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {auditPageContent.tips.map((tip, index) => (
                <div key={index} className="p-4 border rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Подсказка #{index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <Switch 
                        id={`tip-visible-${index}`} 
                        checked={tip.isVisible}
                        onCheckedChange={(checked) => updateAuditTip(index, 'isVisible', checked)}
                      />
                      <Label htmlFor={`tip-visible-${index}`}>Видимость</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`tip-text-${index}`}>Текст подсказки</Label>
                    <Input 
                      id={`tip-text-${index}`} 
                      value={tip.text}
                      onChange={(e) => updateAuditTip(index, 'text', e.target.value)} 
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Глобальные кнопки</CardTitle>
              <CardDescription>Настройка основных кнопок по всему сайту</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-button-text">Текст основной кнопки</Label>
                    <Input 
                      id="primary-button-text" 
                      defaultValue="Проверить сайт" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary-button-color">Цвет основной кнопки</Label>
                    <Select defaultValue="default">
                      <SelectTrigger id="primary-button-color">
                        <SelectValue placeholder="Выберите цвет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Стандартный (синий)</SelectItem>
                        <SelectItem value="green">Зеленый</SelectItem>
                        <SelectItem value="red">Красный</SelectItem>
                        <SelectItem value="purple">Фиолетовый</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondary-button-text">Текст вторичной кнопки</Label>
                    <Input 
                      id="secondary-button-text" 
                      defaultValue="Подробнее" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="button-radius">Скругление углов кнопок</Label>
                    <Select defaultValue="md">
                      <SelectTrigger id="button-radius">
                        <SelectValue placeholder="Выберите размер" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Без скругления</SelectItem>
                        <SelectItem value="sm">Маленькое</SelectItem>
                        <SelectItem value="md">Среднее</SelectItem>
                        <SelectItem value="lg">Большое</SelectItem>
                        <SelectItem value="full">Полное</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="button-size">Размер кнопок</Label>
                  <Select defaultValue="default">
                    <SelectTrigger id="button-size">
                      <SelectValue placeholder="Выберите размер" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Маленький</SelectItem>
                      <SelectItem value="default">Стандартный</SelectItem>
                      <SelectItem value="lg">Большой</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки навигации</CardTitle>
              <CardDescription>Управление меню и навигацией по сайту</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Пункты главного меню</Label>
                  <div className="space-y-3">
                    {[
                      { name: 'Главная', url: '/' },
                      { name: 'Аудит', url: '/audit' },
                      { name: 'Цены', url: '/pricing' },
                      { name: 'О нас', url: '/about' },
                      { name: 'Контакты', url: '/contact' }
                    ].map((item, index) => (
                      <div key={index} className="p-4 border rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.url}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-2">
                    Добавить пункт меню
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
