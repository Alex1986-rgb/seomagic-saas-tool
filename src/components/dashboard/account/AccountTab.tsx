
import React from 'react';
import { User, Lock, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export const AccountTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Информация об аккаунте</h2>
        <Button className="gap-2" onClick={() => navigate('/account/settings')}>
          <Settings size={16} className="mr-2" />
          Редактировать
        </Button>
      </div>
      
      <div className="neo-card p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-xl font-medium">Иван Петров</h3>
            <p className="text-muted-foreground">ivan@example.com</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Текущий тариф</h4>
            <p className="font-medium">Бизнес</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Дата продления</h4>
            <p className="font-medium">15 ноября 2023</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Использовано проверок</h4>
            <p className="font-medium">42/100</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Дата регистрации</h4>
            <p className="font-medium">5 марта 2023</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="gap-2" onClick={() => navigate('/account/change-password')}>
            <Lock className="h-4 w-4" />
            Изменить пароль
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate('/account/edit-profile')}>
            <User className="h-4 w-4" />
            Редактировать профиль
          </Button>
        </div>
      </div>
    </div>
  );
};
