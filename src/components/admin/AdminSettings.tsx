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
  RefreshCw,
  DollarSign,
  Tag,
  Search
} from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import PositionPricingSettings from './PositionPricingSettings';

const AdminSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [auditCompletedNotification, setAuditCompletedNotification] = useState(true);
  const [paymentNotification, setPaymentNotification] = useState(true);
  const [newUserNotification, setNewUserNotification] = useState(true);
  const { toast } = useToast();
  
  const [prices, setPrices] = useState({
    basePagePrice: 500,
    metaDescriptionPrice: 50,
    metaKeywordsPrice: 30,
    altTagPrice: 20,
    underscoreUrlPrice: 10,
    duplicateContentPrice: 200,
    contentRewritePrice: 150
  });

  const handlePriceChange = (field: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setPrices(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSavePrices = () => {
    toast({
      title: "Настройки цен сохранены",
      description: "Новые цены будут применены к будущим аудитам"
    });
  };
  
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
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Цены оптимизации</span>
          </TabsTrigger>
          <TabsTrigger value="position-pricing" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Цены мониторинга</span>
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
        
        <TabsContent value="pricing">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Настройки цен оптимизации</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Настройте стоимость различных типов оптимизации. Эти цены будут использоваться
                для расчета общей стоимости оптимизации сайта.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="base-page-price">Базовая цена за страницу (₽)</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="base-page-price" 
                    type="number" 
                    min="0"
                    value={prices.basePagePrice}
                    onChange={(e) => handlePriceChange('basePagePrice', e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Базовая стоимость за обработку одной страницы
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description-price">Мета-описание (₽)</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="meta-description-price" 
                    type="number"
                    min="0" 
                    value={prices.metaDescriptionPrice}
                    onChange={(e) => handlePriceChange('metaDescriptionPrice', e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Стоимость оптимизации одного мета-тега description
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-keywords-price">Ключевые слова (₽)</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="meta-keywords-price" 
                    type="number"
                    min="0" 
                    value={prices.metaKeywordsPrice}
                    onChange={(e) => handlePriceChange('metaKeywordsPrice', e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Стоимость оптимизации одного мета-тега keywords
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alt-tag-price">Alt-теги изображений (₽)</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="alt-tag-price" 
                    type="number"
                    min="0" 
                    value={prices.altTagPrice}
                    onChange={(e) => handlePriceChange('altTagPrice', e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Стоимость добавления одного alt-тега для изображения
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="underscore-url-price">Оптимизация URL (₽)</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="underscore-url-price" 
                    type="number"
                    min="0" 
                    value={prices.underscoreUrlPrice}
                    onChange={(e) => handlePriceChange('underscoreUrlPrice', e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Стоимость оптимизации одного URL (замена подчеркиваний на дефисы)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duplicate-content-price">Исправление дублей (₽)</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="duplicate-content-price" 
                    type="number"
                    min="0" 
                    value={prices.duplicateContentPrice}
                    onChange={(e) => handlePriceChange('duplicateContentPrice', e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Стоимость исправления одной страницы с дублирующимся контентом
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content-rewrite-price">Переписывание контента (₽)</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="content-rewrite-price" 
                    type="number"
                    min="0" 
                    value={prices.contentRewritePrice}
                    onChange={(e) => handlePriceChange('contentRewritePrice', e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Стоимость переписывания контента одной страницы для SEO
                </p>
              </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-medium">Скидки за объем</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Более 200 страниц</p>
                  <p className="text-sm text-muted-foreground">Скидка 5%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Более 500 страниц</p>
                  <p className="text-sm text-muted-foreground">Скидка 10%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Более 1000 страниц</p>
                  <p className="text-sm text-muted-foreground">Скидка 15%</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSavePrices}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Сохранить настройки цен</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="position-pricing">
          <PositionPricingSettings />
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
