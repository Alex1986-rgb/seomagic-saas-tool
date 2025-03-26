
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  CreditCard, 
  Mail, 
  Bell, 
  Lock, 
  Save, 
  Trash, 
  RefreshCw 
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [auditCompletedNotification, setAuditCompletedNotification] = useState(true);
  const [paymentNotification, setPaymentNotification] = useState(true);
  const [newUserNotification, setNewUserNotification] = useState(true);
  
  return (
    <div>
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Общие</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Платежи</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Безопасность</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
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
        </TabsContent>
        
        <TabsContent value="payment">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Валюта</Label>
                <Input id="currency" defaultValue="RUB" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stripe-key">Ключ Stripe</Label>
                <Input id="stripe-key" defaultValue="sk_test_*********************" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paypal-client">PayPal Client ID</Label>
                <Input id="paypal-client" defaultValue="client-id-*************" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Ставка налога (%)</Label>
                <Input id="tax-rate" defaultValue="20" type="number" min="0" max="100" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="test-mode" defaultChecked />
              <Label htmlFor="test-mode">Тестовый режим платежей</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="invoice-notification" defaultChecked />
              <Label htmlFor="invoice-notification">Отправлять уведомления о счетах</Label>
            </div>
            
            <div className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                <span>Сохранить настройки платежей</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="email">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Email уведомления</h3>
                <p className="text-sm text-muted-foreground">
                  Настройте, какие email-уведомления будут отправляться
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
                    Уведомление о завершении аудита сайта
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
                  <h4 className="font-medium">Новый платеж</h4>
                  <p className="text-sm text-muted-foreground">
                    Уведомление о новом платеже
                  </p>
                </div>
                <Switch 
                  checked={paymentNotification} 
                  onCheckedChange={setPaymentNotification}
                  disabled={!emailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Новый пользователь</h4>
                  <p className="text-sm text-muted-foreground">
                    Уведомление о регистрации нового пользователя
                  </p>
                </div>
                <Switch 
                  checked={newUserNotification} 
                  onCheckedChange={setNewUserNotification}
                  disabled={!emailNotifications}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtp-server">SMTP Сервер</Label>
              <Input id="smtp-server" defaultValue="smtp.example.com" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="smtp-user">SMTP Пользователь</Label>
                <Input id="smtp-user" defaultValue="notifications@seomarket.ru" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP Пароль</Label>
                <Input id="smtp-password" type="password" defaultValue="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Порт</Label>
                <Input id="smtp-port" defaultValue="587" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-from">Email отправителя</Label>
                <Input id="email-from" defaultValue="SeoMarket <noreply@seomarket.ru>" />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Тестовое письмо</span>
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                <span>Сохранить настройки</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Пароль администратора</Label>
              <Input id="password" type="password" defaultValue="secure-password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <Input id="new-password" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтвердите пароль</Label>
              <Input id="confirm-password" type="password" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="two-factor" />
              <Label htmlFor="two-factor">Двухфакторная аутентификация</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="api-access" defaultChecked />
              <Label htmlFor="api-access">Разрешить API доступ</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Ключ</Label>
              <div className="flex gap-2">
                <Input 
                  id="api-key" 
                  defaultValue="api-key-123456789" 
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline">Обновить</Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Опасная зона</h3>
              <div className="flex gap-4">
                <Button variant="destructive" className="gap-2">
                  <Trash className="h-4 w-4" />
                  <span>Удалить все данные</span>
                </Button>
                <Button variant="destructive" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Сбросить настройки</span>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
