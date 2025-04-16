
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HomePageSettingsProps {
  homePageContent: {
    hero: {
      title: string;
      subtitle: string;
      buttonText: string;
      buttonUrl: string;
    };
    features: Array<{
      title: string;
      description: string;
      isVisible: boolean;
    }>;
    cta: {
      title: string;
      description: string;
      buttonText: string;
      buttonUrl: string;
      isVisible: boolean;
    }>;
  };
  updateHeroField: (field: string, value: string) => void;
  updateFeature: (index: number, field: string, value: string | boolean) => void;
  updateCtaField: (field: string, value: string | boolean) => void;
}

const HomePageSettings: React.FC<HomePageSettingsProps> = ({
  homePageContent,
  updateHeroField,
  updateFeature,
  updateCtaField
}) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default HomePageSettings;
