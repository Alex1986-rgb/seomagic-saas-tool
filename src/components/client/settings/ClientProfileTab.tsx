
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from 'lucide-react';

const ClientProfileTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input id="name" defaultValue="Иван Петров" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue="ivan@example.com" type="email" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Компания (опционально)</Label>
          <Input id="company" defaultValue="ООО Техно" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Телефон (опционально)</Label>
          <Input id="phone" defaultValue="+7 (900) 123-45-67" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">О себе (опционально)</Label>
        <Textarea 
          id="bio" 
          rows={4}
          defaultValue="SEO-специалист с опытом более 5 лет. Работаю с интернет-магазинами и сервисными компаниями."
        />
      </div>
      
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          <span>Сохранить изменения</span>
        </Button>
      </div>
    </div>
  );
};

export default ClientProfileTab;
