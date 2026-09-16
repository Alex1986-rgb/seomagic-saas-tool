
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_CONTACTS } from '@/config/site-contacts';

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
          
          {/*
            В полях по умолчанию стояли выдуманные контакты: info@seomarket.ru
            и +7 (999) 123-45-67. Админ сохранял настройки не глядя — и выдумка
            расходилась дальше по сайту. Теперь подставляется то, что есть в
            SITE_CONTACTS, а если там пусто — поле пустое с подсказкой.
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Контактный email</Label>
              <Input
                id="contact-email"
                type="email"
                defaultValue={SITE_CONTACTS.email}
                placeholder="Например, hello@вашдомен.ru"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Контактный телефон</Label>
              <Input
                id="contact-phone"
                defaultValue={SITE_CONTACTS.telephone}
                placeholder="Например, +7 495 000-00-00"
              />
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
          {/*
            Ссылки vk.com/seomarket, t.me/seomarket и youtube.com/c/seomarket
            были придуманы — таких страниц нет. Поля оставлены пустыми,
            с подсказкой формата.
          */}
          <div className="space-y-2">
            <Label htmlFor="social-vk">ВКонтакте</Label>
            <Input id="social-vk" placeholder="https://vk.com/..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="social-telegram">Telegram</Label>
            <Input id="social-telegram" placeholder="https://t.me/..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="social-youtube">YouTube</Label>
            <Input id="social-youtube" placeholder="https://youtube.com/@..." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSiteSettings;
