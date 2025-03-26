
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe, 
  Trash, 
  Save,
  AlertCircle
} from 'lucide-react';

const ClientSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [auditCompletedNotification, setAuditCompletedNotification] = useState(true);
  const [optimizationNotification, setOptimizationNotification] = useState(true);
  const [marketingNotification, setMarketingNotification] = useState(false);
  
  return (
    <div>
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Пароль</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="sites" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Мои сайты</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
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
        </TabsContent>
        
        <TabsContent value="password">
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
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Email уведомления</h3>
                <p className="text-sm text-muted-foreground">
                  Управляйте email-уведомлениями, которые вы получаете
                </p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Завершение аудита</h4>
                  <p className="text-sm text-muted-foreground">
                    Уведомлять о завершении SEO-аудита
                  </p>
                </div>
                <Switch 
                  checked={auditCompletedNotification} 
                  onCheckedChange={setAuditCompletedNotification}
                  disabled={!emailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Оптимизация сайта</h4>
                  <p className="text-sm text-muted-foreground">
                    Уведомлять о готовности оптимизированной версии сайта
                  </p>
                </div>
                <Switch 
                  checked={optimizationNotification} 
                  onCheckedChange={setOptimizationNotification}
                  disabled={!emailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Маркетинговые рассылки</h4>
                  <p className="text-sm text-muted-foreground">
                    Получать новости, советы и специальные предложения
                  </p>
                </div>
                <Switch 
                  checked={marketingNotification} 
                  onCheckedChange={setMarketingNotification}
                  disabled={!emailNotifications}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                <span>Сохранить настройки</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sites">
          <div className="space-y-6">
            <div className="text-center py-8">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Сохраненные сайты</h3>
              <p className="text-muted-foreground mb-6">
                Здесь будут храниться ваши часто проверяемые сайты для быстрого доступа.
              </p>
              <Button>
                Добавить сайт
              </Button>
            </div>
            
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Опасная зона</h3>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-800 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Удаление аккаунта</h4>
                    <p className="text-sm mt-1">
                      После удаления аккаунта все данные будут потеряны, включая историю аудитов, отчеты и настройки. Это действие необратимо.
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="destructive" className="gap-2">
                <Trash className="h-4 w-4" />
                <span>Удалить аккаунт</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientSettings;
