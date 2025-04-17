
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GeneralSiteSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основные настройки сайта</CardTitle>
          <CardDescription>Настройте общую информацию о вашем сайте</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Название сайта</Label>
            <Input id="site-name" defaultValue="SEO Market" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-description">Описание сайта</Label>
            <Textarea 
              id="site-description" 
              rows={3}
              defaultValue="Оптимизируйте ваш сайт с помощью искусственного интеллекта" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-keywords">Ключевые слова (через запятую)</Label>
            <Input 
              id="site-keywords" 
              defaultValue="SEO, оптимизация, поисковые системы, аудит сайта" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Контактный email</Label>
              <Input id="contact-email" type="email" defaultValue="info@seomarket.ru" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Контактный телефон</Label>
              <Input id="contact-phone" defaultValue="+7 (999) 123-45-67" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="maintenance-mode" />
            <Label htmlFor="maintenance-mode">Режим обслуживания</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Социальные сети</CardTitle>
          <CardDescription>Настройте ссылки на ваши социальные сети</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="social-vk">ВКонтакте</Label>
            <Input id="social-vk" defaultValue="https://vk.com/seomarket" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="social-telegram">Telegram</Label>
            <Input id="social-telegram" defaultValue="https://t.me/seomarket" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="social-youtube">YouTube</Label>
            <Input id="social-youtube" defaultValue="https://youtube.com/c/seomarket" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSiteSettings;
