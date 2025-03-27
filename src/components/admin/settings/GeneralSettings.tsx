
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save } from 'lucide-react';

const GeneralSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="site-name">Название сайта</Label>
          <Input id="site-name" defaultValue="SeoMarket" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-url">URL сайта</Label>
          <Input id="site-url" defaultValue="https://seomarket.ru" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email администратора</Label>
          <Input id="admin-email" defaultValue="admin@seomarket.ru" type="email" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact-email">Контактный Email</Label>
          <Input id="contact-email" defaultValue="support@seomarket.ru" type="email" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="site-description">Описание сайта</Label>
        <Textarea 
          id="site-description" 
          rows={4}
          defaultValue="SeoMarket - платформа для SEO-аудита и автоматической оптимизации сайтов."
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="maintenance-mode" />
        <Label htmlFor="maintenance-mode">Режим технического обслуживания</Label>
      </div>
      
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          <span>Сохранить настройки</span>
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;
