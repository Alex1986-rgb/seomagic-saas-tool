
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit } from 'lucide-react';

const NavigationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default NavigationSettings;
