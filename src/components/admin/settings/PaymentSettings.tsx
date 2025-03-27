
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, CreditCard, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const PaymentSettings: React.FC = () => {
  const [currency, setCurrency] = useState("RUB");
  const [stripeKey, setStripeKey] = useState("sk_test_*********************");
  const [paypalClient, setPaypalClient] = useState("client-id-*************");
  const [taxRate, setTaxRate] = useState("20");
  const [testMode, setTestMode] = useState(true);
  const [invoiceNotification, setInvoiceNotification] = useState(true);
  const [showStripeKey, setShowStripeKey] = useState(false);
  const [showPaypalKey, setShowPaypalKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaving(true);
    
    // Имитация сохранения на сервере
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Настройки платежей сохранены",
        description: "Изменения платежных настроек успешно сохранены.",
        variant: "default",
      });
    }, 800);
  };

  const handleTestConnection = () => {
    toast({
      title: "Проверка подключения",
      description: "Проверка подключения к платежным системам...",
    });
    
    setTimeout(() => {
      toast({
        title: "Подключение успешно",
        description: "Все платежные системы работают корректно.",
        variant: "default",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="currency">Валюта</Label>
          <Input 
            id="currency" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Основная валюта для всех транзакций</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stripe-key">Ключ Stripe</Label>
          <div className="relative">
            <Input 
              id="stripe-key" 
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
              type={showStripeKey ? "text" : "password"} 
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-0 h-full"
              onClick={() => setShowStripeKey(!showStripeKey)}
            >
              {showStripeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Секретный ключ для Stripe API</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paypal-client">PayPal Client ID</Label>
          <div className="relative">
            <Input 
              id="paypal-client" 
              value={paypalClient}
              onChange={(e) => setPaypalClient(e.target.value)}
              type={showPaypalKey ? "text" : "password"} 
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-0 h-full"
              onClick={() => setShowPaypalKey(!showPaypalKey)}
            >
              {showPaypalKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Идентификатор клиента PayPal</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tax-rate">Ставка налога (%)</Label>
          <Input 
            id="tax-rate" 
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            type="number" 
            min="0" 
            max="100" 
          />
          <p className="text-xs text-muted-foreground">Стандартная ставка НДС для всех услуг</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-2">
          <Switch 
            id="test-mode" 
            checked={testMode}
            onCheckedChange={setTestMode}
          />
          <div>
            <Label htmlFor="test-mode">Тестовый режим платежей</Label>
            {testMode && (
              <Badge variant="outline" className="ml-2 text-yellow-500 border-yellow-500">
                Активен
              </Badge>
            )}
            <p className="text-xs text-muted-foreground">В этом режиме платежи не будут обрабатываться</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="invoice-notification" 
            checked={invoiceNotification}
            onCheckedChange={setInvoiceNotification}
          />
          <div>
            <Label htmlFor="invoice-notification">Отправлять уведомления о счетах</Label>
            <p className="text-xs text-muted-foreground">Автоматическая отправка счетов и напоминаний</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleTestConnection} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Проверить подключение</span>
        </Button>
        
        <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              <span>Сохранение...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Сохранить настройки платежей</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentSettings;
