
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Save } from 'lucide-react';

const ClientPasswordTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="current-password">Текущий пароль</Label>
        <Input id="current-password" type="password" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-password">Новый пароль</Label>
        <Input id="new-password" type="password" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
        <Input id="confirm-password" type="password" />
      </div>
      
      <div className="flex items-center p-4 border border-amber-200 bg-amber-50 rounded-lg text-amber-800">
        <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
        <div className="text-sm">
          Убедитесь, что ваш пароль содержит минимум 8 символов, включая заглавную букву, строчную букву, цифру и специальный символ.
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          <span>Обновить пароль</span>
        </Button>
      </div>
    </div>
  );
};

export default ClientPasswordTab;
